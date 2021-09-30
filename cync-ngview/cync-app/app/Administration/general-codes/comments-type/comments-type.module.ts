import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './comments-type.routing';
import { CommentsTypeComponent } from './comments-type.component';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsTypeViewComponent } from './comments-type.view.component';
import { CommentsTypeNewComponent } from './comments-type.new.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';


@NgModule({
  declarations: [
    CommentsTypeComponent,
    CommentsTypeViewComponent,
    CommentsTypeNewComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing

  ],
  exports : [CommentsTypeComponent],
  providers: [GridComponent, FormvalidationService]

})
export class CommentsTypeModule { }
