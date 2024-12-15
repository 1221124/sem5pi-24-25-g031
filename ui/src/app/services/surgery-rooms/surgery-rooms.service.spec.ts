import { TestBed } from '@angular/core/testing';

import { SurgeryRoomsService } from './surgery-rooms.service';

describe('SurgeryRoomsService', () => {
  let service: SurgeryRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurgeryRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
