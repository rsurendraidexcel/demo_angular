import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebHooksComponent } from './web-hooks.component';
import { Routing } from './web-hooks.routing';
import { WebHooksService } from './web-hooks.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { DeleteButtonComponent } from './delete-button.component';

@NgModule({
  declarations: [WebHooksComponent,DeleteButtonComponent],
  imports: [
    CommonModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([DeleteButtonComponent])
  ],
  providers:[
    WebHooksService
  ]
})
export class WebHooksModule { }
