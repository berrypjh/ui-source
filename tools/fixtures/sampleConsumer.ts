/**
 * Demo/E2E 용 가상 Consumer extension.
 *
 * Shared production 토큰(`libs/design-tokens/tokens/**`)에는 들어가지 않는다.
 * 여기 값은 실제 제품 브랜드가 아니라 **검증용 임의 값**이며, Shared 팔레트와
 * 눈에 띄게 달라야 computed style 비교가 의미를 갖는다.
 *
 * platform-neutral 위치다 — Web demo와 Native demo가 같은 정의를 컴파일한다.
 */
import { defineTokenExtension } from '@berrypjh/design-tokens/extension';

export const SAMPLE_PROFILE = 'sample';

/** Sample profile CSS를 감싸는 selector. Demo가 같은 값을 attribute로 쓴다. */
export const SAMPLE_SCOPE = `[data-profile="${SAMPLE_PROFILE}"]`;

export const sampleConsumer = defineTokenExtension({
  name: 'sample-consumer',
  source: {
    brand: {
      primary: '#5B21B6',
      primaryDark: '#A78BFA',
      surface: '#FDFCFF',
      surfaceDark: '#1B1630',
      ink: '#221133',
      inkInverse: '#F7F5FF',
    },
  },
  semantic: {
    'color.background.primary': '{brand.primary}',
    'color.background.surface': '{brand.surface}',
    'color.text.default': '{brand.ink}',
    'color.text.contrastText': '{brand.inkInverse}',
    'color.primaryBtn.default': '{brand.primary}',
    'color.primaryBtn.hover': '#4C1D95',
    'color.stroke.default': '#C4B5FD',
  },
  modes: {
    dark: {
      'color.background.primary': '{brand.primaryDark}',
      'color.background.surface': '{brand.surfaceDark}',
      'color.text.default': '{brand.inkInverse}',
      'color.primaryBtn.default': '{brand.primaryDark}',
    },
  },
});

export default sampleConsumer;
