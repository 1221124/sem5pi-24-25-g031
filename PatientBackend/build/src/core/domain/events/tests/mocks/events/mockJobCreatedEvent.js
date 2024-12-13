"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockJobCreatedEvent = void 0;
class MockJobCreatedEvent {
    constructor(id) {
        this.id = id;
        this.dateTimeOccurred = new Date();
    }
    getAggregateId() {
        return this.id;
    }
}
exports.MockJobCreatedEvent = MockJobCreatedEvent;
//# sourceMappingURL=mockJobCreatedEvent.js.map