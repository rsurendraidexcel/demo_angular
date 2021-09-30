import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringInterestSetupComponent } from './factoring-interest-setup.component';

describe('FactoringInterestSetupComponent', () => {
  let component: FactoringInterestSetupComponent;
  let fixture: ComponentFixture<FactoringInterestSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringInterestSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringInterestSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
