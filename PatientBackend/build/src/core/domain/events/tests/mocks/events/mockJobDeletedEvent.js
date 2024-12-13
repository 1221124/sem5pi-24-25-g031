"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockJobDeletedEvent = void 0;
class MockJobDeletedEvent {
    constructor(id) {
        this.dateTimeOccurred = new Date();
        this.id = id;
    }
    getAggregateId() {
        return this.id;
    }
}
exports.MockJobDeletedEvent = MockJobDeletedEvent;
//# sourceMappingURL=mockJobDeletedEvent.js.map