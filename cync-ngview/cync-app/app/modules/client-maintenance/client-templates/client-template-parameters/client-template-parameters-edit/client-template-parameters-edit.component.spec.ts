import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTemplateParametersEditComponent } from './client-template-parameters-edit.component';

describe('ClientTemplateParametersEditComponent', () => {
  let component: ClientTemplateParametersEditComponent;
  let fixture: ComponentFixture<ClientTemplateParametersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTemplateParametersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTemplateParametersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
