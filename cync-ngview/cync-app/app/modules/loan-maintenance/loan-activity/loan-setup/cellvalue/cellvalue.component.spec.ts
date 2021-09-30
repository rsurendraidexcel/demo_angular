import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellvalueComponent } from './cellvalue.component';

describe('CellvalueComponent', () => {
  let component: CellvalueComponent;
  let fixture: ComponentFixture<CellvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
