import { TestBed } from '@angular/core/testing';

import { OperationTypeService } from './operationTypes.service';

describe('OperationTypesService', () => {
  let service: OperationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
