import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesRollforwardComponent } from './receivables-rollforward.component';

describe('ReceivablesRollforwardComponent', () => {
  let component: ReceivablesRollforwardComponent;
  let fixture: ComponentFixture<ReceivablesRollforwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivablesRollforwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivablesRollforwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
