import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BbcFilesRequiredComponent } from './bbc-files-required.component';

describe('BbcFilesRequiredComponent', () => {
  let component: BbcFilesRequiredComponent;
  let fixture: ComponentFixture<BbcFilesRequiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BbcFilesRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BbcFilesRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
