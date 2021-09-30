import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIpAddressSetupComponent } from './manage-ip-address-setup.component';

describe('ManageIpAddressSetupComponent', () => {
  let component: ManageIpAddressSetupComponent;
  let fixture: ComponentFixture<ManageIpAddressSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIpAddressSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIpAddressSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
