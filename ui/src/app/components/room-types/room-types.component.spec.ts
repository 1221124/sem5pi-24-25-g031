import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RoomTypesComponent } from './room-types.component';
import { AuthService } from '../../services/auth/auth.service';
import { RoomTypesService } from '../../services/room-types/room-types.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpResponse } from '@angular/common/http';

describe('RoomTypesComponent', () => {
  let component: RoomTypesComponent;
  let fixture: ComponentFixture<RoomTypesComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRoomTypesService: jasmine.SpyObj<RoomTypesService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'extractRoleFromAccessToken',
      'updateMessage',
      'updateIsError'
    ]);
    mockRoomTypesService = jasmine.createSpyObj('RoomTypesService', ['get', 'post']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RoomTypesComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RoomTypesService, useValue: mockRoomTypesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomTypesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      const navigateSpy = spyOn(router, 'navigate');

      component.ngOnInit();

      expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
        'You are not authenticated or are not an admin! Please login...'
      );
      expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });

    it('should fetch room types if authenticated and admin', fakeAsync(() => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');
      mockRoomTypesService.get.and.returnValue(
        Promise.resolve({ status: 200, body: { roomTypes: [
          { Id: '1', RoomTypeCode: 'roty1', Name: 'Name', Description: 'Description', AvailableForSurgeries: true }
        ], totalItems: 1 } })
      );

      component.ngOnInit();
      tick();

      expect(component.roomTypes.length).toBe(1);
      expect(component.roomTypes[0].Name).toBe('Test Room');
    }));
  });

  describe('submitForm', () => {
    it('should post a room type and display success message', fakeAsync(() => {
      mockRoomTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));
      const navigateSpy = spyOn(router, 'navigate');

      component.roomType = {
        Id: '',
        RoomTypeCode: 'RT1',
        Name: 'New Room',
        Description: 'Test Description',
        AvailableForSurgeries: true
      };
      component.submitForm();
      tick(3000);

      expect(component.message).toBe('Room type added successfully!');
      expect(component.isError).toBeFalse();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/roomTypes']);
    }));

    it('should display an error message if post fails', fakeAsync(() => {
      mockRoomTypesService.post.and.returnValue(Promise.reject({ status: 400 }));
      const navigateSpy = spyOn(router, 'navigate');

      component.roomType = {
        Id: '',
        RoomTypeCode: 'RT1',
        Name: 'New Room',
        Description: 'Test Description',
        AvailableForSurgeries: true
      };
      component.submitForm();
      tick(3000);

      expect(component.message).toBe('Something went wrong! Please try again...');
      expect(component.isError).toBeTrue();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/roomTypes']);
    }));
  });

  describe('isNameValid', () => {
    it('should return false if name is empty', () => {
      component.roomType.Name = '';
      expect(component.isNameValid()).toBeFalse();
    });

    it('should return false if name is already used', () => {
      component.roomTypes = [{ Id: '1', Name: 'Duplicate Room', RoomTypeCode: '', Description: '', AvailableForSurgeries: false }];
      component.roomType.Name = 'Duplicate Room';
      expect(component.isNameValid()).toBeFalse();
    });

    it('should return true for a valid unique name', () => {
      component.roomTypes = [{ Id: '1', Name: 'Existing Room', RoomTypeCode: '', Description: '', AvailableForSurgeries: false }];
      component.roomType.Name = 'New Room';
      expect(component.isNameValid()).toBeTrue();
    });
  });

  describe('isFormValid', () => {
    it('should return true if form is valid', () => {
      component.roomType = {
        Id: '',
        RoomTypeCode: 'RT1',
        Name: 'Valid Name',
        Description: 'Valid Description',
        AvailableForSurgeries: true
      };
      expect(component.isFormValid()).toBeTrue();
    });

    it('should return false if name is invalid', () => {
      component.roomType.Name = '';
      expect(component.isFormValid()).toBeFalse();
    });
  });

  describe('toggleForm', () => {
    it('should toggle showForm property', () => {
      expect(component.showForm).toBeFalse();
      component.toggleForm();
      expect(component.showForm).toBeTrue();
      component.toggleForm();
      expect(component.showForm).toBeFalse();
    });
  });

  describe('back', () => {
    it('should navigate to admin page', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.back();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
    });
  });
});