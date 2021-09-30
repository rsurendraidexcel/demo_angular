import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTemplateParametersComponent } from './client-template-parameters.component';

describe('ClientTemplateParametersComponent', () => {
  let component: ClientTemplateParametersComponent;
  let fixture: ComponentFixture<ClientTemplateParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTemplateParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTemplateParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
