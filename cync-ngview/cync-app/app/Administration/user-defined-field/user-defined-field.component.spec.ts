import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefinedFieldComponent } from './user-defined-field.component';

describe('UserDefinedFieldComponent', () => {
  let component: UserDefinedFieldComponent;
  let fixture: ComponentFixture<UserDefinedFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDefinedFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefinedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
