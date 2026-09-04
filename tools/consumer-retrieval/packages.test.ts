import { describe, expect, it } from 'vitest';

import { INTERNAL_PACKAGES, PLATFORM_PACKAGES, resolvePackages } from './packages';
import { NATIVE_PACKAGE, WEB_PACKAGE } from './platform';
import { loadCatalogs } from './repo-source';

const catalogs = await loadCatalogs();

describe('package resolution', () => {
  it('maps each platform to its public package', () => {
    expect(resolvePackages('web').packages).toEqual([WEB_PACKAGE]);
    expect(resolvePackages('react-native').packages).toEqual([NATIVE_PACKAGE]);
    expect(resolvePackages('both').packages).toEqual([WEB_PACKAGE, NATIVE_PACKAGE]);
    expect(resolvePackages('none').packages).toEqual([]);
  });

  it('forbids the other platform package on a single-platform route', () => {
    expect(resolvePackages('web').forbidden).toContain(NATIVE_PACKAGE);
    expect(resolvePackages('react-native').forbidden).toContain(WEB_PACKAGE);
  });

  it('always forbids the private internal packages', () => {
    for (const platform of ['web', 'react-native', 'both', 'none'] as const) {
      for (const internal of INTERNAL_PACKAGES) {
        expect(resolvePackages(platform).forbidden).toContain(internal);
      }
    }
  });

  it('chooses no package when the platform is ambiguous', () => {
    const decision = resolvePackages(null);
    expect(decision.packages).toEqual([]);
    expect(decision.reason).toContain('ambiguous');
  });

  it('confirms the platform packages re-export everything a consumer needs from ui-core', () => {
    // ui-core를 직접 import하지 않아도 되는 근거 — 생성 카탈로그로 검증한다.
    const passthrough = ['cx', 'getColor', 'createTheme', 'themes', 'Web', 'Native'];
    const types = ['ColorToken', 'RadiusToken', 'SpacingToken', 'RNTokens', 'Theme', 'ThemeDef'];
    for (const pkg of Object.values(PLATFORM_PACKAGES)) {
      for (const symbol of [...passthrough, ...types]) {
        expect(catalogs[pkg].symbols[symbol]).toBeDefined();
      }
    }
  });
});
