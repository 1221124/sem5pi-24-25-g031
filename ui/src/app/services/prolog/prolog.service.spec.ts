import { TestBed } from '@angular/core/testing';

import { PrologService } from './prolog.service';
import {provideHttpClient, withFetch} from '@angular/common/http';

describe('PrologService', () => {
  let service: PrologService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch())
      ],
    });
    service = TestBed.inject(PrologService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
