import { TestBed } from '@angular/core/testing';

import { UserTourService } from './user-tour.service';

describe('UserTourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserTourService = TestBed.get(UserTourService);
    expect(service).toBeTruthy();
  });
});
