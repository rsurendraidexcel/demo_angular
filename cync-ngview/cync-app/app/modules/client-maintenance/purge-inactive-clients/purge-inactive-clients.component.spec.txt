import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgeInactiveClientsComponent } from './purge-inactive-clients.component';

describe('PurgeInactiveClientsComponent', () => {
  let component: PurgeInactiveClientsComponent;
  let fixture: ComponentFixture<PurgeInactiveClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurgeInactiveClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurgeInactiveClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
