import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCommissionDetailComponent } from './broker-commission-detail.component';

describe('BrokerCommissionDetailComponent', () => {
  let component: BrokerCommissionDetailComponent;
  let fixture: ComponentFixture<BrokerCommissionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerCommissionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerCommissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
