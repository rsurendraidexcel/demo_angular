import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './udf-mapping-routing';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { ListUdfMappingComponent } from './list-udf-mapping/list-udf-mapping.component';
import { ManageUdfMappingComponent } from './manage-udf-mapping/manage-udf-mapping.component';
import { DataTableModule, AutoCompleteModule, SharedModule, DialogModule, CheckboxModule, MultiSelectModule, ListboxModule,RadioButtonModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UdfMappingService } from '@app/Administration/user-defined-field/udf-mapping/service/udf-mapping.service';
import { SortablejsModule } from 'angular-sortablejs';
import { EditUdfMappingComponent } from './edit-udf-mapping/edit-udf-mapping.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    routing,
    DataTableModule,
    SharedModule,
    DialogModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ListboxModule,
    SortablejsModule,
    RadioButtonModule,
    CommonComponentModule,
    AutoCompleteModule
  ],
  declarations: [ListUdfMappingComponent,ManageUdfMappingComponent, EditUdfMappingComponent],
  exports:[ListUdfMappingComponent],
  providers:[UdfMappingService]
})
export class UdfMappingModule { }
