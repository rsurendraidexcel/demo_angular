import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './participation-loans-routing';
import { ParticipationPartiesComponent } from './participation-parties/participation-parties.component';
import { ParticipationLoanDetailsComponent } from './participation-loan-details/participation-loan-details.component';
import { MapLoansComponent } from './map-loans/map-loans.component';
import { PickListModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ParticipationPartiesComponent, ParticipationLoanDetailsComponent, MapLoansComponent],
  imports: [
    CommonModule,
    routing,
    PickListModule,
    FormsModule
  ]
})
export class ParticipationLoansModule { }
