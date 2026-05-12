import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StaffAlertsComponent } from './staff-alerts'; // <-- Sin .ts

describe('StaffAlertsComponent', () => {
  let component: StaffAlertsComponent;
  let fixture: ComponentFixture<StaffAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAlertsComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});