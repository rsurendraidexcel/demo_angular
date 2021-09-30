import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRatiosComponent } from './custom-ratios.component';

describe('CustomRatiosComponent', () => {
  let component: CustomRatiosComponent;
  let fixture: ComponentFixture<CustomRatiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRatiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
