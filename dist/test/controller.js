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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemTestController = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("./util");
const cache_decorator_1 = require("./cache.decorator");
const service_1 = require("./service");
const time_constants_1 = require("../time.constants");
let InMemTestController = class InMemTestController {
    constructor(testService) {
        this.testService = testService;
    }
    async test1() {
        await (0, util_1.sleep)(1000);
        return "test1";
    }
    async test2() {
        await (0, util_1.sleep)(1000);
        if (Date.now() - util_1.startTime > 3000) {
            return "modified test2";
        }
        else {
            return "test2";
        }
    }
    async test2bust() { }
    async test3() {
        await (0, util_1.sleep)(1000);
        return "test3";
    }
    async test3param(param, query) {
        await (0, util_1.sleep)(1000);
        return "test3" + param + query;
    }
    async test3post(body) {
        await (0, util_1.sleep)(1000);
        return "test3" + Object.keys(body).join("");
    }
    async test3bust() { }
    async test3RootKeyBust() { }
    async partiallyCached() {
        await this.testService.cacheableTask1();
        await this.testService.notCacheableTask();
        await this.testService.cacheableTask2();
        return "test4";
    }
    async reverseOrderDecorator() {
        await (0, util_1.sleep)(1000);
        return "test5";
    }
    async test6() {
        await (0, util_1.sleep)(1000);
        return "test6";
    }
    async underTest6() {
        await (0, util_1.sleep)(1000);
        return "under_test6";
    }
    async test6bust() { }
};
exports.InMemTestController = InMemTestController;
__decorate([
    (0, common_1.Get)("test1"),
    (0, cache_decorator_1.InMemCache)({
        key: "test1",
        kind: "persistent",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test1", null);
__decorate([
    (0, common_1.Get)("test2"),
    (0, cache_decorator_1.InMemCache)({
        key: "test2",
        kind: "persistent",
        refreshIntervalSec: 2,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test2", null);
__decorate([
    (0, common_1.Get)("test2/bust"),
    (0, cache_decorator_1.InMemCache)({
        key: "test2",
        kind: "bust",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test2bust", null);
__decorate([
    (0, common_1.Get)("test3/noParam"),
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "temporal",
        ttl: 300 * time_constants_1.SECOND,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test3", null);
__decorate([
    (0, common_1.Get)("test3/withParam/:param"),
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "temporal",
        ttl: 300 * time_constants_1.SECOND,
        paramIndex: [0, 1],
    }),
    __param(0, (0, common_1.Param)("param")),
    __param(1, (0, common_1.Query)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test3param", null);
__decorate([
    (0, common_1.Post)("test3"),
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "temporal",
        ttl: 300 * time_constants_1.SECOND,
        paramIndex: [0],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test3post", null);
__decorate([
    (0, common_1.Get)("test3/bust"),
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "bust",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test3bust", null);
__decorate([
    (0, common_1.Get)("test3/rootKeyBust"),
    (0, cache_decorator_1.InMemCache)({
        key: "test3",
        kind: "bust",
        bustAllChildren: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test3RootKeyBust", null);
__decorate([
    (0, common_1.Get)("test4"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "partiallyCached", null);
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "test5",
        kind: "persistent",
    }),
    (0, common_1.Get)("test5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "reverseOrderDecorator", null);
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "test6",
        kind: "temporal",
        ttl: 300 * time_constants_1.SECOND,
    }),
    (0, common_1.Get)("test6"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test6", null);
__decorate([
    (0, cache_decorator_1.InMemCache)({
        key: "under_test6",
        kind: "temporal",
        ttl: 300 * time_constants_1.SECOND,
    }),
    (0, common_1.Get)("under_test6"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "underTest6", null);
__decorate([
    (0, common_1.Patch)("test6/bust"),
    (0, cache_decorator_1.InMemCache)({
        key: "test6",
        kind: "bust",
        addition: [
            {
                key: "under_test6",
            },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InMemTestController.prototype, "test6bust", null);
exports.InMemTestController = InMemTestController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [service_1.InMemTestService])
], InMemTestController);
