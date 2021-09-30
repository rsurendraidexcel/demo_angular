import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLetterNamesComponent } from './manage-letter-names.component';

describe('ManageLetterNamesComponent', () => {
  let component: ManageLetterNamesComponent;
  let fixture: ComponentFixture<ManageLetterNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLetterNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLetterNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
