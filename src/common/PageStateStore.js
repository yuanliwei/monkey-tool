import { HmacSHA1, base64encode, textEncode } from "./crypto-wrap-web.js"

/**
 * @param {string} key
 */
export async function getCfg(key) {
    let k = await buildStorageKey(key)
    return JSON.parse(localStorage[k] || null)
}
/**
 * @param {string} key
 * @param {object} value
 */
export async function putCfg(key, value) {
    let k = await buildStorageKey(key)
    localStorage[k] = JSON.stringify(value)
}

/**
 * @param {string} key
 */
export async function buildStorageKey(key) {
    if (window.crypto.subtle?.importKey) {
        return await HmacSHA1(key, location.pathname)
    } else {
        return base64encode(textEncode(location.pathname + key))
    }
}
