# @berrypjh/design-tokens

토큰 JSON을 입력으로 **CSS 변수**, **React Native JS 객체**, **Tailwind preset**을 생성한다.

## 사용

```ts
// Web: CSS 변수 (side-effect import — 한 번만)
import '@berrypjh/design-tokens/css';

// Web/RN 공통: 타입 안전한 토큰 객체
import { Web, Native, themes } from '@berrypjh/design-tokens';
const color = Web.Light.tokens.color.primary.pr500; // '#2E90FA'
const spacing = Native.Light.tokens.spacing.md; // 8 (number)

// Tailwind v4 preset
import preset from '@berrypjh/design-tokens/tailwind';
```

테마 전환은 `<html data-theme="dark">`처럼 `data-theme` 속성으로 한다(`themes.ts` 셀렉터 참조).
현재 테마: `light` `dark` `sepia` `amber` `ember` `frost` `midnight` — 이름은 분위기를 뜻하며
어떤 앱이 어느 테마를 쓰는지는 `AGENTS.md`의 표가 관리한다.

## Export 경로

| 경로                               | 용도                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `@berrypjh/design-tokens`          | `themes`, `ThemeName`, `ThemeDef`, `Web` / `Native` namespace, `tailwindPreset` |
| `@berrypjh/design-tokens/web`      | Web 토큰 namespace (`Light`, `Dark`, `Sepia`, ...)                              |
| `@berrypjh/design-tokens/rn`       | RN 토큰 namespace (숫자형 type은 number로 변환)                                 |
| `@berrypjh/design-tokens/css`      | CSS 변수 (side-effect import)                                                   |
| `@berrypjh/design-tokens/tailwind` | Tailwind preset (default export)                                                |

`Web.*` 와 `Native.*` 는 같은 토큰 트리 구조를 갖지만 RN 쪽은 px/dimension이 number로 변환되어 있다.

추가로 **`dist/tokens.json`** (슬림 정적 카탈로그)을 만든다 — 모든 토큰 path, cssVar, 테마별 값을 단일 평탄 JSON으로 enumerate. 이 패키지는 배포되지 않으므로, 빌드 중 `ui-core`를 거쳐 `react-ui` / `react-native-ui`의 `./tokens`로 복사되어 소비자에게 닿는다. 자동화·문서화·AI 에이전트 분석용이며, 키는 결정적으로 정렬되어 빌드 간 diff가 0이다.

```jsonc
// dist/tokens.json (발췌)
{
  "schema": "tokens[path] = [cssVar, ...valuesInThemesOrder]",
  "themes": ["light", "dark", "sepia"],
  "categories": ["border", "borderWidth", "color", ...],
  "tokens": {
    "color.primary.pr500": ["--ds-primary-pr500", "#2E90FA", "#53B1FD", "#2E90FA"]
  }
}
```

`type` 필드는 path[0]이 곧 카테고리이므로 생략. 토큰 한 줄 = JSON 한 라인 형식으로 직렬화해 구두점·줄바꿈 최소화.

이 패키지는 `private: true`이고 소비자용 `AGENTS.md`를 만들지 않는다 — AI 에이전트용 사용 안내는
이 토큰을 재노출하는 `@berrypjh/react-ui` / `@berrypjh/react-native-ui`의 `dist/AGENTS.md`가 담당한다.

## 파이프라인

```
tokens/{theme}/{category}.json
        │   pnpm tokens:gen
        ▼
[Style Dictionary in-memory dict] ──▶ [generators]
                                          │
                                          ├─ dist/css/variables.css           (병합본)
                                          ├─ dist/css/variables.{theme}.css   (테마별)
                                          ├─ dist/tokens.json                 (평탄 카탈로그)
                                          ├─ src/.generated/web/themes/<t>/tokens.ts
                                          ├─ src/.generated/rn/themes/<t>/tokens.ts
                                          └─ src/.generated/tailwind/preset.ts
```

SD는 transform 파이프라인으로만 사용한다. 사전(`Dictionary`)은 in-memory로 보관되고 generator가 직접 소비해 산출물을 만든다.

## 디렉토리

```
src/
  build.ts                  엔트리 (SD dict → generators)
  themes.ts                 테마 등록부 (단일 진실)
  index.ts / web.ts / rn.ts / tailwind.ts   public 진입점
  lib/
    sd.ts                   SD config + buildThemeDictionaries
    tokens.ts               classify / cssVarName / colorRgb / getTokenType / getTokenValue
    genCss.ts               CSS 변수 생성
    genTsTokens.ts          Web/RN TS 토큰 + namespace 인덱스 생성
    genTailwind.ts          Tailwind preset 생성
    genCatalog.ts           dist/tokens.json (슬림 카탈로그)
    contrast.ts             WCAG 대비 회귀 가드
    platformValue.ts        SD 비의존 값 변환 (rem / 숫자 / ms / 서체 스택)
    pipeline.ts             생성 단계 조립
tokens/
  light/                    base 풀세트
  dark/, sepia/, ...        light을 덮어쓰는 토큰만
```

## 토큰 JSON 형식

[DTCG](https://design-tokens.github.io/community-group/format/) 형식 (`$value` / `$type`).

```json
{
  "primary": {
    "pr500": { "$value": "#2E90FA", "$type": "color" },
    "pr600": { "$value": "{primary.pr500}", "$type": "color" }
  }
}
```

- `$value`: 토큰 값. 다른 토큰 참조는 `{path.to.token}`
- `$type`: `color`, `spacing`, `borderRadius`, `borderWidth`, `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacing`, `fontFamilies`, `typography`, `boxShadow`, `dropShadow`, `innerShadow`, `border`, `duration`, `cubicBezier` (Tokens Studio 어휘 유지 — 전처리기가 DTCG 표준 type으로 자동 정렬)

## 새 테마 추가

1. `tokens/{name}/*.json` 폴더에 override 토큰 작성 (light에 없는 키는 무시되거나 누락)
2. `src/themes.ts`에 한 줄 추가
   ```ts
   { name: 'sepia', selector: '[data-theme="sepia"]', sourceDirs: ['light', 'sepia'] }
   ```
   `sourceDirs`는 deep-merge 순서 (뒤가 우선). base가 아닌 테마는 보통 `['light', '<name>']`.
3. `pnpm tokens:gen` — namespace 진입점 (`src/.generated/{web,rn}/index.ts`)이 자동 갱신된다.

첫 번째 항목이 base 테마. 풀세트 토큰을 가져야 한다.

`themes.ts` 한 곳이 단일 진실이라, 이 셋만 하면 CSS 블록·Web/RN 토큰 객체·Tailwind preset이
함께 생성되고 `themes`를 읽는 화면(예: demo의 Theme 전환)에도 자동으로 나타난다.
브랜드를 추가하는 방법도 이것 하나다 — 소비자용 override 레이어는 두지 않는다.

## 새 top-level 키 추가

토큰의 path[0]은 카테고리(color / spacing / radius / borderWidth / border / typography / shadow / elevation / component / motion)로 매핑되어야 한다. 매핑은 `src/lib/tokens.ts`의 `HEAD_REWRITE`에 정의된다.

새 키(예: `tertiary` 색상)를 도입할 땐 거기에 한 줄 추가한다.

```ts
tertiary: ['color', 'tertiary'],
```

미등록 키가 토큰에 등장하면 빌드가 즉시 throw — 무음 누락이 발생하지 않는다.

## Build 타깃

| nx 타깃        | 명령                       | 역할                                     |
| -------------- | -------------------------- | ---------------------------------------- |
| `build:tokens` | `tsx src/build.ts`         | SD dict → CSS / Web / RN / Tailwind 생성 |
| `build:ts`     | `tsc -p tsconfig.lib.json` | `dist/`로 d.ts·JS 컴파일                 |
| `build`        | 위 둘 (`dependsOn`)        | 전체 빌드                                |

`dist/`가 배포 대상. `src/.generated/`는 빌드 중간 산출물이며 `tsc`가 함께 컴파일해 `dist/.generated/`로 내보낸다.

### root 스크립트 (workflow shortcut)

| 스크립트            | 역할                                                            |
| ------------------- | --------------------------------------------------------------- |
| `pnpm tokens:gen`   | 토큰 JSON → CSS / Web / RN / Tailwind (compile 없음, 가장 빠름) |
| `pnpm tokens:build` | 풀 빌드 (gen + tsc → dist)                                      |
| `pnpm tokens:watch` | `tokens/**/*.json` 변경 시 자동 regen                           |
| `pnpm tokens:clean` | `dist/`, `src/.generated/`, `tsbuildinfo` 정리                  |

## Publish

`private: true` 패키지. 직접 publish하지 않고 `react-ui` / `react-native-ui` 빌드 시 d.ts와 CSS로 번들되어 다운스트림에 전달된다. `nx.json`의 `release.projects`에 포함되어 버전·changelog는 함께 생성된다.

`package.json`의 `sideEffects: ["./dist/css/variables.css"]`가 CSS-only import의 tree-shake를 막는다.
