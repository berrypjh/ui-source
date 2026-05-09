---
name: ai-commit
description: staged 변경을 scope별로 분석하고 Conventional Commits 형식의 한국어 커밋 메시지를 제안한 뒤, 승인 후 scope별로 커밋한다.
when_to_use: Use when the user wants to create commit messages for staged git changes, especially when multiple apps/libs scopes are staged together.
argument-hint: [major]
disable-model-invocation: true
---

# AI Commit

이 skill은 현재 프로젝트에 연결된 `ai-commit` MCP 서버를 사용한다.

참고 기준 문서:

- `.claude/skills/ai-commit/examples/commit-message-rules.md`

## 목적

현재 staged 변경을 분석해서:

1. scope를 감지하고
2. scope별 Conventional Commits 메시지를 제안하고
3. 사용자 승인 후
4. 해당 scope만 커밋한다.

## 입력 인자

scope 선택은 사용자가 `git add`로 직접 제어한다. skill은 scope 인자를 받지 않는다.

- 인자 없음: 모든 staged scope를 일반(patch/minor) commit 흐름으로 처리한다.
- `major`: 이번 호출의 모든 commit에 BREAKING CHANGE footer 처리 흐름을 적용한다.
  - 같은 메시지에 `BREAKING CHANGE: <본문>` 형식의 footer 본문이 함께 있으면 그 본문을 그대로 사용한다.
  - 본문이 없으면 사용자에게 마이그레이션 가이드를 묻고, 응답을 받기 전까지 commit하지 않는다.
  - 합성된 commit 메시지(title + body + footer) 전체를 사용자에게 다시 보여주고 별도 승인(`y`)을 받는다.
  - 0.x 단계라면 다음 release에서 1.0.0으로의 major bump가 발생할 수 있음을 한 번 안내한다.
- 그 외 인자는 무시하고 일반 흐름으로 처리한다.

## 반드시 지킬 절차

1. 먼저 `list_staged_scopes` tool을 호출한다.
2. staged scope가 없으면 그 사실을 알려주고 바로 종료한다.
3. 각 staged scope마다 `get_scope_details` tool을 호출한다.
4. 각 scope에 대해 커밋 메시지를 제안한다.
   - title 형식: `type(scope): 설명`
   - type은 영어 (`feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `build`, `ci`)
   - scope는 MCP가 반환한 값 그대로 사용한다
   - 설명은 한국어로 작성한다
   - body는 최대 3줄
   - rename / delete / copy / 공통화 / 구조 정리가 핵심이면 body에서 반드시 언급한다
   - `major` 인자가 있으면 위 BREAKING CHANGE footer 처리 절차를 함께 따른다
5. 반드시 사용자 승인 후에만 `commit_scope` tool을 호출한다.
   - 승인 전에는 절대 커밋하지 않는다.
6. 여러 scope가 있으면 한 번에 전부 commit하지 말고, scope별로 순서대로 승인받고 진행한다.
7. 사용자가 수정 요청을 하면 수정된 제목/본문으로 다시 제안한 뒤 승인받는다.
8. tool 실행이 실패하면 stderr/에러를 요약해서 보여주고, 다음 scope로 넘어갈지 중단할지 사용자 의사를 확인한다.

## 응답 방식

각 scope마다 아래 형식으로 보여준다.

### scope: <scope>

**제안 제목**
`type(scope): 설명`

**제안 본문**

- 첫 줄
- 둘째 줄
- 셋째 줄

**판단 근거**

- 어떤 변경이 핵심인지 1~3줄 요약

그 다음 아래처럼 묻는다.

- `y`: 이 메시지로 커밋
- `e`: 제목/본문 수정 후 다시 제안
- `s`: 이 scope는 건너뛰기
- `n`: 전체 중단

## 추가 규칙

- diff에 없는 내용을 지어내지 않는다.
- 불확실하면 과장된 `feat` 대신 보수적으로 `refactor` 또는 `chore`를 선택한다.
- body가 불필요하면 비워도 되지만, rename/refactor 성격이 강하면 body를 넣는다.
- 사용자가 "본문 없이"를 원하면 title만 사용한다.
- 사용자가 여러 scope를 한 번에 묶어달라고 명시하지 않은 이상, scope별 개별 커밋을 유지한다.
- BREAKING CHANGE footer는 사용자가 `major` 인자로 명시적으로 요청한 경우에만 추가한다. LLM이 자체 판단으로 footer를 제안하거나 추가하지 않는다.
- title은 `feat(scope): ...` 같은 형식만 허용한다. `feat!:` 등 헤더 `!` 표기는 commitlint(`no-header-bang`)가 차단하므로 사용하지 않는다.
