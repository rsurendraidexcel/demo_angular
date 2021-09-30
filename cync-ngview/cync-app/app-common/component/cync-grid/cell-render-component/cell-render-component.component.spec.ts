import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellRenderComponentComponent } from './cell-render-component.component';

describe('CellRenderComponentComponent', () => {
  let component: CellRenderComponentComponent;
  let fixture: ComponentFixture<CellRenderComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellRenderComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellRenderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
