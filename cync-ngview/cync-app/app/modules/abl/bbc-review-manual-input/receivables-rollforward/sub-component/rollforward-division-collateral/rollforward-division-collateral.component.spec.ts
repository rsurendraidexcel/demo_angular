import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollforwardDivisionCollateralComponent } from './rollforward-division-collateral.component';

describe('RollforwardDivisionCollateralComponent', () => {
  let component: RollforwardDivisionCollateralComponent;
  let fixture: ComponentFixture<RollforwardDivisionCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollforwardDivisionCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollforwardDivisionCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
