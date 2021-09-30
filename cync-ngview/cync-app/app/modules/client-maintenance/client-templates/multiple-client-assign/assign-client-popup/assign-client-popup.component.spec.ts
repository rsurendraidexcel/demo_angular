import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClientPopupComponent } from './assign-client-popup.component';

describe('AssignClientPopupComponent', () => {
  let component: AssignClientPopupComponent;
  let fixture: ComponentFixture<AssignClientPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignClientPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignClientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
