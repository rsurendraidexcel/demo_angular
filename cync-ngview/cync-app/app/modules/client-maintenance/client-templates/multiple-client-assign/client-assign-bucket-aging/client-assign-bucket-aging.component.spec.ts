import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignBucketAgingComponent } from './client-assign-bucket-aging.component';

describe('ClientAssignBucketAgingComponent', () => {
  let component: ClientAssignBucketAgingComponent;
  let fixture: ComponentFixture<ClientAssignBucketAgingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssignBucketAgingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignBucketAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
