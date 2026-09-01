import type { FileStatus, ScopeGroups } from './types.js';

const SCOPED_ROOTS = new Set(['apps', 'libs', 'tools', 'plugins']);

export const getScopeFromFilePath = (filePath: string): string => {
  const [first, second] = filePath.split('/');

  if (first && second && SCOPED_ROOTS.has(first)) {
    return second;
  }

  return 'root';
};

export const groupFilesByScope = (files: FileStatus[]): ScopeGroups => {
  const groups: ScopeGroups = {};

  for (const fileStatus of files) {
    const scope = getScopeFromFilePath(fileStatus.file);

    if (!groups[scope]) {
      groups[scope] = [];
    }

    groups[scope].push(fileStatus);
  }

  return groups;
};

export const sortScopes = (scopes: string[]): string[] =>
  [...scopes].sort((a, b) => {
    if (a === 'root') return -1;
    if (b === 'root') return 1;
    return a.localeCompare(b);
  });

export const getFilesForScope = (groups: ScopeGroups, scope: string): FileStatus[] => {
  const files = groups[scope];

  if (!files || files.length === 0) {
    throw new Error(`scope "${scope}" 에 해당하는 staged 파일이 없습니다.`);
  }

  return files;
};
