import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactReportsComponent } from './fact-reports.component';

describe('FactReportsComponent', () => {
  let component: FactReportsComponent;
  let fixture: ComponentFixture<FactReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
