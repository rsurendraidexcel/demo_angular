import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTemplatesComponent } from './client-templates.component';

describe('ClientTemplatesComponent', () => {
  let component: ClientTemplatesComponent;
  let fixture: ComponentFixture<ClientTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
