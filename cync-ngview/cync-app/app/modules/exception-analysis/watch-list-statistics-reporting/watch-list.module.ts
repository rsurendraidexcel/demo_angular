import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./watch-list.routing";
import { WatchListComponent } from './watch-list.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    WatchListComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [WatchListComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class WatchListModule { }