"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFakeRepo = void 0;
class BaseFakeRepo {
    constructor() {
        this._items = [];
    }
    addFakeItem(t) {
        let found = false;
        for (let item of this._items) {
            if (this.compareFakeItems(item, t)) {
                found = true;
            }
        }
        if (!found) {
            this._items.push(t);
        }
    }
    removeFakeItem(t) {
        this._items = this._items
            .filter((item) => !this.compareFakeItems(item, t));
    }
}
exports.BaseFakeRepo = BaseFakeRepo;
//# sourceMappingURL=BaseFakeRepo.js.map