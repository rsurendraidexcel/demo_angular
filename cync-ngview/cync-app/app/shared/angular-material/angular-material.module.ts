import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog, MatSelectModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { PopupsComponent } from '@cyncCommon/component/popups/popups.component';
import { AdvanceSearchPopupComponent } from '@app/shared/components/advance-search-popup/advance-search-popup.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    //PickListModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  declarations: [
    PopupsComponent,
    AdvanceSearchPopupComponent,
    CustomDatePickerComponent
  ],
  exports: [
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [MatDialog],
  entryComponents:
    [
      PopupsComponent,
      AdvanceSearchPopupComponent,
      CustomDatePickerComponent
    ]
})

export class AngularMaterialModule { }
