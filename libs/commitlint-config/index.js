module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-header-bang': ({ header }) => {
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
    'subject-case': [0, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'body-max-line-length': [0, 'always', 200],
  },
};
