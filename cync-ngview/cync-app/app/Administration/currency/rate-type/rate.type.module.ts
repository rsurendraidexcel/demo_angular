import { NgModule } from '@angular/core';
import { rateTypeComponent } from './rate.type.component';
import { routing } from './rate.type.routing';
import {CommonModule} from '@angular/common';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { rateTypeViewComponent } from './ratetype.view.component';
import {rateTypeAddComponent} from './ratetype.add.component';
import { FormsModule } from '@angular/forms';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { OnlyNumber } from '../../../../app-common/directive/only-number.directive';

@NgModule({
  declarations: [
    rateTypeComponent,
    rateTypeViewComponent,
    rateTypeAddComponent
  ],
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    FormsModule
  ],
  exports : [rateTypeComponent],
  providers: [GridComponent]
})
export class RateTypeModule { }
