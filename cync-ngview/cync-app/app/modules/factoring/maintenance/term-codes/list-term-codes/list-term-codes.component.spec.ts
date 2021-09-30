import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTermCodesComponent } from './list-term-codes.component';

describe('ListTermCodesComponent', () => {
  let component: ListTermCodesComponent;
  let fixture: ComponentFixture<ListTermCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTermCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTermCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
