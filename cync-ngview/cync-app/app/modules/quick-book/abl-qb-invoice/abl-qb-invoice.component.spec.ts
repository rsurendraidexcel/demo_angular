import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AblQbInvoiceComponent } from './abl-qb-invoice.component';

describe('AblQbInvoiceComponent', () => {
  let component: AblQbInvoiceComponent;
  let fixture: ComponentFixture<AblQbInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AblQbInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AblQbInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
