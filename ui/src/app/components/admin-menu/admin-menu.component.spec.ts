import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMenuComponent } from './admin-menu.component';
import { provideHttpClient } from '@angular/common/http';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMenuComponent],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});