import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashControlComponent } from './cash-control.component';

describe('CashControlComponent', () => {
  let component: CashControlComponent;
  let fixture: ComponentFixture<CashControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
