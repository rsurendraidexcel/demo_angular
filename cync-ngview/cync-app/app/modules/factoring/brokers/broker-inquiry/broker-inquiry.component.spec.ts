import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerInquiryComponent } from './broker-inquiry.component';

describe('BrokerInquiryComponent', () => {
  let component: BrokerInquiryComponent;
  let fixture: ComponentFixture<BrokerInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
