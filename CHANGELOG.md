## 1.0.1 (2026-05-18)

### 🚀 Features

- **design-tokens:** web rem 변환 transform 추가 및 spacing/color 토큰 정비 ([3be3f78](https://github.com/berrypjh/shared-stack/commit/3be3f78))
- **react-ui:** popover/segment-control/skip-link 추가 및 spacing 토큰 정비 ([240ba69](https://github.com/berrypjh/shared-stack/commit/240ba69))

### 🩹 Fixes

- **design-tokens:** text.disable을 ne500으로 복원해 WCAG AA 대비 충족 ([8ed3170](https://github.com/berrypjh/shared-stack/commit/8ed3170))
- **react-ui:** a11y CI 위반 해소 (Select aria 전달, Fab secondary 대비, stories 색상) ([#888](https://github.com/berrypjh/shared-stack/issues/888), [#666](https://github.com/berrypjh/shared-stack/issues/666))

# 1.0.0 (2026-05-17)

### 🚀 Features

- **commitlint-config:** 워크스페이스 공통 commitlint 설정 패키지 신규 추가 ([0079edc](https://github.com/berrypjh/shared-stack/commit/0079edc))
- **eslint-config:** 워크스페이스 공통 eslint flat config 패키지 신규 추가 ([e7b0a7a](https://github.com/berrypjh/shared-stack/commit/e7b0a7a))
- **prettier-config:** 워크스페이스 공통 prettier 설정 패키지 신규 추가 ([834e82e](https://github.com/berrypjh/shared-stack/commit/834e82e))
- **tsconfig:** 워크스페이스 공통 tsconfig 베이스 패키지 신규 추가 ([6400c6b](https://github.com/berrypjh/shared-stack/commit/6400c6b))
- **ui-core:** button, field, fab, icon-button, menu-item 보편 계약 확장 ([d83303c](https://github.com/berrypjh/shared-stack/commit/d83303c))

### 🩹 Fixes

- **design-tokens:** light 테마 텍스트 토큰 WCAG AA 대비 충족 ([e0b2360](https://github.com/berrypjh/shared-stack/commit/e0b2360))
- **react-ui:** Input 계열 stories a11y 위반 해소 및 InputBase aria 속성 forward ([6c98f63](https://github.com/berrypjh/shared-stack/commit/6c98f63))

## 0.0.6 (2026-05-09)

### 🚀 Features

- **commit-mcp:** staged 변경을 scope별로 커밋하는 MCP 서버 구현 ([9644807](https://github.com/berrypjh/ui-source/commit/9644807))
- **demo-mobile:** react-native-ui 토큰·테마 데모로 App 화면 전환 ([b611caa](https://github.com/berrypjh/ui-source/commit/b611caa))
- **demo-web:** demo-web 애플리케이션 초기 설정 및 기본 구조 추가 ([952146e](https://github.com/berrypjh/ui-source/commit/952146e))
- **demo-web:** 데모 웹 앱 초기 설정 및 빌드 구성 추가 ([8fc81d4](https://github.com/berrypjh/ui-source/commit/8fc81d4))
- **demo-web:** UI 라이브러리 데모 앱 전체 구성 ([56b60a4](https://github.com/berrypjh/ui-source/commit/56b60a4))
- **demo-web:** 디자인 토큰 카탈로그 페이지와 라이트/다크 테마 토글 추가 ([b6e37a3](https://github.com/berrypjh/ui-source/commit/b6e37a3))
- **demo-web-e2e:** e2e 테스트 환경 및 기본 설정 추가 ([0dfa8ee](https://github.com/berrypjh/ui-source/commit/0dfa8ee))
- **demo-web-e2e:** Playwright E2E 테스트 및 프로젝트 설정 구성 ([065ac72](https://github.com/berrypjh/ui-source/commit/065ac72))
- **design-tokens:** design-tokens 라이브러리 초기 설정 및 기본 구조 추가 ([75aaec4](https://github.com/berrypjh/ui-source/commit/75aaec4))
- **design-tokens:** 디자인 토큰 테마 분리 및 병합 빌드 시스템 추가 ([64fae16](https://github.com/berrypjh/ui-source/commit/64fae16))
- **design-tokens:** Style Dictionary 기반 디자인 토큰 파이프라인 및 커스텀 포맷/트랜스폼 추가 ([8fc4b3b](https://github.com/berrypjh/ui-source/commit/8fc4b3b))
- **design-tokens:** Style Dictionary 기반 테마별 디자인 토큰 빌드 시스템 추가 ([9a7d8c9](https://github.com/berrypjh/ui-source/commit/9a7d8c9))
- **design-tokens:** CSS 및 타입 병합 후처리 기능 추가 및 빌드 프로세스 개선 ([bc5d500](https://github.com/berrypjh/ui-source/commit/bc5d500))
- **design-tokens:** Tailwind preset 생성 기능 추가 및 통합 ([c84d808](https://github.com/berrypjh/ui-source/commit/c84d808))
- **design-tokens:** 토큰 경로 매핑 유틸 추가 및 테마 토큰 포맷 개선 ([8d3ce0c](https://github.com/berrypjh/ui-source/commit/8d3ce0c))
- **design-tokens:** design-tokens 타입 정의 및 포맷 개선과 유틸 함수 추가 ([70680c8](https://github.com/berrypjh/ui-source/commit/70680c8))
- **design-tokens:** primary를 emerald로 교체하고 WCAG AA 매핑으로 정비 ([#10](https://github.com/berrypjh/ui-source/issues/10))
- **mcp:** commit scope 격리 및 허용 type 검증 추가 ([fe98c9e](https://github.com/berrypjh/ui-source/commit/fe98c9e))
- **react-native-ui:** 테마 지원 및 Box 컴포넌트 추가 및 라이브러리 설정 개선 ([f9e3422](https://github.com/berrypjh/ui-source/commit/f9e3422))
- **react-ui:** 임시 버튼 컴포넌트 및 Storybook 설정 추가 ([92b8761](https://github.com/berrypjh/ui-source/commit/92b8761))
- **react-ui:** 빌드 설정 및 버튼 컴포넌트 파일 구조 개선 ([8f7e235](https://github.com/berrypjh/ui-source/commit/8f7e235))
- **react-ui:** 컴포넌트 구조 개선 및 버튼 컴포넌트 추가 ([d88537d](https://github.com/berrypjh/ui-source/commit/d88537d))
- **react-ui:** 버튼 및 박스 컴포넌트 스타일링과 빌드 환경 개선 ([f1b3519](https://github.com/berrypjh/ui-source/commit/f1b3519))
- **react-ui:** ButtonBase 컴포넌트와 테스트 환경 추가 ([62e9e53](https://github.com/berrypjh/ui-source/commit/62e9e53))
- **react-ui:** ButtonBase 컴포넌트 키보드 이벤트 지원 및 테스트 추가 ([ee34713](https://github.com/berrypjh/ui-source/commit/ee34713))
- **react-ui:** ButtonBase 컴포넌트 disabled 처리 개선 및 테스트 추가 ([45059f2](https://github.com/berrypjh/ui-source/commit/45059f2))
- **react-ui:** ButtonBase 컴포넌트 polymorphic 타입 및 스타일 추가 ([0f04d22](https://github.com/berrypjh/ui-source/commit/0f04d22))
- **react-ui:** Button 컴포넌트에 로딩 상태 및 아이콘 기능 추가 및 스타일 개선 ([3724c86](https://github.com/berrypjh/ui-source/commit/3724c86))
- **react-ui:** 스토리북 테마 기능 및 설정 경로 수정 ([60655fc](https://github.com/berrypjh/ui-source/commit/60655fc))
- **react-ui:** ButtonBase, Button, ThemeProvider 스토리북 추가 ([571f770](https://github.com/berrypjh/ui-source/commit/571f770))
- **react-ui:** IconButton 컴포넌트 추가 및 Button 관련 타입 정리 ([15bb308](https://github.com/berrypjh/ui-source/commit/15bb308))
- **react-ui:** Fab 컴포넌트 추가 및 관련 스토리북과 테스트 작성 ([1b537d0](https://github.com/berrypjh/ui-source/commit/1b537d0))
- **react-ui:** BubbleButton 컴포넌트 신규 추가 ([b10b168](https://github.com/berrypjh/ui-source/commit/b10b168))
- **react-ui:** FormControl 컴포넌트 및 관련 타입, 훅 추가 ([ef963ae](https://github.com/berrypjh/ui-source/commit/ef963ae))
- **react-ui:** InputLabel 컴포넌트 추가 ([401cb83](https://github.com/berrypjh/ui-source/commit/401cb83))
- **react-ui:** FormHelperText 컴포넌트 추가 ([fd2c3b8](https://github.com/berrypjh/ui-source/commit/fd2c3b8))
- **react-ui:** InputBase 컴포넌트 추가 및 스타일 구현 ([acb4a73](https://github.com/berrypjh/ui-source/commit/acb4a73))
- **react-ui:** BoxedInput, FilledInput, PlainInput 컴포넌트 추가 및 InputBase 개선 ([fe28281](https://github.com/berrypjh/ui-source/commit/fe28281))
- **react-ui:** TextField 컴포넌트 신규 구현 및 스타일 추가 ([7c33959](https://github.com/berrypjh/ui-source/commit/7c33959))
- **react-ui:** Select 및 MenuItem 컴포넌트 신규 추가 ([5c46900](https://github.com/berrypjh/ui-source/commit/5c46900))
- **react-ui:** SearchField 컴포넌트 신규 추가 ([4d7cbf6](https://github.com/berrypjh/ui-source/commit/4d7cbf6))
- **react-ui:** 다양한 입력 컴포넌트 스토리북 스토리 추가 ([5339156](https://github.com/berrypjh/ui-source/commit/5339156))
- **react-ui:** search-field 컴포넌트 public export 추가 ([c020899](https://github.com/berrypjh/ui-source/commit/c020899))
- **react-ui:** MenuItem을 패키지 public exports에 추가 ([7580c87](https://github.com/berrypjh/ui-source/commit/7580c87))
- ⚠️  **react-ui:** 정식 배포용 스타일 진입점 확정 ([deb15f7](https://github.com/berrypjh/ui-source/commit/deb15f7))
- **root:** 디자인 토큰 빌드 설정 및 플랫폼별 출력 개선 ([4c6f7d5](https://github.com/berrypjh/ui-source/commit/4c6f7d5))
- **root:** 릴리즈 및 빌드 환경 설정 개선 및 로컬 릴리즈 스크립트 추가 ([e94e123](https://github.com/berrypjh/ui-source/commit/e94e123))
- **root:** build:design-tokens 스크립트 추가 ([729a55d](https://github.com/berrypjh/ui-source/commit/729a55d))
- **root:** 신규 디자인 토큰 패키지 추가 ([a642798](https://github.com/berrypjh/ui-source/commit/a642798))
- **root:** react-native-ui 패키지 추가 및 의존성 업데이트 ([052ed24](https://github.com/berrypjh/ui-source/commit/052ed24))
- **root:** 테스트 라이브러리 의존성 추가 ([4045b7b](https://github.com/berrypjh/ui-source/commit/4045b7b))
- **root:** claude 플러그인 설정 파일 추가 ([f64ac27](https://github.com/berrypjh/ui-source/commit/f64ac27))
- **root:** Storybook 스토리 자동 생성 커맨드 추가 ([d9c76c3](https://github.com/berrypjh/ui-source/commit/d9c76c3))
- **root:** ai-commit MCP 서버 연동 설정 추가 ([e45b50e](https://github.com/berrypjh/ui-source/commit/e45b50e))
- **scripts:** NPM 배포 스크립트 추가 ([42773b0](https://github.com/berrypjh/ui-source/commit/42773b0))
- **ui-core:** 버튼 컴포넌트 추가 및 토큰 유틸리티 도입 ([be8161e](https://github.com/berrypjh/ui-source/commit/be8161e))
- **ui-core:** Theme 및 토큰 유틸리티 함수와 타입 확장 추가 ([ab9443d](https://github.com/berrypjh/ui-source/commit/ab9443d))
- **ui-core:** 필드 관련 타입 정의 및 인덱스 파일에 추가 ([b856d27](https://github.com/berrypjh/ui-source/commit/b856d27))
- **ui-core:** 객체 유틸 함수 추가 ([0f98f6d](https://github.com/berrypjh/ui-source/commit/0f98f6d))

### 🩹 Fixes

- **design-tokens:** light text.secondary를 se700으로 올려 ne100 캔버스에서 AA 충족 ([#9](https://github.com/berrypjh/ui-source/issues/9), [#865](https://github.com/berrypjh/ui-source/issues/865))
- **react-native-ui:** tsconfig 경로 설정에 ./ 추가 수정 ([4b33672](https://github.com/berrypjh/ui-source/commit/4b33672))
- **react-ui:** React 19 호환을 위해 ThemeProvider children을 props로 전달 ([65f5aae](https://github.com/berrypjh/ui-source/commit/65f5aae))
- **react-ui:** SCSS 로드 순서 정정 + composite outDir + button 색 variant 매핑 정비 ([5683ec0](https://github.com/berrypjh/ui-source/commit/5683ec0))
- **root:** package.json 빌드 스크립트 개선 ([f664304](https://github.com/berrypjh/ui-source/commit/f664304))
- **root:** Storybook addon 버전 하향 조정 ([ca68f45](https://github.com/berrypjh/ui-source/commit/ca68f45))
- **root:** PR 체크 워크플로우의 의존성 빌드 스크립트 분리 ([6f8fa1c](https://github.com/berrypjh/ui-source/commit/6f8fa1c))
- **root:** GitHub Actions artifact 업로드 액션 버전 업데이트 ([ac729f2](https://github.com/berrypjh/ui-source/commit/ac729f2))
- **scripts:** eas-build-post-install import 공백 누락 수정 ([9de6b77](https://github.com/berrypjh/ui-source/commit/9de6b77))
- **ui-core:** FieldVariant 타입 변경 ([2e7a711](https://github.com/berrypjh/ui-source/commit/2e7a711))
- **ui-core:** readPath 인덱스 접근에 Record 캐스트 추가 ([96555e6](https://github.com/berrypjh/ui-source/commit/96555e6))

### ⚠️  Breaking Changes

- **react-ui:** 정식 배포용 스타일 진입점 확정  ([deb15f7](https://github.com/berrypjh/ui-source/commit/deb15f7))
  라이브러리 정식 배포 준비로 스타일 진입점이 확정됨.
  컴포넌트만 import해도 SCSS 묶음이 자동 번들되며,
  기존 styles 별도 import 호출은 제거 가능.