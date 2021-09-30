import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQueueComponent } from './add-edit-queue.component';

describe('AddEditQueueComponent', () => {
  let component: AddEditQueueComponent;
  let fixture: ComponentFixture<AddEditQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
