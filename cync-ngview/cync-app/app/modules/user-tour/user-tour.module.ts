import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { UserTourRoutingModule } from './user-tour-routing.module';
import { UserTourViewComponent } from './user-tour-view/user-tour-view.component';
import { UserTourService } from './user-tour.service';
import { EditButtonComponent } from './user-tour-view/edit-button.component';
import { DropdownModule } from 'primeng/primeng';
@NgModule({
  declarations: [UserTourViewComponent, EditButtonComponent],
  providers:[
    UserTourService
  ],
  imports: [
    CommonModule,
    UserTourRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    AgGridModule.withComponents([EditButtonComponent]) 
  ]
})
export class UserTourModule { }
