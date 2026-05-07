# @berrypjh/ui-core

플랫폼 독립적인 공통 UI 코어. `react-ui` (web) · `react-native-ui` (RN)이 공유하는 prop 계약·토큰 타입·유틸을 제공한다.

`design-tokens`는 이 패키지에 캡슐화되어 다운스트림(`react-ui`/`react-native-ui`/apps)은 design-tokens를 직접 의존하지 않는다.

## 사용

```ts
// 유틸
import { cx, isObjectRecord } from '@berrypjh/ui-core';
const className = cx('btn', { 'btn-active': isActive });

// 토큰 접근
import { getColor, createTheme } from '@berrypjh/ui-core';
import type { ColorToken, Theme, RNTokens } from '@berrypjh/ui-core';
const theme: Theme<RNTokens> = createTheme({ mode: 'light', tokens });
const c = getColor(theme, 'primary.pr500');

// design-tokens 패스스루 (consumer는 design-tokens 인지 필요 없음)
import { Web, Native, themes } from '@berrypjh/ui-core';
const lightColor = Web.Light.tokens.color.primary.pr500;

// Tailwind preset
import preset from '@berrypjh/ui-core/tailwind';

// CSS 변수
import '@berrypjh/ui-core/css';
```

## Export 경로

| 경로 | 용도 |
| --- | --- |
| `@berrypjh/ui-core` | 유틸 · 토큰 헬퍼 · 컴포넌트 prop 계약 · design-tokens 패스스루 |
| `@berrypjh/ui-core/tailwind` | Tailwind preset (default + named export, design-tokens 패스스루) |
| `@berrypjh/ui-core/css` | CSS 변수 (side-effect import, design-tokens에서 흡수) |

## Public 표면

**ui-core 자체 기여**

| 카테고리 | 심볼 |
| --- | --- |
| 유틸 | `cx`, `isObjectRecord` |
| 토큰 헬퍼 | `getColor`, `createTheme` |
| 토큰 타입 | `ColorToken`, `RadiusToken`, `SpacingToken`, `RNTokens`, `Theme<T>`, `ThemeName` |
| 컴포넌트 prop 계약 | `BoxProps`, `BoxRadiusValue`, `BoxSpacingValue` (box) / `ButtonProps`, `ButtonColor`, `ButtonSize`, `ButtonVariant` (button) / `FieldProps`, `FormControlProps`, `InputFieldProps`, `TextFieldProps`, `FieldColor`, `FieldSize`, `FieldVariant`, `FieldMargin` (field) |

**design-tokens 패스스루**

| 심볼 | 종류 |
| --- | --- |
| `Web`, `Native`, `themes` | namespace 값 |
| `ThemeDef` | type |

## 디렉토리

```
src/
├── index.ts                    public re-export
├── tailwind.ts                 design-tokens/tailwind 패스스루
├── contracts/                  컴포넌트 prop 계약
│   ├── box.ts, button.ts, field.ts, index.ts
├── tokens/                     토큰 타입·접근 헬퍼
│   ├── types.ts                ColorToken, SpacingToken, RadiusToken, RNTokens, Theme, ThemeName
│   ├── path.ts                 LeafDotPath, PathValue (internal generic)
│   ├── getToken.ts             internal path-walk
│   ├── getters.ts              getColor (1개)
│   ├── theme.ts                createTheme
│   └── index.ts
└── utils/                      cx, isObjectRecord
    ├── cx.ts, object.ts, index.ts
```

## 빌드 / 테스트

```bash
pnpm nx build @berrypjh/ui-core      # vite + d.ts 번들링 + css 복사
pnpm nx test @berrypjh/ui-core       # vitest
pnpm nx typecheck @berrypjh/ui-core
pnpm nx lint @berrypjh/ui-core
```

## Publish

`private: true` 워크스페이스 패키지. 직접 publish 안 함 — `react-ui`/`react-native-ui` 빌드 시 d.ts·CSS·Tailwind preset 모두 번들되어 다운스트림에 전달된다 (vite-plugin-dts의 `bundledPackages: ['@berrypjh/design-tokens']`로 design-tokens 타입까지 inline).

`package.json`의 `sideEffects: ["./dist/css/index.css"]`가 CSS-only import의 tree-shake를 막는다.
