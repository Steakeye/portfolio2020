import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import scss from 'rollup-plugin-scss';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss'
import modularCSS from "@modular-css/svelte"
import modularCSSRollup from "@modular-css/rollup"
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import config from 'sapper/config/rollup';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const { preprocess, processor } = modularCSS({
  // Processor options
});

const onWarn = (warning, onWarnFn) => (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message))
  || (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message))
  || onWarnFn(warning);

/* const scssConfiguration = (postfix) => ({
	output: `public/assets/css/global-${postfix}.css`, */
const scssConfiguration = () => ({
  output: 'public/assets/css/steakeye.css',
  sourceMap: dev,
  // prefix: '@import \'src/styles/variables.scss\';',
  watch: 'src/styles/*.scss',
});

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
};

const preProcessConfig = sveltePreprocess(preProcessOptions);

/*const cssOutputFunc = (css) => {
  css.write('public/assets/css/bundle.css', dev);
};*/

export default {
  client: {
    input: config.client.input().replace(/.js$/, '.ts'),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
/*      modularCSSRollup({
        processor,
        commonjs: 'common.css',
      }),*/
      scss(scssConfiguration()),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess: preProcessConfig,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        //css: cssOutputFunc,
      }),
      postcss({
				extract: 'assets/css/global.scss',
				sourceMap: true,
				minimize: true,
        modules:true,
        use: ['sass'],
			}),
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

      copy({
        targets: [{ src: 'static/*', dest: 'public' }],
      }),
    ],

    preserveEntrySignatures: false,
    onwarn: onWarn,
  },

  server: {
    input: config.server.input().server.replace(/.js$/, '.ts'),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      scss(scssConfiguration()),
      svelte({
        generate: 'ssr',
        hydratable: true,
        dev,
        preprocess: preProcessConfig,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        //css: cssOutputFunc,
      }),
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
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn: onWarn,
  },
};
