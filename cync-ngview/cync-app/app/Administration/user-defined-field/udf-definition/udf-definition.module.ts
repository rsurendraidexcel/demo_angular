import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UdfDefinitionComponent } from './udf-definition.component';
import { ListUdfDefinitionComponent } from './list-udf-definition/list-udf-definition.component';
import { ManageUdfDefinitionComponent } from './manage-udf-definition/manage-udf-definition.component';
import { UdfDefinitionService } from './services/udf-definition.service';
import { RouterModule } from '@angular/router';
import { Routing } from './udf-definition.routing';
import { DataTableModule,
	SharedModule,
	DialogModule,
	CheckboxModule,
	RadioButtonModule } from 'primeng/primeng';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		Routing,
		DataTableModule,
		SharedModule,
		DialogModule,
		CheckboxModule,
		RadioButtonModule,
		CommonComponentModule,
		FormsModule,
		ReactiveFormsModule,

	],
	declarations: [
		UdfDefinitionComponent,
		ListUdfDefinitionComponent,
		ManageUdfDefinitionComponent
	],
	providers: [UdfDefinitionService, FormvalidationService]

})
export class UdfDefinitionModule { }
