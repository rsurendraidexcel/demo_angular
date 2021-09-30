import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTourViewComponent } from './user-tour-view.component';

describe('UserTourViewComponent', () => {
  let component: UserTourViewComponent;
  let fixture: ComponentFixture<UserTourViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTourViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTourViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
