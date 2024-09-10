import { CacheKind, CacheOptions } from './types';
export declare const isPersistent: (cacheOptions: CacheOptions<CacheKind>) => cacheOptions is CacheOptions<"persistent">;
export declare const isTemporal: (cacheOptions: CacheOptions<CacheKind>) => cacheOptions is CacheOptions<"temporal">;
export declare const isBust: (cacheOptions: CacheOptions<CacheKind>) => cacheOptions is CacheOptions<"bust">;
