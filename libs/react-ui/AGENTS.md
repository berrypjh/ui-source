# react-ui

## 절대 원칙

- **웹 전용**: DOM API · CSS · React DOM이 전제. RN API 금지. 양 플랫폼이 쓸 코드는 ui-core로 올린다.
- **ui-core 캡슐화**: react-ui 소비자는 `@berrypjh/ui-core`·`@berrypjh/design-tokens`를 모른다. 컴포넌트 prop은 ui-core contracts를 wrap해 노출 (`BoxProps` 등이 ui-core에서 와도 react-ui 자체 props로 한 번 감싼다).
- **accessibility는 필수**: keyboard/focus/aria 동작은 변경 시 보존. `describeConformance` 기반 conformance 테스트는 회귀 방지용.
- **토큰만 사용**: 색·spacing·radius 하드코딩 금지. SCSS는 CSS 변수, JSX는 `getColor`/Tailwind class 활용.
- **단일 사용처면 react-ui가 아님**: 양 플랫폼이 쓸 로직은 ui-core, 한 컴포넌트 안에서만 쓰면 그 컴포넌트 폴더로.

## 파일 (요약)

```
src/
  index.ts                 public re-export (components/theme + ui-core 패스스루)
  styles.ts                모든 컴포넌트 SCSS aggregator (rollup-plugin-postcss가 dist/index.css로 추출)
  global.d.ts              SCSS 모듈 declaration
  components/
    <name>/<Name>.tsx      구현
    <name>/<Name>.types.ts prop 타입 (필요 시 ui-core props wrap)
    <name>/<Name>.utils.ts cx/이벤트 헬퍼 (있을 때만)
    <name>/<name>.scss     스타일
    <name>/index.ts        feature export
    index.ts               전체 aggregator (정확한 목록은 dist/llm-catalog.json)
  theme/
    ThemeProvider.tsx      <html data-theme=...> 적용
    ThemeProvider.types.ts
    index.ts
  types/
    field.ts               Field* 재export, InputLikeElement 등 DOM 한정 alias
    polymorphic.ts         PropsOf, PolymorphicComponentProps* (component prop 패턴)
    index.ts
  utils/                   internal 전용 (form/input/react). src/index.ts에 노출 안 됨
```

`*.test.tsx`는 같은 폴더, `*.stories.tsx`는 storybook용.

## 작업 매트릭스

| 작업               | 수정 파일                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| 새 컴포넌트        | `components/<name>/{<Name>.tsx, .types.ts, .scss, index.ts}` + `components/index.ts` + `styles.ts` |
| 컴포넌트 prop 변경 | 해당 `<Name>.types.ts` (ui-core contracts 변경 필요 시 거기 먼저)                                  |
| 새 SCSS 파일       | 해당 컴포넌트 폴더 + `src/styles.ts` import 추가                                                   |
| 토큰 사용          | `getColor` (JSX) / Tailwind class / SCSS의 `var(--color-...)`                                      |
| 테마 동작 변경     | `theme/ThemeProvider.tsx` (`data-theme` 적용 정책)                                                 |
| Storybook 추가     | `<Name>.stories.tsx` (publish 안 됨)                                                               |

## 빌드 / 테스트

```bash
pnpm nx build @berrypjh/react-ui          # rollup(JS) + dts-bundle-generator(d.ts) + cp(tailwind/css) + llm-catalog
pnpm nx test @berrypjh/react-ui           # vitest (jsdom)
pnpm nx storybook @berrypjh/react-ui      # storybook
pnpm build-storybook @berrypjh/react-ui   # static storybook
```

빌드 산출물: `dist/{index.esm.js, index.css, types/index.d.ts, tailwind.{js,d.ts}, AGENTS.md, tokens.json, llm-catalog.json, README.md}`. d.ts는 `dts-bundle-generator`로 단일 파일, ui-core/design-tokens 타입을 inline. `llm-catalog.json`은 declaration 생성 뒤 `generate-catalog` target이 만든다 (`tools/scripts/generate-consumer-catalog`).

## Gotcha

- **`use client` 디렉티브**: 서버 컴포넌트 호환을 위해 컴포넌트 최상단에 `'use client';` 유지. rollup 빌드 시 ignore 경고 떠도 무시.
- **dts-bundle-generator는 surface 동결**: re-export하지 않은 타입은 `--export-referenced-types`가 아무리 떠도 dist에 포함 안 됨. 다운스트림에서 필요하면 `src/index.ts`에 명시.
- **ui-core 직접 import 금지**: 외부에서 `@berrypjh/ui-core`를 import하라고 안내 X. react-ui가 캡슐화 — ui-core export는 react-ui index를 통해 패스스루.
- **`components/index.ts`·`styles.ts` 동기화**: 새 컴포넌트는 두 곳에 등록해야 SCSS도 dist/index.css에 들어감.
- **conformance 테스트**: `test-utils/describeConformance`가 root class·prop spread·ref forwarding·polymorphic·className merge를 확인. props 패턴 바꾸면 같이 갱신.

## 다운스트림 영향

- `apps/demo-web` — 모든 컴포넌트의 import 경로는 `@berrypjh/react-ui` 단일. styles는 `@berrypjh/react-ui/styles.css`, Tailwind preset은 `@berrypjh/react-ui/tailwind`로 import.
- 컴포넌트 prop 변경 시 demo-web pages도 동시 갱신 필요.
- ui-core 토큰/타입 변경은 react-ui src/index.ts re-export 라인 동기화로 흡수.

## 변경 체크리스트

- [ ] DOM/웹 전용인가? (양 플랫폼이면 ui-core)
- [ ] ui-core를 직접 노출(소비자 import 안내)하지 않는가?
- [ ] accessibility 회귀 없는가? (keyboard/focus/aria)
- [ ] 토큰 사용 — 하드코딩 색/spacing/radius 없는가?
- [ ] storybook stories·conformance test가 의도를 표현하는가?
- [ ] `components/index.ts` + `styles.ts` 동기화했는가?
