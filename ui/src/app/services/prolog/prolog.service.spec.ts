import { TestBed } from '@angular/core/testing';

import { PrologService } from './prolog.service';

describe('PrologService', () => {
  let service: PrologService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrologService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
