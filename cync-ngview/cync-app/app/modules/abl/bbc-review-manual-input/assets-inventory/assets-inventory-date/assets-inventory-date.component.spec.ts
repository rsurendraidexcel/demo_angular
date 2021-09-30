import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsInventoryDateComponent } from './assets-inventory-date.component';

describe('AssetsInventoryDateComponent', () => {
  let component: AssetsInventoryDateComponent;
  let fixture: ComponentFixture<AssetsInventoryDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsInventoryDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsInventoryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
