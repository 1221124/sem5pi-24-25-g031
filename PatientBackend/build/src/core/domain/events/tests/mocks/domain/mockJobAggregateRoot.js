"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockJobAggregateRoot = void 0;
const AggregateRoot_1 = require("../../../../AggregateRoot");
const mockJobCreatedEvent_1 = require("../events/mockJobCreatedEvent");
const mockJobDeletedEvent_1 = require("../events/mockJobDeletedEvent");
class MockJobAggregateRoot extends AggregateRoot_1.AggregateRoot {
    constructor(props, id) {
        super(props, id);
    }
    static createJob(props, id) {
        const job = new this(props, id);
        job.addDomainEvent(new mockJobCreatedEvent_1.MockJobCreatedEvent(job.id));
        return job;
    }
    deleteJob() {
        this.addDomainEvent(new mockJobDeletedEvent_1.MockJobDeletedEvent(this.id));
    }
}
exports.MockJobAggregateRoot = MockJobAggregateRoot;
//# sourceMappingURL=mockJobAggregateRoot.js.map