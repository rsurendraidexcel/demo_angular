import { TestBed } from '@angular/core/testing';

import { ClientParameterService } from './client-parameter.service';

describe('ClientParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientParameterService = TestBed.get(ClientParameterService);
    expect(service).toBeTruthy();
  });
});
