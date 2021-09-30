import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadsComponent } from './uploads.component';
import { Routing } from './uploads.routing';
import { RadioButtonModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    Routing,
    RadioButtonModule,
    FormsModule,
  ],
  declarations: [UploadsComponent],
  exports: [UploadsComponent]
})
export class UploadsModule { }