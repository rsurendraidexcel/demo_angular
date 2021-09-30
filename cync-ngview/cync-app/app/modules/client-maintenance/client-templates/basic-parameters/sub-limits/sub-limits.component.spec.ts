import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLimitsComponent } from './sub-limits.component';

describe('SubLimitsComponent', () => {
  let component: SubLimitsComponent;
  let fixture: ComponentFixture<SubLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
