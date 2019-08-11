//@ts-check

import BaseView from "../common/BaseView"

export default class ViewDemo extends BaseView {
    constructor(app) {
        super(app)
    }

    onCreateView(state) {
        let html = $(`<div class="container">
        <div class="row">
          <div class="col-12 mt-3 content text-info">

          </div>
        </div>
      </div>`)
        this.container.append(html)
        this.removeLoading()
        // this.showNoData()

        let btn = $(`<button class="btn btn-info mt-1">添加新页面</button>`)
        this.container.append(btn)
        btn.click(() => {
            console.log('click button');
        })

        this.app.layout.eventHub.on('onfindclicktree', (user)=> {
            this.container.find('.content').text(user.message)
        });
    }
}