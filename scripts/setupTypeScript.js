// @ts-check

/** This script modifies the project to support TS code in .svelte files like:

  <script lang="ts">
  	export let name: string;
  </script>
 
  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template template && git clone sveltejs/template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

const projectRoot = argv[2] || path.join(__dirname, "..");

// Add deps to pkg.json
const packageJSON = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"))
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  "svelte-check": "^1.0.0",
  "svelte-preprocess": "^4.0.0",
  "@rollup/plugin-typescript": "^4.0.0",
  "typescript": "^3.9.3",
  "tslib": "^2.0.0",
  "@tsconfig/svelte": "^1.0.0"
});

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
  "validate": "svelte-check"
});

// Write the package JSON
fs.writeFileSync(path.join(projectRoot, "package.json"), JSON.stringify(packageJSON, null, "  "));

// mv src/*.js to *.ts - note, we need to edit rollup.config.js for this too
['client', 'server', 'service-worker'].forEach((fileName) => {
  const beforeJSPath = path.join(projectRoot, "src", `${fileName}.js`)
  const afterTSPath = path.join(projectRoot, "src", `${fileName}.ts`)
  fs.renameSync(beforeJSPath, afterTSPath)
});

// Switch the *.svelte file to use TS
[{
  view: 'index',
},{
  view: 'about',
},{
  view: '_layout',
  vars: [{ name:  'segment', type: 'string' }]
},{
  view: '_error',
  vars: [{ name:  'status', type: 'number' }, { name:  'error', type: 'Error' }]
},{
  view: 'blog/index',
  vars: [{ name:  'posts', type: 'any[]' }]
},{
  view: 'blog/[slug]',
  vars: [{ name:  'post', type: 'any' }]
}].forEach(({ view, vars }) => {
  const svelteFilePath = path.join(projectRoot, "src/routes", `${view}.svelte`)
  let file = fs.readFileSync(svelteFilePath, "utf8")

  file = file.replace(/(?:<script)(( .*?)*?)>/gm, '<script$1 lang="ts">')

  if (vars) {
    vars.forEach(({ name, type }) => {
      file = file.replace(`export let ${name};`, `export let ${name}: ${type};`)
    });
  }

  fs.writeFileSync(svelteFilePath, file)
});

// Edit rollup config
const rollupConfigPath = path.join(projectRoot, "rollup.config.js")
let rollupConfig = fs.readFileSync(rollupConfigPath, "utf8")

// Edit imports
rollupConfig = rollupConfig.replace(`'rollup-plugin-terser';`, `'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`)

// Replace name of entry points, client and server
rollupConfig = rollupConfig.replace(/input: config.(?:client|serviceworker).input\(\)/gm, `$&.replace('js', 'ts')`)
rollupConfig = rollupConfig.replace(/input: config.server.input\(\)/gm, `$&.server.replace('js', 'ts')`)

// Add preprocess to the svelte config,
rollupConfig = rollupConfig.replace(/(\n)([ \t]*)(svelte\({[\s\w\W]*?)(})\W*\)/gm, '$1$2$3,\n$2\tpreprocess: sveltePreprocess(),\n$2$4)')

// Add TypeScript
rollupConfig = rollupConfig.replace(/commonjs\(\),?/gm, 'commonjs(),\n\t\ttypescript({ sourceMap: dev }),')

fs.writeFileSync(rollupConfigPath, rollupConfig)

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",

  "include": ["src/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"],
}`
const tsconfigPath =  path.join(projectRoot, "tsconfig.json")
fs.writeFileSync(tsconfigPath, tsconfig)

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename))

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname))
  if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
    fs.unlinkSync(path.join(__dirname, '.DS_store'))
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname))
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"))
fs.writeFileSync(path.join(projectRoot, ".vscode", "extensions.json"), `{
  "recommendations": ["svelte.svelte-vscode"]
}
`)

console.log("Converted to TypeScript.")

if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("\nYou will need to re-run your dependency manager to get started.")
}
