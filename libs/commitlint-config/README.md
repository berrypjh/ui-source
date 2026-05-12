# @berrypjh/commitlint-config

워크스페이스 공통 Commitlint 설정. Conventional Commits 기반.

## 사용

```bash
pnpm add -D @berrypjh/commitlint-config @commitlint/cli
```

```js
// commitlint.config.js
module.exports = { extends: ['@berrypjh/commitlint-config'] };
```

## 규칙 요약

- `type-enum`: feat, fix, docs, design, style, refactor, test, chore, build, ci, revert
- `no-header-bang`: `feat!:` 형태 헤더 금지. Major 변경은 Footer에 `BREAKING CHANGE`를 사용
- `subject-empty`, `type-empty`: 빈 값 금지
