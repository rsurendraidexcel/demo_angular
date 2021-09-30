import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/primeng';
import { Routing } from './clients.routing';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { ClientService } from './services/client.service';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ButtonModule,
    RouterModule,
    Routing

  ],
  declarations: [
    ListClientsComponent
  ],
  exports: [
    ListClientsComponent
  ],
  providers: [ClientService]
})

export class ClientsModule { }
