import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianMenuComponent } from './technician-menu.component';
import { provideHttpClient } from '@angular/common/http';

describe('TechnicianMenuComponent', () => {
  let component: TechnicianMenuComponent;
  let fixture: ComponentFixture<TechnicianMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianMenuComponent],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
