import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorMenuComponent } from './doctor-menu.component';
import { provideHttpClient } from '@angular/common/http';

describe('DoctorMenuComponent', () => {
  let component: DoctorMenuComponent;
  let fixture: ComponentFixture<DoctorMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorMenuComponent],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
