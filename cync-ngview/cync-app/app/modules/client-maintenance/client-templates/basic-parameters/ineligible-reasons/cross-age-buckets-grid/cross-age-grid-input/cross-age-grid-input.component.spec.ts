import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossAgeGridInputComponent } from './cross-age-grid-input.component';

describe('CrossAgeGridInputComponent', () => {
  let component: CrossAgeGridInputComponent;
  let fixture: ComponentFixture<CrossAgeGridInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossAgeGridInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossAgeGridInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
