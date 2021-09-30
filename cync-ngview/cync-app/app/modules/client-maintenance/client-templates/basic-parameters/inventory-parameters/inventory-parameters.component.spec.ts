import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryParametersComponent } from './inventory-parameters.component';

describe('InventoryParametersComponent', () => {
  let component: InventoryParametersComponent;
  let fixture: ComponentFixture<InventoryParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
