# measure-tokens

`@berrypjh/design-tokens`·`@berrypjh/ui-core` 패키지를 AI 에이전트가 분석할 때 소비하는 input 토큰 수를 시나리오별로 측정한다. Anthropic·OpenAI 두 모델군을 같은 시나리오로 비교해 카탈로그·문서 변경의 효과를 수치로 검증.

## 측정 대상 (target)

`MEASURE_TARGET` 환경변수로 선택. 기본 `design-tokens` (후방 호환).

| target                 | 패키지                 | 시나리오                                                           |
| ---------------------- | ---------------------- | ------------------------------------------------------------------ |
| `design-tokens` (기본) | `libs/design-tokens`   | baseline / with-catalog / catalog-only / agents+catalog            |
| `ui-core`              | `libs/ui-core`         | baseline / with-agents / agents-only / agents+tokens / tokens-only |
| `react-ui`             | `libs/react-ui`        | baseline / with-agents / agents-only / agents+tokens / tokens-only |
| `react-native-ui`      | `libs/react-native-ui` | baseline / with-agents / agents-only / agents+tokens / tokens-only |

## 스크립트

| 명령                                             | 측정 방식        | target          |
| ------------------------------------------------ | ---------------- | --------------- |
| `pnpm tokens:measure[:claude\|:openai]`          | OpenAI/Anthropic | design-tokens   |
| `pnpm ui-core:measure[:claude\|:openai]`         | OpenAI/Anthropic | ui-core         |
| `pnpm react-ui:measure[:claude\|:openai]`        | OpenAI/Anthropic | react-ui        |
| `pnpm react-native-ui:measure[:claude\|:openai]` | OpenAI/Anthropic | react-native-ui |

세 형태 (Anthropic+OpenAI 동시 / Claude 단독 / OpenAI 단독)는 모든 target에서 동일하게 동작.

## 사용

```bash
# 선행: 대상 패키지 dist 필요
pnpm tokens:build       # design-tokens
pnpm nx build @berrypjh/ui-core   # ui-core

# 한 번만: ANTHROPIC_API_KEY 설정 (선택)
cp .env.example .env

# design-tokens 측정
pnpm tokens:measure
pnpm tokens:measure:openai
pnpm tokens:measure:claude

# ui-core 측정
pnpm ui-core:measure
pnpm ui-core:measure:openai
pnpm ui-core:measure:claude
```

`MEASURE_TARGET` env로 직접 선택도 가능:

```bash
MEASURE_TARGET=ui-core pnpm tokens:measure:openai
```

## 환경변수

| 변수                      | 기본                | 설명                                           |
| ------------------------- | ------------------- | ---------------------------------------------- |
| `MEASURE_TARGET`          | `design-tokens`     | 측정 대상 패키지 (`design-tokens` / `ui-core`) |
| `ANTHROPIC_API_KEY`       | —                   | Claude 측정에만 필요                           |
| `MEASURE_ANTHROPIC_MODEL` | `claude-sonnet-4-6` | Claude 모델 ID                                 |
| `MEASURE_OPENAI_MODEL`    | `gpt-4o`            | OpenAI 모델 ID (tiktoken 인코딩 매핑)          |

## 출력 예시

design-tokens:

```
target:   design-tokens
provider: OpenAI gpt-4o (tiktoken local)

scenario        files      chars     tokens        Δ
----------------------------------------------------
baseline            8     87,631     19,311        —
with-catalog        2     45,779     15,144   −21.6%
catalog-only        1     44,971     14,890   −22.9%
agents+catalog      2     48,215     16,047   −16.9%
```

ui-core:

```
target:   ui-core
provider: OpenAI gpt-4o (tiktoken local)

scenario       files      chars     tokens        Δ
---------------------------------------------------
baseline           3    175,745     36,939        —
with-agents        2      3,922      1,366   −96.3%
agents-only        1      3,225      1,151   −96.9%
agents+tokens      2     48,198     16,041   −56.6%
tokens-only        1     44,971     14,890   −59.7%
```

`Δ`는 baseline 대비 증감률. `−`면 토큰 절약, `+`면 증가.

## 디렉토리

```
measure-tokens/
  README.md       이 문서
  shared.ts       타깃 등록부·시나리오·읽기 헬퍼·포맷 함수
  all.ts          Anthropic + OpenAI 동시 측정 (단일 표)
  claude.ts       Anthropic count_tokens API 호출
  openai.ts       OpenAI tiktoken 로컬 인코딩
```

## 새 패키지 추가

`shared.ts`의 `TARGETS` 객체에 항목 한 개 추가:

```ts
'my-pkg': {
  pkg: path.resolve('libs/my-pkg'),
  scenarios: {
    baseline: ['package.json', 'README.md', 'dist/index.d.ts'],
    'with-something': [...],
  },
},
```

`package.json` 스크립트도 추가 (또는 `MEASURE_TARGET=my-pkg`로 직접 호출).
