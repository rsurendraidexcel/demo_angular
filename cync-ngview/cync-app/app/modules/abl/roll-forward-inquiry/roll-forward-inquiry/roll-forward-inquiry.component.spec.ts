import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollForwardInquiryComponent } from './roll-forward-inquiry.component';

describe('RollForwardInquiryComponent', () => {
  let component: RollForwardInquiryComponent;
  let fixture: ComponentFixture<RollForwardInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollForwardInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollForwardInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
