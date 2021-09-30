import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSetupFormComponent } from './fee-setup-form.component';

describe('FeeSetupFormComponent', () => {
  let component: FeeSetupFormComponent;
  let fixture: ComponentFixture<FeeSetupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeSetupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeSetupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
