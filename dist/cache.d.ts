/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { CacheKind, CacheOptions, ICacheStorage } from "./types";
import "reflect-metadata";
export declare const cacheEventEmitter: EventEmitter<[never]>;
export declare const intervalTimerMap: Map<string, boolean>;
export declare const intervals: NodeJS.Timeout[];
export declare const makeParamBasedCacheKey: (key: string, args: any[], paramIndex: number[] | undefined) => string;
export declare const Cache: ({ storage }?: {
    storage: ICacheStorage;
}) => <Kind extends CacheKind>(cacheOptions: CacheOptions<Kind>) => (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
