import { TestBed } from '@angular/core/testing';

import { OperationRequestsService } from './operation-requests.service';
import { provideHttpClient } from '@angular/common/http';

describe('OperationRequestsService', () => {
  let service: OperationRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OperationRequestsService,
        provideHttpClient()
    ]});
    service = TestBed.inject(OperationRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
