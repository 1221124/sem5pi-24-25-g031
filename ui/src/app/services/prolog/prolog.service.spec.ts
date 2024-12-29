import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PrologService } from './prolog.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('PrologService', () => {
  let service: PrologService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      providers: [
        PrologService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(PrologService);
  });

  describe('runProlog', () => {
    it('should send the correct parameters when surgeryRoomNumber is provided', async () => {
      const option = 'test-option';
      const surgeryRoomNumber = '101';
      const date = '2024-12-29T10:00';
      const accessToken = 'valid-token';

      const mockResponse = new HttpResponse({ status: 201 });
      httpClientSpy.post.and.returnValue(of(mockResponse));

      const result = await service.runProlog(option, surgeryRoomNumber, date, accessToken);

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        `${environment.prolog}`,
        {
          SurgeryRoomNumber: surgeryRoomNumber,
          DateTime: new Date(date).toISOString(),
          Option: option
        },
        jasmine.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send the correct parameters when surgeryRoomNumber is not provided', async () => {
      const option = 'test-option';
      const surgeryRoomNumber = '';
      const date = '2024-12-29T10:00';
      const accessToken = 'valid-token';

      const mockResponse = new HttpResponse({ status: 201 });
      httpClientSpy.post.and.returnValue(of(mockResponse));

      const result = await service.runProlog(option, surgeryRoomNumber, date, accessToken);

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        `${environment.prolog}`,
        {
          DateTime: new Date(date).toISOString(),
          Option: option
        },
        jasmine.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the HTTP request fails', async () => {
      const option = 'test-option';
      const surgeryRoomNumber = '101';
      const date = '2024-12-29T10:00';
      const accessToken = 'valid-token';

      const mockError = { status: 500, message: 'Internal Server Error' };
      httpClientSpy.post.and.returnValue(throwError(mockError));

      try {
        await service.runProlog(option, surgeryRoomNumber, date, accessToken);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      }
    });

    it('should throw an error when the parameters are invalid', async () => {
      const option = '';
      const surgeryRoomNumber = '101';
      const date = 'invalid-date';
      const accessToken = 'valid-token';

      try {
        await service.runProlog(option, surgeryRoomNumber, date, accessToken);
      } catch (error) {
        expect(error.message).toBe('Invalid date format');
      }
    });
  });
});