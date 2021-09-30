import { TestBed, inject } from '@angular/core/testing';

import { CustomRatiosService } from './custom-ratios.service';

describe('CustomRatiosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomRatiosService]
    });
  });

  it('should be created', inject([CustomRatiosService], (service: CustomRatiosService) => {
    expect(service).toBeTruthy();
  }));
});
