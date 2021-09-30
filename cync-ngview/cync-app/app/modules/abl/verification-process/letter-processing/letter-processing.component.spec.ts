import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterProcessingComponent } from './letter-processing.component';

describe('LetterProcessingComponent', () => {
  let component: LetterProcessingComponent;
  let fixture: ComponentFixture<LetterProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
