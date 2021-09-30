import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTiresFormComponent } from './fee-tires-form.component';

describe('FeeTiresFormComponent', () => {
  let component: FeeTiresFormComponent;
  let fixture: ComponentFixture<FeeTiresFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTiresFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTiresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
