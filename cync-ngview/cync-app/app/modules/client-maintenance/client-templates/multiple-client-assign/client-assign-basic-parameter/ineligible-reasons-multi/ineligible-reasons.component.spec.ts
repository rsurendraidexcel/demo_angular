import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IneligibleReasonsMultiComponent } from './ineligible-reasons-multi.component';

describe('IneligibleReasonsMultiComponent', () => {
  let component: IneligibleReasonsMultiComponent;
  let fixture: ComponentFixture<IneligibleReasonsMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IneligibleReasonsMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IneligibleReasonsMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
