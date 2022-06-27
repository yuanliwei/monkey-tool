import HmacSHA1 from "crypto-js/hmac-sha1";

class PageStateStore {
    static get(key) {
        let k = HmacSHA1(key, location.pathname).toString();
        return JSON.parse(localStorage[k] || null);
    }
    static put(key, value) {
        let k = HmacSHA1(key, location.pathname).toString();
        localStorage[k] = JSON.stringify(value);
    }
}

export default PageStateStore