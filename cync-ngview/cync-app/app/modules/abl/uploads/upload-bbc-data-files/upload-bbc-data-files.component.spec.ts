import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBBCDataFilesComponent } from './upload-bbc-data-files.component';

describe('UploadBBCDataFilesComponent', () => {
  let component: UploadBBCDataFilesComponent;
  let fixture: ComponentFixture<UploadBBCDataFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBBCDataFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBBCDataFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
