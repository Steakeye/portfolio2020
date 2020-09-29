const sveltePreprocess = require('svelte-preprocess');
const jsonImporter = require("node-sass-json-importer");

const preprocessOptions = {
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

module.exports = {
    preprocess: sveltePreprocess(preprocessOptions),

    // Export this to allow rollup.config.js to inherit the same preprocess options.
    //preprocessOptions,
}