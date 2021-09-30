import { TestBed } from '@angular/core/testing';

import { FundsEmployedService } from './funds-employed.service';

describe('FundsEmployedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FundsEmployedService = TestBed.get(FundsEmployedService);
    expect(service).toBeTruthy();
  });
});
