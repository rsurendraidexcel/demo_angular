import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRollforwardEntryComponent } from './manual-rollforward-entry.component';

describe('ManualRollforwardEntryComponent', () => {
  let component: ManualRollforwardEntryComponent;
  let fixture: ComponentFixture<ManualRollforwardEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualRollforwardEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualRollforwardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
