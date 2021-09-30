import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchPopupComponent } from './advance-search-popup.component';

describe('AdvanceSearchPopupComponent', () => {
  let component: AdvanceSearchPopupComponent;
  let fixture: ComponentFixture<AdvanceSearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSearchPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
