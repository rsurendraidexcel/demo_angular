import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverAdvanceComponent } from './over-advance.component';

describe('OverAdvanceComponent', () => {
  let component: OverAdvanceComponent;
  let fixture: ComponentFixture<OverAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
