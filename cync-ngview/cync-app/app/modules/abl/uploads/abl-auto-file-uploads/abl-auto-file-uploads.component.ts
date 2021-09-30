import { Component, OnInit, OnDestroy } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { APIInternalServerErrorHandler } from '@app/shared/services//internal-server-error.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { ABLAutoFileUploadService } from './service/abl-file-upload.service';
import { ABLAutoFileUpload, ABLAutoFileUploadsAPIResponse } from './model/abl-file-uploads.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
  selector: 'app-abl-auto-file-uploads',
  templateUrl: './abl-auto-file-uploads.component.html',
  styleUrls: ['./abl-auto-file-uploads.component.scss']
})

/**
 * @author Raushan Kumar
 */
export class AblAutoFileUploadsComponent implements OnInit, OnDestroy {

  autoFileUploadModel: CustomGridModel;
  ablAutoFileUploadAPIResponse: ABLAutoFileUploadsAPIResponse;
  isGridDataLoaded = false;
  borrowerId: string;
  clientSelectionSubscription: Subscription;

  constructor(private _ablAutoFileUploadService: ABLAutoFileUploadService,
    private _apiBackedError: APIInternalServerErrorHandler,
    private _message: MessageServices,
    private _helper: Helper,
    private _clientSelectionService: ClientSelectionService) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    this.initializeGrid();
    this.registerReloadGridOnClientSelection();
  }

  /**
   * This method will get called to initialize grid
   */
  initializeGrid() {
    this.autoFileUploadModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '', deleteApi: '', updateApi: '' },
      type: CyncConstants.AUTO_FILE_UPLOAD_TYPE,
      columnDef: [
        {
          field: 'file_name', header: 'File Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'uploaded_type', header: 'Upload Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false,
          filter: false
        },
        {
          field: 'uploaded_amount', header: 'Upload Amount', sortable: true, isTemplate: false, templateHtml: '', hidden: false,
          filter: false
        },
        {
          field: 'parameter_type', header: 'Parameter Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false,
          filter: false
        },
        {
          field: 'action', header: 'Actions', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false
        }
      ],
      responseKey: '',
      isSearchAvailable: false,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: false,
      isEditFunctionalityRequired: false,
      isDeleteFunctionalityRequired: false,
      isExportFunctionalityRequired: false,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: false,
      searchViaAPI: false,
      reloadGridDataOnClientSelection: true,
      menuName: '',
      isMoreIconsRequired: false
    };
    this.getAutoFileUploadDetails();
  }

  /**
   * This method is taken care when user will change the client or borrowers
   */
  registerReloadGridOnClientSelection() {
    if (this.autoFileUploadModel.reloadGridDataOnClientSelection) {
      const currObj = this;
      this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
        currObj.borrowerId = clientId;
        currObj.getAutoFileUploadDetails();
      });
    }
  }

  /**
   * this method will return list of existing auto files uploaded by client
   */
  getAutoFileUploadDetails() {
    this._message.showLoader(true);
    this._ablAutoFileUploadService.getABLAutoFileUploads(this.borrowerId).subscribe(response => {
      this.ablAutoFileUploadAPIResponse = response;
      this.isGridDataLoaded = true;
      this._message.showLoader(false);
    });
  }

  /**
   * This method will get called when we try to delete some row from grid data
   * @param model
   */
  private deleteClickedRow(model: ABLAutoFileUpload) {
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._ablAutoFileUploadService.deleteClickedRow(this.borrowerId, model.id).subscribe(popUpResult => {
          this._helper.openAlertPoup('auto file deleted', ClientValidationMessages.UNDO_DATA_BASED_ON_ROW_CLICKED);
          this.getAutoFileUploadDetails();
        });
      }
    });
  }

  /**
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    this.clientSelectionSubscription.unsubscribe();
  }
}