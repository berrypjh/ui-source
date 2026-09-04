# ui-core

## 절대 원칙

- **플랫폼 독립**: web/native 렌더링 가정·DOM API·RN-only API 금지. 두 플랫폼이 **모두** 쓸 수 있어야 ui-core에 들어옴.
- **design-tokens 캡슐화**: ui-core가 design-tokens를 wrap. 다운스트림(`react-ui`/`react-native-ui`/apps)은 **design-tokens를 직접 import하지 않는다**. `Web`, `Native`, `themes`, `ThemeDef`, `/tailwind`, `/css`는 ui-core에서 패스스루.
- **공개 surface는 안정**: `cx`, `getColor`, contracts, 토큰 타입은 다운스트림이 의존. 변경 시 reverse-search로 영향 확인 필수.
- **단일 사용처면 ui-core가 아님**: 한 컴포넌트만 쓰면 그 컴포넌트 패키지로 옮겨라.

## 파일 (전부)

```
src/
  index.ts          public re-export (contracts/tokens/utils)
  tailwind.ts       design-tokens/tailwind 패스스루
  contracts/
    box.ts          BoxProps, BoxSpacingValue, BoxRadiusValue
    button.ts       ButtonProps, ButtonColor, ButtonSize, ButtonVariant
    fab.ts          FabProps, FabShape
    field.ts        FieldProps, FormControlProps, InputFieldProps, TextFieldProps + 4 enums
    icon-button.ts  IconButtonProps, IconButtonEdge
    menu-item.ts    MenuItemProps
    index.ts
  tokens/
    types.ts        ColorToken, SpacingToken, RadiusToken, RNTokens, Theme<T>, ThemeName
    path.ts         LeafDotPath, PathValue (internal generic 유틸)
    getToken.ts     internal path-walk
    getters.ts      getColor (현재 1개. 새 카테고리 getter 필요 시 여기 추가)
    theme.ts        createTheme
    index.ts        + design-tokens 패스스루 (Web, Native, themes, ThemeDef)
  utils/
    cx.ts               className 결합
    form-navigation.ts  키보드 이동 헬퍼
    form-selection.ts   선택 상태 헬퍼
    form-value.ts       폼 값 정규화
    input-value.ts      입력 값 정규화
    object.ts           isObjectRecord
    index.ts
```

## 작업 매트릭스

| 작업                              | 수정 파일                                           |
| --------------------------------- | --------------------------------------------------- |
| 새 prop 계약 (예: TooltipProps)   | `src/contracts/<name>.ts` + `contracts/index.ts`    |
| 새 토큰 카테고리 getter           | `src/tokens/getters.ts` (기존 `getColor` 패턴 따라) |
| 새 토큰 타입 alias 노출           | `src/tokens/types.ts` + `tokens/index.ts`           |
| 새 유틸 (양 플랫폼에서 쓰는 것만) | `src/utils/<name>.ts` + `utils/index.ts`            |
| design-tokens에서 새 심볼 노출    | `src/tokens/index.ts`의 패스스루 라인에 추가        |

`HEAD_REWRITE`/카테고리 추가는 design-tokens 쪽 작업. ui-core는 noop.

## 빌드 / 테스트

```bash
pnpm nx build @berrypjh/ui-core         # vite + dts + css 복사
pnpm nx test @berrypjh/ui-core          # vitest
pnpm nx typecheck @berrypjh/ui-core     # tsc --noEmit
pnpm nx lint @berrypjh/ui-core          # eslint
```

빌드 산출물: `dist/index.{js,d.ts}` + `dist/tailwind.{js,d.ts}` + `dist/css/index.css` + `dist/tokens.json`(design-tokens에서 복사). d.ts는 `vite-plugin-dts`의 `rollupTypes: true` + `bundledPackages: ['@berrypjh/design-tokens']`로 단일 파일 번들.

## Gotcha

- **design-tokens 직접 노출 금지**: 다운스트림에서 `from '@berrypjh/design-tokens'` 등장하면 ui-core 패스스루가 빠진 신호. ui-core를 통하도록 우회.
- **path 매핑 금지**: `tsconfig.base.json`의 `paths`에 `@berrypjh/design-tokens` 추가하지 말 것 (composite + rootDir와 충돌해 빌드 깨짐 — design-tokens 리팩토링 시 학습된 사실).
- **컴포넌트 props는 wrap이 원칙**: contracts의 `BoxProps` 등은 react-ui가 자체 props로 wrap해서 노출함. ui-core 자체의 props가 다운스트림에 그대로 노출되지 않게 주의.
- **getters 일관성**: 추가 시 기존 `getColor` 시그니처(`<P extends XxxToken>`, `Theme<RNTokens>` 인자)를 따르라. PathValue 반환으로 type-narrow.
- **테스트 위치**: 단위 테스트는 `*.test.ts`로 같은 폴더. `vitest`가 `src/**/*.{test,spec}.ts`를 픽업.

## 다운스트림 영향

- `libs/react-ui/src/index.ts` · `libs/react-native-ui/src/index.ts`가 ui-core의 token type·헬퍼·design-tokens 패스스루를 그대로 re-export. **ui-core export 변경 시 두 파일 동기화 필수**.
- `libs/react-ui/src/components/box/Box.types.ts` 등 `BoxProps`·`ColorToken` 등 직접 import.
- `libs/react-native-ui/src/components/box/Box.tsx`가 `getColor` 사용.
- `apps/demo-web/src/app/pages/TokensPage.tsx`가 `Web.Light.tokens` 트리 순회 — 카테고리 키 변경 시 깨짐.

## 변경 체크리스트

- [ ] 진짜 양 플랫폼이 쓰는가? (단일 사용처면 그 패키지로)
- [ ] 다운스트림 사용처 grep 했는가? (`grep -rn '<symbol>' libs apps`)
- [ ] design-tokens 패스스루를 우회하지 않는가?
- [ ] 테스트가 의도를 표현하는가?
- [ ] react-ui·react-native-ui index.ts re-export 동기화 필요 없는가?
