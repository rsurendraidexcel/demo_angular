import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BBCOthersComponent } from './bbc-others.component';

describe('BBCOthersComponent', () => {
  let component: BBCOthersComponent;
  let fixture: ComponentFixture<BBCOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BBCOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BBCOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
