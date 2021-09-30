import { TestBed } from '@angular/core/testing';

import { FactoringInterestSetupService } from './factoring-interest-setup.service';

describe('FactoringInterestSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FactoringInterestSetupService = TestBed.get(FactoringInterestSetupService);
    expect(service).toBeTruthy();
  });
});

