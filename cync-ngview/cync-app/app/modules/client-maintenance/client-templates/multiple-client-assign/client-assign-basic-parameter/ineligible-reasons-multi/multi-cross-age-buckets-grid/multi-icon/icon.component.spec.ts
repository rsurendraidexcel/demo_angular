import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiIconComponent } from './multi-icon.component';

describe('MultiIconComponent', () => {
  let component: MultiIconComponent;
  let fixture: ComponentFixture<MultiIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
