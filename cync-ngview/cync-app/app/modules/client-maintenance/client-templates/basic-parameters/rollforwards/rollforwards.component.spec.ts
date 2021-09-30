import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollforwardsComponent } from './rollforwards.component';

describe('RollforwardsComponent', () => {
  let component: RollforwardsComponent;
  let fixture: ComponentFixture<RollforwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollforwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollforwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
