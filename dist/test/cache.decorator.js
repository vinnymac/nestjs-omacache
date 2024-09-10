"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnotherRedisCache = exports.RedisCache = exports.RedisCacheStorage = exports.InMemCache = exports.defaultStorage = void 0;
const cache_1 = require("../cache");
const redis_1 = require("redis");
const default_storage_1 = require("../default.storage");
exports.defaultStorage = new default_storage_1.DefaultStorage();
exports.InMemCache = (0, cache_1.Cache)({ storage: exports.defaultStorage });
class RedisCacheStorage {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: "redis://localhost:6379",
            name: "class",
        });
        this.client.connect();
    }
    async get(key) {
        const value = await this.client.get(key);
        try {
            return JSON.parse(value);
        }
        catch (error) {
            return value;
        }
    }
    async set(key, value, ttl) {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.client.setEx(key, ttl, stringValue);
        }
        else {
            await this.client.set(key, stringValue);
        }
    }
    async delete(key) {
        const result = await this.client.del(key);
        return result === 1;
    }
    async has(key) {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
exports.RedisCacheStorage = RedisCacheStorage;
exports.RedisCache = (0, cache_1.Cache)({ storage: new RedisCacheStorage() });
exports.AnotherRedisCache = (0, cache_1.Cache)({ storage: new RedisCacheStorage() });
