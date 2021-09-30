import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRollForwardEntryComponent } from './edit-roll-forward-entry.component';

describe('EditRollForwardEntryComponent', () => {
  let component: EditRollForwardEntryComponent;
  let fixture: ComponentFixture<EditRollForwardEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRollForwardEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRollForwardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
