"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.biggerThan = exports.lessThan = exports.sleep = exports.startTime = void 0;
const strict_1 = require("node:assert/strict");
exports.startTime = Date.now();
const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
exports.sleep = sleep;
const lessThan = (input, expected) => {
    console.log("input: ", input, "expected: ", expected);
    (0, strict_1.equal)(input < expected, true);
};
exports.lessThan = lessThan;
const biggerThan = (input, expected) => {
    console.log("input: ", input, "expected: ", expected);
    (0, strict_1.equal)(input > expected, true);
};
exports.biggerThan = biggerThan;
