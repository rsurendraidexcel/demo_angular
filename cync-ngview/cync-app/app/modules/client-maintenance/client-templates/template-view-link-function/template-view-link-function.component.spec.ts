import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateViewLinkFunctionComponent } from './template-view-link-function.component';

describe('TemplateViewLinkFunctionComponent', () => {
  let component: TemplateViewLinkFunctionComponent;
  let fixture: ComponentFixture<TemplateViewLinkFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateViewLinkFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateViewLinkFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
