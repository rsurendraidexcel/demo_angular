import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IneligibleReasonDropDownComponent } from './ineligible-reason-drop-down.component';

describe('IneligibleReasonDropDownComponent', () => {
  let component: IneligibleReasonDropDownComponent;
  let fixture: ComponentFixture<IneligibleReasonDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IneligibleReasonDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IneligibleReasonDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
