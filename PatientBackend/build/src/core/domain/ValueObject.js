"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
const shallow_equal_object_1 = require("shallow-equal-object");
/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */
class ValueObject {
    constructor(props) {
        this.props = Object.freeze(props);
    }
    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return (0, shallow_equal_object_1.shallowEqual)(this.props, vo.props);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=ValueObject.js.map