import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationProcessComponent } from './verification-process.component';

describe('VerificationProcessComponent', () => {
  let component: VerificationProcessComponent;
  let fixture: ComponentFixture<VerificationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
