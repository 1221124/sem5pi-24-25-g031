import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestsComponent } from './operationRequests.component';

describe('OperationRequestsComponent', () => {
  let component: OperationRequestsComponent;
  let fixture: ComponentFixture<OperationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
