# @berrypjh/design-tokens

소스를 직접 편집하는 디자인 토큰 라이브러리. Style Dictionary로 빌드해 CSS / Web / RN / Tailwind 산출물을 생성·배포한다.

## 워크플로우

```
tokens/
  light/{category}.json   ← 사람이 직접 편집(베이스 풀세트)
  dark/{category}.json     ← 사람이 직접 편집(override만)
        ↓  pnpm build:design-tokens
   validate (formats / type 어휘)
        ↓
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

## 토큰 파일 구조

토큰은 카테고리별 파일로 분할되어 있다. 카테고리는 빌드 후 노출되는 9개 그룹과 1:1 일치한다.

```
tokens/
├─ light/
│   ├─ color.json        primary / secondary / neutral / success / warning / error /
│   │                    primaryBtn / text / background / icon / stroke
│   ├─ typography.json   fontFamilies / fontSize / fontWeight / lineHeight /
│   │                    letterSpacing / display / heading / body / paragraph / caption
│   ├─ spacing.json
│   ├─ radius.json
│   ├─ borderWidth.json  primitiveBorder / semanticBorder
│   ├─ border.json
│   ├─ shadow.json
│   ├─ elevation.json
│   └─ component.json
└─ dark/
    └─ color.json        light을 덮어쓰는 토큰만 둔다
```

dark 테마는 글로벌 풀세트와 deep-merge되어 빌드된다(뒤쪽 source가 우선). dark에서 override하지 않은 카테고리는 아예 파일을 두지 않으면 된다.

## leaf 토큰 형식

```json
{
  "primary": {
    "pr500": { "value": "#2E90FA", "type": "color" },
    "pr600": { "value": "{primary.pr500}", "type": "color" }
  }
}
```

- `value`: 토큰 값. 다른 토큰을 참조하려면 `{path.to.token}` 사용
- `type`: Tokens Studio 호환 어휘 — `color`, `spacing`, `borderRadius`, `borderWidth`,
  `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacing`, `fontFamilies`,
  `typography`, `boxShadow`, `dropShadow`, `innerShadow`, `border`

새로운 type을 추가하려면 다음 4곳을 함께 갱신해야 한다:

1. `src/validate/tokens.ts` → `KNOWN_TYPES`
2. `src/sd/utils/mapTokenPath.ts` → 해당 type의 카테고리 분기
3. transforms (필요 시)
4. tailwind preset 분기 (`src/postprocess/generateTailwindPreset.ts`)

미등록 type / 미등록 top-level head는 빌드 시 throw 된다. 새 토큰 추가 시 즉시 감지되도록 의도된 가드다.

## 토큰 업데이트 방법

1. `tokens/{theme}/{category}.json` 편집
2. 빌드 및 미리보기

```bash
pnpm build:design-tokens
pnpm nx run @berrypjh/demo-web:serve   # /tokens 페이지에서 시각 확인
```

3. 배포

```bash
pnpm publish:design-tokens
```

## export 경로

| 경로 | 용도 |
| --- | --- |
| `@berrypjh/design-tokens` | 테마 타입 (`ThemeName`, `Theme` 등) |
| `@berrypjh/design-tokens/web` | Web 토큰 (`Light`, `Dark`) |
| `@berrypjh/design-tokens/rn` | React Native 토큰 (`Light`, `Dark`) |
| `@berrypjh/design-tokens/css` | CSS 변수 파일 (`variables.css`) |
| `@berrypjh/design-tokens/tailwind` | Tailwind 프리셋 |
