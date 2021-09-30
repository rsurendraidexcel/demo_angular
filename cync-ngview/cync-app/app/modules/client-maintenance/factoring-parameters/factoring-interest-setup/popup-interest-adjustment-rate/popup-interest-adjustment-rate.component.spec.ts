import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInterestAdjustmentRateComponent } from './popup-interest-adjustment-rate.component';

describe('PopupInterestAdjustmentRateComponent', () => {
  let component: PopupInterestAdjustmentRateComponent;
  let fixture: ComponentFixture<PopupInterestAdjustmentRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupInterestAdjustmentRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupInterestAdjustmentRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
