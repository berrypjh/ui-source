# @berrypjh/react-ui

React 웹 UI 컴포넌트 라이브러리. 디자인 토큰 기반의 일관된 컴포넌트 세트와 테마 시스템을 제공한다.

## TL;DR

```tsx
// 1. 글로벌 CSS import (앱 진입점에서 한 번)
import '@berrypjh/react-ui/styles.css';

// 2. 컴포넌트 사용
import { Button, TextField, ThemeProvider } from '@berrypjh/react-ui';

<ThemeProvider initialTheme="light">
  <Button variant="filled" color="primary">
    확인
  </Button>
  <TextField label="이름" />
</ThemeProvider>;
```

```js
// 3. (선택) Tailwind preset 연결
// tailwind.config.js
import preset from '@berrypjh/react-ui/tailwind';
export default { presets: [preset] };
```

## Export 경로

| 경로                            | 용도                                                          |
| ------------------------------- | ------------------------------------------------------------- |
| `@berrypjh/react-ui`            | 모든 컴포넌트·테마·토큰·유틸                                  |
| `@berrypjh/react-ui/styles.css` | 글로벌 CSS (토큰 변수 + 컴포넌트 스타일) — side-effect import |
| `@berrypjh/react-ui/tailwind`   | Tailwind preset (color/spacing/radius 등 매핑)                |

## Public 표면

### 컴포넌트 (17개)

| 카테고리 | 심볼                                                                               |
| -------- | ---------------------------------------------------------------------------------- |
| 레이아웃 | `Box`                                                                              |
| 버튼     | `Button`, `IconButton`, `Fab`, `BubbleButton`, `ButtonBase`                        |
| 입력     | `TextField`, `BoxedInput`, `FilledInput`, `PlainInput`, `InputBase`, `SearchField` |
| 선택     | `Select`, `MenuItem`                                                               |
| 폼 구성  | `FormControl`, `InputLabel`, `FormHelperText`                                      |

각 컴포넌트는 `<Name>Props` 타입을 함께 export. 대부분 `component` prop으로 polymorphic — `<Button component="a" href="...">`처럼 다른 element로 렌더 가능.

### 테마

| 심볼               | 용도                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `ThemeProvider`    | `<html data-theme="...">` 적용. `initialTheme` (기본 light), `mode` controlled prop 지원 |
| `themes`           | `[{ name: 'light', ... }, ...]` namespace 배열                                           |
| `ThemeName` (type) | `'light' \| 'dark' \| 'sepia'`                                                           |

### 토큰 / 유틸 (정적 객체)

| 심볼            | 용도                                                                |
| --------------- | ------------------------------------------------------------------- |
| `Web`, `Native` | 정적 토큰 트리. `Web.Light.tokens.color.primary.pr500` 같은 값 참조 |
| `cx`            | className merge — `cx('a', { b: cond }, c && 'd')`                  |
| `getColor`      | 토큰 색 lookup (path 기반)                                          |
| `createTheme`   | 런타임 theme 객체 생성                                              |

### Type alias (재export)

`ColorToken`, `RadiusToken`, `SpacingToken`, `RNTokens`, `Theme<T>`, `ThemeDef`

## ⚠️ 정적 객체 vs 런타임 테마

| 용도                  | 메커니즘                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| **런타임 테마 전환**  | CSS 변수 (`var(--ds-*)`). `<ThemeProvider>` → `data-theme` 속성 자동 적용 |
| **빌드 시점 정적 값** | `Web.Light.tokens.*` 등 namespace 직접 참조                               |

다크모드 처리하려고 `Web.Dark.tokens.*`로 namespace를 동적 선택하지 말 것 — CSS 변수가 자동 처리.

## ⚠️ Tailwind 연결 시 styles.css

```css
/* styles.css */
@import 'tailwindcss';
@config '../tailwind.config.js';
```

`@config`는 v3 호환 directive — IDE의 "Unknown at rule" 경고는 무시 가능 (PostCSS 빌드는 정상).

## 카탈로그 (`dist/tokens.json`)

빌드 산출물에 토큰 카탈로그가 포함됨. flat 형태:

```json
{
  "schema": "tokens[path] = [cssVar, ...valuesPerTheme]",
  "themes": ["light", "dark", "sepia"],
  "tokens": {
    "color.primary.pr500": ["--ds-primary-pr500", "#2E90FA", "#1849A9", "#2E90FA"]
  }
}
```

전체 토큰 enumeration이 필요할 때 d.ts 트리 traverse 대신 이 파일 한 번 read.

## 자동화 메모

- 이 파일은 빌드 시 `dist/AGENTS.md`로 복사. 직접 편집 금지 — 원본은 `AGENTS.consumer.md`.
- 더 자세한 사용법은 `README.md` 참조.
