/**
 * 
 * @param {string} message 
 * @param {string} key 
 * @returns 
 */
export async function HmacSHA1(message, key) {
    const keyBuffer = new TextEncoder().encode(key)
    const messageBuffer = new TextEncoder().encode(message)

    const importedKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    )

    const hmacBytes = await window.crypto.subtle.sign(
        'HMAC',
        importedKey,
        messageBuffer
    )

    const hmacHex = Array.from(new Uint8Array(hmacBytes))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')

    return hmacHex
}

/**
 * @param {ArrayBuffer} buffer 
 */
export async function hex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}

/**
 * @param {string} message 
 */
export async function sha1(message) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
    return hashHex
}

/**
 * @param {string} message 
 */
export async function sha256(message) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
    return hashHex
}

/**
 * @param {string} message 
 */
export async function sha512(message) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-512", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
    return hashHex
}

/**
 * 
 * @param {string} message 
 * @param {string} password 
 * @param {number} iterations 
 * @returns 
 */
export async function aesEncryptString(message, password, iterations) {
    const data = new TextEncoder().encode(message)
    const encryptedData = await aesEncrypt(data, password, iterations)
    const encryptedBase64 = window.btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
    return encryptedBase64
}

/**
 * @param {string} message 
 * @param {string} password 
 * @param {number} iterations 
 * @returns 
 */
export async function aesDecryptString(message, password, iterations) {
    const encryptedArray = new Uint8Array(window.atob(message).split('').map(c => c.charCodeAt(0)))
    const decryptedData = await aesDecrypt(encryptedArray, password, iterations)
    const decryptedMessage = new TextDecoder().decode(decryptedData)
    return decryptedMessage
}

/**
 * @param {string} text 
 * @returns 
 */
export function base64decode(text) {
    const _tidyB64 = (/** @type {string} */ s) => s.replace(/[^A-Za-z0-9+/]/g, '')
    const _unURI = (/** @type {string} */ a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'))
    text = _unURI(text)
    return new Uint8Array(window.atob(text).split('').map(c => c.charCodeAt(0)))
}

/**
 * @param {ArrayBuffer} buffer 
 * @returns 
 */
export function base64encode(buffer, urlsafe = false) {
    let b64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)))
    if (urlsafe) {
        b64 = b64.replace(/=/g, '').replace(/[+/]/g, (m0) => m0 == '+' ? '-' : '_')
    }
    return b64
}

/**
 * @param {string} text hex string
 * @returns 
 */
export function hexDecode(text) {
    return new Uint8Array(text.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)))
}

/**
 * @param {ArrayBuffer} buffer 
 * @returns 
 */
export function hexEncode(buffer) {
    const hashArray = Array.from(new Uint8Array(buffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * @param {ArrayBuffer} buffer 
 * @returns 
 */
export function textDecode(buffer) {
    return new TextDecoder().decode(buffer)
}

/**
 * @param {string} text 
 * @returns 
 */
export function textEncode(text) {
    return new TextEncoder().encode(text)
}

/**
 * 
 * @param {string} password 
 * @param {number} iterations 
 * @returns 
 */
export async function aesKeyBuilder(password, iterations) {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
    )
    const salt = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))
    const pbkdf2Params = {
        name: "PBKDF2",
        salt,
        iterations: iterations,
        hash: "SHA-256",
    }
    const key = await window.crypto.subtle.deriveKey(
        pbkdf2Params,
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
    )
    const iv = await window.crypto.subtle.deriveBits(
        pbkdf2Params,
        keyMaterial,
        256,
    )
    return { key, iv }
}

/**
 * 
 * @param {Uint8Array} message 
 * @param {string} password 
 * @param {number} iterations 
 * @returns 
 */
export async function aesEncrypt(message, password, iterations) {
    const { key, iv } = await aesKeyBuilder(password, iterations)
    const data = message
    const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv }, key, data
    )
    return new Uint8Array(encryptedData)
}

/**
 * @param {Uint8Array} message 
 * @param {string} password 
 * @param {number} iterations 
 * @returns 
 */
export async function aesDecrypt(message, password, iterations) {
    const { key, iv } = await aesKeyBuilder(password, iterations)
    const encryptedArray = message
    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv }, key, encryptedArray
    )
    return new Uint8Array(decryptedData)
}

/**
 * @param {import('crypto-js').lib.WordArray} wordArray 
 * @returns 
 */
export function convertWordArrayToUint8Array(wordArray) {
    let words = wordArray.words
    let sigBytes = wordArray.sigBytes
    let buffer = new Uint8Array(sigBytes)
    for (let i = 0; i < sigBytes; i++) {
        buffer[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    }
    return buffer
}