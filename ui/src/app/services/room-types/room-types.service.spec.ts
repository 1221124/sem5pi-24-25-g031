import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { RoomTypesService } from './room-types.service';
import { environment } from '../../../environments/environment';
import { RoomType } from '../../models/room-type.model';
import { of } from 'rxjs';

describe('RoomTypesService', () => {
  let service: RoomTypesService;
  let httpMock: jasmine.SpyObj<HttpClient>;

  const mockRoomType: RoomType = {
    Id: '1',
    RoomTypeCode: 'RT001',
    Name: 'Operating Room 1',
    Description: 'Main operating room',
    AvailableForSurgeries: true
  };

  const mockRoomTypesResponse = {
    roomTypes: [
      {
        id: '1',
        roomTypeCode: { value: 'RT001' },
        name: { value: 'Operating Room 1' },
        description: { value: 'Main operating room' },
        availableForSurgeries: true
      }
    ],
    totalItems: 1
  };

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    TestBed.configureTestingModule({
      providers: [
        RoomTypesService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });

    service = TestBed.inject(RoomTypesService);
    httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('post()', () => {
    it('should send a POST request to create a room type', async () => {
      const accessToken = 'testAccessToken';
      httpMock.post.and.returnValue(of({}));

      const response = await service.post(mockRoomType, accessToken);

      expect(httpMock.post).toHaveBeenCalledWith(
        `${environment.roomTypes}`,
        {
          Name: { Value: mockRoomType.Name },
          Description: { Value: mockRoomType.Description || '-' },
          AvailableForSurgeries: mockRoomType.AvailableForSurgeries
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      expect(response).toBeTruthy();
    });
  });

  describe('get()', () => {
    it('should send a GET request and return room types', async () => {
      const accessToken = 'testAccessToken';
      httpMock.get.and.returnValue(of(mockRoomTypesResponse));

      const result = await service.get(accessToken);

      expect(httpMock.get).toHaveBeenCalledWith(
        `${environment.roomTypes}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      expect(result.status).toBe(200);
      expect(result.body.roomTypes.length).toBe(1);
      expect(result.body.roomTypes[0].Id).toBe(mockRoomType.Id);
    });
  });
});