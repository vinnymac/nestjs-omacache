"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const node_test_1 = require("node:test");
const strict_1 = require("node:assert/strict");
const testing_1 = require("@nestjs/testing");
const service_1 = require("./service");
const util_1 = require("./util");
const cache_module_1 = require("../cache.module");
const controller_1 = require("./controller");
const cache_1 = require("../cache");
const cache_decorator_1 = require("./cache.decorator");
let httpServer;
let app;
let service;
const requestBody = {
    stringValue: "Hello, world!",
    numberValue: 123,
    objectValue: {
        nestedString: "This is a string inside an object",
        nestedNumber: 456,
        nestedObject: {
            anotherKey: "Another string",
        },
    },
    arrayValue: ["string in array", 789, true, null, { objectInArray: "value" }],
    booleanValue: true,
    nullValue: null,
};
(0, node_test_1.describe)("e2e-in-memory", () => {
    (0, node_test_1.before)(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [cache_module_1.CacheModule],
            controllers: [controller_1.InMemTestController],
            providers: [service_1.InMemTestService],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
        service = app.get(service_1.InMemTestService);
    });
    (0, node_test_1.after)(async () => {
        await app.close();
        cache_1.intervals.forEach(clearInterval);
        cache_decorator_1.defaultStorage.clear();
    });
    (0, node_test_1.it)("should return immediately(set on start). test1 route", async () => {
        await (0, util_1.sleep)(1000);
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test1");
        const diff = Date.now() - start;
        (0, strict_1.equal)(response.status, 200);
        (0, strict_1.equal)(response.text, "test1");
        (0, util_1.lessThan)(diff, 50);
    });
    (0, node_test_1.it)("should return immediately(set on start) modified value. test2 route", async () => {
        await (0, util_1.sleep)(3000);
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test2");
        const diff = Date.now() - start;
        (0, strict_1.equal)(response.status, 200);
        (0, strict_1.equal)(response.text, "modified test2");
        (0, util_1.lessThan)(diff, 50);
    });
    (0, node_test_1.it)("should return deferred value. because persistent cache busted", async () => {
        await (0, supertest_1.default)(httpServer).get("/test2/bust");
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test2");
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
        (0, strict_1.equal)(response.text, "modified test2");
    });
    (0, node_test_1.it)("even if cache value busted, it will automatically invoked internally, so request can get cached value", async () => {
        await (0, supertest_1.default)(httpServer).get("/test2/bust");
        await (0, util_1.sleep)(1050);
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test2");
        const diff = Date.now() - start;
        (0, util_1.lessThan)(diff, 50);
        (0, strict_1.equal)(response.text, "modified test2");
    });
    (0, node_test_1.it)("should return deferred value at first, then return cached value immediately", async () => {
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test3/withParam/paramValue?query=queryValue");
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
        (0, strict_1.equal)(response.text, "test3paramValuequeryValue");
        const start2 = Date.now();
        const response2 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/paramValue?query=queryValue");
        const diff2 = Date.now() - start2;
        (0, util_1.lessThan)(diff2, 50);
        (0, strict_1.equal)(response2.text, "test3paramValuequeryValue");
    });
    (0, node_test_1.it)("should return both deferred value if referenced value is different(parameter combined cache)", async () => {
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test3/withParam/param1?query=query1");
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
        (0, strict_1.equal)(response.text, "test3param1query1");
        const start2 = Date.now();
        const response2 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/param2?query=query1");
        const diff2 = Date.now() - start2;
        (0, util_1.biggerThan)(diff2, 1000);
        (0, strict_1.equal)(response2.text, "test3param2query1");
    });
    (0, node_test_1.it)("should bust all param based cache with a key if bustAllChildren is true", async () => {
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test3/noParam");
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
        (0, strict_1.equal)(response.text, "test3");
        const start1 = Date.now();
        const response1 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p1?query=_q1");
        const diff1 = Date.now() - start1;
        (0, util_1.biggerThan)(diff1, 1000);
        (0, strict_1.equal)(response1.text, "test3_p1_q1");
        const start2 = Date.now();
        const response2 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p2?query=_q1");
        const diff2 = Date.now() - start2;
        (0, util_1.biggerThan)(diff2, 1000);
        (0, strict_1.equal)(response2.text, "test3_p2_q1");
        const start3 = Date.now();
        const response3 = await (0, supertest_1.default)(httpServer).get("/test3/noParam");
        const diff3 = Date.now() - start3;
        (0, util_1.lessThan)(diff3, 50);
        (0, strict_1.equal)(response3.text, "test3");
        const start4 = Date.now();
        const response4 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p1?query=_q1");
        const diff4 = Date.now() - start4;
        (0, util_1.lessThan)(diff4, 50);
        (0, strict_1.equal)(response4.text, "test3_p1_q1");
        const start5 = Date.now();
        ``;
        const response5 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p2?query=_q1");
        const diff5 = Date.now() - start5;
        (0, util_1.lessThan)(diff5, 50);
        (0, strict_1.equal)(response5.text, "test3_p2_q1");
        await (0, supertest_1.default)(httpServer).get("/test3/rootKeyBust");
        (0, util_1.sleep)(1000);
        const start6 = Date.now();
        const response6 = await (0, supertest_1.default)(httpServer).get("/test3/noParam");
        const diff6 = Date.now() - start6;
        (0, util_1.biggerThan)(diff6, 1000);
        (0, strict_1.equal)(response6.text, "test3");
        const start7 = Date.now();
        const response7 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p1?query=_q1");
        const diff7 = Date.now() - start7;
        (0, util_1.biggerThan)(diff7, 1000);
        (0, strict_1.equal)(response7.text, "test3_p1_q1");
        const start8 = Date.now();
        const response8 = await (0, supertest_1.default)(httpServer).get("/test3/withParam/_p2?query=_q1");
        const diff8 = Date.now() - start8;
        (0, util_1.biggerThan)(diff8, 1000);
        (0, strict_1.equal)(response8.text, "test3_p2_q1");
    });
    (0, node_test_1.it)("should work with object parameters", async () => {
        const start = Date.now();
        const response = await (0, supertest_1.default)(httpServer).post("/test3").send(requestBody);
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
        (0, strict_1.equal)(response.text, "test3" + Object.keys(requestBody).join(""));
        const start2 = Date.now();
        const response2 = await (0, supertest_1.default)(httpServer)
            .post("/test3")
            .send(requestBody);
        const diff2 = Date.now() - start2;
        (0, util_1.lessThan)(diff2, 50);
        (0, strict_1.equal)(response2.text, "test3" + Object.keys(requestBody).join(""));
        const start3 = Date.now();
        const modifiedRequestBody = { ...requestBody, stringValue: "modified" };
        const response3 = await (0, supertest_1.default)(httpServer)
            .post("/test3")
            .send(modifiedRequestBody);
        const diff3 = Date.now() - start3;
        (0, util_1.biggerThan)(diff3, 1000);
        (0, strict_1.equal)(response3.text, "test3" + Object.keys(modifiedRequestBody).join(""));
    });
    (0, node_test_1.it)("should work with array parameters", async () => {
        const array = [1, "hi", true, { a: 1 }, [1, 2], null];
        const start = Date.now();
        const result = await service.cacheableTaskWithArrayParam(array);
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 900);
        (0, strict_1.equal)(result, array.join(""));
        const start2 = Date.now();
        const result2 = await service.cacheableTaskWithArrayParam(array);
        const diff2 = Date.now() - start2;
        (0, util_1.lessThan)(diff2, 50);
        (0, strict_1.equal)(result2, array.join(""));
        const start3 = Date.now();
        const modifiedArray = [...array, "modified"];
        const result3 = await service.cacheableTaskWithArrayParam(modifiedArray);
        const diff3 = Date.now() - start3;
        (0, util_1.biggerThan)(diff3, 900);
        (0, strict_1.equal)(result3, modifiedArray.join(""));
    });
    (0, node_test_1.it)("should cache injectable partially so whole Request-Response cycle can divided into optimizable sections", async () => {
        const rawStart = Date.now();
        const response = await (0, supertest_1.default)(httpServer).get("/test4");
        const diff = Date.now() - rawStart;
        (0, util_1.biggerThan)(diff, 3000);
        (0, strict_1.equal)(response.text, "test4");
        const start = Date.now();
        const response2 = await (0, supertest_1.default)(httpServer).get("/test4");
        const diff2 = Date.now() - start;
        (0, util_1.biggerThan)(diff2, 1000);
        (0, util_1.lessThan)(diff2, 1100);
        (0, strict_1.equal)(response2.text, "test4");
    });
    (0, node_test_1.it)('should bust all addition cache if "addition" option is specified when bust', async () => {
        await (0, supertest_1.default)(httpServer).get("/test6");
        await (0, supertest_1.default)(httpServer).get("/under_test6");
        await (0, supertest_1.default)(httpServer).patch("/test6/bust");
        const start = Date.now();
        await (0, supertest_1.default)(httpServer).get("/test6");
        const diff = Date.now() - start;
        (0, util_1.biggerThan)(diff, 1000);
    });
});
