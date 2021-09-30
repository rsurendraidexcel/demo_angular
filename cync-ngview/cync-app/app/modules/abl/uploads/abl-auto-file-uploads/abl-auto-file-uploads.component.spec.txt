import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AblAutoFileUploadsComponent } from './abl-auto-file-uploads.component';

describe('AblAutoFileUploadsComponent', () => {
  let component: AblAutoFileUploadsComponent;
  let fixture: ComponentFixture<AblAutoFileUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AblAutoFileUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AblAutoFileUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
