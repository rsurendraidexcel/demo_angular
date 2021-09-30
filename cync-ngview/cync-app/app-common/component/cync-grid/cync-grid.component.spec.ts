import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CyncGridComponent } from './cync-grid.component';

describe('CyncGridComponent', () => {
  let component: CyncGridComponent;
  let fixture: ComponentFixture<CyncGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CyncGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CyncGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
