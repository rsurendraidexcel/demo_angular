import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTemplateParametersCopyComponent } from './client-template-parameters-copy.component';

describe('ClientTemplateParametersCopyComponent', () => {
  let component: ClientTemplateParametersCopyComponent;
  let fixture: ComponentFixture<ClientTemplateParametersCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTemplateParametersCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTemplateParametersCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
