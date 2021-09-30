import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossAgeBucketsGridComponent } from './cross-age-buckets-grid.component';

describe('CrossAgeBucketsGridComponent', () => {
  let component: CrossAgeBucketsGridComponent;
  let fixture: ComponentFixture<CrossAgeBucketsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossAgeBucketsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossAgeBucketsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
