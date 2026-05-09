# @berrypjh/ui-source

> **Note**
> GitHub Packages 비공개 배포 라이브러리입니다. 설치 전 `.npmrc` 설정이 필요합니다.

**Nx** 기반 크로스 플랫폼 UI 컴포넌트 라이브러리 모노레포입니다.
공통 코어 로직(`ui-core`)과 디자인 토큰(`design-tokens`)을 공유하여 웹(React)과 모바일(React Native) 환경에서 일관된 UI 경험을 제공합니다.

## 기술 스택

| 분류                 | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo & Build** | ![Nx](https://img.shields.io/badge/Nx-143055?style=flat-square&logo=nx&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)                                                                                                                                                                                                                                                                     |
| **Core**             | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                                                                                                                                                                                                                                                                           |
| **Web Library**      | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                                                                       |
| **Mobile Library**   | ![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black) ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)                                                                                                                                                                                                                                              |
| **Testing & Docs**   | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white) ![Chromatic](https://img.shields.io/badge/Chromatic-FC521F?style=flat-square&logo=chromatic&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |

## 패키지 구조

```text
libs/
├── ui-core/              # 프레임워크 독립적 공통 로직 (Pure TS)
├── design-tokens/        # 디자인 토큰 (CSS 변수, Tailwind, RN)
├── react-ui/             # React 컴포넌트 라이브러리 (Web)
└── react-native-ui/      # React Native 컴포넌트 라이브러리 (Mobile)

apps/
├── demo-web/             # 웹 라이브러리 데모 (React)
├── demo-web-e2e/         # 웹 E2E 테스트 (Playwright)
└── demo-mobile/          # 모바일 라이브러리 데모 (Expo)

tools/
├── scripts/              # 측정·트리셰이킹·릴리즈 자동화 스크립트
└── mcp/                  # mcp 도구
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 웹 데모 앱 실행
pnpm start

# 모바일 데모 앱 실행
pnpm start:mobile

# Storybook 실행
pnpm storybook
```

## 주요 명령어

| 명령어               | 설명                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| `pnpm build`         | 전체 빌드                                                                     |
| `pnpm build:libs`    | 라이브러리만 빌드 (`design-tokens`, `ui-core`, `react-ui`, `react-native-ui`) |
| `pnpm tokens:build`  | 디자인 토큰 빌드                                                              |
| `pnpm test`          | 전체 테스트 실행                                                              |
| `pnpm lint`          | 전체 린트                                                                     |
| `pnpm typecheck`     | 전체 타입 체크                                                                |
| `pnpm release:local` | 로컬 레지스트리로 릴리즈                                                      |

## 사용 (설치)

GitHub Packages 비공개 배포로 제공됩니다. 설치 전 `.npmrc`에 레지스트리와 인증 토큰을 설정해야 합니다.

```
@berrypjh:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

```bash
pnpm add @berrypjh/react-ui
pnpm add @berrypjh/react-native-ui
```

## 라이선스

MIT
