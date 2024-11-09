import { TestBed } from '@angular/core/testing';

import { OperationTypesService } from './operation-types.service';

describe('OperationTypesService', () => {
  let service: OperationTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
