import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routing } from './currency-code-routing';
import { ListCurrencyCodeComponent } from './list-currency-code/list-currency-code.component';
import { ManageCurrencyCodeComponent } from './manage-currency-code/manage-currency-code.component';
import { CurrencyCodeService } from './service/currency-code.service';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';


@NgModule({
  declarations:
    [ListCurrencyCodeComponent,
      ManageCurrencyCodeComponent
    ],
  imports:
    [
      CommonModule,
      CommonComponentModule,
      FormsModule,
      ReactiveFormsModule,
      Routing
    ],

  exports:
    [
      ListCurrencyCodeComponent
    ],
  providers:
    [
      CurrencyCodeService,
      FormvalidationService
    ]
})
export class CurrencyCodeModule { }
