import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExceptionAnalysisComponent } from './exception-analysis.component';
import { routing } from "./exception-analysis.routing";

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [ExceptionAnalysisComponent],
  exports : [ExceptionAnalysisComponent]
})
export class ExceptionAnalysisModule { }