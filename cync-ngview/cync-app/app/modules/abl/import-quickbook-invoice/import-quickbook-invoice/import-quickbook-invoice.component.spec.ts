import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuickbookInvoiceComponent } from './import-quickbook-invoice.component';

describe('ImportQuickbookInvoiceComponent', () => {
  let component: ImportQuickbookInvoiceComponent;
  let fixture: ComponentFixture<ImportQuickbookInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportQuickbookInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuickbookInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
