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
exports.InMemTestService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("./util");
const cache_decorator_1 = require("./cache.decorator");
const time_constants_1 = require("../time.constants");
let InMemTestService = class InMemTestService {
    async cacheableTask1() {
        await (0, util_1.sleep)(1000);
        return true;
    }
    async cacheableTask2() {
        await (0, util_1.sleep)(1000);
        return true;
    }
    async notCacheableTask() {
        await (0, util_1.sleep)(1000);
        return true;
    }
    async cacheableTaskWithArrayParam(param) {
        await (0, util_1.sleep)(1000);
        return param.join("");
    }
};
exports.InMemTestService = InMemTestService;
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "cacheableTask1",
        kind: "temporal",
        ttl: 3 * time_constants_1.SECOND,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestService.prototype, "cacheableTask1", null);
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "cacheableTask2",
        kind: "temporal",
        ttl: 3 * time_constants_1.SECOND,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestService.prototype, "cacheableTask2", null);
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "temporal",
        ttl: 3 * time_constants_1.SECOND,
        paramIndex: [0],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], InMemTestService.prototype, "cacheableTaskWithArrayParam", null);
exports.InMemTestService = InMemTestService = __decorate([
    (0, common_1.Injectable)()
], InMemTestService);
