"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("./constants");
const cache_1 = require("./cache");
let CacheService = class CacheService {
    constructor(discoveryService, scanner, reflector) {
        this.discoveryService = discoveryService;
        this.scanner = scanner;
        this.reflector = reflector;
    }
    getAllInstances() {
        return [
            ...this.discoveryService.getControllers(),
            ...this.discoveryService.getProviders(),
        ];
    }
    canExplore(instance) {
        return (instance.isDependencyTreeStatic() &&
            instance.metatype &&
            instance.instance);
    }
    extractCacheMetadata(instances) {
        return instances
            .filter(this.canExplore)
            .map(({ instance }) => ({
            instance,
            methodNames: [
                ...new Set(this.scanner.getAllFilteredMethodNames(Object.getPrototypeOf(instance))),
            ],
        }))
            .map(({ instance, methodNames }) => ({
            instance,
            methods: methodNames
                .map((methodName) => ({
                method: instance[methodName],
                methodName,
            }))
                .filter(({ method }) => this.reflector.get(constants_1.CACHE, method)),
        }))
            .filter(({ methods }) => methods.length)
            .flatMap(({ instance, methods }) => methods.map(({ method, methodName }) => ({
            instance,
            cacheOptions: this.reflector.get(constants_1.CACHE, method),
            methodName,
        })));
    }
    initializeAllPersistentCache() {
        this.extractCacheMetadata(this.getAllInstances()).forEach(({ instance, cacheOptions }) => {
            const { kind, key } = cacheOptions;
            if (kind === 'persistent')
                cache_1.cacheEventEmitter.emit(key, instance);
        });
    }
    onModuleInit() {
        this.initializeAllPersistentCache();
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector])
], CacheService);
