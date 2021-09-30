import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleClientAssignComponent } from './multiple-client-assign.component';

describe('MultipleClientAssignComponent', () => {
  let component: MultipleClientAssignComponent;
  let fixture: ComponentFixture<MultipleClientAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleClientAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleClientAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
