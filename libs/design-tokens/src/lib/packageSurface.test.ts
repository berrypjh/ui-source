/**
 * 공개 경계는 `package.json`의 exports map이 정한다.
 * dist에 internal 모듈이 있어도 subpath로는 들어올 수 없어야 한다.
 */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(PKG_ROOT, 'package.json'));

const readPkg = async () =>
  JSON.parse(await fs.readFile(path.join(PKG_ROOT, 'package.json'), 'utf8'));

/** subpath가 해석되면 경로를, 막히면 에러 코드를 돌려준다. */
const resolve = (subpath: string): string => {
  try {
    return path.relative(PKG_ROOT, require.resolve(subpath));
  } catch (e) {
    return (e as NodeJS.ErrnoException).code ?? 'ERROR';
  }
};

describe('public subpaths', () => {
  it.each([
    ['@berrypjh/design-tokens', 'dist/index.js'],
    ['@berrypjh/design-tokens/web', 'dist/web.js'],
    ['@berrypjh/design-tokens/rn', 'dist/rn.js'],
    ['@berrypjh/design-tokens/tailwind', 'dist/tailwind.js'],
    ['@berrypjh/design-tokens/contract', 'dist/contract.js'],
    ['@berrypjh/design-tokens/contract.json', 'dist/contract.json'],
    ['@berrypjh/design-tokens/tokens', 'dist/tokens.json'],
    ['@berrypjh/design-tokens/extension', 'dist/extension.js'],
    ['@berrypjh/design-tokens/compiler', 'dist/compiler.js'],
  ])('resolves %s', (subpath, target) => {
    expect(resolve(subpath)).toBe(target);
  });
});

describe('internal modules are not reachable', () => {
  it.each([
    '@berrypjh/design-tokens/dist/lib/sd.js',
    '@berrypjh/design-tokens/dist/lib/contract.js',
    '@berrypjh/design-tokens/dist/extension/validate.js',
    '@berrypjh/design-tokens/dist/compiler/selector.js',
    '@berrypjh/design-tokens/dist/index.js',
    '@berrypjh/design-tokens/src/lib/contract.ts',
    '@berrypjh/design-tokens/lib/contract',
  ])('blocks %s', (subpath) => {
    expect(resolve(subpath)).toBe('ERR_PACKAGE_PATH_NOT_EXPORTED');
  });

  it('exposes no wildcard subpath', async () => {
    const { exports } = await readPkg();
    for (const key of Object.keys(exports)) expect(key).not.toContain('*');
  });
});

describe('publish configuration', () => {
  it('is publishable so consumers can install the compiler', async () => {
    expect((await readPkg()).private).toBe(false);
  });

  it('ships only dist', async () => {
    expect((await readPkg()).files).toEqual(['dist']);
  });

  it('keeps style dictionary an optional peer, not a hard dependency', async () => {
    const pkg = await readPkg();
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.peerDependencies).toHaveProperty('style-dictionary');
    expect(pkg.peerDependenciesMeta['style-dictionary'].optional).toBe(true);
    expect(pkg.peerDependenciesMeta['@tokens-studio/sd-transforms'].optional).toBe(true);
  });

  it('keeps the css side-effect declaration', async () => {
    expect((await readPkg()).sideEffects).toEqual(['./dist/css/variables.css']);
  });
});

describe('authoring entry stays free of style dictionary at runtime', () => {
  it('does not import sd.js from the extension entry graph', async () => {
    const entry = await fs.readFile(path.join(PKG_ROOT, 'dist/extension.js'), 'utf8');
    expect(entry).not.toContain('style-dictionary');

    const compose = await fs.readFile(path.join(PKG_ROOT, 'dist/extension/compose.js'), 'utf8');
    // 값 변환은 SD 없는 모듈에서 온다.
    expect(compose).toContain('platformValue');
    expect(compose).not.toMatch(/from '\.\.\/lib\/sd/);
  });
});

describe('downstream propagation', () => {
  const WORKSPACE = path.resolve(PKG_ROOT, '../..');
  const json = async (rel: string) =>
    JSON.parse(await fs.readFile(path.join(WORKSPACE, rel), 'utf8'));

  /** 프로젝트의 모든 target에 걸친 run-commands 목록. */
  const allCommands = async (rel: string): Promise<string[]> => {
    const project = await json(rel);
    return Object.values(
      project.targets as Record<string, { options?: { commands?: string[] } }>,
    ).flatMap((t) => t.options?.commands ?? []);
  };

  it('copies the contract from design-tokens into ui-core', async () => {
    expect(await allCommands('libs/ui-core/project.json')).toContain(
      'cp libs/design-tokens/dist/contract.json libs/ui-core/dist/contract.json',
    );
  });

  it.each([
    ['libs/react-ui/project.json', 'react-ui'],
    ['libs/react-native-ui/project.json', 'react-native-ui'],
  ])('copies the contract from ui-core into %s', async (project, pkg) => {
    expect(await allCommands(project)).toContain(
      `cp libs/ui-core/dist/contract.json libs/${pkg}/dist/contract.json`,
    );
  });

  it.each(['libs/react-ui/package.json', 'libs/react-native-ui/package.json'])(
    'exposes ./contract from %s',
    async (pkg) => {
      expect((await json(pkg)).exports['./contract']).toBe('./dist/contract.json');
    },
  );

  it('keeps the existing ./tokens subpath untouched', async () => {
    for (const pkg of ['libs/react-ui/package.json', 'libs/react-native-ui/package.json']) {
      expect((await json(pkg)).exports['./tokens']).toBe('./dist/tokens.json');
    }
  });

  it('copies rather than regenerating, so there is one source of truth', async () => {
    const commands = [
      ...(await allCommands('libs/ui-core/project.json')),
      ...(await allCommands('libs/react-ui/project.json')),
      ...(await allCommands('libs/react-native-ui/project.json')),
    ];
    // contract.json을 만드는 곳은 design-tokens 빌드 하나뿐이다.
    expect(
      commands.filter((c) => c.includes('contract.json')).every((c) => c.startsWith('cp ')),
    ).toBe(true);
  });
});
