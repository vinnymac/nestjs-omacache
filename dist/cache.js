"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.makeParamBasedCacheKey = exports.intervals = exports.intervalTimerMap = exports.cacheEventEmitter = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const constants_1 = require("./constants");
const guard_1 = require("./guard");
require("reflect-metadata");
const default_storage_1 = require("./default.storage");
exports.cacheEventEmitter = new events_1.EventEmitter();
exports.intervalTimerMap = new Map();
exports.intervals = [];
const ROOT_KEY_SUFFIX = "__ROOT_KEY__";
const makeRootKey = (key) => `${key}${ROOT_KEY_SUFFIX}`;
const makeParamBasedCacheKey = (key, args, paramIndex) => !paramIndex
    ? key
    : paramIndex.reduce((cacheKey, pidx) => `${cacheKey}:${JSON.stringify(args[pidx])}`, key);
exports.makeParamBasedCacheKey = makeParamBasedCacheKey;
const setChildCacheKey = async (storage, cacheKey, rootKey) => {
    if (!(await storage.has(rootKey))) {
        storage.set(rootKey, JSON.stringify({ [cacheKey]: 1 }));
        return;
    }
    const children = await getChildrenObject(storage, rootKey);
    if (children[cacheKey])
        return;
    children[cacheKey] = 1;
    storage.set(rootKey, JSON.stringify(children));
};
const deleteChildCacheKey = async (storage, cacheKey, rootKey) => {
    if (await storage.has(rootKey)) {
        const children = await getChildrenObject(storage, rootKey);
        delete children[cacheKey];
        storage.set(rootKey, JSON.stringify(children));
    }
};
const deleteAllChildrenByRootKey = async (storage, rootKey, originalKey) => {
    if (await storage.has(rootKey)) {
        const children = await getChildrenObject(storage, rootKey);
        for (const key in children) {
            storage.delete(key);
        }
        storage.delete(rootKey);
        storage.delete(originalKey);
    }
};
const getChildrenObject = async (storage, rootKey) => {
    if (!rootKey.endsWith(ROOT_KEY_SUFFIX)) {
        throw new Error("Invalid root key");
    }
    try {
        return JSON.parse(await storage.get(rootKey));
    }
    catch (e) {
        throw new Error("cannot parse children object");
    }
};
function copyOriginalMetadataToCacheDescriptor(metadataKeys, originalMethod, descriptor) {
    metadataKeys.forEach((key) => {
        const metadataValue = Reflect.getMetadata(key, originalMethod);
        Reflect.defineMetadata(key, metadataValue, descriptor.value);
    });
}
const Cache = ({ storage } = { storage: new default_storage_1.DefaultStorage() }) => (cacheOptions) => {
    return (target, _propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        const originalMethodMetadataKeys = Reflect.getMetadataKeys(originalMethod);
        const { key } = cacheOptions;
        if ((0, guard_1.isPersistent)(cacheOptions)) {
            const { refreshIntervalSec } = cacheOptions;
            Reflect.defineMetadata(key, 0, target);
            descriptor.value = async function () {
                if (arguments.length)
                    throw new Error("arguments are not supported for persistent cache");
                if (await storage.has(key))
                    return storage.get(key);
                const result = await originalMethod.call(this);
                storage.set(key, result);
                if (refreshIntervalSec && !exports.intervalTimerMap.has(key)) {
                    const interval = setInterval(() => {
                        const result = originalMethod.call(this);
                        result instanceof Promise
                            ? result.then((result) => {
                                storage.set(key, result);
                            })
                            : storage.set(key, result);
                    }, refreshIntervalSec * 1000);
                    exports.intervals.push(interval);
                    exports.intervalTimerMap.set(key, true);
                }
                return result;
            };
            exports.cacheEventEmitter.once(key, (instance) => {
                descriptor.value.call(instance);
                exports.cacheEventEmitter.on(`__${0}=>${key}__`, () => {
                    descriptor.value.call(instance);
                });
            });
        }
        if ((0, guard_1.isTemporal)(cacheOptions)) {
            const { ttl, paramIndex } = cacheOptions;
            Reflect.defineMetadata(key, 1, target);
            descriptor.value = async function (...args) {
                const cacheKey = (0, exports.makeParamBasedCacheKey)(key, args, paramIndex);
                const rootKey = makeRootKey(key);
                if (paramIndex?.length) {
                    setChildCacheKey(storage, cacheKey, rootKey);
                }
                if (await storage.has(cacheKey))
                    return storage.get(cacheKey);
                const result = await originalMethod.apply(this, args);
                storage.set(cacheKey, result, ttl);
                return result;
            };
        }
        if ((0, guard_1.isBust)(cacheOptions)) {
            descriptor.value = async function (...args) {
                const { paramIndex, bustAllChildren, addition } = cacheOptions;
                const rootKey = makeRootKey(key);
                if (bustAllChildren && (await storage.has(rootKey))) {
                    deleteAllChildrenByRootKey(storage, rootKey, key);
                }
                else {
                    const cacheKey = (0, exports.makeParamBasedCacheKey)(key, args, paramIndex);
                    await storage.delete(cacheKey);
                    if (await storage.has(rootKey)) {
                        deleteChildCacheKey(storage, cacheKey, rootKey);
                    }
                }
                for (const additionalBusting of addition || []) {
                    const additionalRootKey = makeRootKey(additionalBusting.key);
                    if (additionalBusting.bustAllChildren &&
                        (await storage.has(additionalRootKey))) {
                        deleteAllChildrenByRootKey(storage, additionalRootKey, additionalBusting.key);
                    }
                    else {
                        const cacheKey = (0, exports.makeParamBasedCacheKey)(additionalBusting.key, args, additionalBusting.paramIndex);
                        storage.delete(cacheKey);
                        if (await storage.has(additionalRootKey)) {
                            deleteChildCacheKey(storage, cacheKey, additionalRootKey);
                        }
                    }
                }
                const result = await originalMethod.apply(this, args);
                if (Reflect.getMetadata(key, target) === 0) {
                    exports.cacheEventEmitter.emit(`__${0}=>${key}__`);
                }
                return result;
            };
        }
        copyOriginalMetadataToCacheDescriptor(originalMethodMetadataKeys, originalMethod, descriptor);
        (0, common_1.SetMetadata)(constants_1.CACHE, cacheOptions)(descriptor.value);
        return descriptor;
    };
};
exports.Cache = Cache;
