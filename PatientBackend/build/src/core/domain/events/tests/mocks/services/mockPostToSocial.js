"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPostToSocial = void 0;
const mockJobCreatedEvent_1 = require("../events/mockJobCreatedEvent");
const mockJobDeletedEvent_1 = require("../events/mockJobDeletedEvent");
const DomainEvents_1 = require("../../../DomainEvents");
class MockPostToSocial {
    constructor() {
    }
    /**
     * This is how we may setup subscriptions to domain events.
     */
    setupSubscriptions() {
        DomainEvents_1.DomainEvents.register(this.handleJobCreatedEvent, mockJobCreatedEvent_1.MockJobCreatedEvent.name);
        DomainEvents_1.DomainEvents.register(this.handleDeletedEvent, mockJobDeletedEvent_1.MockJobDeletedEvent.name);
    }
    /**
     * These are examples of how we define the handlers for domain events.
     */
    handleJobCreatedEvent(event) {
        console.log('A job was created!!!');
    }
    handleDeletedEvent(event) {
        console.log('A job was deleted!!!');
    }
}
exports.MockPostToSocial = MockPostToSocial;
//# sourceMappingURL=mockPostToSocial.js.map