import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessOneTimeManualChargesComponent } from './process-one-time-manual-charges.component';

describe('ProcessOneTimeManualChargesComponent', () => {
  let component: ProcessOneTimeManualChargesComponent;
  let fixture: ComponentFixture<ProcessOneTimeManualChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessOneTimeManualChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOneTimeManualChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
