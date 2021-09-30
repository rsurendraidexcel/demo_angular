import { TestBed } from '@angular/core/testing';

import { QbArAgingSummaryService } from './qb-ar-aging-summary.service';

describe('QbArAgingSummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QbArAgingSummaryService = TestBed.get(QbArAgingSummaryService);
    expect(service).toBeTruthy();
  });
});
