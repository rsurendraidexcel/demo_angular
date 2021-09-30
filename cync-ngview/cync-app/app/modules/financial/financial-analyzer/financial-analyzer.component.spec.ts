import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAnalyzerComponent } from './financial-analyzer.component';

describe('FinancialAnalyzerComponent', () => {
  let component: FinancialAnalyzerComponent;
  let fixture: ComponentFixture<FinancialAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
