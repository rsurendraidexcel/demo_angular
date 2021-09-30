import { TestBed } from '@angular/core/testing';

import { BbcReviewService } from './bbc-review.service';

describe('BbcReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BbcReviewService = TestBed.get(BbcReviewService);
    expect(service).toBeTruthy();
  });
});
