---
name: story
description: 기존 컴포넌트와 인접 스토리 패턴을 분석해 누락된 Storybook 스토리만 최소 수정으로 추가합니다
argument-hint: <ComponentName>
---

$ARGUMENTS에서 컴포넌트 이름을 파악하세요.
인자가 없으면 현재 열려 있는 파일 또는 현재 작업 중인 컴포넌트를 기준으로 추론하세요.

목표:

- 기존 Storybook 파일이 없으면 새로 생성
- 기존 Storybook 파일이 있으면 누락된 스토리만 최소 수정으로 추가
- 항상 현재 모노레포의 기존 스토리 패턴을 우선 재사용

## 0단계 — 이름 변환

입력이 어떤 형태로 오든 (`BoxedInput` / `boxed-input` / `boxedinput`) 다음 두 형태를 도출하세요.

- **PascalCase** → 파일명, 컴포넌트명, export명에 사용
- **kebab-case** → 폴더명에 사용

변환 규칙:

- `BoxedInput` → PascalCase: `BoxedInput` / kebab-case: `boxed-input`
- `boxed-input` → PascalCase: `BoxedInput` / kebab-case: `boxed-input`
- `button` → PascalCase: `Button` / kebab-case: `button`

경로 조합 예시 (`BoxedInput`인 경우): 폴더: `libs/react-ui/src/components/boxed-input/` / React 파일: `libs/react-ui/src/components/boxed-input/BoxedInput.tsx`

## 1단계 — 컴포넌트 탐색

경로를 "고정 조합"하지 말고 아래 순서로 찾으세요.

1. `libs/react-ui/src/components/**/{PascalCase}.tsx`
2. 같은 폴더의 `index.ts`
3. 같은 폴더의 `{PascalCase}.stories.tsx`
4. 같은 라이브러리에서 이름/props가 유사한 인접 스토리 파일 2~3개
5. 필요하면 연관 타입 정의 파일 (`libs/ui-core/src/types/{kebab-case}.ts`)

컴포넌트 파일이 여러 개면:

- `libs/react-ui/src/components/` 아래를 우선
- 동일 이름이면 현재 작업 파일과 가장 가까운 경로를 우선

## 2단계 — 기존 패턴 학습

스토리를 생성하기 전에 반드시 아래를 파악하세요.

- title 패턴
- meta 구조
- tags, parameters, decorators 사용 방식
- argTypes 관례
- Playground/Default/Variants 계열 스토리 관례
- wrapper 필요 여부 (예: FormControl, ThemeProvider)

기존 패턴이 있으면 일반 Storybook 예시보다 프로젝트 패턴을 우선합니다.

## 3단계 — 컴포넌트 분석

다음을 분석하세요.

- 필수/선택 props
- union props (`variant`, `size`, `color` 등) — 가능한 값 전부 열거
- boolean 상태 props (`disabled`, `error`, `loading`, `readOnly`, `required`, `multiline`, `checked`, `open` 등)
- 이벤트 핸들러 (`onClick`, `onChange` 등)
- children / slot / adornment (`startAdornment`, `endAdornment`, `icon`, `prefix` 등)
- 스토리로 의미 있게 보여줄 수 있는 상태 조합

## 4단계 — 커버리지 분석

기존 story가 있으면 먼저 현재 커버리지를 요약해서 보고하세요.
누락된 스토리만 생성 대상으로 확정하세요.

기본 후보:

| 스토리 이름      | 설명                                                   | 조건                                           |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------- |
| `Playground`     | `argTypes` 전부 열어서 Controls 패널로 자유롭게 조작   | 항상                                           |
| `Default`        | 가장 기본 형태, 필수 Props만                           | 항상                                           |
| `AllVariants`    | `variant` union 값 전체를 한 화면에                    | `variant` prop이 있을 때만                     |
| `AllSizes`       | `size` union 값 전체                                   | `size` prop이 있을 때만                        |
| `AllColors`      | `color` union 값 전체                                  | `color` prop이 있을 때만                       |
| `Disabled`       | `disabled` 상태                                        | `disabled` prop이 있을 때만                    |
| `Error`          | `error` 상태, 잘못된 값 포함                           | `error` prop이 있을 때만                       |
| `Loading`        | `loading` 또는 `isLoading` 상태                        | `loading` prop이 있을 때만                     |
| `ReadOnly`       | `readOnly` 상태                                        | `readOnly` prop이 있을 때만                    |
| `Required`       | `required` 상태, label과 함께                          | `required` prop이 있을 때만                    |
| `Multiline`      | 여러 줄 입력 상태                                      | `multiline` prop이 있을 때만                   |
| `FullWidth`      | 전체 너비 레이아웃, `parameters.layout: 'padded'` 적용 | `fullWidth` prop이 있을 때만                   |
| `WithAdornments` | start/end adornment 조합                               | `startAdornment` 또는 `endAdornment`가 있을 때 |
| `WithLongText`   | 긴 텍스트/내용에서의 레이아웃                          | 항상                                           |
| `A11y`           | aria 속성 올바른 사용 예시                             | 항상                                           |

위 목록 외에도 컴포넌트에 boolean 상태 prop이 있으면 각각 독립된 스토리를 추가하세요. 상태 조합(예: `disabled + error`)이 의미 있는 경우 `DisabledWithError` 같은 이름으로 추가합니다. 단, 컴포넌트 의미에 맞지 않는 스토리는 억지로 만들지 마세요.

## 5단계 — 스토리 생성

저장 위치: `libs/react-ui/src/components/{kebab-case}/{PascalCase}.stories.tsx`

기존 패턴이 없을 때 아래 예시 파일을 참고하세요:

- `examples/variant-component.stories.tsx` — variant / size / color / loading이 있는 버튼형 컴포넌트
- `examples/input-component.stories.tsx` — 텍스트 입력형 컴포넌트 (adornment / multiline / fullWidth)
- `examples/children-component.stories.tsx` — children을 직접 전달하는 컴포넌트 (render 함수 기반)

기본 코드 형식 (CSF3, Storybook 8 기준):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { {PascalCase} } from './{PascalCase}';

const meta = {
  title: 'Components/{PascalCase}',
  component: {PascalCase},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    // 컴포넌트의 기본 Props 값
  },
  argTypes: {
    // union 타입은 control: 'select'로 명시
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    // ReactNode, ref, 함수형 콜백 등 직렬화 불가 props는 control: false
    icon: { control: false },
    ref: { control: false },
    className: { control: false },
    style: { control: false },
  },
} satisfies Meta<typeof {PascalCase}>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = {
  display: 'grid',
  gap: '16px',
  minWidth: '320px',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '16px',
  alignItems: 'center',
};

export const Playground: Story = {
  render: (args) => <{PascalCase} {...args} />,
};

export const Default: Story = {
  args: {},
};
```

## 생성 규칙

- 폴더는 반드시 kebab-case, 파일명은 반드시 PascalCase
- 기존 story 파일이 있으면 전체 재작성하지 말고 최소 수정만 수행
- `meta.args`에 공통 기본값을 두고 개별 스토리는 덮어쓰기만 사용
- union prop은 `argTypes` select + options 명시
- `ReactNode`, `ref`, `className`, `style` 등 직렬화 불가 props는 `control: false`
- `Playground`는 반드시 `render: (args) => <Component {...args} />` 형태
- 여러 스토리에서 쓰는 레이아웃 style은 파일 상단 상수(`columnStyle`, `rowStyle`)로 추출
- `render` 함수 안 style은 인라인 또는 상단 상수만 사용 (CSS 파일 import 금지)
- `AllVariants`에는 실제 컴포넌트 인스턴스를 variant 수만큼 렌더링
- `A11y` 스토리에는 `parameters.a11y.disable: false` 반드시 명시
- 스토리 export 이름은 영문 PascalCase
- Lorem ipsum 금지 — 실제 UI에서 쓸 법한 텍스트 사용

## 6단계 — 출력 방식

먼저 아래 형식으로 보고하세요.

```
현재 커버리지:
- ✅ Default
- ❌ AllVariants (없음)

생성할 스토리: AllVariants, ...
```

그 다음 실제 파일 변경을 수행하세요.
