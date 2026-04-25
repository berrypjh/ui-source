module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-header-bang': ({ header }) => {
          // 헤더에 '!:'가 포함되어 있으면 에러 반환
          return [
            !header.includes('!:'),
            '실수 방지를 위해 feat!: 문법 사용을 금지합니다. Major 변경은 Footer에 "BREAKING CHANGE"를 사용하세요.',
          ];
        },
      },
    },
  ],
  rules: {
    'no-header-bang': [2, 'always'],
    // Type(태그)의 종류를 제한 (레벨: 0=무시, 1=경고, 2=에러)
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'design',
        'style',
        'refactor',
        'test',
        'chore',
        'build',
        'ci',
        'revert',
      ],
    ],
    // Subject의 케이스를 제한
    'subject-case': [0, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    // Subject가 비어있으면 안 됨
    'subject-empty': [2, 'never'],
    // Type이 비어있으면 안 됨
    'type-empty': [2, 'never'],
    // Body의 최대 줄 수를 제한
    'body-max-line-length': [0, 'always', 200],
  },
};
