// rollup.config.js
import fs from 'fs'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import less from 'rollup-plugin-less'
import html from 'rollup-plugin-html'
import globals from 'rollup-plugin-node-globals'
import svelte from 'rollup-plugin-svelte'
import livereload from 'rollup-plugin-livereload'

import addAsset from './rollup-plugin-add-asset'

export default {
    input: 'src/app.js',
    output: {
        name: 'App',
        file: 'dest/bundle.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            "element-resize-detector": "elementResizeDetectorMaker",
            "js-beautify": "js_beautify",
            "crypto-js": "CryptoJS",
            'crypto-js/hmac-sha1': 'HmacSHA1',
            "split.js": "Split",
            "pako": "pako",
            'vkbeautify': "vkbeautify",
            'dayjs': "dayjs",
            'js-base64': 'Base64',
            'yaml': 'YAML',
        }
    },
    plugins: [
        svelte({
            dev: true,
            extensions: ['.svelte']
        }),
        resolve({
            browser: true,
        }),
        less({
            insert: true,
            exclude: [],
            output: (css, id) => {
                return css.replace(/'([^']+.png)'/g, (a, b) => {
                    let img = path.join(path.dirname(id), b)
                    if (!fs.existsSync(img)) return a
                    return a.replace(b, 'data:image/*;base64,' + fs.readFileSync(img).toString('base64'))
                })
            }
        }),
        commonjs({
            transformMixedEsModules: true
        }),
        globals({
            process: false
        }),
        html(),
        addAsset({
            name: 'index.html',
            buildContent: () => {
                let content = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf-8')
                content = content.replace('<script src="https://yuanliwei.gitee.io/M$EV2.js"></script>', '<script src="lib.min.js"></script>')
                content = content.replace('<script src="app.js"></script>', '<script src="bundle.js"></script>')
                return content
            }
        }),
        livereload('dest/bundle.js')
    ],
    external: ['monaco-editor',
        '@material/mwc-button',
        '@material/mwc-checkbox',
        '@material/mwc-circular-progress-four-color',
        '@material/mwc-dialog',
        '@material/mwc-drawer',
        '@material/mwc-formfield',
        '@material/mwc-icon-button',
        '@material/mwc-icon',
        '@material/mwc-list',
        '@material/mwc-radio',
        '@material/mwc-select',
        '@material/mwc-snackbar',
        '@material/mwc-switch',
        '@material/mwc-textarea',
        '@material/mwc-textfield',
        '@material/mwc-top-app-bar',
        '@material/mwc-list/mwc-list',
        '@material/mwc-list/mwc-list-item',
        '@material/mwc-list/mwc-check-list-item',
        'crypto-js',
        'crypto-js/hmac-sha1',
        'element-resize-detector',
        'js-base64',
        'js-beautify',
        'leb',
        'nzh',
        'dayjs',
        'pako',
        'split.js',
        'vkbeautify',
        'yaml',
    ]
}