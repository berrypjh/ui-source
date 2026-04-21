# @berrypjh/design-tokens

Figma Tokens Studio에서 추출한 토큰을 Style Dictionary로 빌드해 배포하는 디자인 토큰 라이브러리입니다.

## 워크플로우

```
Figma (Tokens Studio)
        ↓  export
tokens/data.json
        ↓  pnpm build:design-tokens
  Style Dictionary
        ↓
  ┌─────────────────────────────────┐
  │  dist/css/variables.css         │  CSS 변수
  │  src/.generated/web/tokens.ts   │  Web JS 객체
  │  src/.generated/rn/tokens.ts    │  React Native JS 객체
  │  src/.generated/tailwind/       │  Tailwind 프리셋
  └─────────────────────────────────┘
        ↓  pnpm publish:design-tokens
  GitHub Packages (@berrypjh/design-tokens)
```

## 토큰 업데이트 방법

1. Figma Tokens Studio에서 `data.json` export
2. `tokens/data.json` 교체
3. 빌드 및 배포

```bash
pnpm build:design-tokens
pnpm publish:design-tokens
```

## export 경로

| 경로 | 용도 |
| --- | --- |
| `@berrypjh/design-tokens` | 테마 타입 (`ThemeName`, `Theme` 등) |
| `@berrypjh/design-tokens/web` | Web 토큰 (Global, Dark) |
| `@berrypjh/design-tokens/rn` | React Native 토큰 |
| `@berrypjh/design-tokens/css` | CSS 변수 파일 (`variables.css`) |
| `@berrypjh/design-tokens/tailwind` | Tailwind 프리셋 |
