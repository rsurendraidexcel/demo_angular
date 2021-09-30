import { TestBed } from '@angular/core/testing';

import { CyncGridService } from './cync-grid.service';

describe('CyncGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CyncGridService = TestBed.get(CyncGridService);
    expect(service).toBeTruthy();
  });
});
