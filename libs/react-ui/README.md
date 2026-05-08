# @berrypjh/react-ui

React 웹 UI 컴포넌트 라이브러리. 디자인 토큰 기반의 일관된 컴포넌트 세트를 제공합니다.

## 설치

```bash
pnpm add @berrypjh/react-ui
```

CSS를 별도로 import해야 합니다.

```ts
import '@berrypjh/react-ui/styles.css';
```

## 사용 예시

```tsx
import { Button, TextField, ThemeProvider } from '@berrypjh/react-ui';

<ThemeProvider initialTheme="light">
  <Button variant="filled" color="primary">확인</Button>
  <TextField label="이름" />
</ThemeProvider>
```

## 제공 컴포넌트

| 컴포넌트 | 설명 |
| --- | --- |
| `Box` | 기본 레이아웃 컴포넌트 |
| `Button` | 버튼 (variant, size, color 지원) |
| `IconButton` | 아이콘 전용 버튼 |
| `Fab` | Floating Action Button |
| `BubbleButton` | 버블 스타일 버튼 |
| `TextField` | 텍스트 입력 필드 |
| `BoxedInput` / `FilledInput` / `PlainInput` | 스타일 변형 인풋 |
| `Select` | 셀렉트 박스 |
| `SearchField` | 검색 필드 |
| `FormControl` / `InputLabel` / `FormHelperText` | 폼 구성 요소 |
| `MenuItem` | 메뉴 아이템 |

## 테마와 토큰

- `ThemeProvider` — 라이트/다크/세피아 테마 컨텍스트
- `themes`, `Web`, `Native` — 토큰 정적 객체
- `cx` — className merge 유틸
- `getColor` — 토큰 색 lookup

타입은 `BoxProps`, `ButtonProps`, `ColorToken`, `RadiusToken`, `SpacingToken`, `Theme`, `ThemeName` 등 함께 export됩니다.

## Tailwind 연동

```ts
// tailwind.config.{js,ts}
import preset from '@berrypjh/react-ui/tailwind';

export default {
  presets: [preset],
};
```

## Export 경로

| 경로 | 용도 |
| --- | --- |
| `@berrypjh/react-ui` | 모든 컴포넌트·테마·토큰·유틸 |
| `@berrypjh/react-ui/styles.css` | 글로벌 CSS (토큰 변수 + 컴포넌트 스타일) |
| `@berrypjh/react-ui/tailwind` | Tailwind preset |
