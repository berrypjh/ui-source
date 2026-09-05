import { ReactNode, useEffect, useState } from 'react';

import { ThemeName } from '@berrypjh/react-ui';

import { createPortal } from 'react-dom';

/**
 * Default 와 Sample 을 **동시에** 측정한다.
 *
 * 토큰 CSS 의 selector 는 `[data-profile="sample"][data-theme="dark"]` 처럼 한 요소에 대한
 * 복합 선택자다. 그래서 ThemeProvider 바깥(document.body)에 attribute 를 직접 단 probe 를
 * 심으면 프로필을 토글하지 않고도 두 값을 함께 읽을 수 있다.
 */

export type Profile = 'default' | 'sample';
export const PROFILES: Profile[] = ['default', 'sample'];

const HIDDEN: React.CSSProperties = {
  position: 'fixed',
  left: -9999,
  top: 0,
  width: 1,
  height: 1,
  overflow: 'hidden',
  pointerEvents: 'none',
};

export const probeRootId = (p: Profile) => `probe-root-${p}`;

/** 화면 밖이지만 실제로 렌더되고 스타일이 계산되는 측정 트리. */
export const ProbeTrees = ({
  theme,
  children,
}: {
  theme: ThemeName;
  children?: (profile: Profile) => ReactNode;
}) => (
  <>
    {PROFILES.map((profile) =>
      createPortal(
        <div
          key={profile}
          style={HIDDEN}
          data-theme={theme}
          data-profile={profile}
          id={probeRootId(profile)}
          aria-hidden
        >
          {children?.(profile)}
        </div>,
        document.body,
        profile,
      ),
    )}
  </>
);

export type ProbeValues = Record<Profile, Record<string, string>>;

/** 두 프로필에서 같은 CSS 변수 목록을 읽는다. 테마가 바뀌면 다시 읽는다. */
export const useProbeValues = (theme: ThemeName, names: readonly string[]): ProbeValues | null => {
  const [values, setValues] = useState<ProbeValues | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const read = (p: Profile) => {
        const el = document.getElementById(probeRootId(p));
        if (!el) return null;
        const style = getComputedStyle(el);
        return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n).trim()]));
      };
      const base = read('default');
      const sample = read('sample');
      setValues(base && sample ? { default: base, sample } : null);
    });
    return () => cancelAnimationFrame(raf);
  }, [theme, names]);

  return values;
};
