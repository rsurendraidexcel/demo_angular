import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCurrencyCodeComponent } from './manage-currency-code.component';

describe('ManageCurrencyCodeComponent', () => {
  let component: ManageCurrencyCodeComponent;
  let fixture: ComponentFixture<ManageCurrencyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCurrencyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCurrencyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
