import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTermCodesComponent } from './manage-term-codes.component';

describe('ManageTermCodesComponent', () => {
  let component: ManageTermCodesComponent;
  let fixture: ComponentFixture<ManageTermCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTermCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTermCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
