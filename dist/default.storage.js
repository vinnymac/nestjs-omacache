"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DefaultStorage_storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStorage = void 0;
const lru_cache_1 = require("lru-cache");
class DefaultStorage {
    constructor(size = 10000) {
        _DefaultStorage_storage.set(this, void 0);
        __classPrivateFieldSet(this, _DefaultStorage_storage, new lru_cache_1.LRUCache({
            max: size,
        }), "f");
    }
    get(key) {
        return __classPrivateFieldGet(this, _DefaultStorage_storage, "f").get(key);
    }
    set(key, value, ttl) {
        __classPrivateFieldGet(this, _DefaultStorage_storage, "f").set(key, value, {
            ttl,
        });
    }
    delete(key) {
        return __classPrivateFieldGet(this, _DefaultStorage_storage, "f").delete(key);
    }
    has(key) {
        return __classPrivateFieldGet(this, _DefaultStorage_storage, "f").has(key);
    }
    clear() {
        __classPrivateFieldGet(this, _DefaultStorage_storage, "f").clear();
    }
}
exports.DefaultStorage = DefaultStorage;
_DefaultStorage_storage = new WeakMap();
