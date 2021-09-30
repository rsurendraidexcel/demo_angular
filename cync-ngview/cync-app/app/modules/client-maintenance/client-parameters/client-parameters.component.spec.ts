import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientParametersComponent } from './client-parameters.component';

describe('ClientParametersComponent', () => {
  let component: ClientParametersComponent;
  let fixture: ComponentFixture<ClientParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
