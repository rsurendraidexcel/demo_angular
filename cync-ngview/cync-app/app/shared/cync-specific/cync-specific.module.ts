import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Helper } from '@cyncCommon/utils/helper'
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CommonAPIs } from '@cyncCommon/utils/common.apis'
import { APIMessagesComponent } from '@cyncCommon/component/api-messages/api-messages.component';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
import { CheckClientView } from '@cyncCommon/component/ui-mgmt/check-client-view';

import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';


/* for phase 1 code base .. below is kept .. once phase1 code base is refactored , will remove below **/
import { RolesAndPermissionService } from '@cyncCommon/component/roles-and-permissions/roles-and-permissions.service';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';


/* phase1 code base end */
import { APIInternalServerErrorHandler } from '@app/shared/services/internal-server-error.service';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { AdvanceSearchPoupService } from '@app/shared/components/advance-search-popup/advance-search-popup.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations:
    [
      APIMessagesComponent
      //FormValidationComponent
    ],
  exports:
    [
      APIMessagesComponent
      //FormValidationComponent
    ],
  providers:
    [
      //FormValidationService, // this is latest
      FormvalidationService, // its old
      APIMessagesService,
      Helper,
      APIMapper,
      CommonAPIs,
      CyncHttpService,
      HttpInterceptor,
      CheckClientSelection,
      CheckClientView,
      RolesAndPermissionService,
      CheckPermissionsService,
      ClientSelectionService,
      APIInternalServerErrorHandler,
      OpenPoupService,
      AdvanceSearchPoupService
    ],
  entryComponents:
    [

    ]
})
export class CyncSpecificModule { }
