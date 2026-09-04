/**
 * Consumer Token Extension authoring 진입점.
 * public export map 정리는 별도로 한다 — 지금은 workspace 내부 진입점이다.
 */
export {
  type ComposedTheme,
  type ComposedTokens,
  composeExtension,
  type CompositionResult,
} from './compose.js';
export { defineTokenExtension } from './defineTokenExtension.js';
export {
  type Diagnostic,
  type DiagnosticCode,
  type DiagnosticSeverity,
  errors,
  formatDiagnostic,
  type Platform,
  sortDiagnostics,
  warnings,
} from './diagnostics.js';
export {
  type NormalizedExtension,
  type NormalizedOverride,
  type NormalizedSourceToken,
  normalizeExtension,
  referenceTarget,
} from './normalize.js';
export { referenceEdgesForMode, resolveValue, validateReferences } from './references.js';
export type {
  BrandGroup,
  BrandNode,
  BrandToken,
  BrandValue,
  ColorValue,
  DimensionValue,
  ExplicitToken,
  ModeOverrides,
  OverrideValue,
  SemanticOverrides,
  TokenExtension,
  TokenReference,
  ValueForPath,
} from './types.js';
export {
  assertValidExtension,
  type ExtensionIssue,
  type ExtensionIssueCode,
  validateExtension,
  type ValidateOptions,
} from './validate.js';
