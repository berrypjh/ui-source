type TokenLike = {
  path: string[];
  type?: string;
  original?: { type?: string };
};

const getTokenType = (t: TokenLike): string | undefined => {
  return (t.type ?? t.original?.type) as string | undefined;
};

// typography 묶을 대상
const TYPO_ROOTS = new Set([
  'fontFamilies',
  'fontFamily',
  'fontWeight',
  'fontWeights',
  'fontSize',
  'fontSizes',
  'lineHeight',
  'lineHeights',
  'letterSpacing',
  'display',
  'heading',
  'body',
  'paragraph',
  'caption',
]);

/**
 * SD token.path/type을 원하는 "카테고리 구조"로 변환한다.
 *
 * 최상위 고정:
 * - color, spacing, radius, borderWidth, border, typography, shadow, elevation, component
 *
 * 매핑 누락이 생기면 빌드에서 바로 터지도록 throw 하는 편이 안전함(토큰 추가 시 즉시 감지).
 */
export const mapTokenPath = (t: TokenLike): string[] => {
  const type = getTokenType(t);
  const [head, ...rest] = t.path;

  if (!head) throw new Error(`Invalid token path: ${t.path.join('.')}`);

  // component
  if (head === 'component') return ['component', ...rest];

  // spacing
  if (head === 'spacing') return ['spacing', ...rest];

  // radius
  if (head === 'radius') return ['radius', ...rest];

  // border
  if (type === 'border' || head === 'border') return ['border', ...rest];

  // shadow / elevation
  if (head === 'shadow') return ['shadow', ...rest];
  if (head === 'elevation') return ['elevation', ...rest];

  // color (type === color 인 모든 토큰을 color.* 아래로)
  if (type === 'color') return ['color', ...t.path];

  // borderWidth (primitiveBorder/semanticBorder → borderWidth.{primitive|semantic}.*)
  if (type === 'borderWidth' || head === 'primitiveBorder' || head === 'semanticBorder') {
    if (head === 'primitiveBorder') return ['borderWidth', 'primitive', ...rest];
    if (head === 'semanticBorder') return ['borderWidth', 'semantic', ...rest];
    // 다른 그룹에서 borderWidth가 나오면 일단 보존
    return ['borderWidth', ...t.path];
  }

  // typography
  // - 스케일/리소스(fontSize/fontWeight...) + 텍스트 스타일(display/heading...)을 typography 아래로 모음
  if (
    type === 'typography' ||
    type === 'fontFamilies' ||
    type === 'fontWeights' ||
    type === 'fontSizes' ||
    type === 'lineHeights' ||
    type === 'letterSpacing' ||
    TYPO_ROOTS.has(head)
  ) {
    // 키 통일: fontSize / fontWeight / lineHeight / fontFamilies
    if (head === 'fontFamilies' || head === 'fontFamily')
      return ['typography', 'fontFamilies', ...rest];
    if (head === 'fontWeight' || head === 'fontWeights')
      return ['typography', 'fontWeight', ...rest];
    if (head === 'fontSize' || head === 'fontSizes') return ['typography', 'fontSize', ...rest];
    if (head === 'lineHeight' || head === 'lineHeights')
      return ['typography', 'lineHeight', ...rest];
    if (head === 'letterSpacing') return ['typography', 'letterSpacing', ...rest];

    // display/heading/body/paragraph/caption 같은 텍스트 스타일은 그대로 typography 아래로
    if (
      head === 'display' ||
      head === 'heading' ||
      head === 'body' ||
      head === 'paragraph' ||
      head === 'caption'
    ) {
      return ['typography', head, ...rest];
    }

    // 타입이 typography인데 head가 위 목록에 없으면, 그래도 typography 밑으로 보내되 원본 경로 유지
    return ['typography', ...t.path];
  }

  // 현재 설계한 최상위 9개 카테고리로 분류 불가
  throw new Error(`Unmapped token: path=${t.path.join('.')} type=${type ?? 'unknown'}`);
};
