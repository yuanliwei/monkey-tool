//@ts-check

import BaseView from "../common/BaseView"
import CodeMirrorUtil from "../common/CodeMirrorUtil";

export default class ViewOutput extends BaseView {
    constructor(app) {
        super(app)
    }

    async onCreateView(state) {
        this.container.css("height", "100%")
        await CodeMirrorUtil.load(this.loader)
        let CodeMirror = window.CodeMirror || {}
        let html = $(`<textarea />`)
        this.container.append(html)
        var editor = CodeMirror.fromTextArea(html[0], {
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: false,
            mode: { name: state.name, globalVars: true },
            foldGutter: true,
            autoCloseBrackets: true,
            codeToolTip: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
        })
        this.editor = editor
        editor.setOption("theme", "bespin")
        editor.setSize("100%", "100%");
        this.handleSpecialChars()
        this.removeLoading()
        setTimeout(() => {
            editor.refresh()
        }, 100)
        this.onStateChanged = (item) => { editor.refresh() }

        this.app.layout.eventHub.on('onfindclicktree', (cb) => {
            editor.setValue(cb.message)
        });
    }

    handleSpecialChars() {
        // \u0020 space | \u0009 tab
        var specialChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff\u0020\u0009]/
        this.editor.setOption("specialChars", specialChars)
        var defaultSpecialCharPlaceholder = this.editor.getOption("specialCharPlaceholder")
        this.editor.setOption("specialCharPlaceholder", (ch) => {
            var token = defaultSpecialCharPlaceholder(ch)
            switch (ch.charCodeAt(0)) {
                case 9:  // tab
                    token.classList.remove("cm-invalidchar")
                    token.classList.add('cm-invalidchar-u20')
                    token.innerText = '→'
                    break;
                case 32: // space
                    token.classList.remove("cm-invalidchar")
                    token.classList.add('cm-invalidchar-u20')
                    break;
            }
            return token
        })
    }
}