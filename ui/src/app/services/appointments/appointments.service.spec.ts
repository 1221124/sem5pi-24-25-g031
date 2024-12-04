import { TestBed } from '@angular/core/testing';

import { AppointmentsService } from './appointments.service';
import {provideHttpClient, withFetch} from '@angular/common/http';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
        provideHttpClient(withFetch())
      ],});
    service = TestBed.inject(AppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
