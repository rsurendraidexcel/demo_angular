import { TestBed } from '@angular/core/testing';

import { CashControlService } from './cash-control.service';

describe('CashControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashControlService = TestBed.get(CashControlService);
    expect(service).toBeTruthy();
  });
});
