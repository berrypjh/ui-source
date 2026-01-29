import path from 'node:path';
import fs from 'node:fs/promises';

import { deepMergeTokens } from './deepMerge.js';

export const splitAndMergeThemes = async (args: {
  inputFileAbs: string;
  outputDirAbs: string;
}): Promise<{ globalFileAbs: string; darkMergedFileAbs: string }> => {
  const raw = await fs.readFile(args.inputFileAbs, 'utf8');
  const data = JSON.parse(raw);

  const values = data?.values;
  if (!values?.global) throw new Error('Tokens Studio export: values.global not found');
  if (!values?.dark) throw new Error('Tokens Studio export: values.dark not found');

  const globalTokens = values.global;
  const darkTokens = values.dark;

  // dark는 "global + override"
  const darkMerged = deepMergeTokens(globalTokens, darkTokens);

  const globalFileAbs = path.join(args.outputDirAbs, 'global.json');
  const darkMergedFileAbs = path.join(args.outputDirAbs, 'dark.merged.json');

  await fs.writeFile(globalFileAbs, JSON.stringify(globalTokens, null, 2), 'utf8');
  await fs.writeFile(darkMergedFileAbs, JSON.stringify(darkMerged, null, 2), 'utf8');

  return { globalFileAbs, darkMergedFileAbs };
};
