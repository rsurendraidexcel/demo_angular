import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationProcessComponent } from './verification-process.component';
import { routing } from "./verification-process.routing";

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [VerificationProcessComponent],
  exports: [VerificationProcessComponent]
})
export class VerificationProcessModule { }