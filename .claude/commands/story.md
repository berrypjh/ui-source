---
description: 기존 컴포넌트에 누락되거나 부족한 Storybook 스토리를 자동 생성합니다
argument-hint: '<ComponentName>'
---

$ARGUMENTS에서 컴포넌트 이름을 파악하세요.
인자가 없으면 현재 열려 있는 파일의 컴포넌트를 대상으로 하세요.

## 0단계 — 이름 변환

입력이 어떤 형태로 오든 (`BoxedInput` / `boxed-input` / `boxedinput`) 다음 두 형태를 도출하세요.

- **PascalCase** → 파일명, 컴포넌트명, export명에 사용
- **kebab-case** → 폴더명에 사용

변환 규칙:

- `BoxedInput` → PascalCase: `BoxedInput` / kebab-case: `boxed-input`
- `boxed-input` → PascalCase: `BoxedInput` / kebab-case: `boxed-input`
- `button` → PascalCase: `Button` / kebab-case: `button`

경로 조합 예시 (`BoxedInput`인 경우):폴더: libs/react-ui/src/components/boxed-input/
React 파일: libs/react-ui/src/components/boxed-input/BoxedInput.tsx

이후 모든 단계에서 경로를 조합할 때 이 규칙을 따르세요.

## 1단계 — 컴포넌트 파악

다음 파일들을 읽으세요:

**React:**

- `libs/react-ui/src/components/{kebab-case}/{PascalCase}.tsx`
- `libs/react-ui/src/components/{kebab-case}/index.ts`
- `libs/ui-core/src/types/{kebab-case}.ts`

기존 스토리 파일이 있으면 함께 읽어 중복을 피하세요:

- `libs/react-ui/src/components/{kebab-case}/{PascalCase}.stories.tsx`

파악할 내용:

- 모든 Props와 타입, 기본값
- 필수 Props vs optional Props 구분
- union 타입 (`variant`, `size`, `color` 등) — 가능한 값 전부 열거
- 이벤트 핸들러 (`onClick`, `onChange` 등)
- `children` 또는 slot 여부
- boolean 상태 Props 전부 (`disabled`, `error`, `loading`, `readOnly`, `required`, `multiline`, `checked`, `open` 등)
- slot/adornment Props (`startAdornment`, `endAdornment`, `icon`, `prefix` 등)

## 2단계 — 스토리 커버리지 분석

기존 스토리가 있다면, 빠진 스토리를 분석해서 먼저 보고하세요:

```
현재 커버리지:
- ✅ Default
- ✅ Disabled
- ❌ AllVariants (없음)
- ❌ Loading 상태 (없음)
- ❌ 에러 상태 (없음)
- ❌ 접근성 예시 (없음)

생성할 스토리: AllVariants, Loading, Error, A11y
```

기존 스토리가 없으면 아래 필수 목록 전체를 생성하세요.

## 3단계 — 스토리 생성

### React 스토리 파일

저장 위치: `libs/react-ui/src/components/{kebab-case}/{PascalCase}.stories.tsx`

**필수 스토리 목록:**

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

> **상태 Props 일반 원칙:** 위 목록 외에도 컴포넌트에 boolean 상태 prop이 있으면 (`checked`, `selected`, `expanded`, `open` 등) 각각 독립된 스토리를 추가하세요. 상태 조합(예: `disabled + error`)이 의미 있는 경우 `DisabledWithError` 같은 이름으로 추가합니다.

**코드 형식 (CSF3, Storybook 8 기준):**

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
  // 모든 스토리에서 공유할 기본 args를 meta.args에 선언
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

// 여러 스토리에서 공유하는 레이아웃 스타일은 상수로 추출
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

// Playground — Controls 패널로 전부 조작 가능
export const Playground: Story = {
  render: (args) => <{PascalCase} {...args} />,
};

// Default — 가장 기본 형태
export const Default: Story = {
  args: {
    // 필수 Props만, 나머지는 meta.args 기본값에 맡김
  },
};

// AllVariants — 모든 variant를 한눈에
export const AllVariants: Story = {
  render: () => (
    <div style={rowStyle}>
      {/* variant 값마다 인스턴스 — 컴포넌트 분석 결과로 채울 것 */}
    </div>
  ),
};

// A11y — 접근성 올바른 사용 예시
export const A11y: Story = {
  render: () => (
    <div style={columnStyle}>
      {/* aria-label, role, aria-describedby 등 올바른 사용 예시 */}
    </div>
  ),
  parameters: {
    a11y: { disable: false },
  },
};
```

## 규칙

- 경로 조합 시 폴더는 반드시 kebab-case, 파일명은 반드시 PascalCase
- `meta.args`에 모든 스토리의 공유 기본값을 선언하고, 개별 스토리 `args`는 그 위에 덮어쓰기만 함
- `argTypes`에서 union 타입은 반드시 `control: 'select'`와 `options` 명시
- `ReactNode`, `ref`, `className`, `style`, `component` 등 직렬화 불가 props는 `control: false`로 설정
- `Playground`는 반드시 `render: (args) => <Component {...args} />` 형태로 작성
- 여러 스토리에서 공유하는 레이아웃 스타일은 파일 상단에 상수(`columnStyle`, `rowStyle`)로 추출
- `render` 함수 안 `style`은 인라인 또는 상단 상수만 사용 (CSS 파일 import 금지)
- `AllVariants`에는 실제 컴포넌트 인스턴스를 variant 수만큼 렌더링
- `A11y` 스토리에는 `parameters.a11y.disable: false` 반드시 명시
- 스토리 export 이름은 영문 PascalCase (`Default`, `AllVariants` 등)
- Lorem ipsum 금지 — 실제 UI에서 쓸 법한 텍스트 사용
- 기존 스토리가 있을 때는 덮어쓰지 말고 누락된 스토리만 추가
