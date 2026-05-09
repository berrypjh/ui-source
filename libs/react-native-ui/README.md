# @berrypjh/react-native-ui

> **Note**
> 현재 작업 중인 라이브러리입니다.

React Native 모바일 UI 컴포넌트 라이브러리. 디자인 토큰 기반의 일관된 컴포넌트 세트를 제공합니다.

## 설치

```bash
pnpm add @berrypjh/react-native-ui
```

## 사용 예시

```tsx
import { Box, ThemeProvider } from '@berrypjh/react-native-ui';

<ThemeProvider mode="light">
  <Box p="md" bg="background.surface" radius="md" />
</ThemeProvider>;
```

## 제공 컴포넌트

| 컴포넌트 | 설명                   |
| -------- | ---------------------- |
| `Box`    | 기본 레이아웃 컴포넌트 |

## 테마와 토큰

- `ThemeProvider`, `useTheme` — 라이트/다크 테마 컨텍스트
- `themes`, `Web`, `Native` — 토큰 정적 객체
- `cx` — className merge 유틸
- `getColor` — 토큰 색 lookup

타입은 `BoxProps`, `ColorToken`, `RadiusToken`, `SpacingToken`, `RNTokens`, `Theme`, `ThemeName` 등 함께 export됩니다.

## Export 경로

| 경로                        | 용도                         |
| --------------------------- | ---------------------------- |
| `@berrypjh/react-native-ui` | 모든 컴포넌트·테마·토큰·유틸 |
