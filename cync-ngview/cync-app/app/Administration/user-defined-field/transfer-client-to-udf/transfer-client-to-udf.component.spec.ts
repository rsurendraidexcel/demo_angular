import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferClientToUdfComponent } from './transfer-client-to-udf.component';

describe('TransferClientToUdfComponent', () => {
  let component: TransferClientToUdfComponent;
  let fixture: ComponentFixture<TransferClientToUdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferClientToUdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferClientToUdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
