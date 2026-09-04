/**
 * Consumer Override Contract (v1).
 *
 * Shared 토큰 그래프를 두 층으로 가른다.
 * - Internal Primitive : 색상 램프(`color.primary.pr*` 등)와 raw scale. Consumer override 불가.
 * - Public Semantic    : brand/theme에 따라 합리적으로 달라지는 intent 토큰. leaf 단위로 명시 허용.
 *
 * 정책은 deny-by-default다. `PUBLIC_OVERRIDE_CONTRACT`에 leaf가 명시되지 않으면 internal이다.
 * category/root wildcard는 contract에 쓰지 않는다 — 모든 public path는 leaf로 열거된다.
 *
 * 이 제약은 Consumer override에만 적용된다. Shared 자신의 light/dark/sepia authoring은
 * 종전대로 primitive를 자유롭게 참조한다.
 */

/** public = Consumer가 알 수 있는 ABI. internal = Shared 구현 세부. */
export type TokenVisibility = 'public' | 'internal';

/**
 * stable       = Shared component 또는 public utility가 이미 소비 중. 장기 ABI로 유지한다.
 * experimental = public semantic family에 속하지만 아직 소비처가 없다. 이름이 바뀔 수 있다.
 */
export type TokenStability = 'stable' | 'experimental';

/** contract가 다루는 DTCG 타입. 그래프의 public 표면은 현재 이 둘뿐이다. */
export type TokenContractType = 'color' | 'dimension';

export type TokenContractEntry = {
  /** `classifyTokenPath` 기준 canonical leaf path. */
  path: string;
  type: TokenContractType;
  visibility: TokenVisibility;
  /** Consumer가 값을 재정의할 수 있는가. */
  overridable: boolean;
  stability: TokenStability;
  /** 폐기 예정 path. 설정 시 `replacement`를 함께 준다. */
  deprecated?: boolean;
  /** `deprecated` path를 대체하는 canonical path. */
  replacement?: string;
  note?: string;
};

/**
 * Consumer override 불가인 internal primitive root.
 * 색상 램프는 Shared palette 구조 그 자체라 노출 시 Consumer가 내부 구현에 결합된다.
 */
export const INTERNAL_PRIMITIVE_ROOTS = [
  'color.primary',
  'color.secondary',
  'color.neutral',
  'color.success',
  'color.warning',
  'color.error',
  'borderWidth.primitive',
] as const;

/**
 * Public Override Contract. leaf 단위 explicit allowlist.
 *
 * 선정 기준 세 가지를 모두 만족하는 path만 포함한다.
 * 1. Consumer brand/theme에 따라 합리적으로 달라지는 semantic intent인가
 * 2. Shared component 또는 public utility가 소비하는 family인가
 * 3. 장기 public ABI로 유지할 수 있는가
 *
 * v1 범위는 색상 semantic과 border다. spacing/radius/typography scale과
 * `component.*`는 아직 internal이다 (AGENTS.md의 Consumer Override Contract 절 참고).
 */
export const PUBLIC_OVERRIDE_CONTRACT = [
  // color.text (12 leaves)
  {
    path: 'color.text.contrastText',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.default',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.disable',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.error',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.light',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.link',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.text.linkSelected',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.text.placeholder',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.primary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.secondary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.text.success',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.text.warning',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },

  // color.background (11 leaves)
  {
    path: 'color.background.dark',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.default',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.background.disable',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.error',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.grey',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.background.placeholder',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.primary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.background.secondary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.success',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.background.surface',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.background.warning',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },

  // color.icon (12 leaves)
  {
    path: 'color.icon.contrastText',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.default',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.disable',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.icon.error',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.light',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.icon.link',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.linkSelected',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.placeholder',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.primary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.secondary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.success',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.icon.warning',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },

  // color.stroke (10 leaves)
  {
    path: 'color.stroke.dark',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.stroke.default',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.stroke.disable',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.stroke.error',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.stroke.grey',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.stroke.light',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.stroke.primary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.stroke.secondary',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.stroke.success',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.stroke.warning',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },

  // color.primaryBtn (6 leaves)
  {
    path: 'color.primaryBtn.default',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.primaryBtn.disabled',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.primaryBtn.focusRipple',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.primaryBtn.hover',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'color.primaryBtn.outlinedFocusRipple',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'color.primaryBtn.outlinedHover',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },

  // border (4 leaves)
  {
    path: 'border.disabled.color',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'border.disabled.width',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'border.primary.color',
    type: 'color',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'border.primary.width',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },

  // borderWidth.semantic (6 leaves)
  {
    path: 'borderWidth.semantic.default',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'borderWidth.semantic.divider',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'borderWidth.semantic.focus',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'stable',
  },
  {
    path: 'borderWidth.semantic.hairline',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'borderWidth.semantic.outline',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
  {
    path: 'borderWidth.semantic.strong',
    type: 'dimension',
    visibility: 'public',
    overridable: true,
    stability: 'experimental',
  },
] as const satisfies readonly TokenContractEntry[];

/**
 * 런타임·검증용 wide view. `PUBLIC_OVERRIDE_CONTRACT`는 리터럴 추론을 위해 좁은 타입을 유지하므로
 * optional 필드(`deprecated`/`replacement`)를 읽거나 순회할 때는 이쪽을 쓴다.
 */
export const publicContractEntries: readonly TokenContractEntry[] = PUBLIC_OVERRIDE_CONTRACT;

/** contract에 등재된 public leaf path의 union. Consumer authoring의 key 타입이 된다. */
export type PublicTokenPath = (typeof PUBLIC_OVERRIDE_CONTRACT)[number]['path'];

/** `P` 경로에 대해 contract가 선언한 DTCG 타입. */
export type PublicTokenTypeOf<P extends PublicTokenPath> = Extract<
  (typeof PUBLIC_OVERRIDE_CONTRACT)[number],
  { path: P }
>['type'];

/** contract에 등재된 path 집합. 조회는 O(1). */
const PUBLIC_PATHS = new Set<string>(publicContractEntries.map((e) => e.path));

const byPath = new Map<string, TokenContractEntry>(publicContractEntries.map((e) => [e.path, e]));

/** `path`가 internal primitive root 아래에 있는가. */
export const isInternalPrimitive = (path: string): boolean =>
  INTERNAL_PRIMITIVE_ROOTS.some((root) => path === root || path.startsWith(`${root}.`));

/** Public Override Contract의 버전. 호환되지 않는 변경 시 올린다. */
export const CONTRACT_VERSION = 1;

/** contract에 등재된 path인가. overridable 여부와는 별개다. */
export const isPublicPath = (path: string): boolean => PUBLIC_PATHS.has(path);

/** Consumer가 이 path를 override할 수 있는가. 미등재 path는 deny. */
export const isOverridable = (path: string): boolean => byPath.get(path)?.overridable === true;

/**
 * path의 contract를 조회한다. 미등재 path는 deny-by-default로 internal 항목을 합성해 반환한다.
 * 합성 항목의 `type`은 알 수 없으므로 호출자가 그래프에서 확인해야 한다.
 */
export const resolveTokenContract = (path: string, type: TokenContractType): TokenContractEntry =>
  byPath.get(path) ?? {
    path,
    type,
    visibility: 'internal',
    overridable: false,
    stability: 'stable',
  };

/** contract에 등재된 public path 목록. path 오름차순. */
export const publicOverridePaths = (): string[] => [...PUBLIC_PATHS].sort();
