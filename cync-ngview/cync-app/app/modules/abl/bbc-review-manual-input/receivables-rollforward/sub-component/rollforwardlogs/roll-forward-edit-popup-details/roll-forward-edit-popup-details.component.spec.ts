import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollForwardEditPopupDetailsComponent } from './roll-forward-edit-popup-details.component';

describe('RollForwardEditPopupDetailsComponent', () => {
  let component: RollForwardEditPopupDetailsComponent;
  let fixture: ComponentFixture<RollForwardEditPopupDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollForwardEditPopupDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollForwardEditPopupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
