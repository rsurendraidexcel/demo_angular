import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignBasicParameterComponent } from './client-assign-basic-parameter.component';

describe('ClientAssignBasicParameterComponent', () => {
  let component: ClientAssignBasicParameterComponent;
  let fixture: ComponentFixture<ClientAssignBasicParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssignBasicParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignBasicParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
