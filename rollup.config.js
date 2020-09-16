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
import postcss from 'rollup-plugin-postcss'
import postcssSass from '@csstools/postcss-sass';
import tildeSassImporter from "node-sass-tilde-importer";
import jsonImporter from 'node-sass-json-importer';
import { terser } from 'rollup-plugin-terser';
import favicons from 'rollup-plugin-favicons'
import customSvelteHtmlTemplate from './scripts/rollup/rollup-custom-sapper-html-template'
import customPostcssSassLoader from './scripts/rollup/rollup-custom-postcss-sass-loader'
import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import config from 'sapper/config/rollup';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const cssFolderPath = 'public/assets/css/';
const faviconAssetPath = '/favicon/';
const faviconOutputPath = `public${faviconAssetPath}`;

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

function faviconCallback(error, response) {
  if (error) {
    console.log(error.message); // Error description e.g. "An unknown error has occurred"
    return;
  }

  fs.mkdirSync(faviconOutputPath, { recursive: true });

  response.images.forEach(({ name, contents }) => {
    //noop callback just to avoid using the sync version
    fs.writeFile(path.resolve(path.join(faviconOutputPath, name)), contents, () => {})
  })

  response.files.forEach(({ name, contents }) => {
    //noop callback just to avoid using the sync version
    fs.writeFile(path.resolve(path.join(faviconOutputPath, name)), contents, () => {})
  })

  return response; //Have yo return a valid response to process and cache
}

const onWarn = (warning, onWarnFn) => (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message))
  || (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message))
  || onWarnFn(warning);

const preProcessOptions = {
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          // No need for babel to resolve modules
          modules: false,
          targets: {
            // ! Very important. Target es6+
            esmodules: true,
          },
        },
      ],
    ],
  },
  defaults: {
    script: 'typescript',
    style: 'scss',
  },
  postcss: {
    plugins: [require('autoprefixer')()],
  },
  scss: {
    importer: [jsonImporter()],
  }
};

const preProcessConfig = sveltePreprocess(preProcessOptions);

const postCssPluginConfig = (client = true) => postcss({
      extract: client ? 'base.css': false,
      onExtract: (processedCSSWrapper) => {
        const result = processedCSSWrapper();
        fs.mkdirSync(cssFolderPath, { recursive: true })
        fs.writeFileSync(path.join(cssFolderPath, result.codeFileName), result.code);

        if (result.map) {
          fs.writeFileSync(path.join(cssFolderPath, result.mapFileName), result.map);
        }

        return false; //Returning false prevents the emission of css files
      },
      sourceMap: dev,
      minimize: !dev,
      modules: true,
      extensions: ['.css', '.scss'],
      use: [
          ['sass', {
          importer: jsonImporter(),
        },]
      ],
      loaders: [customPostcssSassLoader],
      plugins: [postcssSass({
        includePaths: ['node_modules', 'src'],
        importer: [jsonImporter(), tildeSassImporter,],
      })],
    });

const urlImportConfig = (client = true) => importUrl({
  emitFiles:client,
  sourceDir: path.join(__dirname, 'src'), //'src',
  destDir: 'public',
  fileName: '[dirname][name][extname]',
  limit: 0,
});

const includePathPlugin = includePaths(
    {
      root: __dirname,
    }
);

const cssOutputFunc = (css) => {
  css.write(`${cssFolderPath}/steakeye.css`, dev);
};

export default {
  client: {
    input: config.client.input().replace(/.js$/, '.ts'),
    output: {
      ...config.client.output(),
      //`assetFileNames` has to be a function in order to workaround the favicon plugin overriding the path when it's a string
      assetFileNames: () => '[name]-[hash][extname]',
    },
    plugins: [
      cleaner({
        targets: ['public']
      }),
      includePathPlugin,
      replace({
        //'process.browser': true, // Phaser tries to assign a value to `process.browser` which would fail
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      json(),
      urlImportConfig(),
      svelte({
        dev,
        hydratable: true,
        emitCss: false,
        preprocess: preProcessConfig,
        css: cssOutputFunc,
      }),
      // we'll extract any component CSS out into
      // a separate file — better for performance
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
          appName: pkg.name, // process.env.npm_package_displayName,
          appDescription: pkg.description,
          path: faviconAssetPath,
        },
        emitAssets: false,
        callback: faviconCallback,
      }),
      customSvelteHtmlTemplate({
        replacePairs: [{
          templateKey: 'faviconLinks',
          contentPath: ['__favicons_output'],
          contentTransformer(links) {
            return links.join('\n    ');
          }
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
      // we'll extract any component CSS out into
      // a separate file — better for performance
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
