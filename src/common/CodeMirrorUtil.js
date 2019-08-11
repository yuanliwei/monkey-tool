//@ts-check

import moment from "moment"

export default class CodeMirrorUtil {
  /** @param{import("@yuanliwei/web-loader")} loader */
  static async load(loader) {
    await loadSources(loader)
  }
};

async function loadSources(loader) {
  let CodeMirrorVersion = '5.38.0'
  await loader.load(`https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/codemirror.min.js`)
  await loader.load(`https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/mode/javascript/javascript.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/codemirror.min.css`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/theme/bespin.min.css`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/mode/xml/xml.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/dialog/dialog.min.css`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/dialog/dialog.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/edit/matchbrackets.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/fold/foldcode.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/fold/brace-fold.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/fold/indent-fold.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/fold/foldgutter.min.css`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/fold/foldgutter.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/edit/closebrackets.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/selection/selection-pointer.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/selection/mark-selection.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/selection/active-line.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/search/search.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/search/searchcursor.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/search/matchesonscrollbar.min.css`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/search/matchesonscrollbar.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/search/match-highlighter.min.js`,
    `https://cdn.bootcss.com/codemirror/${CodeMirrorVersion}/addon/scroll/annotatescrollbar.min.js`)
  initToolTip()
}

/*
* yuanliwei
*
* 引用代码提示插件
*
* use : codeToolTip: true,
*
* Copyright (c) 2017 Copyright Holder All Rights Reserved.
*/
var hasInitToolTip = false
function initToolTip() {
  if (hasInitToolTip) {
    return
  }
  hasInitToolTip = true
  let CodeMirror = window.CodeMirror || {}
  CodeMirror.defineOption("codeToolTip", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      CodeMirror.off(cm.getWrapperElement(), "mouseover", cm.state.codeToolTip.onMouseOver);
    }

    if (val) {
      var state = cm.state.codeToolTip = new CodeToolTip(cm)
      CodeMirror.on(cm.getWrapperElement(), "mouseover", state.onMouseOver);
    }
  });

  function CodeToolTip(cm) {
    this.timeout = null;
    this.onMouseOver = function (e) { onMouseOver(cm, e); };
  }

  function onMouseOver(cm, e) {
    var target = e.target || e.srcElement;
    if (!/\bcm-number/.test(target.className)) return;
    if (!/^(\d{10}|\d{13})$/.test(target.innerText)) { return }
    var code = dateStr(parseInt(target.innerText))
    popupTooltips(code, e);
  }

  function annotationTooltip(description) {
    var tip = document.createElement("div");
    tip.className = "CodeMirror-code-tooltip";
    tip.appendChild(document.createTextNode(description));
    return tip;
  }

  function popupTooltips(description, e) {
    var target = e.target || e.srcElement;
    var tooltip = document.createDocumentFragment();
    tooltip.appendChild(annotationTooltip(description));
    showTooltipFor(e, tooltip, target);
  }

  function showTooltipFor(e, content, node) {
    var tooltip = showTooltip(e, content);
    function hide() {
      CodeMirror.off(node, "mouseout", hide);
      if (tooltip) { hideTooltip(tooltip); tooltip = null; }
    }
    var poll = setInterval(function () {
      if (tooltip) for (var n = node; ; n = n.parentNode) {
        if (n && n.nodeType == 11) n = n.host;
        if (n == document.body) return;
        if (!n) { hide(); break; }
      }
      if (!tooltip) return clearInterval(poll);
    }, 400);
    CodeMirror.on(node, "mouseout", hide);
  }

  function showTooltip(e, content) {
    var tt = document.createElement("div");
    tt.className = "CodeMirror-lint-tooltip";
    tt.appendChild(content.cloneNode(true));
    document.body.appendChild(tt);

    function position(e) {
      if (!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
      tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + "px";
      tt.style.left = (e.clientX + 5) + "px";
    }
    CodeMirror.on(document, "mousemove", position);
    position(e);
    if (tt.style.opacity != null) tt.style.opacity = '1';
    return tt;
  }

  function hideTooltip(tt) {
    if (!tt.parentNode) return;
    if (tt.style.opacity == null) rm(tt);
    tt.style.opacity = 0;
    setTimeout(function () { rm(tt); }, 600);
  }

  function rm(elt) {
    if (elt.parentNode) elt.parentNode.removeChild(elt);
  }

}

let dateStr = (time_) => {
  var time = parseInt(time_)
  if (!time) return '';
  var date = time
  // java中的Integer.MAX_VALUE
  if (date == 2147483647) { return time_ }
  if (time_.length == 10) {
    if (time_.startsWith('19')) { return time_ }
    if (time_.startsWith('20')) { return time_ }
    date *= 1000
  }
  return moment(date).format('YYYY-MM-DD HH:mm:ss.SSS')
};