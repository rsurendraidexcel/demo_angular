import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsInventoryComponent } from './assets-inventory.component';

describe('AssetsInventoryComponent', () => {
  let component: AssetsInventoryComponent;
  let fixture: ComponentFixture<AssetsInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
