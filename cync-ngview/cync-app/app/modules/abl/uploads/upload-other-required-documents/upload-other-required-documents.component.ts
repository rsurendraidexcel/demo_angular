import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ABLOtherFileUploadService } from './service/upload-other-required-documents.service';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ABLOtherRequiredDoc, ABLOtherRequiredDocAPIResponse } from './model/upload-other-required-documents.model';
import { APIInternalServerErrorHandler } from '@app/shared/services/internal-server-error.service';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
  selector: 'app-abl-other-required-documents',
  templateUrl: './upload-other-required-documents.component.html',
  styleUrls: ['./upload-other-required-documents.component.scss']
})

/**
 * @author Raushan Kumar
 */
export class UploadOtherRequiredDocumentComponent implements OnInit, OnDestroy {

  otherFileUploadModel: CustomGridModel;
  assetsPath: string = CyncConstants.getAssetsPath();
  ablOtherRequiredDocAPIResponse: ABLOtherRequiredDocAPIResponse;
  isGridDataLoaded = false;
  uniqueFiles: Map<number, any> = new Map<number, any>();
  progress: { percentage: number } = { percentage: 0 };
  isFilesProcessing: boolean;
  filesQueue: Array<File> = [];
  receivedDate: Date = new Date();
  borrowerId: string;
  clientSelectionSubscription: Subscription;

  constructor(private _ablOtherFileUploadService: ABLOtherFileUploadService,
    private _apiBackedError: APIInternalServerErrorHandler,
    private _message: MessageServices,
    private _helper: Helper,
    private _popupService: OpenPoupService,
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
    this.otherFileUploadModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '', deleteApi: '', updateApi: '' },
      type: CyncConstants.OTHER_FILE_UPLOAD_TYPE,
      columnDef: [
        {
          field: 'source_documents_name', header: 'Description', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'classification', header: 'Classification', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'frequency_name', header: 'Frequency', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'next_date', header: 'Current Period', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'due_date', header: 'Due Date', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'notified', header: 'Notified', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'uploaded_folder', header: 'Uploaded Folder', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'file', header: 'Upload File', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
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
    this.getOtherFileUploads();
  }

  /**
   * This method is taken care when user will change the client or borrowers
   */
  registerReloadGridOnClientSelection() {
    if (this.otherFileUploadModel.reloadGridDataOnClientSelection) {
      const currObj = this;
      this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
        currObj.borrowerId = clientId;
        currObj.getOtherFileUploads();
      });
    }
  }

  /**
   * this method will return list of existing other required files uploaded by client
   */
  getOtherFileUploads() {
    this._message.showLoader(true);
    this._ablOtherFileUploadService.getOtherFileUploadDetails(this.borrowerId).subscribe(response => {
      this.ablOtherRequiredDocAPIResponse = response;
      this.isGridDataLoaded = true;
      this._message.showLoader(false);
    });
  }

  /**
   * This method will reset all properties whatever user changed to grid data
   */
  _resetAllProperties() {
    this.isFilesProcessing = false;
    this.uniqueFiles = new Map<number, any>();
    this.filesQueue = [];
    this.progress.percentage = 0;
    this.undoUIBindings();
  }

  /**
   * this method will undo all the ui & image binding for every mapping showin on UI
   */
  undoUIBindings() {
    this.ablOtherRequiredDocAPIResponse.reporting_documents.forEach(eachMapping => {
      if (eachMapping.uiBindings.isFileSelected) {
        eachMapping.uiBindings.isProcessingStarted = false;
        eachMapping.uiBindings.labelForSelectFile = 'Choose File';
        eachMapping.uiBindings.isFileSelected = false;
        eachMapping.uiBindings.selectedFile = null;
      }
    });
  }

  /**
   * This method will add files selected by user in a queue.
   * @param event
   * @param model
   */
  addFileInQueue(event, model: ABLOtherRequiredDoc) {
    const fileFormats = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'csv', 'pdf', 'xls', 'xlsx', 'txt', 'prn', 'html', 'tif', 'xlsm'];
    for (const file of event.target.files) {
      if (this._helper.isFileExtensionValid(file, fileFormats)) {
        this.uniqueFiles.set(model.id, file);
        model.uiBindings.selectedFile = file;
        model.uiBindings.labelForSelectFile = file.name;
        model.uiBindings.isFileSelected = true;
      }
    }
  }

  /**
   * This method will remove files from queue when user click on 'X' after upload
   * @param model
   */
  removeFileFromQueue(model: ABLOtherRequiredDoc) {
    this.uniqueFiles.delete(model.id);
    model.uiBindings.labelForSelectFile = 'Choose File';
    model.uiBindings.isFileSelected = false;
    model.uiBindings.selectedFile = null;
  }

  /**
   * If user has not selected any file , this method will return true
   */
  isFileQueueEmpty(): boolean {
    return this.uniqueFiles.size === 0;
  }

  /**
   * This method will process all the files in queue
   */
  processFiles() {
    this.progress.percentage = 0;
    const formdata: FormData = new FormData();
    formdata.append('received_date', this._helper.convertDateToString(this.receivedDate));
    formdata.append('borrower_id', this.borrowerId);
    formdata.append('append', 'true');
    this.uniqueFiles.forEach((filesObj: any, key: number) => {
      const fileuploadModel = this.getOtherFileUploadModel(key);
      const myFile = this.uniqueFiles.get(fileuploadModel.id);
      if (myFile !== undefined) {
        formdata.append('reporting_documents[][file]', myFile, myFile['name']);
      }
      formdata.append('reporting_documents[][addendum_id]', fileuploadModel.id.toString());
    });
    this.uploadFiles(formdata);
  }

  /**
   * This method will take the form data and start uploading to server
   * @param formdata
   */
  uploadFiles(formdata: FormData) {
    this.isFilesProcessing = true;
    this._ablOtherFileUploadService.uploadFile(formdata).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this._resetAllProperties();
        const popupParam = { 'title': 'File Upload', 'message': event['message'], 'msgType': 'success' };
        this._popupService.openFileUploadSuccessPopup(popupParam);
        this.reloadGridData();
      }
    });
  }

  /**
   * This method will call getOtherFileUploads method to upload grid data
   */
  reloadGridData() {
    this.getOtherFileUploads();
  }

  /**
   * This method will return the ABLOtherRequiredDoc model
   * @param id
   */
  private getOtherFileUploadModel(id: number): ABLOtherRequiredDoc {
    let model: ABLOtherRequiredDoc = null;
    for (let i = 0; i < this.ablOtherRequiredDocAPIResponse.reporting_documents.length; i++) {
      if (id === this.ablOtherRequiredDocAPIResponse.reporting_documents[i].id) {
        model = this.ablOtherRequiredDocAPIResponse.reporting_documents[i];
        break;
      }
    }
    return model;
  }

  /**
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    this.clientSelectionSubscription.unsubscribe();
  }
}