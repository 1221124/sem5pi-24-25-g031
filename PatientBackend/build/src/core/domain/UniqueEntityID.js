"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityID = void 0;
// remove by JRT : import uuid from 'uuid/v4';
const uuid = require('uuid').v4; // Added by JRT
const Identifier_1 = require("./Identifier");
class UniqueEntityID extends Identifier_1.Identifier {
    constructor(id) {
        super(id ? id : uuid());
    }
}
exports.UniqueEntityID = UniqueEntityID;
//# sourceMappingURL=UniqueEntityID.js.map