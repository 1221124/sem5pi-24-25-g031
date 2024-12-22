import { TestBed } from '@angular/core/testing';

import { PatientMedicalRecordService } from './patient-medical-record.service';

describe('PatientMedicalRecordService', () => {
  let service: PatientMedicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientMedicalRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
