# @berrypjh/demo-web-e2e

`@berrypjh/demo-web`의 E2E 테스트 앱입니다.
[Playwright](https://playwright.dev/)를 사용하여 페이지 이동 및 컴포넌트 동작을 검증합니다.

## 실행

```bash
# 헤드리스 실행
pnpm exec nx run @berrypjh/demo-web-e2e:e2e

# UI 모드 (시각적 디버깅)
pnpm exec nx run @berrypjh/demo-web-e2e:e2e-ui
```

> 테스트 실행 시 `playwright.config.ts`의 `webServer` 설정이 `demo-web` 개발 서버(포트 4200)를 자동으로 실행합니다.
