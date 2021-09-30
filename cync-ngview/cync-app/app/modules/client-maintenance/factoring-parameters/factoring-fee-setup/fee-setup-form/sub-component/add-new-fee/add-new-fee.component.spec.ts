import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFeeComponent } from './add-new-fee.component';

describe('AddNewFeeComponent', () => {
  let component: AddNewFeeComponent;
  let fixture: ComponentFixture<AddNewFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
