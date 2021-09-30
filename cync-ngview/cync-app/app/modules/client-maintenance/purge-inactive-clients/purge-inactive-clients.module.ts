import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurgeInactiveClientsComponent } from './purge-inactive-clients.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PurgeInactiveClientsComponent],
  exports: [PurgeInactiveClientsComponent]
})
export class PurgeInactiveClientsModule { }
