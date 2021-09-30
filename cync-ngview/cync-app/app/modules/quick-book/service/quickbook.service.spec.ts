import { TestBed } from '@angular/core/testing';

import { QuickbookService } from './quickbook.service';

describe('QuickbookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuickbookService = TestBed.get(QuickbookService);
    expect(service).toBeTruthy();
  });
});
