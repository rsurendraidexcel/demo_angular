import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollforwardlogsComponent } from './rollforwardlogs.component';

describe('RollforwardlogsComponent', () => {
  let component: RollforwardlogsComponent;
  let fixture: ComponentFixture<RollforwardlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollforwardlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollforwardlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
