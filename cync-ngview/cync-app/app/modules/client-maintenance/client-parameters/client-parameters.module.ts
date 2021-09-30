import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientParametersComponent } from './client-parameters.component';
import { ClientParametersRouting } from "./client-parameters.routing";
import { BbcFilesRequiredComponent } from './bbc-files-required/bbc-files-required.component';
import { AgGridModule } from 'ag-grid-angular';
import { MappingDropDownComponent } from './bbc-files-required/mapping-drop-down/mapping-drop-down.component';
import { ClientParameterService } from './service/client-parameter.service';
import { FileClassficationDropdownComponent } from './bbc-files-required/file-classfication-dropdown/file-classfication-dropdown.component';
import { CollateralDropDownComponent } from './bbc-files-required/collateral-drop-down/collateral-drop-down.component';
import { FrequencyDropdownComponent } from './bbc-files-required/frequency-dropdown/frequency-dropdown.component';

@NgModule({
  declarations: [ClientParametersComponent, BbcFilesRequiredComponent, MappingDropDownComponent, FileClassficationDropdownComponent, CollateralDropDownComponent, FrequencyDropdownComponent],
  imports: [
    CommonModule,
    ClientParametersRouting,
    AgGridModule.withComponents([MappingDropDownComponent, FileClassficationDropdownComponent,CollateralDropDownComponent,FrequencyDropdownComponent])
  ],
  providers:[ClientParameterService]

})
export class ClientParametersModule { }