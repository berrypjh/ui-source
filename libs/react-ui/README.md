# @berrypjh/react-ui

React 기반 웹 UI 컴포넌트 라이브러리입니다.
`ui-core`의 컨트랙트와 `design-tokens`를 기반으로 구축되어 있습니다.

## 컴포넌트

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
import { Button, TextField } from '@berrypjh/react-ui';

<Button variant="filled" color="primary">확인</Button>
<TextField label="이름" />
```

## 빌드, 테스트, Storybook

```bash
nx build @berrypjh/react-ui
nx test @berrypjh/react-ui
pnpm storybook
```
