import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUdfMappingComponent } from './edit-udf-mapping.component';

describe('EditUdfMappingComponent', () => {
  let component: EditUdfMappingComponent;
  let fixture: ComponentFixture<EditUdfMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUdfMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUdfMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
