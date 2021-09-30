import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { navbarComponent } from './navbar/navbar.component';
import { AuthGuard } from '@cyncCommon/auth/auth';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GrowlModule } from 'primeng/primeng';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { DeleteModal } from '@cyncCommon/component/message/delete.modal.component';
import { MessagesModule } from 'primeng/primeng';
import { ApplicationErrorHandler } from '@cyncCommon/ExceptionHandler/ApplicationErrorHandler';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from '@cyncCommon/Pipes/searchPipe';
import { DialogModule } from 'primeng/primeng';
import { CookieService } from 'ngx-cookie-service';
import { CheckboxModule, DropdownModule } from 'primeng/primeng';
import { GridComponent } from '@cyncCommon/component/grid/grid.component'
import { exchangeRatesComponent } from '@app/Administration/currency/exchange-rates/exchange.rates.component'

import { HighlightPipePipe } from '@cyncCommon/Pipes/highlight-pipe.pipe';
import { GridHelper } from '@cyncCommon/utils/grid-helper';
import { Helper } from '@cyncCommon/utils/helper';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { APIMessagesComponent } from '@cyncCommon/component/api-messages/api-messages.component';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
/*Code Changes for Dynamic menu CYNCUXT-3269 begin*/
import { MenuListComponent } from "./navbar/menu-list.component";
import { SubMenuComponent } from "./navbar/sub-menu.component";
/*Code Changes for Dynamic menu CYNCUXT-3269 ends*/

import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { AngularMaterialModule } from '@app/shared/angular-material/angular-material.module';
import { CyncSpecificModule } from '@app/shared/cync-specific/cync-specific.module';
import { NavbarService } from '@app/navbar/service/navbar.service';
import { OnlyNumber } from '@cyncCommon/directive/only-number.directive';
import { CustomErrorComponent } from '@cyncCommon/component/custom-error/custom-error.component';
import { CustomErrorService } from '@cyncCommon/component/custom-error/custom-error.service';


import { CommonRadioComponent } from '@cyncCommon/component/common-radio-header/common-radio-header.component';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';
import { ExportPopupComponent } from '@app/Administration/user-maintenance/roles-and-permissions/export-popup/export-popup.component';
import { PickListModule } from 'primeng/primeng';
import { AppRoutingModule } from './app-routing.module';
import { CyncHttpInterceptor } from '@cyncCommon/services/cync-http-intercepter';
import { CyncCustomHttpService } from '@cyncCommon/services/cync-custom-http-service';
import { MatomoInjectorService } from '@cyncCommon/services/matomo/matomo-injector-service';
@NgModule({
  imports:
    [
      HttpClientModule,
      DropdownModule,
      CheckboxModule,
      DialogModule,
      FormsModule,
      BrowserAnimationsModule,
      BrowserModule,
      RouterModule,
      AppRoutingModule,
      CommonModule,
      GrowlModule,
      MessagesModule,
      HttpModule,
      AngularMaterialModule,
      CyncSpecificModule,
      ReactiveFormsModule,
      PickListModule
    ],
  declarations:
    [
      AppComponent,
      navbarComponent,
      MenuListComponent,
      SubMenuComponent,
      MessageServices,
      DeleteModal,
      SearchPipe,
      HighlightPipePipe,
      OnlyNumber,
      CustomErrorComponent,
      ExportPopupComponent
    ],

  bootstrap:
    [
      AppComponent
    ],
  providers:
    [
      CustomErrorService,
      RadioButtonService,
      CustomErrorComponent,
      CommonRadioComponent,
      CookieService,
      CyncCustomHttpService,
      CustomHttpService,
      MatomoInjectorService,
      {
        provide: ErrorHandler,
        useClass: ApplicationErrorHandler
      },
      AuthGuard,
      MessageServices,
      DeleteModal,
      MessageService,
      AppConfig,
      GridComponent,
      exchangeRatesComponent,
      NavbarService,
      {
        provide: APP_INITIALIZER,
        useFactory: httpFactory,
        deps: [AppConfig], multi: true
      },
      {
        provide: HTTP_INTERCEPTORS, 
        useClass: CyncHttpInterceptor,
        multi: true
      }
    ],
  entryComponents: [ExportPopupComponent]

})
export class AppModule { }

export function httpFactory(config: AppConfig) {
  return () => config.load();
}

