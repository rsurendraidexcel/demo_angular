import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollfrowardAddDetailsComponent } from './rollfroward-add-details.component';

describe('RollfrowardAddDetailsComponent', () => {
  let component: RollfrowardAddDetailsComponent;
  let fixture: ComponentFixture<RollfrowardAddDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollfrowardAddDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollfrowardAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
