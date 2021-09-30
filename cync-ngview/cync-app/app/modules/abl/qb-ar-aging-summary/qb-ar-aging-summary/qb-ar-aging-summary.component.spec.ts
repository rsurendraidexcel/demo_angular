import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QbArAgingSummaryComponent } from './qb-ar-aging-summary.component';

describe('QbArAgingSummaryComponent', () => {
  let component: QbArAgingSummaryComponent;
  let fixture: ComponentFixture<QbArAgingSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QbArAgingSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QbArAgingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
