import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignIneligibleCalculationComponent } from './client-assign-ineligible-calculation.component';

describe('ClientAssignIneligibleCalculationComponent', () => {
  let component: ClientAssignIneligibleCalculationComponent;
  let fixture: ComponentFixture<ClientAssignIneligibleCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssignIneligibleCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignIneligibleCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
