import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringComponent } from './factoring.component';

describe('FactoringComponent', () => {
  let component: FactoringComponent;
  let fixture: ComponentFixture<FactoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
