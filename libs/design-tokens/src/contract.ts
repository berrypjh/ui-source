/**
 * Public Override Contract 진입점.
 *
 * Consumer가 "무엇을 override할 수 있는가"를 프로그래밍 방식으로 묻는 좁은 표면이다.
 * 값 인벤토리는 `dist/tokens.json`, 이 metadata는 `dist/contract.json` 이 담당한다.
 */
export {
  CONTRACT_VERSION,
  INTERNAL_PRIMITIVE_ROOTS,
  isInternalPrimitive,
  isOverridable,
  isPublicPath,
  PUBLIC_OVERRIDE_CONTRACT,
  publicContractEntries,
  publicOverridePaths,
  type PublicTokenPath,
  type PublicTokenTypeOf,
  resolveTokenContract,
  type TokenContractEntry,
  type TokenStability,
  type TokenVisibility,
} from './lib/contract.js';
export {
  type ContractChange,
  type ContractChangeKind,
  type ContractDiff,
  diffContracts,
} from './lib/contractDiff.js';
export {
  buildContractMetadata,
  type ContractMetadata,
  type ContractRow,
} from './lib/genContract.js';
