"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBust = exports.isTemporal = exports.isPersistent = void 0;
const isPersistent = (cacheOptions) => {
    return cacheOptions.kind === 'persistent';
};
exports.isPersistent = isPersistent;
const isTemporal = (cacheOptions) => {
    return cacheOptions.kind === 'temporal';
};
exports.isTemporal = isTemporal;
const isBust = (cacheOptions) => {
    return cacheOptions.kind === 'bust';
};
exports.isBust = isBust;
