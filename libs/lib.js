import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-switch'
import '@material/mwc-select'
import '@material/mwc-list'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-list/mwc-check-list-item'
import '@material/mwc-drawer'
import '@material/mwc-circular-progress-four-color'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon-button'
import '@material/mwc-radio'
import '@material/mwc-snackbar'
import '@material/mwc-textarea'
import '@material/mwc-textfield'
import '@material/mwc-top-app-bar'

import CryptoJS from 'crypto-js'
import HmacSHA1 from "crypto-js/hmac-sha1"
import JSZip from 'jszip'
import Split from 'split.js'
import elementResizeDetectorMaker from 'element-resize-detector'
import js_beautify from 'js-beautify'
import pako from 'pako'
import vkbeautify from 'vkbeautify'
import dayjs from 'dayjs'
import Nzh from 'nzh'
import * as Base64 from 'js-base64'
import YAML from 'yaml'

Object.assign(window, {
    CryptoJS,
    HmacSHA1,
    JSZip,
    Split,
    elementResizeDetectorMaker,
    pako,
    vkbeautify,
    js_beautify,
    dayjs,
    Nzh,
    Base64,
    YAML,
})
