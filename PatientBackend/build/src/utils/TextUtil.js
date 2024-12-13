"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextUtil = void 0;
class TextUtil {
    static isUUID(text) {
        return new RegExp('\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b').test(text);
    }
}
exports.TextUtil = TextUtil;
//# sourceMappingURL=TextUtil.js.map