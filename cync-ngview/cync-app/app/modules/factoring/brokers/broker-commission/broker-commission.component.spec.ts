import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCommissionComponent } from './broker-commission.component';

describe('BrokerCommissionComponent', () => {
  let component: BrokerCommissionComponent;
  let fixture: ComponentFixture<BrokerCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
