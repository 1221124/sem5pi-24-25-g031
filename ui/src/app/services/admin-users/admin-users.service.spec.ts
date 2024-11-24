import { TestBed } from '@angular/core/testing';

import { AdminUsersService } from './admin-users.service';
import {provideHttpClient, withFetch} from '@angular/common/http';

describe('AdminUsersService', () => {
  let service: AdminUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch())
      ],
    });
    service = TestBed.inject(AdminUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
