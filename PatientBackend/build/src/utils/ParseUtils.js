"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUtils = void 0;
const Result_1 = require("../core/logic/Result");
class ParseArrayConfig {
    constructor(raw) {
        this.raw = raw;
    }
    to(dataType) {
        switch (dataType) {
            case 'number':
                return JSON.parse(this.raw);
            case 'string':
                return JSON.parse(this.raw);
            case 'object':
                return JSON.parse(this.raw);
        }
    }
}
class ParseUtils {
    static parseBoolean(raw) {
        if (raw === "" || raw === undefined || raw === null || raw === "null")
            return false;
        return JSON.parse(raw);
    }
    static parseObject(raw) {
        let returnData;
        try {
            returnData = JSON.parse(raw);
        }
        catch (err) {
            return Result_1.Result.fail(err);
        }
        return Result_1.Result.ok(returnData);
    }
    static parseArray(rawArrayString) {
        return new ParseArrayConfig(rawArrayString);
    }
}
exports.ParseUtils = ParseUtils;
//# sourceMappingURL=ParseUtils.js.map