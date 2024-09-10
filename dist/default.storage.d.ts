import { ICacheStorage } from "./types";
export declare class DefaultStorage implements ICacheStorage {
    #private;
    constructor(size?: number);
    get(key: string): any;
    set(key: string, value: any, ttl?: number): void;
    delete(key: string): boolean;
    has(key: string): boolean;
    clear(): void;
}
