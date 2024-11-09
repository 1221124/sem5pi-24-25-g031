import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationTypesComponent } from './operation-types.component';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
