import { TestBed } from '@angular/core/testing';

import { FactoringFeeSetupService } from './factoring-fee-setup.service';

describe('FactoringFeeSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FactoringFeeSetupService = TestBed.get(FactoringFeeSetupService);
    expect(service).toBeTruthy();
  });
});
