# @berrypjh/react-native-ui

React Native 모바일 UI 컴포넌트 라이브러리. 디자인 토큰 기반의 일관된 컴포넌트와 테마 시스템을 제공한다.

## TL;DR

```tsx
import { Box, ThemeProvider, useTheme, getColor } from '@berrypjh/react-native-ui';

function App() {
  return (
    <ThemeProvider mode="light">
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const theme = useTheme();
  return <Box p="md" bg="background.surface" radius="md" />;
}
```

## Export 경로

| 경로                        | 용도                         |
| --------------------------- | ---------------------------- |
| `@berrypjh/react-native-ui` | 모든 컴포넌트·테마·토큰·유틸 |

## Public 표면

### 컴포넌트

| 심볼  | 설명                                                                   |
| ----- | ---------------------------------------------------------------------- |
| `Box` | 기본 레이아웃 컴포넌트 (padding, background, border 등 토큰 기반 prop) |

### 테마

| 심볼               | 용도                                                   |
| ------------------ | ------------------------------------------------------ |
| `ThemeProvider`    | RN context 기반 테마. `mode` prop (기본 `light`)       |
| `useTheme`         | 현재 theme 객체 반환. `getColor(theme, ...)` 등에 사용 |
| `themes`           | `[{ name: 'light', ... }, ...]` namespace 배열         |
| `ThemeName` (type) | `'light' \| 'dark' \| 'sepia'`                         |

### 토큰 / 유틸 (정적 객체)

| 심볼            | 용도                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| `Web`, `Native` | 정적 토큰 트리. `Native.Light.tokens.color.primary.pr500` 같은 값 참조 |
| `cx`            | className merge — RN에선 style array 사용이 일반적이라 보조 용도       |
| `getColor`      | 토큰 색 lookup (`getColor(theme, 'primary.pr500')`)                    |
| `createTheme`   | 런타임 theme 객체 생성                                                 |

### Type alias (재export)

`ColorToken`, `RadiusToken`, `SpacingToken`, `RNTokens`, `Theme<T>`, `ThemeDef`

## ⚠️ 정적 객체 vs 런타임 테마

| 용도                  | 메커니즘                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| **런타임 테마 전환**  | `ThemeProvider` context. `useTheme()` 훅으로 현재 theme 획득 후 `getColor` 등에 사용 |
| **빌드 시점 정적 값** | `Native.Light.tokens.*` 등 namespace 직접 참조                                       |

다크모드 처리하려고 `Native.Dark.tokens.*`로 namespace를 동적 선택하지 말 것 — `ThemeProvider`가 자동 처리.

## ⚠️ Web vs Native 토큰

`Native.*` 트리는 RN-specific transforms 적용된 값:

- `spacing`/`radius`/`borderWidth` → number (px 단위 stripped)
- `typography.{fontSize,lineHeight,letterSpacing,fontWeight}` → number (단독 토큰 + composite 자식 모두)
- `color.*` → hex string 그대로
- `shadow.*` 산출물은 leaf로 분해 (`shadow.xs.0.x` 등) — 일반 사용자는 `Native.Light.tokens.shadow` 직접 접근보다 컴포넌트의 elevation prop 권장

Web 토큰을 RN에서 그대로 쓰지 말 것 — `Native` namespace가 호환 형식.

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
