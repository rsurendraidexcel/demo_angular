import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormGroup,FormBuilder,Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { ExceptionService } from '../service/exceptions.service';


import { ManageExceptionsComponent } from './manage-exceptions.component';

describe('ManageExceptionsComponent', () => {
  let component: ManageExceptionsComponent;
  let fixture: ComponentFixture<ManageExceptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports :[ RouterTestingModule,
                 FormsModule,
                 ReactiveFormsModule
                ],
      declarations: [ManageExceptionsComponent ],
      providers:[ 
               FormBuilder,
               Validators,
               APIMapper,
               {provide:MessageServices,deps:[MessageService]}, 
               {provide:ExceptionService, deps:[]},
               {provide:Helper, deps:[]},
               {provide:CustomHttpService, deps:[Http]}
              ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => { 

    fixture = TestBed.createComponent(ManageExceptionsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  
  });
  
  it('should create manage-charge-codes component', () => {
    expect(component).toBeTruthy();
  });


});
