import nx from '@nx/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * React / JSX 전용 ESLint 설정.
 *
 * 적용 항목:
 * - @nx/eslint-plugin flat/react (react-hooks/jsx-a11y/react 플러그인 선언 + 안전성 룰)
 * - jsx-a11y `flatConfigs.recommended` 추가 (nx 기본보다 강함)
 *
 * NOTE: react-hooks/jsx-a11y 플러그인 자체는 nx flat/react에서 선언하므로
 * 여기서 다시 `plugins`에 넣지 않는다 (flat config: "Cannot redefine plugin" 회피).
 */
export const reactConfig = [
  ...nx.configs['flat/react'],
  {
    files: ['**/*.jsx', '**/*.tsx'],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];

export default reactConfig;
