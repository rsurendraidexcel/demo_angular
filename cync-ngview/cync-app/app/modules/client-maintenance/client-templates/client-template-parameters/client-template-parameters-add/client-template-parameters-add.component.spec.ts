import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTemplateParametersAddComponent } from './client-template-parameters-add.component';

describe('ClientTemplateParametersAddComponent', () => {
  let component: ClientTemplateParametersAddComponent;
  let fixture: ComponentFixture<ClientTemplateParametersAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTemplateParametersAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTemplateParametersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
