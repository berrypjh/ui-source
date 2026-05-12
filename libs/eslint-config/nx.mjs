/**
 * Nx 워크스페이스 전용 ESLint 설정.
 *
 * `@nx/enforce-module-boundaries` 기본값을 제공한다.
 * Tag/allow 규칙은 consumer가 override 하는 것이 일반적이다.
 */
export const nxConfig = [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
];

export default nxConfig;
