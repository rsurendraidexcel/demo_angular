import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationLoanDetailsComponent } from './participation-loan-details.component';

describe('ParticipationLoanDetailsComponent', () => {
  let component: ParticipationLoanDetailsComponent;
  let fixture: ComponentFixture<ParticipationLoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipationLoanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
