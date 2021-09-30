import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermCodesComponent } from './term-codes.component';

describe('TermCodesComponent', () => {
  let component: TermCodesComponent;
  let fixture: ComponentFixture<TermCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
