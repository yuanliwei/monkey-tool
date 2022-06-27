export default function (options) {
    return {
        name: 'add-asset',
        async generateBundle(options_, bundle) {
            let content = options.buildContent()
            bundle[options.name] = {
                fileName: options.name,
                source: content,
                type: 'asset',
            }
        }
    }
}