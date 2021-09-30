import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellrenderexampleComponent } from './cellrenderexample.component';

describe('CellrenderexampleComponent', () => {
  let component: CellrenderexampleComponent;
  let fixture: ComponentFixture<CellrenderexampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellrenderexampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellrenderexampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
