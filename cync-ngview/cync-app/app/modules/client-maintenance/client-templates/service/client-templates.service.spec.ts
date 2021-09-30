import { TestBed } from '@angular/core/testing';

import { ClientTemplatesService } from './client-templates.service';

describe('ClientTemplatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientTemplatesService = TestBed.get(ClientTemplatesService);
    expect(service).toBeTruthy();
  });
});
