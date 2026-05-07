# @berrypjh/ui-core

플랫폼 독립적인 공통 UI 코어. `react-ui` (web) · `react-native-ui` (RN) 같은 플랫폼 패키지가 공유하는 prop 계약·토큰 타입·유틸을 제공한다.

`design-tokens`는 이 패키지에 내부 캡슐화 — 소비자는 design-tokens를 직접 의존하지 않는다.

## TL;DR

```ts
// 유틸
import { cx, isObjectRecord } from '@berrypjh/ui-core';
const className = cx('btn', { active: isActive }, disabled && 'btn-disabled');

// 토큰 헬퍼
import { getColor, createTheme } from '@berrypjh/ui-core';
import type { Theme, RNTokens } from '@berrypjh/ui-core';
const theme: Theme<RNTokens> = createTheme({ mode: 'light', tokens });
const c = getColor(theme, 'primary.pr500');

// design-tokens 패스스루 (consumer는 design-tokens 인지 불필요)
import { Web, Native, themes } from '@berrypjh/ui-core';
const lightColor = Web.Light.tokens.color.primary.pr500; // '#2E90FA'

// Tailwind preset · CSS 변수
import preset from '@berrypjh/ui-core/tailwind';
import '@berrypjh/ui-core/css';
```

## ⚠️ 컴포넌트 prop 계약 (BoxProps 등)

`BoxProps`, `ButtonProps`, `FieldProps` 같은 contracts는 **플랫폼 패키지(react-ui/react-native-ui)가 wrap**해서 자기 props로 노출한다. ui-core에서 직접 import해서 컴포넌트를 만드는 건 권장 패턴 아님 — 플랫폼 패키지의 wrapped props를 사용하라.

ui-core에서 직접 가져오는 건 type-level 유틸로만:

```ts
import type { BoxProps, ColorToken } from '@berrypjh/ui-core';
// 자체 컴포넌트 props에 spread하거나 type narrowing에 사용
```

## ⚠️ 정적 객체 vs 런타임 변수

| 용도                       | 메커니즘                                               |
| -------------------------- | ------------------------------------------------------ |
| **런타임 테마 전환**       | CSS 변수 (`var(--ds-...)`). `data-theme` 속성으로 자동 |
| **빌드 시점 정적 값 참조** | `Web.Light.tokens.*` / `Native.Light.tokens.*`         |

`Web.Dark.tokens.*` 같은 다른 테마 namespace도 있지만 정적 스냅샷일 뿐. 다크모드 처리하려고 namespace를 동적으로 선택하지 말 것 — CSS 변수가 자동 처리.

## Export 경로

| 경로                         | 용도                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `@berrypjh/ui-core`          | 유틸 · 토큰 헬퍼 · prop 계약 · design-tokens 패스스루 |
| `@berrypjh/ui-core/tailwind` | Tailwind preset (default + named export)              |
| `@berrypjh/ui-core/css`      | CSS 변수 (side-effect import, `--ds-*` 정의)          |

## Public 표면

**ui-core 자체 기여**

| 카테고리    | 심볼                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 유틸        | `cx`, `isObjectRecord`                                                                                                          |
| 토큰 헬퍼   | `getColor`, `createTheme`                                                                                                       |
| 토큰 타입   | `ColorToken`, `RadiusToken`, `SpacingToken`, `RNTokens`, `Theme<T>`, `ThemeName`                                                |
| Box prop    | `BoxProps`, `BoxRadiusValue`, `BoxSpacingValue`                                                                                 |
| Button prop | `ButtonProps`, `ButtonColor`, `ButtonSize`, `ButtonVariant`                                                                     |
| Field prop  | `FieldProps`, `FormControlProps`, `InputFieldProps`, `TextFieldProps`, `FieldColor`, `FieldSize`, `FieldVariant`, `FieldMargin` |

**design-tokens 패스스루** (소비자는 ui-core를 통해서만 접근)

| 심볼                      | 종류         |
| ------------------------- | ------------ |
| `Web`, `Native`, `themes` | namespace 값 |
| `ThemeDef`                | type         |

## Tailwind 연결

```js
// tailwind.config.js
import preset from '@berrypjh/ui-core/tailwind';
export default { presets: [preset] };
```

```css
/* styles.css */
@import 'tailwindcss';
@config '../tailwind.config.js';
```

이후 `bg-primary-pr500`, `text-primary-pr500/50` (alpha) 같은 유틸 사용 가능.

## CSS 변수 규칙

`@berrypjh/ui-core/css`를 import하면 design-tokens의 모든 CSS 변수가 정의됨.

- prefix: `--ds-` (고정)
- naming: `--ds-{kebab(rawPath)}` (예: `primary.pr500` → `--ds-primary-pr500`)
- color는 `-rgb` 채널도 자동 (Tailwind alpha용): `--ds-primary-pr500-rgb`
- 적용 위치: `:root` (light), `[data-theme="dark"]`/`.theme-dark` (dark) 등

## 자동화 메모

- 이 파일은 빌드 시 `dist/AGENTS.md`로 복사됨. 직접 편집 금지 — 원본은 `AGENTS.consumer.md`.
- 더 자세한 사용법은 `README.md` 참조.
