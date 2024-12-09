import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationTypesComponent } from './operation-types.component'

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;

  TestBed.configureTestingModule({
    imports: [OperationTypesComponent]
  }).compileComponents();
  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
})