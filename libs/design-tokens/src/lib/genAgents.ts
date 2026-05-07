import fs from 'node:fs/promises';

import type { ThemeBuild } from './sd';
import { TOKEN_CATEGORIES } from './tokens';

/**
 * npm 소비자(AI 에이전트 포함)용 AGENTS.md를 dist/에 생성한다.
 * 자료는 build dict에서 추출 — 테마·카테고리 변경 시 자동 동기화.
 *
 * 루트의 `libs/design-tokens/AGENTS.md`와 별도. 그쪽은 monorepo 개발자용.
 */
export const writeAgents = async (builds: ThemeBuild[], outFileAbs: string): Promise<void> => {
  const themes = builds.map((b) => b.theme);
  const themesArr = JSON.stringify(themes);
  const categoriesArr = JSON.stringify(TOKEN_CATEGORIES);

  const content = `# @berrypjh/design-tokens

토큰 JSON을 입력으로 **CSS 변수**, **React Native JS 객체**, **Tailwind preset**을 생성하는 라이브러리.

## TL;DR

\`\`\`ts
// CSS 변수 정의 (--ds-* 부수효과)
import '@berrypjh/design-tokens/css';

// 타입 안전 토큰 객체 (light theme 정적 스냅샷)
import { Web, Native } from '@berrypjh/design-tokens';
const color = Web.Light.tokens.color.primary.pr500;     // '#2E90FA'
const spacing = Native.Light.tokens.spacing.md;          // 8 (RN은 number)

// Tailwind preset (아래 "Tailwind 연결" 참조)
import preset from '@berrypjh/design-tokens/tailwind';
\`\`\`

테마 전환은 \`<html data-theme="dark">\` 같은 \`data-theme\` 속성으로 (CSS 변수가 자동 갱신).

## ⚠️ 정적 객체 vs 런타임 변수 (혼동 금지)

| 용도 | 메커니즘 |
| --- | --- |
| **런타임 테마 전환** | CSS 변수 (\`var(--ds-...)\`). \`data-theme\` 속성으로 자동 |
| **빌드 시점 정적 값 참조** | \`Web.Light.tokens.*\` / \`Native.Light.tokens.*\` |

\`Web.Dark.tokens.*\` 등 다른 테마 namespace도 있지만 **빌드 시점 정적 스냅샷**일 뿐. 다크모드 처리하려고 \`Web.Dark\`를 동적으로 선택하지 말 것 — CSS 변수가 알아서 처리.

## 토큰 catalog

\`dist/tokens.json\` — 모든 토큰의 path, CSS 변수, 테마별 값을 단일 평탄 JSON으로 enumerate.

\`\`\`jsonc
{
  "schema": "tokens[path] = [cssVar, ...valuesInThemesOrder]",
  "themes": ${themesArr},
  "categories": ${categoriesArr},
  "tokens": {
    "color.primary.pr500": ["--ds-primary-pr500", "#2E90FA", "#53B1FD", "#2E90FA"]
  }
}
\`\`\`

배열 인덱스: \`[0]\` cssVar, \`[1+]\` themes 배열 순서대로 각 테마 값.

## Export 경로

| 경로 | 용도 |
| --- | --- |
| \`@berrypjh/design-tokens\` | \`themes\`, \`ThemeName\`, \`ThemeDef\`, \`Web\` / \`Native\` namespace, \`tailwindPreset\` |
| \`@berrypjh/design-tokens/web\` | Web 토큰 namespace (\`Light\`, \`Dark\`, \`Sepia\`). 값은 모두 string |
| \`@berrypjh/design-tokens/rn\` | RN 토큰 namespace. \`spacing\` · \`radius\` · \`borderWidth\` · \`typography.{fontSize,lineHeight,letterSpacing}\` 토큰이 number로 변환됨. 색은 hex string 그대로 |
| \`@berrypjh/design-tokens/css\` | CSS 변수 (\`:root\`, \`[data-theme="dark"]\` 등에 \`--ds-*\` 정의) |
| \`@berrypjh/design-tokens/tailwind\` | Tailwind preset (default export) |

namespace 키는 테마명의 첫 글자 대문자 변환: \`light\` → \`Light\`.

## Tailwind 연결

Tailwind v4 + preset 등록:

\`\`\`js
// tailwind.config.js
import preset from '@berrypjh/design-tokens/tailwind';
export default { presets: [preset] };
\`\`\`

\`\`\`css
/* styles.css */
@import 'tailwindcss';
@config '../tailwind.config.js';
\`\`\`

이후 \`bg-primary-pr500\`, \`text-primary-pr500/50\` (alpha) 같은 유틸 사용 가능. alpha는 자동 생성된 \`--ds-*-rgb\` 채널 변수로 동작.

## CSS 변수 규칙

- prefix: \`--ds-\` (고정)
- naming: \`--ds-{kebab(rawPath)}\` (예: \`primary.pr500\` → \`--ds-primary-pr500\`)
- color 토큰은 \`-rgb\` 채널 변수도 자동 생성 (Tailwind alpha용): \`--ds-primary-pr500-rgb\`

## 카테고리 (${TOKEN_CATEGORIES.length}종)

${TOKEN_CATEGORIES.map((c) => `\`${c}\``).join(', ')}

\`Web.Light.tokens.{category}.*\` 트리로 노출. RN 쪽도 동일 구조.

**typography 주의**: 일부는 composite 객체. 예: \`Web.Light.tokens.typography.display.huge\` = \`{ fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }\`. catalog(\`tokens.json\`)에는 leaf까지 평탄화되지만 JS namespace에서는 객체 그대로 유지.

## 테마 (${themes.length}종)

${themes.map((t) => `\`${t}\``).join(', ')} — 첫 번째가 base.

## 자동화 메모

- 모든 산출물(\`dist/css/*\`, \`dist/tokens.json\`, \`dist/.generated/**\`)은 결정적 — 키 정렬·재현 가능. diff가 0이면 토큰 변경 없음.
- 이 파일은 \`build:tokens\`에서 자동 생성됨. 직접 편집 금지.
- 더 자세한 사용법은 \`README.md\` 참조.
`;

  await fs.writeFile(outFileAbs, content, 'utf8');
};
