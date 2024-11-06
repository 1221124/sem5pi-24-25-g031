import { TestBed } from '@angular/core/testing';

import { OperationRequestsService } from './operation-requests.service';

describe('OperationRequestsService', () => {
  let service: OperationRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
