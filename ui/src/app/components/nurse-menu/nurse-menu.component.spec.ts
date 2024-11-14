import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseMenuComponent } from './nurse-menu.component';

describe('NurseMenuComponent', () => {
  let component: NurseMenuComponent;
  let fixture: ComponentFixture<NurseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseMenuComponent]
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
