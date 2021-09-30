import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IneligibleReasonsComponent } from './ineligible-reasons.component';

describe('IneligibleReasonsComponent', () => {
  let component: IneligibleReasonsComponent;
  let fixture: ComponentFixture<IneligibleReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IneligibleReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IneligibleReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
