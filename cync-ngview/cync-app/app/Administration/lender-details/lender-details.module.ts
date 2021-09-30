import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './lender-details.routing';
import { HttpModule } from  '@angular/http';
import { RouterModule } from '@angular/router';

import { LenderDetailsComponent } from  './lender-details.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    HttpModule,
    RouterModule
  ],
  declarations: [LenderDetailsComponent],
  exports : [LenderDetailsComponent]

})
export class LenderDetailsModule { }
