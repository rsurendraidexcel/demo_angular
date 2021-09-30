import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionComponent } from './client-transaction.component';

describe('ClientTransactionComponent', () => {
  let component: ClientTransactionComponent;
  let fixture: ComponentFixture<ClientTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
