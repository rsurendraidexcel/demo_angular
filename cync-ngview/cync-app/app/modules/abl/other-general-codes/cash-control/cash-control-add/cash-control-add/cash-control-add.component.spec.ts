import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashControlAddComponent } from './cash-control-add.component';

describe('CashControlAddComponent', () => {
  let component: CashControlAddComponent;
  let fixture: ComponentFixture<CashControlAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashControlAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashControlAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
