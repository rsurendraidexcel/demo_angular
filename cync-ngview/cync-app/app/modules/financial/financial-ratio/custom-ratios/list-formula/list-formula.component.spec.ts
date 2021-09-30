import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormulaComponent } from './list-formula.component';

describe('ListFormulaComponent', () => {
  let component: ListFormulaComponent;
  let fixture: ComponentFixture<ListFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
