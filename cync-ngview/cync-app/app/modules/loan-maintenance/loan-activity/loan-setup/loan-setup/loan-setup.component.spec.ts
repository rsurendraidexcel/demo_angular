import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSetupComponent } from './loan-setup.component';

describe('LoanSetupComponent', () => {
  let component: LoanSetupComponent;
  let fixture: ComponentFixture<LoanSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
