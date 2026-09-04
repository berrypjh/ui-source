# design-tokens

## 절대 원칙

- 핵심 책임(JSON → CSS/RN/Tailwind 3종 출력) 외 기능 추가 금지.
- `Web.*`/`Native.*` namespace 구조와 `tokens.{category}.{...}` 트리는 **공개 API**. 다운스트림(ui-core)이 의존.
- `themes` 배열의 **첫 항목이 base** (light). 풀세트 토큰을 가짐. 다른 테마는 override.
- 미등록 토큰 head는 **즉시 throw** — 무음 누락 금지.
- **토큰 JSON은 DTCG 형식**(`$value`/`$type`)을 사용. type 어휘는 Tokens Studio 플러랄(`fontSizes`/`boxShadow` 등)을 유지하며 sd-transforms 전처리기가 DTCG 정렬 타입으로 자동 변환. 한 SD 인스턴스 안에서 legacy(`value`)와 DTCG는 섞을 수 없음.

## 파일 (전부)

```
src/
  build.ts          엔트리. SD dict → 3종 generator 호출
  themes.ts         테마 등록부. ThemeDef[], ThemeName, baseTheme = themes[0]
  index.ts          public re-export (Web, Native, themes, ThemeDef, ThemeName, tailwindPreset)
  web.ts/rn.ts/tailwind.ts   .generated/ → public 진입점
  lib/
    sd.ts           Style Dictionary 등록 + buildThemeDictionaries (web/rn 두 dict)
    tokens.ts       getTokenType / getTokenValue / cssVarName / colorToRgbChannels / classifyTokenPath / TOKEN_CATEGORIES
    genCss.ts       writeCss → dist/css/variables{,.<theme>}.css
    genTsTokens.ts  writeTsTokens → src/.generated/{web,rn}/themes/<t>/tokens.ts + index.ts
    genTailwind.ts  writeTailwindPreset → src/.generated/tailwind/preset.ts
    genCatalog.ts   writeTokensJson → dist/tokens.json (슬림 평탄 카탈로그)
tokens/
  light/   base 풀세트 (color/typography/spacing/radius/borderWidth/border/shadow/elevation/component)
  dark/, sepia/   light 위 override
```

## 작업 매트릭스

| 작업                              | 수정 파일                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| 새 토큰 값                        | `tokens/<theme>/<category>.json`                                                                 |
| 새 테마                           | `tokens/<name>/` + `src/themes.ts` 배열에 항목 추가                                              |
| 새 top-level 키 (e.g. `tertiary`) | `src/lib/tokens.ts`의 `HEAD_REWRITE`                                                             |
| 새 token type 어휘                | `src/lib/sd.ts` transforms (필요 시) + `HEAD_REWRITE` 매핑                                       |
| 새 카테고리 (10번째)              | `src/lib/tokens.ts`의 `TOKEN_CATEGORIES` + `genTsTokens.ts`의 type alias + `genTailwind.ts` 분기 |

`HEAD_REWRITE`: `path[0]` → 카테고리 path 접두로 치환 (예: `primary` → `['color', 'primary']`).

## 빌드

```bash
pnpm nx run @berrypjh/design-tokens:build:tokens   # JSON → 산출물
pnpm nx run @berrypjh/design-tokens:build:ts       # 산출물 → dist d.ts/JS
pnpm nx run @berrypjh/design-tokens:build          # 둘 다
```

`build.ts`는 시작 시 `src/.generated/`와 `dist/css/`를 정리해 stale 파일 누적을 막는다.

## Gotcha

- **TS 증분 캐시**: `dist/`만 지우고 빌드하면 `tsconfig.lib.tsbuildinfo`(`libs/design-tokens/`에 위치)가 stale 상태로 남아 d.ts가 누락될 수 있다. 클린 빌드 시 tsbuildinfo도 같이 삭제.
- **path 매핑 금지**: `tsconfig.base.json`의 `paths`에 `@berrypjh/design-tokens` 추가하지 말 것. composite project + rootDir 제약과 충돌해 ui-core 빌드가 깨진다. node_modules workspace 심링크로 해결되는 게 정상 경로.
- **`.generated/` 손대지 말 것**: 빌드 중간 산출물. 직접 편집해도 다음 build에서 덮어써짐.
- **base가 첫 항목**: `themes` 배열 순서는 의미가 있다. `baseTheme = themes[0]`을 import해 사용.
- **kebab-case CSS 변수**: `--ds-` prefix 고정. color는 `--ds-x-rgb` 채널 변수도 같이 생성 (Tailwind alpha 유틸용).

## 다운스트림

- `libs/ui-core/src/tokens/*` — `Web.Light.*` 타입을 주축으로 ColorToken, SpacingToken 등을 도출. 구조 변경 시 ui-core 영향 큼.
- `apps/demo-web/src/app/pages/TokensPage.tsx` — `Web.Light.tokens.color/typography/spacing/radius/borderWidth/shadow` 트리를 직접 순회. 카테고리 키 이름 변경 시 깨짐.
- 런타임 테마 전환: 다운스트림은 CSS 변수 (`var(--ds-*)`)에 의존하므로 `tokens.color.x`는 base 테마 값으로 고정 노출되어도 OK.

## 소비자 문서 없음

design-tokens는 `private: true`이고 `AGENTS.consumer.md`도 `dist/AGENTS.md`도 만들지 않는다.
소비자 대상 문서는 `react-ui`/`react-native-ui`가 담당한다. 이 때문에
`tools/scripts/measure-tokens`의 `design-tokens` target 중 `dist/AGENTS.md`를 읽는
시나리오(`agents+catalog`)는 현재 실패한다 — 그 README의 "알려진 제약" 참조.

## Validation

토큰 JSON validation은 SD 파이프라인에 위임. 별도 validator 없음. 잘못된 형식이면 SD가 throw.
