import path from 'path';

const defaultSourcePath = 'src/html.template';
const defaultTargetPath = 'src/template.html';

export default function (options = {}) {
    console.log('creating rollup-custom-sapper-html-template option')
    console.log('options', options)
    const { source = defaultSourcePath, target = defaultTargetPath} = options

    return {
        name: 'rollup-plugin-custom-sapper-html-template',
        buildStart(options) {
            console.info(this.name)
            this.addWatchFile(path.resolve(source));
        },
        /*load(...loadArgs) { //Gets called for every asset in the bundle
            console.log('loadArgs', loadArgs)
        },*/
        resolveId(...resolveIdArgs) {
            /* ... */
            console.log('resolveIdArgs', resolveIdArgs)
        },
        generateBundle(...generateBundleArgs) {
            /* ... */
            console.log('generateBundleArgs', generateBundleArgs)
        },
        buildEnd(error) {
            if (!error) {
                //this.addWatchFile(path.resolve(source));
            }
        },
        // ...
    }
}