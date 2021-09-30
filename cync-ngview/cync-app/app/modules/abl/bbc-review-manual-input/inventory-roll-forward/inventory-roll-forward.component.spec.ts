import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRollForwardComponent } from './inventory-roll-forward.component';

describe('InventoryRollForwardComponent', () => {
  let component: InventoryRollForwardComponent;
  let fixture: ComponentFixture<InventoryRollForwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRollForwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRollForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
