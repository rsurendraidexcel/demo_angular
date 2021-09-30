import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoansComponent } from './map-loans.component';

describe('MapLoansComponent', () => {
  let component: MapLoansComponent;
  let fixture: ComponentFixture<MapLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
