import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
export declare class CacheService implements OnModuleInit {
    private readonly discoveryService;
    private readonly scanner;
    private readonly reflector;
    constructor(discoveryService: DiscoveryService, scanner: MetadataScanner, reflector: Reflector);
    private getAllInstances;
    private canExplore;
    private extractCacheMetadata;
    private initializeAllPersistentCache;
    onModuleInit(): void;
}
