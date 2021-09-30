import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddInvoiceValidationComponent } from './edit-add-invoice-validation.component';

describe('EditAddInvoiceValidationComponent', () => {
  let component: EditAddInvoiceValidationComponent;
  let fixture: ComponentFixture<EditAddInvoiceValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAddInvoiceValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddInvoiceValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
