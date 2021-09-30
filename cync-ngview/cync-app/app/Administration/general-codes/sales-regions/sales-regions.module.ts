import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { routing } from './sales-regions.routing';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { SalesRegionsComponent } from './sales-regions.component';
import {SalesRegionsNewComponent} from './sales-regions.new.component';
import {SalesRegionsViewComponent} from './sales-regions.view.component';

@NgModule({
	declarations: [SalesRegionsComponent, SalesRegionsNewComponent, SalesRegionsViewComponent],
	imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  exports : [SalesRegionsComponent],
  providers: [GridComponent, FormvalidationService]
})
export class SalesRegionsModule {}
