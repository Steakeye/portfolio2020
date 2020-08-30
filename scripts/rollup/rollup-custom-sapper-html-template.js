import fs from 'fs';
import path from 'path';
import getter from 'ramda/src/path'

const defaultSourcePath = 'src/html.template';
const defaultTargetPath = 'src/template.html';

function transformTemplate(template, replacePairs, rollupConfig) {
    replacePairs.forEach(({ templateKey, content, contentPath, contentTransformer } = {}) => {
        let replacementContent = content || (contentPath ? getter(contentPath, rollupConfig) || '': '');

        if (contentTransformer) {
            replacementContent = contentTransformer(replacementContent);
        }

        template = template.replace(RegExp(`\\$\\{${templateKey}}`, 'g'), replacementContent);
    })

    return template;
}

export default function (options = {}) {
    /*console.log('creating rollup-custom-sapper-html-template option')
    console.log('options', options)*/
    const { source = defaultSourcePath, target = defaultTargetPath, replacePairs = [],  } = options

    let resolvedSourcePath;

    return {
        name: 'rollup-plugin-custom-sapper-html-template',
        buildStart(options) {
            console.info(this.name)
            console.log('path.resolve(source)', path.resolve(source))
            resolvedSourcePath = path.resolve(source);
            this.addWatchFile(resolvedSourcePath);
        },
        /*load(...loadArgs) { //Gets called for every asset in the bundle
            console.log('loadArgs', loadArgs)
        },*/
        /*resolveId(...resolveIdArgs) {
            /* ... *\/
            console.log('resolveIdArgs', resolveIdArgs)
        },*/
        generateBundle(rollupConfig) {
            /* ... */
            console.log('generateBundleArgs'); //, generateBundleArgs)
            const htmlTemplate = fs.readFileSync(resolvedSourcePath, { encoding: 'utf8'});

            const updatedHTMLTemplate = transformTemplate(htmlTemplate, replacePairs, rollupConfig);

            fs.writeFileSync(path.resolve(target), updatedHTMLTemplate, { encoding: 'utf8'});
        },
        /*buildEnd(error) {
            if (!error) {
                //this.addWatchFile(path.resolve(source));
            }
        },*/
        // ...
    }
}