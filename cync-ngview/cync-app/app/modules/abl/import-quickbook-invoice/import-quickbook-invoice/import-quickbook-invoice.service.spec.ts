import { TestBed } from '@angular/core/testing';

import { ImportQuickbookInvoiceService } from './import-quickbook-invoice.service';

describe('ImportQuickbookInvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportQuickbookInvoiceService = TestBed.get(ImportQuickbookInvoiceService);
    expect(service).toBeTruthy();
  });
});
