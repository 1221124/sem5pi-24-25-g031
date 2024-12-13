"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = __importStar(require("sinon"));
const DomainEvents_1 = require("../DomainEvents");
const mockJobCreatedEvent_1 = require("./mocks/events/mockJobCreatedEvent");
const mockJobDeletedEvent_1 = require("./mocks/events/mockJobDeletedEvent");
const mockJobAggregateRoot_1 = require("./mocks/domain/mockJobAggregateRoot");
const mockPostToSocial_1 = require("./mocks/services/mockPostToSocial");
const mockJobAggregateRootId_1 = require("./mocks/domain/mockJobAggregateRootId");
const UniqueEntityID_1 = require("../../UniqueEntityID");
const node_test_1 = require("node:test");
const expect_1 = require("expect");
let social;
let job;
let spy;
(0, node_test_1.describe)('Domain Events', () => {
    (0, node_test_1.beforeEach)(() => {
        social = null;
        DomainEvents_1.DomainEvents.clearHandlers();
        DomainEvents_1.DomainEvents.clearMarkedAggregates();
        spy = null;
        job = null;
    });
    (0, node_test_1.describe)('Given a JobCreatedEvent, JobDeletedEvent and a PostToSocial handler class', () => {
        (0, node_test_1.it)('Should be able to setup event subscriptions', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            (0, expect_1.expect)(Object.keys(DomainEvents_1.DomainEvents['handlersMap']).length).toBe(2);
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['handlersMap'][mockJobDeletedEvent_1.MockJobDeletedEvent.name].length).toBe(1);
        });
        (0, node_test_1.it)('There should be exactly one handler subscribed to the JobCreatedEvent', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
        });
        (0, node_test_1.it)('There should be exactly one handler subscribed to the JobDeletedEvent', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
        });
        (0, node_test_1.it)('Should add the event to the DomainEvents list when the event is created', () => {
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            var domainEventsAggregateSpy = sinon.spy(DomainEvents_1.DomainEvents, "markAggregateForDispatch");
            // setTimeout(() => {
            //   expect(domainEventsAggregateSpy.calledOnce).toBeTruthy();
            //   expect(domainEventsAggregateSpy.callCount).toBe(0)
            //   expect(DomainEvents['markedAggregates'][0]['length']).toBe(1);
            // }, 1000);
        });
        (0, node_test_1.it)('Should call the handlers when the event is dispatched after marking the aggregate root', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            var jobCreatedEventSpy = sinon.spy(social, "handleJobCreatedEvent");
            var jobDeletedEventSpy = sinon.spy(social, "handleDeletedEvent");
            // Create the event, mark the aggregate
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            // Dispatch the events now
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId_1.MockJobAggregateRootId);
            // setTimeout(() => {
            //   expect(jobCreatedEventSpy.calledOnce).toBeFalsy();
            //   expect(jobDeletedEventSpy.calledOnce).toBeTruthy();
            // }, 1000);
        });
        (0, node_test_1.it)('Should remove the marked aggregate from the marked aggregates list after it gets dispatched', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            // Create the event, mark the aggregate
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            // Dispatch the events now
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId_1.MockJobAggregateRootId);
            // setTimeout(() => {
            //   expect(DomainEvents['markedAggregates']['length']).toBe(0);
            // }, 1000);
        });
        (0, node_test_1.it)('Should only add the domain event to the ', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            // Create the event, mark the aggregate
            mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, new UniqueEntityID_1.UniqueEntityID('99'));
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(1);
            // Create a new job, it should also get marked
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, new UniqueEntityID_1.UniqueEntityID('12'));
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(2);
            // Dispatch another action from the second job created
            job.deleteJob();
            // The number of aggregates should be the same
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(2);
            // However, the second aggregate should have two events now
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates'][1].domainEvents.length).toBe(2);
            // And the first aggregate should have one event
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates'][0].domainEvents.length).toBe(1);
            // Dispatch the event for the first job
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(new UniqueEntityID_1.UniqueEntityID('99'));
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(1);
            // The job with two events should still be there
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates'][0].domainEvents.length).toBe(2);
            // Dispatch the event for the second job
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(new UniqueEntityID_1.UniqueEntityID('12'));
            // There should be no more domain events in the list
            (0, expect_1.expect)(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(0);
        });
    });
});
//# sourceMappingURL=domainEvents.spec.js.map