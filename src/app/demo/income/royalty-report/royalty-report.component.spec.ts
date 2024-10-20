import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltyReportComponent } from './royalty-report.component';

describe('RoyaltyReportComponent', () => {
  let component: RoyaltyReportComponent;
  let fixture: ComponentFixture<RoyaltyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaltyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaltyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
