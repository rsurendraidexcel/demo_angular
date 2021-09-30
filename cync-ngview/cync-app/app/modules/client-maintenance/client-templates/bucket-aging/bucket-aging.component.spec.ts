import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketAgingComponent } from './bucket-aging.component';

describe('BucketAgingComponent', () => {
  let component: BucketAgingComponent;
  let fixture: ComponentFixture<BucketAgingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketAgingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
