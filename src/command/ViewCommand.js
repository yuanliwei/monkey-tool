//@ts-check

import BaseView from "../common/BaseView"
import CodeMirrorUtil from "../common/CodeMirrorUtil";

export default class ViewCommand extends BaseView {
    constructor(app) {
        super(app)
    }

    async onCreateView(state) {
        const fs = require('fs')
        this.container.append(fs.readFileSync(__dirname + '/template.html', 'utf-8'))
        this.removeLoading()
        this.container.find('.col').click(()=>{
            this.app.layout.eventHub.emit('onaddcode', {message:"hahahahhaha~~~~"+Date.now()})
            console.log('click sds col ');
            
            // this.app.layout.eventHub.on('onaddcode', (cb) => {
            //     // @ts-ignore
            //     // editor.setValue(cb.message)
            //     editor.execCommand("newlineAndIndent")
    
            // });
        })
        // this.container.css("height", "100%")
        // await CodeMirrorUtil.load(this.loader)
        // let CodeMirror = window.CodeMirror || {}
        // let html = $(`<textarea />`)
        // this.container.append(html)
        // var editor = CodeMirror.fromTextArea(html[0], {
        //     lineNumbers: true,
        //     matchBrackets: true,
        //     lineWrapping: false,
        //     mode: { name: state.name, globalVars: true },
        //     foldGutter: true,
        //     autoCloseBrackets: true,
        //     codeToolTip: true,
        //     gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        //     highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
        // })
        // this.editor = editor
        // editor.setOption("theme", "bespin")
        // editor.setSize("100%", "100%");
        // this.handleSpecialChars()
        // this.removeLoading()
        // setTimeout(() => {
        //     editor.refresh()
        // }, 100)
        // this.onStateChanged = (item) => { editor.refresh() }

        // // this.app.layout.eventHub.on('onaddcode', (cb) => {
        // //     editor.setValue(cb.message)
        // // });
    }

}