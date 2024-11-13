import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthCallbackComponent } from './auth-callback.component';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

class MockAuthService {
  message$ = of('Test message');
  isError$ = of(false);
  setToken = jasmine.createSpy();
  verifyToken = jasmine.createSpy().and.returnValue(true);
  handleUserCallback = jasmine.createSpy().and.returnValue(Promise.resolve({ status: 200 }));
  login = jasmine.createSpy().and.returnValue(Promise.resolve({ status: 200 }));
  updateMessage = jasmine.createSpy();
  updateIsError = jasmine.createSpy();
  redirectBasedOnRole = jasmine.createSpy();
  extractEmailFromAccessToken = jasmine.createSpy().and.returnValue('test@example.com');
  extractRoleFromAccessToken = jasmine.createSpy().and.returnValue('Admin');
  createUser = jasmine.createSpy().and.returnValue(Promise.resolve({ status: 201 }));
}

class MockActivatedRoute {
  queryParams = of({ access_token: 'dummy_access_token' });
}

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCallbackComponent, CommonModule, RouterModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});