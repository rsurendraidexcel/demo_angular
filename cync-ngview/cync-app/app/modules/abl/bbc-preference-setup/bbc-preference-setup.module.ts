import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BbcPreferenceSetupComponent } from './bbc-preference-setup.component';
import { routing } from "./bbc-preference-setup.routing";

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [BbcPreferenceSetupComponent],
  exports: [BbcPreferenceSetupComponent]
})
export class BbcPreferenceSetupModule { }
