import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkExportDownloadComponent } from './bulk-export-download.component';

describe('BulkExportDownloadComponent', () => {
  let component: BulkExportDownloadComponent;
  let fixture: ComponentFixture<BulkExportDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkExportDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkExportDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
