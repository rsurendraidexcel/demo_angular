import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRollForwardHistoryComponent } from './inventory-roll-forward-history.component';

describe('InventoryRollForwardHistoryComponent', () => {
  let component: InventoryRollForwardHistoryComponent;
  let fixture: ComponentFixture<InventoryRollForwardHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRollForwardHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRollForwardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
