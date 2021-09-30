import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCrossAgeBucketsGridComponent } from './multi-cross-age-buckets-grid.component';

describe('CrossAgeBucketsGridComponent', () => {
  let component: MultiCrossAgeBucketsGridComponent;
  let fixture: ComponentFixture<MultiCrossAgeBucketsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCrossAgeBucketsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCrossAgeBucketsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
