import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIpAddressSetupComponent } from './list-ip-address-setup.component';

describe('ListIpAddressSetupComponent', () => {
  let component: ListIpAddressSetupComponent;
  let fixture: ComponentFixture<ListIpAddressSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIpAddressSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIpAddressSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
