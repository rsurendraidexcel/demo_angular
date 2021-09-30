import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromToDateSearchComponent } from './from-to-date-search.component';

describe('FromToDateSearchComponent', () => {
  let component: FromToDateSearchComponent;
  let fixture: ComponentFixture<FromToDateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromToDateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromToDateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
