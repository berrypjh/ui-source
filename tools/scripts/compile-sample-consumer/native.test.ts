/**
 * Consumer fixture → RN 토큰 통합 검증.
 *
 * `react-native-ui`와 `demo-mobile`에는 테스트 인프라가 없어서, 새 프레임워크를 들이는 대신
 * 이미 vitest가 도는 곳에서 컴파일러 + RN 소비 경로를 검증한다.
 * Web(Command 07)과 **같은 fixture**를 쓴다 — 여기서 다시 정의하지 않는다.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { themes } from '@berrypjh/design-tokens';
import { buildThemeDictionaries, compileExtension } from '@berrypjh/design-tokens/compiler';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { sampleConsumer } from '../../fixtures/sampleConsumer';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const TOKENS_DIR = path.join(REPO_ROOT, 'libs/design-tokens/tokens');

type TokenTree = {
  color: {
    background: Record<string, string>;
    text: Record<string, string>;
    primaryBtn: Record<string, string>;
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
};

let outDir: string;
/** 컴파일된 RN 레코드 — ThemeProvider의 `tokensByMode`와 같은 모양. */
let tokensByMode: Record<string, TokenTree>;
/** 비교 기준이 되는 Shared 기본 트리. */
let sharedByMode: Record<string, TokenTree>;

/** 생성된 `tokens.ts`에서 트리를 읽는다. 손으로 편집하지 않는다. */
const readTree = async (dir: string, theme: string): Promise<TokenTree> => {
  const src = await fs.readFile(path.join(dir, 'rn/themes', theme, 'tokens.ts'), 'utf8');
  return JSON.parse(src.slice(src.indexOf('= {') + 2, src.lastIndexOf('} as const') + 1));
};

beforeAll(async () => {
  outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ds-native-'));
  const builds = await buildThemeDictionaries(themes, TOKENS_DIR);

  const sampleResult = await compileExtension(builds, sampleConsumer, { outDir });
  expect(sampleResult.ok).toBe(true);

  const sharedDir = path.join(outDir, 'shared');
  const sharedResult = await compileExtension(
    builds,
    { name: 'shared-baseline' },
    {
      outDir: sharedDir,
    },
  );
  expect(sharedResult.ok).toBe(true);

  const modes = ['light', 'dark', 'sepia'];
  tokensByMode = Object.fromEntries(
    await Promise.all(modes.map(async (m) => [m, await readTree(outDir, m)])),
  );
  sharedByMode = Object.fromEntries(
    await Promise.all(modes.map(async (m) => [m, await readTree(sharedDir, m)])),
  );
}, 60_000);

afterAll(async () => {
  await fs.rm(outDir, { recursive: true, force: true });
});

describe('same source as the web demo', () => {
  it('compiles the fixture the web demo uses', () => {
    expect(sampleConsumer.name).toBe('sample-consumer');
  });

  it('produces a record keyed by every registered theme', () => {
    expect(Object.keys(tokensByMode).sort()).toEqual([...themes.map((t) => t.name)].sort());
  });
});

describe('full rn record', () => {
  it('carries every token category in every mode', () => {
    for (const tree of Object.values(tokensByMode)) {
      expect(Object.keys(tree)).toEqual([
        'color',
        'spacing',
        'radius',
        'borderWidth',
        'border',
        'typography',
        'shadow',
        'elevation',
        'component',
        'motion',
      ]);
    }
  });

  it('matches the shared tree leaf-for-leaf', () => {
    const leaves = (o: unknown, p = ''): string[] =>
      o && typeof o === 'object' && !Array.isArray(o)
        ? Object.entries(o).flatMap(([k, v]) => leaves(v, p ? `${p}.${k}` : k))
        : [p];

    for (const mode of Object.keys(tokensByMode)) {
      expect(leaves(tokensByMode[mode]).sort()).toEqual(leaves(sharedByMode[mode]).sort());
    }
  });

  it('emits rn values as numbers, not css strings', () => {
    expect(typeof tokensByMode.light.spacing.md).toBe('number');
    expect(typeof tokensByMode.light.radius.md).toBe('number');
    expect(tokensByMode.light.spacing.md).toBe(12);
  });
});

describe('sample semantic override', () => {
  it('applies the overridden colour in light', () => {
    expect(tokensByMode.light.color.background.primary).toBe('#5B21B6');
    expect(tokensByMode.light.color.primaryBtn.default).toBe('#5B21B6');
  });

  it('applies the mode-specific colour in dark', () => {
    expect(tokensByMode.dark.color.background.primary).toBe('#A78BFA');
    expect(tokensByMode.dark.color.text.default).toBe('#F7F5FF');
  });

  it('carries a base override into a mode the consumer did not restate', () => {
    // sepia는 override하지 않았지만 base override는 모든 모드에 적용된다.
    expect(tokensByMode.sepia.color.background.primary).toBe('#5B21B6');
  });

  it('differs from the shared default it replaced', () => {
    expect(sharedByMode.light.color.background.primary).toBe('#047857');
    expect(tokensByMode.light.color.background.primary).not.toBe(
      sharedByMode.light.color.background.primary,
    );
  });
});

describe('fallback for non-overridden tokens', () => {
  it('keeps spacing and radius identical to the shared defaults', () => {
    for (const mode of Object.keys(tokensByMode)) {
      expect(tokensByMode[mode].spacing).toEqual(sharedByMode[mode].spacing);
      expect(tokensByMode[mode].radius).toEqual(sharedByMode[mode].radius);
    }
  });

  it('keeps non-overridden colours at their shared per-mode value', () => {
    for (const mode of Object.keys(tokensByMode)) {
      expect(tokensByMode[mode].color.background.secondary).toBe(
        sharedByMode[mode].color.background.secondary,
      );
    }
  });

  it('preserves the shared mode delta for untouched tokens', () => {
    expect(tokensByMode.light.color.background.secondary).not.toBe(
      tokensByMode.dark.color.background.secondary,
    );
  });
});

describe('tokensByMode consumption', () => {
  /** ThemeProvider가 하는 일과 같다 — 새 런타임 없이 레코드에서 모드를 고른다. */
  const resolve = (mode: string) => tokensByMode[mode];

  it('resolves the overridden token per mode', () => {
    expect(resolve('light').color.background.primary).toBe('#5B21B6');
    expect(resolve('dark').color.background.primary).toBe('#A78BFA');
  });

  it('resolves a non-overridden token per mode', () => {
    expect(resolve('light').spacing.md).toBe(resolve('dark').spacing.md);
  });

  it('exposes a value for every mode the provider can be given', () => {
    for (const theme of themes) expect(resolve(theme.name)).toBeDefined();
  });
});

describe('default path compatibility', () => {
  it('leaves the shared baseline untouched when no extension is given', () => {
    expect(sharedByMode.light.color.background.primary).toBe('#047857');
    expect(sharedByMode.dark.color.background.primary).toBe('#136F47');
  });

  it('changes only the tokens the consumer declared', () => {
    const changed = (mode: string) => {
      const flat = (o: unknown, p = ''): [string, unknown][] =>
        o && typeof o === 'object' && !Array.isArray(o)
          ? Object.entries(o).flatMap(([k, v]) => flat(v, p ? `${p}.${k}` : k))
          : [[p, o]];
      const shared = new Map(flat(sharedByMode[mode]));
      return flat(tokensByMode[mode])
        .filter(([k, v]) => shared.get(k) !== v)
        .map(([k]) => k);
    };

    // 7개 base override 중 light에서 실제로 값이 달라지는 것들.
    expect(changed('light').sort()).toEqual([
      'color.background.primary',
      'color.background.surface',
      'color.primaryBtn.default',
      'color.primaryBtn.hover',
      'color.stroke.default',
      'color.text.contrastText',
      'color.text.default',
    ]);
  });
});
