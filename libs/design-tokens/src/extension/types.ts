/**
 * Consumer Token Extension 의 authoring 타입.
 *
 * Consumer는 Shared token source를 건드리지 않고 두 가지만 작성한다.
 * 1. `source` — Consumer 소유의 brand 값. authoring 전용이며 `--ds-*` 로 방출되지 않는다.
 * 2. `semantic` / `modes` — Command 02 public contract path에 대한 partial override.
 *
 * 값 타입은 contract가 선언한 DTCG 타입에서 자동으로 좁혀지므로 Consumer가 `$type`을
 * 적을 필요가 없다. 적는다면 contract 타입과 일치해야 한다.
 */
import type { PublicTokenPath, PublicTokenTypeOf } from '../lib/contract.js';
import type { ThemeName } from '../themes.js';

/** DTCG alias 표기. canonical dot-path를 감싼다 — `{color.text.default}`, `{brand.primary}`. */
export type TokenReference = `{${string}}`;

/** color 토큰의 authoring 값. hex 리터럴 또는 alias. */
export type ColorValue = `#${string}` | TokenReference;

/** dimension 토큰의 authoring 값. 숫자, 단위 문자열, 또는 alias. */
export type DimensionValue =
  | number
  | `${number}`
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}%`
  | TokenReference;

/** contract가 `P`에 대해 선언한 타입에 맞는 값. */
export type ValueForPath<P extends PublicTokenPath> =
  PublicTokenTypeOf<P> extends 'color' ? ColorValue : DimensionValue;

/** DTCG 명시 형태. `$type`은 optional이지만 쓰면 contract 타입과 같아야 한다. */
export type ExplicitToken<P extends PublicTokenPath> = {
  readonly $value: ValueForPath<P>;
  readonly $type?: PublicTokenTypeOf<P>;
};

/** shorthand 값 또는 DTCG 명시 형태. */
export type OverrideValue<P extends PublicTokenPath> = ValueForPath<P> | ExplicitToken<P>;

/**
 * public contract path에 대한 partial override.
 * key는 contract에 등재된 leaf path만 허용된다 — 오타나 internal primitive는 컴파일 에러다.
 */
export type SemanticOverrides = {
  readonly [P in PublicTokenPath]?: OverrideValue<P>;
};

/** mode(테마)별 partial override. 생략한 mode는 base 값을 그대로 쓴다. */
export type ModeOverrides = {
  readonly [M in ThemeName]?: SemanticOverrides;
};

/** Consumer brand 값. contract 타입에 매이지 않는다. */
export type BrandValue = ColorValue | DimensionValue;

/** DTCG 명시 형태의 brand 토큰. */
export type BrandToken = {
  readonly $value: BrandValue;
  readonly $type?: 'color' | 'dimension';
};

/** brand 트리의 노드 — 값, 명시 토큰, 또는 하위 그룹. */
export type BrandNode = BrandValue | BrandToken | BrandGroup;

/** 중첩 brand 그룹. DTCG group 규칙대로 `$value` 가 있으면 토큰, 없으면 그룹이다. */
export type BrandGroup = { readonly [key: string]: BrandNode };

/** Consumer가 작성하는 extension 정의. */
export type TokenExtension = {
  /** extension 식별자. 진단 메시지와 산출물 이름에 쓰인다. */
  readonly name: string;
  /** Consumer 전용 brand 값. `--ds-*` 로 방출되지 않는다. */
  readonly source?: BrandGroup;
  /** 모든 mode에 적용되는 base override. */
  readonly semantic?: SemanticOverrides;
  /** mode별 override. 같은 path가 있으면 `semantic` 보다 우선한다. */
  readonly modes?: ModeOverrides;
};
