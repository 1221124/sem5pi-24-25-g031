import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseMenuComponent } from './nurse-menu.component';
import { provideHttpClient } from '@angular/common/http';

describe('NurseMenuComponent', () => {
  let component: NurseMenuComponent;
  let fixture: ComponentFixture<NurseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NurseMenuComponent],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
