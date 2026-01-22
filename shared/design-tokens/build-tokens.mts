import StyleDictionary from 'style-dictionary';
import { register, getTransforms } from '@tokens-studio/sd-transforms';

register(StyleDictionary, {
  excludeParentKeys: true,
});

StyleDictionary.registerTransformGroup({
  name: 'tokens-studio/js',
  transforms: [
    ...getTransforms({ platform: 'css' }),
    'name/camel',
  ].filter(
    (t) =>
      ![
        'ts/size/px',
        'ts/size/css/letterspacing',
        'ts/color/css/hexrgba',
        'ts/shadow/innerShadow',
      ].includes(t)
  ),
});

const sd = new StyleDictionary({
  source: ['src/data.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    // CSS Variables 형식
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'src/styles/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true,
          },
        },
      ],
    },
    // JS - ESM 객체 형식
    js: {
      transformGroup: 'tokens-studio/js',
      buildPath: 'src/styles/js/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/esm',
          options: {
            stripMeta: true,
          },
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    // RN - ESM 객체 형식
    rn: {
      transformGroup: 'tokens-studio/js',
      buildPath: 'src/styles/rn/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/esm',
          options: { stripMeta: true },
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();