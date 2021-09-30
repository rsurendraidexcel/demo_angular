import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsEmployedComponent } from './funds-employed.component';

describe('FundsEmployedComponent', () => {
  let component: FundsEmployedComponent;
  let fixture: ComponentFixture<FundsEmployedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsEmployedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsEmployedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
