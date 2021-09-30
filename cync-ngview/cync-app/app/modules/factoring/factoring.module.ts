import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoringComponent } from './factoring.component';
import { FactoringRoutingModule } from './factoring.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule} from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    FactoringRoutingModule,
    FormsModule,
    FileUploadModule,
  ],
  declarations: [
    FactoringComponent
  ],
  exports: [FactoringComponent],
  providers: []
})
export class FactoringModule { }

