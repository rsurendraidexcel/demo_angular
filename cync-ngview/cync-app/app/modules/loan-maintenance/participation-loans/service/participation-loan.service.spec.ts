import { TestBed } from '@angular/core/testing';

import { ParticipationLoanService } from './participation-loan.service';

describe('ParticipationLoanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParticipationLoanService = TestBed.get(ParticipationLoanService);
    expect(service).toBeTruthy();
  });
});
