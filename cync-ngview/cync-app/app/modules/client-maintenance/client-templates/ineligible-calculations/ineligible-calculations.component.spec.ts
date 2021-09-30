import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IneligibleCalculationsComponent } from './ineligible-calculations.component';

describe('IneligibleCalculationsComponent', () => {
  let component: IneligibleCalculationsComponent;
  let fixture: ComponentFixture<IneligibleCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IneligibleCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IneligibleCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
