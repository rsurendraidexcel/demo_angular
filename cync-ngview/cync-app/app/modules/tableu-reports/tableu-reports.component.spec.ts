import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableuReportsComponent } from './tableu-reports.component';

describe('TableuReportsComponent', () => {
  let component: TableuReportsComponent;
  let fixture: ComponentFixture<TableuReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableuReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableuReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
