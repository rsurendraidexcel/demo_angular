import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOtherRequiredDocumentComponent } from './upload-other-required-documents.component';

describe('UploadOtherRequiredDocumentComponent', () => {
  let component: UploadOtherRequiredDocumentComponent;
  let fixture: ComponentFixture<UploadOtherRequiredDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOtherRequiredDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOtherRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
