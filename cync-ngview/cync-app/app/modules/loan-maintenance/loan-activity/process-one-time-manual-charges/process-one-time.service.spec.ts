import { TestBed } from '@angular/core/testing';

import { ProcessOneTimeService } from './process-one-time.service';

describe('ProcessOneTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessOneTimeService = TestBed.get(ProcessOneTimeService);
    expect(service).toBeTruthy();
  });
});
