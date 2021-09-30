import { TestBed } from '@angular/core/testing';

import { AssetsInventoryService } from './assets-inventory.service';

describe('AssetsInventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetsInventoryService = TestBed.get(AssetsInventoryService);
    expect(service).toBeTruthy();
  });
});
