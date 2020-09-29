import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import includePaths from 'rollup-plugin-root-import';
import importUrl from '@rollup/plugin-url';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import postcss from 'rollup-plugin-postcss';
import postcssSass from '@csstools/postcss-sass';
import tildeSassImporter from 'node-sass-tilde-importer';
import jsonImporter from 'node-sass-json-importer';
import { terser } from 'rollup-plugin-terser';
import favicons from 'rollup-plugin-favicons';
// import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import config from 'sapper/config/rollup';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import customPostcssSassLoader from './scripts/rollup/rollup-custom-postcss-sass-loader';
import customSvelteHtmlTemplate from './scripts/rollup/rollup-custom-sapper-html-template';
import pkg from './package.json';
// import { preprocess as preProcessConfig } from './svelte.config';
import { appRoot } from './src/resources/config.json';
import { global as globalStrings } from './src/resources/content.json';

const preProcessConfig = require('./svelte.config').preprocess;

const { devComment } = globalStrings;

const cssFolderPath = 'public/assets/css/';
const faviconAssetPath = '/favicon/';
const faviconOutputPath = `public${faviconAssetPath}`;

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

function faviconCallback(error, response) {
  let successResult;

  if (error) {
    console.log(error.message); // Error description e.g. "An unknown error has occurred"
  } else {
    fs.mkdirSync(faviconOutputPath, { recursive: true });

    response.images.forEach(({ name, contents }) => {
      // noop callback just to avoid using the sync version
      fs.writeFile(path.resolve(path.join(faviconOutputPath, name)), contents, () => {
      });
    });

    response.files.forEach(({ name, contents }) => {
      // noop callback just to avoid using the sync version
      fs.writeFile(path.resolve(path.join(faviconOutputPath, name)), contents, () => {
      });
    });

    successResult = response; // Have to return a valid response to process and cache
  }

  return successResult;
}

const onWarn = (warning, onWarnFn) => (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message))
  || (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message))
  || onWarnFn(warning);

const postCssPluginConfig = (client = true) => postcss({
  extract: client ? 'base.css' : false,
  onExtract: (processedCSSWrapper) => {
    const result = processedCSSWrapper();
    fs.mkdirSync(cssFolderPath, { recursive: true });
    fs.writeFileSync(path.join(cssFolderPath, result.codeFileName), result.code);

    if (result.map) {
      fs.writeFileSync(path.join(cssFolderPath, result.mapFileName), result.map);
    }

    return false; // Returning false prevents the emission of css files
  },
  sourceMap: dev,
  minimize: !dev,
  modules: true,
  extensions: ['.css', '.scss'],
  use: [
    ['sass', {
      importer: jsonImporter(),
    }],
  ],
  loaders: [customPostcssSassLoader],
  plugins: [postcssSass({
    includePaths: ['node_modules', 'src'],
    importer: [jsonImporter(), tildeSassImporter],
  })],
});

const urlImportConfig = (client = true) => importUrl({
  emitFiles: client,
  sourceDir: path.join(__dirname, 'src'), // 'src',
  destDir: 'public',
  fileName: '[dirname][name][extname]',
  limit: 0,
});

const includePathPlugin = includePaths(
  {
    root: __dirname, // TODO, consider changing this to include 'src' folder?
  },
);

const cssOutputFunc = (css) => {
  css.write(`${cssFolderPath}/steakeye.css`, dev);
};

export default {
  client: {
    input: config.client.input().replace(/.js$/, '.ts'),
    output: {
      ...config.client.output(),
      // `assetFileNames` has to be a function in order to workaround the favicon plugin overriding the path when it's a
      // string
      assetFileNames: () => '[name]-[hash][extname]',
    },
    plugins: [
      cleaner({
        targets: ['public'],
      }),
      includePathPlugin,
      replace({
        // 'process.browser': true, // Phaser tries to assign a value to `process.browser` which would fail
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      json(),
      urlImportConfig(),
      svelte({
        dev,
        hydratable: true,
        emitCss: false,
        preprocess: preProcessConfig,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: cssOutputFunc,
      }),
      // This handles baseline css: reset css, globals
      postCssPluginConfig(),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),

      legacy
        && babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev
        && terser({
          module: true,
        }),
      favicons({
        source: 'src/assets/images/steakeye-roundel.svg',
        configuration: {
          appName: pkg.name,
          appDescription: pkg.description,
          path: faviconAssetPath,
        },
        emitAssets: false,
        callback: faviconCallback,
      }),
      customSvelteHtmlTemplate({
        replacePairs: [{
          templateKey: 'appRoot',
          content: appRoot,
        }, {
          templateKey: 'devComment',
          content: devComment,
        }, {
          templateKey: 'faviconLinks',
          contentPath: ['__favicons_output'],
          contentTransformer(links) {
            return links.join('\n    ');
          },
        }],
      }),
      copy({
        targets: [
          { src: 'static/*', dest: 'public' },
          { src: 'node_modules/@coreui/icons/fonts', dest: 'public/assets' },
        ],
      }),
    ],

    preserveEntrySignatures: false,
    onwarn: onWarn,
  },

  server: {
    input: config.server.input().server.replace(/.js$/, '.ts'),
    output: config.server.output(),
    plugins: [
      includePathPlugin,
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      json(),
      urlImportConfig(false),
      svelte({
        generate: 'ssr',
        hydratable: true,
        dev,
        preprocess: preProcessConfig,
      }),
      // This handles baseline css: reset css, globals
      postCssPluginConfig(false),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
    ],
    external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

    preserveEntrySignatures: 'strict',
    onwarn: onWarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/.js$/, '.ts'),
    output: config.serviceworker.output(),
    plugins: [
      includePathPlugin,
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      json(),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn: onWarn,
  },
};
