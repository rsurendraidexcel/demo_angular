import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanActivityComponent } from './loan-activity.component';

describe('LoanActivityComponent', () => {
  let component: LoanActivityComponent;
  let fixture: ComponentFixture<LoanActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
