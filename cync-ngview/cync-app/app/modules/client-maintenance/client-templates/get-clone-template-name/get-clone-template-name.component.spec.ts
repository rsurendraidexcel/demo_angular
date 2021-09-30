import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCloneTemplateNameComponent } from './get-clone-template-name.component';

describe('GetCloneTemplateNameComponent', () => {
  let component: GetCloneTemplateNameComponent;
  let fixture: ComponentFixture<GetCloneTemplateNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetCloneTemplateNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCloneTemplateNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
