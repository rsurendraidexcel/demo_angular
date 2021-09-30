import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceValidationTemplateComponent } from './invoice-validation-template.component';

describe('InvoiceValidationTemplateComponent', () => {
  let component: InvoiceValidationTemplateComponent;
  let fixture: ComponentFixture<InvoiceValidationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceValidationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceValidationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
