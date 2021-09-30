import { TestBed } from '@angular/core/testing';

import { LetterNamesService } from './letter-names.service';

describe('LetterNamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LetterNamesService = TestBed.get(LetterNamesService);
    expect(service).toBeTruthy();
  });
});
