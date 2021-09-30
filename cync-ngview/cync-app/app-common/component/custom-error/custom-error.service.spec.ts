import { TestBed, inject } from '@angular/core/testing';

import { CustomErrorService } from './custom-error.service';

describe('CustomErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomErrorService]
    });
  });

  it('should be created', inject([CustomErrorService], (service: CustomErrorService) => {
    expect(service).toBeTruthy();
  }));
});
