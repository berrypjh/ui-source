import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Style Dictionary 등으로 테마별로 생성된 CSS 변수 파일을 배포용(flat) 파일로 병합/재배치한다.
 *
 * 입력(예상 경로)
 * - `{distCssDirAbs}/global/variables.css`
 * - `{distCssDirAbs}/dark/variables.css`
 *
 * 출력(생성 파일)
 * - `{distCssDirAbs}/variables.global.css` : global 테마 변수만 flat 파일로 복사
 * - `{distCssDirAbs}/variables.dark.css`   : dark 테마 변수만 flat 파일로 복사
 * - `{distCssDirAbs}/variables.css`        : global + dark를 개행(`\n`)으로 연결한 최종 병합본
 *
 * @param args - 병합에 필요한 경로 인자
 * @param args.distCssDirAbs - 테마별 CSS 결과물이 존재하는 dist CSS 디렉터리의 **절대 경로**
 */
export const mergeCssThemes = async (args: { distCssDirAbs: string }) => {
  const globalFile = path.join(args.distCssDirAbs, 'global', 'variables.css');
  const darkFile = path.join(args.distCssDirAbs, 'dark', 'variables.css');

  const outGlobal = path.join(args.distCssDirAbs, 'variables.global.css');
  const outDark = path.join(args.distCssDirAbs, 'variables.dark.css');
  const outMerged = path.join(args.distCssDirAbs, 'variables.css');

  const globalCss = await fs.readFile(globalFile, 'utf8');
  const darkCss = await fs.readFile(darkFile, 'utf8');

  // 최종 배포는 flat 파일로도 제공
  await fs.writeFile(outGlobal, globalCss, 'utf8');
  await fs.writeFile(outDark, darkCss, 'utf8');

  // 최종 합친 파일
  await fs.writeFile(outMerged, `${globalCss}\n${darkCss}`, 'utf8');
};
