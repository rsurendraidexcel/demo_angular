import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCrossAgeGridInputComponent } from './multi-cross-age-grid-input.component';

describe('MultiCrossAgeGridInputComponent', () => {
  let component: MultiCrossAgeGridInputComponent;
  let fixture: ComponentFixture<MultiCrossAgeGridInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCrossAgeGridInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCrossAgeGridInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
