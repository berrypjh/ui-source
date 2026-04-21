# @berrypjh/ui-core

프레임워크에 독립적인 공통 UI 로직 라이브러리입니다.
`react-ui`, `react-native-ui` 모두 이 패키지의 컨트랙트와 유틸리티를 공유합니다.

## 구조

```text
src/
├── contracts/   # 컴포넌트 Props 타입 정의 (Box, Button, Field 등)
├── tokens/      # 디자인 토큰 타입 및 getter 함수
└── utils/       # 공통 유틸리티 (cx, object helpers 등)
```

## 주요 export

- **contracts** — `BoxProps`, `ButtonProps`, `FieldProps` 등 컴포넌트 인터페이스
- **tokens** — `getColor`, `getSpacing`, `getRadius` 등 토큰 접근 getter
- **utils** — `cx` (className 조합), 객체 유틸

## 설치

```bash
pnpm add @berrypjh/ui-core
```

## 빌드 및 테스트

```bash
nx build @berrypjh/ui-core
nx test @berrypjh/ui-core
```
