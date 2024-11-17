import { TestBed } from '@angular/core/testing';

import { StaffsService } from './staffs.service';
import { provideHttpClient } from '@angular/common/http';

describe('StaffsService', () => {
  let service: StaffsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StaffsService,
        provideHttpClient()
      ]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
