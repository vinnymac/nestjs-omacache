"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const reporters_1 = require("node:test/reporters");
let notOk = 0;
(0, node_test_1.run)({ files: ["lib/test/in-memory.e2e.test.ts"] })
    .on("test:fail", () => {
    notOk++;
    console.warn("not ok count:", notOk);
    if (notOk > 1) {
        process.exitCode = 1;
    }
})
    .compose(reporters_1.tap)
    .pipe(process.stdout);
