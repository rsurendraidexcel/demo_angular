import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLetterNamesComponent } from './list-letter-names.component';

describe('ListLetterNamesComponent', () => {
  let component: ListLetterNamesComponent;
  let fixture: ComponentFixture<ListLetterNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLetterNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLetterNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
