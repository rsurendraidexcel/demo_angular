import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPreferencesComponent } from './report-preferences.component';

describe('ReportPreferencesComponent', () => {
  let component: ReportPreferencesComponent;
  let fixture: ComponentFixture<ReportPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
