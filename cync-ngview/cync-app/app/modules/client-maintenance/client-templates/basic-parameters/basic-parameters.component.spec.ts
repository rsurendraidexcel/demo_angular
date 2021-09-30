import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicParametersComponent } from './basic-parameters.component';

describe('BasicParametersComponent', () => {
  let component: BasicParametersComponent;
  let fixture: ComponentFixture<BasicParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
