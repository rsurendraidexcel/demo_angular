import { TestBed, inject } from '@angular/core/testing';

import { IpAddressSetupService } from './ip-address-setup.service';

describe('IpAddressSetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpAddressSetupService]
    });
  });

  it('should be created', inject([IpAddressSetupService], (service: IpAddressSetupService) => {
    expect(service).toBeTruthy();
  }));
});
