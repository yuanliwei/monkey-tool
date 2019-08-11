// @ts-check

require("regenerator-runtime/runtime");

/*
窗口基类
需要在界面上显示内容的处理器都应继承自这个类，
不显示界面的处理器也可以继承这个类

BaseView:
initLoadingView()               // 初始化一个loading
initRootView()                  // 初始化根布局
showLoading()                   // 显示loading
removeLoading()                 // 移除loading
updateLoadingProgress(progress) // 更新进度
onAddView()                     // view被添加到界面上显示时的回调
*/
export default class BaseView {

  /**
   * @param {import("../app").default} app
   */
  constructor(app) {
    this.app = app
    this.layout = app.layout
    this.loader = app.loader
    this.loading = this.initLoadingView()
    this.rootView = this.initRootView()
    this.container = this.rootView
    this.container.append(this.loading)
  }

  initLoadingView() {
    var templ = `<div class="progress mt-5">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                     </div>`
    return $(templ)
  }

  initRootView() {
    var templ = `<div class="container-fluid"></div>`
    return $(templ)
  }

  /*
  数据加载完成后调用这个方法，移除loading动画
  */
  showLoading() {
    this.container.html('')
    this.container.append(this.loading)
  }

  showNoData() {
    this.container.append(`<div class="no-data jumbotron">
          <h1 class="display-4">没有数据!</h1>
          <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
          <hr class="my-4">
          <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
          <p class="lead">
            <a class="btn btn-primary btn-lg" href="javascript:void(0)" role="button">Learn more</a>
          </p>
        </div>`)
  }

  removeNoData() {
    this.container.find('.no-data').remove()
  }

  /*
  数据加载完成后调用这个方法，移除loading动画
  */
  removeLoading() {
    this.loading.remove()
  }

  /*
  更新加载进度
  */
  updateLoadingProgress(progress) {
    this.loading.find('.progress-bar')[0].style.width = `${progress}%`
  }

  /*
  这个方法给AppGoldenLayout调用，用来获取窗口视图
  */
  getView() {
    return this.rootView
  }

  /*
  界面创建时的回调方法
  */
  onCreateView(state) {
    // console.log('onCreateView');
  }
  onTitleChanged(item) {
    // console.log('onTitleChanged:'+item.config.title);
  }
  onActiveContentItemChanged(item) {
    // console.log('onActiveContentItemChanged:'+item.config.title);
  }
  onItemDestroyed(item) {
    // console.log('onItemDestroyed:'+item.config.title);
  }
  onItemCreated(item) {
    // console.log('onItemCreated:'+item.config.title);
  }
  onComponentCreated(item) {
    this.item = item
    // console.log('onComponentCreated:'+item.config.title);
  }
  onStateChanged(item) {
    // console.log('onStateChanged:'+item.config.title);
  }

  addView(name, componentName, state) {
    throw Error('no impl!')
    // this.layout.addView(name, componentName, state)
  }

  emitLayout(event){
    this.layout.layout.emit(event)
  }
}
