import { ICacheStorage } from "../types";
import { DefaultStorage } from "../default.storage";
export declare const defaultStorage: DefaultStorage;
export declare const InMemCache: <Kind extends import("../types").CacheKind>(cacheOptions: import("../types").CacheOptions<Kind>) => (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare class RedisCacheStorage implements ICacheStorage {
    private client;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
}
export declare const RedisCache: <Kind extends import("../types").CacheKind>(cacheOptions: import("../types").CacheOptions<Kind>) => (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const AnotherRedisCache: <Kind extends import("../types").CacheKind>(cacheOptions: import("../types").CacheOptions<Kind>) => (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
