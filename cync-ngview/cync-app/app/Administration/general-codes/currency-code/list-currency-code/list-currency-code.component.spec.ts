import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCurrencyCodeComponent } from './list-currency-code.component';

describe('ListCurrencyCodeComponent', () => {
  let component: ListCurrencyCodeComponent;
  let fixture: ComponentFixture<ListCurrencyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCurrencyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCurrencyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
