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
    contract.ts     Consumer Override Contract — public semantic allowlist + primitive deny
    genContract.ts  writeContractMetadata → dist/contract.json (governance sidecar)
    contractDiff.ts 두 contract metadata 비교 → upgrade 안전성 분류
    platformValue.ts  SD 비의존 dimension 변환 (toWebRem / toRnNumeric)
  extension/        Consumer Token Extension authoring (TS 정의 → canonical 표현 + 검증)
    types.ts        authoring 타입. contract에서 path union과 값 타입을 파생
    defineTokenExtension.ts  authoring helper (const 제네릭 + freeze)
    normalize.ts    authoring shape → canonical dot-path (변환 지점은 여기 하나)
    validate.ts     런타임 검증 + reference 정책
    typeFixtures.ts 컴파일 타임 타입 테스트 (@ts-expect-error)
    diagnostics.ts  구조적 진단 (severity/code/extension/mode/path/platform/chain)
    references.ts   Consumer 참조 그래프 — dangling/cycle 검출, alias 해소
    compose.ts      Shared 사전 + Consumer 정의 → 검증된 합성 모델
  compiler/         Consumer 산출물 컴파일러 (기존 generator 재사용)
    compileExtension.ts  합성 모델 → Consumer CSS delta + RN 완전 레코드 + manifest
    selector.ts     테마 selector에 Consumer scope 씌우기
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
| public override 가능 토큰 추가    | `src/lib/contract.ts`의 `PUBLIC_OVERRIDE_CONTRACT`                                               |
| Consumer extension authoring 변경 | `src/extension/types.ts` + `typeFixtures.ts`                                                     |
| 새 카테고리 (10번째)              | `src/lib/tokens.ts`의 `TOKEN_CATEGORIES` + `genTsTokens.ts`의 type alias + `genTailwind.ts` 분기 |

`HEAD_REWRITE`: `path[0]` → 카테고리 path 접두로 치환 (예: `primary` → `['color', 'primary']`).

## Consumer Override Contract

`src/lib/contract.ts`가 **Consumer가 무엇을 override할 수 있는지**를 코드로 고정한다.
deny-by-default — `PUBLIC_OVERRIDE_CONTRACT`에 leaf로 명시되지 않으면 전부 internal이다.

| 층                    | 예시                                                                                                                               | Consumer override |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Internal Primitive    | `color.primary.pr700`, `borderWidth.primitive.*`                                                                                   | 불가              |
| Public Semantic       | `color.text.*`, `color.background.*`, `color.icon.*`, `color.stroke.*`, `color.primaryBtn.*`, `border.*`, `borderWidth.semantic.*` | 가능              |
| Raw scale / Component | `spacing.*`, `radius.*`, `typography.*`, `shadow.*`, `component.*`                                                                 | v1에서는 불가     |

- **wildcard 금지**: category/root가 아니라 leaf path 61개를 전부 열거한다.
- **stability**: shared component가 이미 소비하면 `stable`, 아직이면 `experimental`.
- **deprecated/replacement**: 지금 deprecated 토큰은 없지만 표현·검증 가능하다.
  `deprecated: true`면 `replacement`가 반드시 다른 contract path여야 한다.
- 이 제약은 **Consumer override 전용**이다. Shared 자신의 light/dark/sepia authoring은
  종전대로 primitive를 자유롭게 참조한다.

`src/lib/contract.test.ts`가 contract를 실제 토큰 그래프에 대해 검증한다 — path 존재,
타입 일치, primitive 유출, deprecation metadata, 결정적 순서. public 토큰을 지우거나
이름을 바꾸면 이 테스트가 정확한 path를 지목하며 실패한다.

## Consumer Token Extension

`src/extension/`은 Consumer가 **Shared token source를 건드리지 않고** brand를 입히는 TS authoring 층이다.

```ts
defineTokenExtension({
  name: 'acme',
  source: { brand: { primary: '#5B21B6', ink: { strong: '#111827' } } }, // Consumer 전용
  semantic: { 'color.background.primary': '{brand.primary}' }, // public contract path
  modes: { dark: { 'color.background.primary': '{brand.primaryDark}' } },
});
```

- **작성하는 것은 brand 값 + semantic mapping 둘뿐이다.** Shared 트리 복제도, RGB 채널 수동
  입력도 필요 없다 (`-rgb`는 종전대로 `genCss`가 파생한다).
- `semantic`/`modes`의 key는 contract path union이라 오타·primitive·raw scale·`--ui-*` local
  토큰은 **컴파일 에러**다. `$type`은 생략 가능하고, 쓰면 contract 타입과 일치해야 한다.
- `source`는 **authoring 전용**이다. 중첩 그룹으로 쓰고 `normalizeExtension`이 dot-path로
  평탄화하며, `--ds-*`로 방출되지 않는다 (`NormalizedExtension`이 `source`/`semantic`을
  구조적으로 분리한다).
- **reference 정책**: alias 대상은 public contract token 또는 이 extension의 private source만
  허용. internal primitive 경유는 `primitive-reference`로 거부된다.
- 내부 표현은 canonical dot-path 하나뿐이고, 변환은 `normalize.ts` 한 곳에서만 일어난다.
- `validateExtension`은 던지지 않고 문제 목록을 돌려준다 — compiler가 한 번에 모아 보고한다.
  전체 그래프 대조는 아직 하지 않는다.

타입 테스트는 별도 러너 없이 `typeFixtures.ts`의 `@ts-expect-error`로 고정하고
`tsc -p tsconfig.spec.json`이 검사한다. 케이스가 합법이 되면 unused directive로 실패한다.

### 합성 파이프라인

`composeExtension(builds, extension?)` 이 전 단계를 한 번에 돌린다.
`builds`는 `buildThemeDictionaries` 결과를 그대로 받는다 — DTCG 파싱과 Shared 참조 해소는
Style Dictionary가 한 것을 재사용하고 여기서 다시 구현하지 않는다.

```
normalize → contract/path → type → reference(mode별) → compose → completeness → platform
```

- **우선순위**: Shared base → Shared mode delta → Consumer base → Consumer mode.
  앞 두 단계는 SD가 테마별 사전을 만들 때 이미 적용했으므로 그 위에 Consumer 값만 얹는다.
  override하지 않은 토큰은 해당 모드의 Shared 최종 값을 그대로 유지한다.
- **입력 불변**: Shared 사전도 Consumer 정의도 변형하지 않는다. 매 호출이 새 Map을 만든다.
- **모드 fallback**: Consumer가 어떤 모드를 override하지 않으면 그 모드의 Shared 값을 쓴다.
  `source`는 **모드 독립적**이다 — 모드별 브랜드 값은 키를 나눠(`primary`/`primaryDark`)
  `modes`에서 각각 참조해 표현한다.
- **플랫폼 호환성**: dimension이 숫자로 안 떨어지면 `rn`, color에서 RGB 채널을 못 뽑으면 `web`.
  판정은 `toRnNumeric`/`colorToRgbChannels` 즉 실제 빌드가 쓰는 함수를 그대로 쓴다.
- **수명주기**: deprecated는 `warning` + `replacement` 제안, removed(contract에는 있으나
  그래프에 없음)는 `error`. 경고는 console이 아니라 `result.diagnostics`로 실려 나간다.
- 진단은 severity → code → mode → path → platform 순으로 정렬돼 결정적이다.
- `result.ok`가 false면 `themes`는 비어 있다 — 반쯤 합성된 모델을 흘려보내지 않는다.

## Consumer Compiler

`compileExtension(builds, extension, { outDir, scope? })`.
**새 Style Dictionary 설정을 만들지 않는다** — `buildThemeDictionaries` 결과와 합성 모델을
기존 generator에 그대로 먹인다. CSS 변수 이름, RGB 파생, RN 트리 모양이 Shared 빌드와
한 구현을 공유하도록 `genCss`/`genTsTokens`에 값 reader 하나만 주입할 수 있게 열어 두었다.

| 산출물                        | 이유                                                                |
| ----------------------------- | ------------------------------------------------------------------- |
| `css/variables.{theme}.css`   | Shared 대비 **달라진 변수만**. 나머지는 Shared CSS가 계속 담당한다. |
| `rn/themes/{theme}/tokens.ts` | RN에는 CSS 변수가 없다 — 모드별 **완전한** 값 트리가 필요하다.      |
| `rn/index.ts`                 | `ThemeProvider`의 `tokensByMode`에 그대로 넣는 레코드.              |
| `manifest.json`               | extension·contract version·modes·files·warnings.                    |

- **Web TS 트리는 만들지 않는다.** Web은 CSS 변수로 동작하므로 값 트리를 또 내보내면
  두 번째 진실 원본이 되어 drift한다. RN만 값이 필요하다는 비대칭이 이 결정의 근거다.
- **Consumer용 Tailwind preset도 만들지 않는다.** 기존 preset이 `var(--ds-*)` /
  `rgb(var(--ds-*-rgb) / <alpha-value>)`를 가리키므로 override가 자동으로 따라간다
  (`compiler/tailwind.test.ts`가 고정).
- 색 하나를 authoring하면 `--ds-x`와 `--ds-x-rgb`가 **함께** 나온다 — RGB 수동 입력은 없다.
- `scope` 옵션은 Demo에서 Default와 Sample을 나란히 비교하기 위한 최소 장치다.
  런타임 멀티브랜드 엔진이 아니다.
- 검증에 실패하면 **파일을 하나도 쓰지 않고** manifest 없이 진단만 돌려준다.
- Shared 빌드 산출물은 이 컴파일러가 전혀 건드리지 않는다 (`compiler/parity.test.ts`).

## 공개 표면 (package exports)

공개 경계는 **`package.json`의 exports map**이 정한다. `dist/`에 internal 모듈이 있어도
subpath로는 들어올 수 없다 (`packageSurface.test.ts`가 고정).

| subpath                             | 용도                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `.` `/web` `/rn` `/css` `/tailwind` | 기존 토큰 표면 (변경 없음)                              |
| `/contract`                         | contract 조회 API + `diffContracts`                     |
| `/contract.json`                    | governance sidecar (원시 JSON)                          |
| `/tokens`                           | 값 인벤토리 (`tokens.json`)                             |
| `/extension`                        | Consumer authoring — **Style Dictionary 불필요**        |
| `/compiler`                         | Consumer 컴파일 — `style-dictionary` optional peer 필요 |

`style-dictionary`/`@tokens-studio/sd-transforms`는 **optional peerDependencies**다.
토큰만 쓰는 Consumer는 설치하지 않아도 되고, `/compiler`를 쓰는 Consumer만 설치한다.
이를 위해 dimension 변환은 `lib/platformValue.ts`(SD 비의존)로 분리되어 있다.

`tokens.json`의 positional ABI는 **바뀌지 않았다**. governance는 별도 `contract.json`이다.

sidecar는 design-tokens → ui-core → react-ui/react-native-ui 로 **복사**되어 흐른다
(기존 `tokens.json`과 같은 경로). 생성 지점은 design-tokens 빌드 하나뿐이다.

## SemVer 규칙 (contract 기준)

Nx fixed release + conventional commits 위에서 contract 변경을 이렇게 읽는다.

| 변경                             | 분류                                  | 커밋/릴리스                           |
| -------------------------------- | ------------------------------------- | ------------------------------------- |
| public semantic token 추가       | non-breaking                          | `feat` → minor                        |
| token deprecated (+ replacement) | non-breaking                          | `feat` → minor, migration window 유지 |
| public token 제거                | **breaking**                          | `!` → major                           |
| token type 변경                  | **breaking**                          | `!` → major                           |
| public → internal                | **breaking**                          | `!` → major                           |
| overridable true → false         | **breaking**                          | `!` → major                           |
| default 값이 눈에 보이게 바뀜    | non-breaking                          | changelog에 반드시 명시               |
| internal primitive 변경          | public 표면에 영향 없으면 patch/minor |

`diffContracts(prev, next)`가 위 표를 코드로 구현한다. `breaking: true`면 major다.
deprecated는 **즉시 제거하지 않는다** — 최소 한 번의 minor 동안 replacement와 함께 남긴다.

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
