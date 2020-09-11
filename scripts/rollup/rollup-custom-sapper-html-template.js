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
    const { source = defaultSourcePath, target = defaultTargetPath, replacePairs = [],  } = options

    let resolvedSourcePath;

    return {
        name: 'rollup-plugin-custom-sapper-html-template',
        buildStart(options) {
            console.info(this.name)
            resolvedSourcePath = path.resolve(source);
            this.addWatchFile(resolvedSourcePath);
        },
        generateBundle(rollupConfig) {
            const htmlTemplate = fs.readFileSync(resolvedSourcePath, { encoding: 'utf8'});

            const updatedHTMLTemplate = transformTemplate(htmlTemplate, replacePairs, rollupConfig);

            fs.writeFileSync(path.resolve(target), updatedHTMLTemplate, { encoding: 'utf8'});
        },
    }
}