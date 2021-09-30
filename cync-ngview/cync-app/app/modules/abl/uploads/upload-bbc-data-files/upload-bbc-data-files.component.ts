import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadBBCDataFilesService } from './service/upload-bbc-data-files.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ABLFileUploadsAPIResponse, ABLFileUpload, RequiredSourceDocuments, DataReview, ExchangeRateData, ReExchangeRateData, ReApplyExchangeRate, ReprocessCollateralFrom } from './model/upload-bbc-data-files.model';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Router } from '@angular/router';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { navbarComponent } from '@app/navbar/navbar.component';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { MatDialog } from '@angular/material';
import { AppConfig } from '@app/app.config';
@Component({
  selector: 'app-upload-required-documents',
  templateUrl: './upload-bbc-data-files.component.html',
  styleUrls: ['./upload-bbc-data-files.component.scss']
})

/**
 * @author Ranveer Singh & Raushan Kumar
 */
export class UploadBBCDataFilesComponent implements OnInit, OnDestroy {
  exchangeRateForm: FormGroup;
  @ViewChild(DataTable) dataTableComponent: DataTable;
  uniqueUploadBBCDataFilesMap: Map<number, any> = new Map<number, any>();
  uniqueUploadBBCDataFilesImagesMap: Map<number, any> = new Map<number, any>();
  uniqueSourceDocumentFiles: Map<number, any> = new Map<number, any>();
  progress: { percentage: number } = { percentage: 0 };
  uploadBBCDataFilesQueue: Array<File> = [];
  requiredSourceDocumentFilesQueue: Array<File> = [];
  ablFileUploadAPIResponse: ABLFileUploadsAPIResponse;
  assetsPath: string = CyncConstants.getAssetsPath();
  fileUploadModel: CustomGridModel;
  requiredSourceDocumentsModel: CustomGridModel;
  isFilesProcessing: boolean;
  isGridDataLoaded = false;
  headersForExpendedRow: string[];
  allDivisionsDropDown: any;
  searchTerm = '';
  recordTotal: number;
  pageNumber = CyncConstants.DEFAULT_PAGE_NUMBER;
  rowCount: number = CyncConstants.getDefaultRowCount();
  showSpinner: boolean;
  filterRecordCount = -1;
  globalSearchCloseIcon: boolean;
  globalSearchIcon: boolean;
  bbc_dt: Date;
  division_code = '';
  isUndoPermitted: boolean;
  isExpandRowPermitted: boolean;
  isReprocessCollateralPermitted: boolean;
  borrowerId: string;
  clientSelectionSubscription: Subscription;
  currenctPeriodDate: Date;
  dueDate: Date;
  bbcYearRange: string = '';
  isCancelButtonDisable = true;
  isFileLoaded = true;
  toggleExchangeRateModal: boolean;
  exchangeRatesValueValidations = new Map<number, string>();
  selectedLayoutId: any;
  envValue: string;
  layoutFilePresent: string;
  isValidPression: boolean=false;
  isCurrentPression : number;
  invalidPdescription: string;
  borrowerReceivable: string;

  constructor(private _helper: Helper,
    private _service: UploadBBCDataFilesService,
    private _apiMapper: APIMapper,
    private _message: MessageServices,
    private _navbarComponent: navbarComponent,
    private _popupService: OpenPoupService,
    private _apiMsgService: APIMessagesService,
    private _clientSelectionService: ClientSelectionService,
    private _decimalPipe: DecimalPipe,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private config: AppConfig) {
    this.borrowerId = CyncConstants.getSelectedClient();
    this.envValue = this.config.getEnvName();
  }

  /**
   * initializing form validator
   */
  initFormValidator() {
    this.exchangeRateForm = this.fb.group({
      exchange_rates: this.fb.array([])
    });
  }

  /**
   * 
   */
  initExchangeRatesFormGrp() {
    return this.fb.group({
      currency_id: new FormControl(),
      description: new FormControl(), // Currency Name
      exchange_rate_value: new FormControl('', Validators.compose([Validators.required])), // Value 
      decimal_precision: new FormControl() // Decimal Precision
    });
  }

  ngOnInit() {
    this.initFormValidator();
    this.setDefaultDecimalPrecision();
    this.fileUploadModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: CyncConstants.CHARGE_CODES_GRID_MODEL_TYPE,
      apiDef: { getApi: '', deleteApi: '', updateApi: '' },
      columnDef: [
        {
          field: 'data_file_type', header: 'Data File Type', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'group_name', header: 'Mapping Group', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'layout_dropDown', header: 'Mapping Name', sortable: false, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'data_type', header: 'Collateral Name', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'dropDown', header: 'Select Collateral From', sortable: false, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        // {
        //   field: 'mapping_name', header: 'Mapping Name', sortable: true, isTemplate: false,
        //   templateHtml: '', hidden: false, filter: true
        // },
        {
          field: 'file_format', header: 'File Format', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'preview', header: 'View', sortable: false, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'expected_value', header: 'Expected Value', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'total_expected_value', header: 'Total Expected Value', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'uploaded_value', header: 'Total Uploaded Value', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'variance', header: 'Variance', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'file_loaded', header: '#Files', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'file', header: 'Upload File', sortable: false, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'pending_action_link', header: 'Action Pending', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'next_date', header: 'Current Period', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },
        {
          field: 'due_date', header: 'Due Date', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: true
        },


        // {
        //   field: 'total_expected_value', header: 'Total Expected Value', sortable: true, isTemplate: false,
        //   templateHtml: '', hidden: true, filter: true
        // },
        // {
        //   field: 'uploaded_value', header: 'Upload Value', sortable: true, isTemplate: false,
        //   templateHtml: '', hidden: true, filter: true
        // },
        // {
        //   field: 'borrower_receivable', header: 'Borrower Receivables', sortable: true,
        //   isTemplate: false, templateHtml: '', hidden: true, filter: true
        // },
        // {
        //   field: 'mapping_description', header: 'Description', sortable: true, isTemplate: false,
        //   templateHtml: '', hidden: false, filter: true
        // },
        // {
        //   field: 'choosen_mapping_name', header: 'Choosen Mapping Name', sortable: false, isTemplate: false,
        //   templateHtml: '', hidden: false, filter: false
        // },



        // {
        //   field: 'image_flag', header: 'Image File', sortable: false, isTemplate: false,
        //   templateHtml: '', hidden: true, filter: false
        // },
      ],
      responseKey: 'uploaded_file',
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: false,
      isEditFunctionalityRequired: false,
      isDeleteFunctionalityRequired: false,
      isExportFunctionalityRequired: false,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: true,
      reloadGridDataOnClientSelection: true,
      menuName: CyncConstants.ABL_FILE_UPLOAD_MENU_NAME,
      permissionRequired: true,
    };

    this.requiredSourceDocumentsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: CyncConstants.CHARGE_CODES_GRID_MODEL_TYPE,
      apiDef: { getApi: '', deleteApi: '', updateApi: '' },
      columnDef: [
        {
          field: 'source_documents_name', header: 'Source File', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        },
        {
          field: 'frequency', header: 'Frequency', sortable: true, isTemplate: false,
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
          field: 'file', header: 'Upload File', sortable: true, isTemplate: false,
          templateHtml: '', hidden: false, filter: false
        }
      ],
      responseKey: 'bbc_document',
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: false,
      isEditFunctionalityRequired: false,
      isDeleteFunctionalityRequired: false,
      isExportFunctionalityRequired: false,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: true,
      reloadGridDataOnClientSelection: true,
      menuName: CyncConstants.ABL_FILE_UPLOAD_MENU_NAME,
      permissionRequired: true,
    };

    this.getPermissions();
    this.registerReloadGridOnClientSelection();
    this.getDivisionDropdownValues();
    //this.getABLUploads();
    this.initABLUploads();
  }

  customWidth(columnName){
      if(columnName == 'due_date'){
          return 'adjust-width_for_due_date';
      }
      if(columnName == 'next_date'){
        return 'adjust-width_for_next_date';
    }
  }

  /**
  * This method is used to call ABL upload data api and checking multiple user login or not.
  * This method is executing only once while loading page.
  */
  initABLUploads() {
    this._message.showLoader(true);
    this._service.getABLUploads(this.getABLUploadEndpoint()).subscribe(response => {
      this._service.getSameClientLoginInfo().subscribe(result => {
        let isMultiUserLoggedIn = result.multi_user_alert;
        if (isMultiUserLoggedIn) {
          if (confirm("Another user is viewing the same page. Do you want to continue?")) {
            this.renderFileUploadResponse(response);
          } else {
            this._message.showLoader(false);
            window.location.href = '../../';
          }
        } else {
          this.renderFileUploadResponse(response);
        }
      });
    });
  }

  /**
  * This method is used to bind file upload api response.
  */
  renderFileUploadResponse(response: any) {
    this.ablFileUploadAPIResponse = response;
    this.isGridDataLoaded = true;
    this.recordTotal = response.recordTotal;
    this.selectedLayoutId = this.ablFileUploadAPIResponse.uploaded_file.length===0 ? this.ablFileUploadAPIResponse.uploaded_file : this.ablFileUploadAPIResponse.uploaded_file[0].mapping_id;
    this.showBBCDate();
    this._message.showLoader(false);
    this.initFormValidator();
    this.populateExchangeRates();
  }

  /**
   * This method is taken care when user will change the client or borrowers
   */
  registerReloadGridOnClientSelection() {
    if (this.requiredSourceDocumentsModel.reloadGridDataOnClientSelection && this.fileUploadModel.reloadGridDataOnClientSelection) {
      const currObj = this;
      this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
        this._message.showLoader(true);
        if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
          setTimeout(function () {
            window.location.href = '../../';
          }, 2000);
        } else {
          const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', clientId);
          this._service.getBorrowerDetails(url).subscribe(data => {
            if (data !== undefined && data.borrower !== undefined
              && data.borrower.processing_type !== undefined
              && data.borrower.processing_type !== null
              && this._helper.compareIgnoreCase(data.borrower.processing_type, CyncConstants.FACTORING_PROCESSING_TYPE)) {
              setTimeout(function () {
                window.location.href = '../../factoring/dashboard';
              }, 2000);
            } else {
              this.searchTerm = '';
              this.globalSearchCloseIcon = false;
              this.globalSearchIcon = false;
              currObj.borrowerId = clientId;
              currObj.getDivisionDropdownValues();
              currObj.getABLUploads();
            }
          });
        }
      });
    }
  }

  /**
   * This method will get menu permissions based on user logged in
   */
  getPermissions() {
    const roleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
    if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
      this._service.getMenuPermission().subscribe(permissionsResponse => {
        this.isUndoPermitted = this._service.getUndoPermission(permissionsResponse);
        this.isExpandRowPermitted = this._service.getExpandRowPermission(permissionsResponse);
        this.isReprocessCollateralPermitted = this._service.getReprocessCollateralPermission(permissionsResponse);
      });
    } else {
      this.isUndoPermitted = true;
      this.isExpandRowPermitted = true;
      this.isReprocessCollateralPermitted = true;
    }
  }

  /**
   * This method will get called when user clicks on exchange rate popup apply button
   * @param exchangeRate
   */
  applyExchangeRate(exchangeRate: any[]) {

    if (this.exchangeRateForm.valid) {
      if (exchangeRate.hasOwnProperty('exchange_rates')) {
            let exRate = exchangeRate['exchange_rates'];
            let checklist=[];

            exRate.forEach(elm => {
                let k = elm.exchange_rate_value.split('.')[1].length;
                if (k > elm.decimal_precision){
                    checklist.push({'currency_id': elm.currency_id, 'description': elm.description,'precision': elm.decimal_precision, 'current_pression': k });
                   } 
            });

            if(checklist.length==0){
              this.isValidPression=false;
              this.ablFileUploadAPIResponse.exchange_rates = exchangeRate['exchange_rates'];
            }else{
              console.log(checklist);
              this.invalidPdescription = checklist[0].description;
              this.isCurrentPression = checklist[0].precision;
              this.isValidPression=true;

              return false;
            }

      } else {
        this.ablFileUploadAPIResponse.exchange_rates = exchangeRate
      }

      let modelArray = [];
      this.ablFileUploadAPIResponse.exchange_rates.forEach(rate => {
        let model = new ReExchangeRateData();
        model.currency_id = rate.currency_id;
        model.exchange_rate_value = rate.exchange_rate_value;
        modelArray.push(model);
      });
      let model = new ReApplyExchangeRate();
      model.exchange_rates = modelArray;
      model.borrower_id = this.borrowerId;
      const url = this._apiMapper.endpoints[CyncConstants.RECALCULATE_EXCHANGE_RATE];
      this._service.reApplyExchangeRate(url, model).subscribe(res => {
        if (res.status === 204) {
          this.toggleExchangeRateModal = false;
          this._helper.openAlertPoup('Information', ClientValidationMessages.EXCHANGE_RATE_SUCCESS);
        }
      });

    }
  }

  /**
   * this method will return list of existing files uploaded by client
   */
  getABLUploads() {
    this._message.showLoader(true);
    this._service.getABLUploads(this.getABLUploadEndpoint()).subscribe(response => {
      this.ablFileUploadAPIResponse = response;
      this.isGridDataLoaded = true;
      this.recordTotal = response.recordTotal;
      this.showBBCDate();
      this._message.showLoader(false);
      this.initFormValidator();
      this.populateExchangeRates();
    });
  }

  /**
   * This method will get called to populate exchange rate data to popup
   */
  populateExchangeRates() {
    let exchangeRatesArray = <FormArray>this.exchangeRateForm.controls['exchange_rates'];
    this.ablFileUploadAPIResponse.exchange_rates.forEach(exchangeRate => {
      const fb = this.initExchangeRatesFormGrp();
      let pattern = this.exchangeRatesValueValidations.get(exchangeRate.decimal_precision);
      fb.controls['exchange_rate_value'].setValidators(Validators
        .compose([Validators.required,
        Validators.pattern(pattern)]));
      exchangeRatesArray.push(fb);
      fb.patchValue(exchangeRate);
    });
  }

  /**
   * this method will get the value from specific header key from expended row data
   * @param headerName 
   * @param expendedRowData 
   */
  getHeadersValue(headerName: string, expendedRowData: any): string | number {
    if (expendedRowData != undefined && expendedRowData.hasOwnProperty(headerName)) {
      return this.maskAmountInFormat(expendedRowData[headerName]);
    }
  }

  /**
   * This method will get caleed to mask number correctly
   * @param amountValue 
   */
  maskAmountInFormat(amountValue: string | number): string {
    let formatedValue = this._decimalPipe.transform(amountValue, '.2');
    if (formatedValue.indexOf('-') !== -1) {
      return "(" + formatedValue.replace('-', '') + ")";
    } else {
      return formatedValue;
    }
  }

  /**
   * this will show bbc date
   */
  showBBCDate() {
    if (this.ablFileUploadAPIResponse.uploaded_file.length > 0) {
      this.bbc_dt = this._helper.convertStringToDateWithoutTz(this.ablFileUploadAPIResponse.uploaded_file[0].bbc_date);
      //this.bbcYearRange = '2000:' + this.bbc_dt.getFullYear().toString();
      this.bbcYearRange = (this.bbc_dt.getFullYear() - 10) + ':' + (this.bbc_dt.getFullYear() + 10);
    }
  }

  /**
   * This method will get called to generate final apiEndPoints
   */
  getABLUploadEndpoint(): string {
    let endPoint = this._apiMapper.endpoints[CyncConstants.GET_UPLOAD_BBC_DATA_FILES];
    endPoint = endPoint.replace('{clientId}', this.borrowerId);
    endPoint = endPoint.replace('{searchTerm}', this.searchTerm);
    endPoint = endPoint.replace('{order_by}', 'data_type');
    endPoint = endPoint.replace('{sort_by}', 'asc');
    endPoint = endPoint.replace('{page}', this.pageNumber);
    endPoint = endPoint.replace('{rows}', this.rowCount);
    if (this.division_code !== undefined && this.division_code !== '') {
      endPoint = endPoint + '&division_code_id=' + this.division_code;
    }
    return endPoint;
  }

  /**
   * This method will get called to relod grid data
   */
  reloadGridData() {
    this.isCancelButtonDisable = true;
    this.getABLUploads();
  }

  /**
   * this method will reset all the properties and start from scratch
   */
  _resetAllProperties() {
    this.isFilesProcessing = false;
    this.uniqueUploadBBCDataFilesMap = new Map<number, any>();
    this.uploadBBCDataFilesQueue = [];
    this.progress.percentage = 0;
    this.uniqueUploadBBCDataFilesImagesMap = new Map<number, any>();
    this.uniqueSourceDocumentFiles = new Map<number, any>();
    this.requiredSourceDocumentFilesQueue = [];
    this.division_code = '';
    this.undoUIBindings();
  }

  /**
	 * Method that gets called on scroll
   * @param event
	 */
  onScroll(event) {
    let load_more = false;
    this._helper.fixTableHeader(event.target, this.fileUploadModel.isAdvanceSearchAvailable);
    if (this._helper.isScollbarAtBottom(CyncConstants.P_DATA_TABLE_NEW_ELEMENT_ID)) {
      load_more = true;
    } else {
      load_more = false;
    }
    if (load_more === true && this.ablFileUploadAPIResponse.uploaded_file.length < this.recordTotal) {
      this.pageNumber = this.pageNumber + 1;
      if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
        this.showSpinner = true;
      }
      const url = this.getABLUploadEndpoint();
      this._service.getABLUploads(url).subscribe(data => {
        if (data.uploaded_file.length > 0) {
          this.ablFileUploadAPIResponse.uploaded_file = this.ablFileUploadAPIResponse.uploaded_file.concat(data.uploaded_file);
        }
        this.showSpinner = false;
      });
    }
  }

  /**
	 * Method that gets called for global search
	 * @param event
	 */
  globalSearch(event: any) {
    if (this.searchTerm === CyncConstants.BLANK_STRING || this.searchTerm === undefined || this.searchTerm === null) {
      this.searchTerm = '';
      this.globalSearchCloseIcon = false;
      this.globalSearchIcon = true;
    } else {
      this.globalSearchCloseIcon = true;
      this.globalSearchIcon = false;
    }
    const url = this.getABLUploadEndpoint();
    this._service.getABLUploads(url).subscribe(data => {
      this.ablFileUploadAPIResponse = data;
    });
  }

  /**
   * If user has not selected any file , this method will return true
   */
  isFileQueueEmpty(): boolean {
    this.isFileLoaded = false;
    return this.uniqueUploadBBCDataFilesMap.size === 0 && this.uniqueUploadBBCDataFilesImagesMap.size === 0 &&
      this.uniqueSourceDocumentFiles.size === 0;
  }

  /**
   * To open notification popup
   * @param fileId
   */
  openNotification(fileId: number) {
    this._navbarComponent.getUploadedFileNotification(fileId);
  }

  /**
   * This method will add files selected by user in a queue.
   * @param event
   * @param model
   */
  addFileInQueue(event, model: ABLFileUpload) {
    this.borrowerReceivable = model.borrower_receivable;
    if (model.data_file_type == 'AR Summary' && model.detail_client == true) {
      this._helper.openAlertPoup('Unsupported File Format', model.mapping_name + ClientValidationMessages.UPLOAD_BBC_DATA_FILES_BBC_SUPPORTED_FILE);
    } else {
      for (const file of event.target.files) {
        if (this._helper.isFileExtensionValid(file, [model.file_format])) {
          this.uniqueUploadBBCDataFilesMap.set(model.id, file);
          model.uiBindings.selectedFile = file;
          model.uiBindings.labelForSelectFile = file.name;
          model.uiBindings.isFileSelected = true;
          this.isCancelButtonDisable = false;
        }
      }
    }
  }

  /**
   * This method will add files selected by user in a queue.
   * @param event
   * @param model
   */
  addBBCDataFileImageInQueue(event, model: ABLFileUpload) {
    for (const file of event.target.files) {
      if (this._helper.isFileHaveZIPExtension(file, 'zip')) {
        this.uniqueUploadBBCDataFilesImagesMap.set(model.id, file);
        model.imageBindings.selectedFile = file;
        model.imageBindings.labelForSelectFile = file.name;
        model.imageBindings.isFileSelected = true;
        this.isCancelButtonDisable = false;
      }
    }
  }

  /**
   * this method will add required source documents
   * @param event
   * @param model
   */
  addRequiredSourceDocumentInQueue(event, model: RequiredSourceDocuments) {
    const fileFormats = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'csv', 'pdf', 'xls', 'xlsx', 'txt', 'prn', 'html', 'tif', 'xlsm'];
    for (const file of event.target.files) {
      if (this._helper.isFileExtensionValid(file, fileFormats)) {
        this.uniqueSourceDocumentFiles.set(model.id, file);
        model.uiBindings.selectedFile = file;
        model.uiBindings.labelForSelectFile = file.name;
        model.uiBindings.isFileSelected = true;
        this.isCancelButtonDisable = false;
      }
    }
  }

  /**
   * this method is to remove file form queue for particular model
   * @param model
   */
  removeFileFromQueue(model: ABLFileUpload) {
    this.uniqueUploadBBCDataFilesMap.delete(model.id);
    model.uiBindings.labelForSelectFile = 'Choose File';
    model.uiBindings.isFileSelected = false;
    model.uiBindings.selectedFile = null;
  }

  /**
   * this method is to remove soruce document file form queue for particular model
   * @param model
   */
  removeSourceDocumentFromQueue(model: RequiredSourceDocuments) {
    this.uniqueSourceDocumentFiles.delete(model.id);
    model.uiBindings.labelForSelectFile = 'Choose File';
    model.uiBindings.isFileSelected = false;
    model.uiBindings.selectedFile = null;
  }

  /**
   * this method is to remove image file form queue for particular model
   * @param model
   */
  removeBBCDataFileImageInQueue(model: ABLFileUpload) {
    this.uniqueUploadBBCDataFilesImagesMap.delete(model.id);
    model.imageBindings.labelForSelectFile = 'Choose File';
    model.imageBindings.isFileSelected = false;
    model.imageBindings.selectedFile = null;
  }

  /**
   * this method will validate the uploaded files and any other validations
   */
  private validateBBCDataFiles(): boolean {
    let keepGoing = true;
    if (this.bbc_dt === undefined) {
      this._helper.openAlertPoup('bbc date selection', ClientValidationMessages.UPLOAD_BBC_DATA_FILES_BBC_DATE_REQUIRED);
      keepGoing = false;
    }
    const uploadedImagesKeys: number[] = Array.from(this.uniqueUploadBBCDataFilesImagesMap.keys());
    for (let i = 0; i < uploadedImagesKeys.length; i++) {
      const fileuploadModel = this.getBBCDataFileModel(uploadedImagesKeys[i]);
      if (this.uniqueUploadBBCDataFilesMap.get(fileuploadModel.id) === undefined ||
        this.uniqueUploadBBCDataFilesMap.get(fileuploadModel.id) === null) {
        this._helper.openAlertPoup('BBC file uploads', ClientValidationMessages.UPLOAD_BBC_DATA_FILES_ONLY_UPLOAD_IMAGE_NOT_REQUIRED);
        keepGoing = false;
        break;
      }
    }
    return keepGoing;
  }

  /**
   * This method is getting called to get popUp is file is already uploaded for same collateral
   */
  private isFileAlreadyUploaded() {
    let uploadedFilesData = this.ablFileUploadAPIResponse.uploaded_file;
    let br=this.borrowerReceivable;
    const fileuploadModelIds: number[] = Array.from(this.uniqueUploadBBCDataFilesMap.keys());
    // let filteredRows = uploadedFilesData.filter(f =>
    //   fileuploadModelIds != undefined && fileuploadModelIds.length > 0 && fileuploadModelIds.indexOf(f.id) != -1 && f.file_loaded > 0
    // );
    let filteredRows = uploadedFilesData.filter(f =>{
      if(f.layouts.length===1){ return (f.borrower_receivable===br && fileuploadModelIds[0]== f.id);}
      if(f.layouts.length >1){ return (f.borrower_receivable===br && fileuploadModelIds[0]== f.id);}
    });

    if (filteredRows != undefined  && filteredRows.length!=0) {
      //const collateralNames = filteredRows.map(f => f.mapping_name);
        if(filteredRows[0].file_loaded > 0){
              const collateralNames = filteredRows.filter(obj => {
                    if(obj.layoutName == '' || obj.layoutName == null || obj.layoutName == undefined){
                      return false;
                    }
                    return true;
              }).map(function(obj) { return obj.layoutName });

              const popupParam = { 'title': ClientValidationMessages.UPLOAD_BBC_DATA_APPEND_OVERRIDE, 'message': collateralNames, 'msgType': 'information' };
              this._popupService.openPopupWithAppendOverrideButton(popupParam).subscribe(result => {
                if (result !== undefined) {
                  this.proceedFileData(result);
                }
              });
          }else {
            this.proceedFileData(true);
          }
      
    } else {
      this.proceedFileData(true);
    }
  }

  /**
   * This method will open popup for exchange rate
   */
  private isExchangeRateRequired() {
    let keepGoing = true;
    let uploadedFilesData = this.ablFileUploadAPIResponse.uploaded_file;
    const fileuploadModelIds: number[] = Array.from(this.uniqueUploadBBCDataFilesMap.keys());
    let filteredRows = uploadedFilesData.filter(f =>
      fileuploadModelIds != undefined && fileuploadModelIds.length > 0 && fileuploadModelIds.indexOf(f.id) != -1 && f.exchange_rates_flag == true
    );
    if (filteredRows != undefined && filteredRows.length > 0 && !this.exchangeRateForm.valid) {
      this._helper.openAlertPoup('Exchange Rate Validation', ClientValidationMessages.EXCHANGE_RATE_VALIDATION_MSG);
      keepGoing = false;
    }
    return keepGoing;
  }

  /**
   * This method will process all the files in queue
   */
  processFiles() {
    if (!this.validateBBCDataFiles()) {
      return;
    }
    if (!this.isExchangeRateRequired()) {
      return;
    }
    this.isFileAlreadyUploaded();
  }

  /**
   * This method get called when we click on Append or Override
   * @param result
   */
  proceedFileData(result: boolean) {
    this.progress.percentage = 0;
    const formdata: FormData = new FormData();
    formdata.append('bbc_dt', this._helper.convertDateToStringWithoutTz(this.bbc_dt));
    formdata.append('borrower_id', this.borrowerId);
    formdata.append('append', result.toString());
    this.uniqueUploadBBCDataFilesMap.forEach((filesObj: any, key: number) => {
      const fileuploadModel = this.getBBCDataFileModel(key);
      const myImgFile = this.uniqueUploadBBCDataFilesImagesMap.get(fileuploadModel.id);
      formdata.append('uploaded_file[][expected_value]', fileuploadModel.expected_value.toString());
      formdata.append('uploaded_file[][borrower_id]', this.borrowerId);
      formdata.append('uploaded_file[][type]', 'AblUpload');
      //formdata.append('uploaded_file[][data_type]', fileuploadModel.data_type);
      formdata.append('uploaded_file[][mapping_id]', fileuploadModel.mapping_id.toString());
      formdata.append('uploaded_file[][file]', filesObj, filesObj['name']);
      if (fileuploadModel.select_collateral_from == null) {
        fileuploadModel.select_collateral_from = fileuploadModel.default_select_collateral;
      }
      formdata.append('uploaded_file[][select_collateral_from]', this.replaceNullValuesForFormData(fileuploadModel.select_collateral_from));
      if (myImgFile !== undefined) {
        formdata.append('uploaded_file[][image_file]', myImgFile, myImgFile['name']);
      }
      //formdata.append('uploaded_file[][layout_id]', this.selectedLayoutId);
      formdata.append('uploaded_file[][layout_id]', fileuploadModel.layoutID.toString());
      formdata.append('uploaded_file[][borrower_receivable]', this.borrowerReceivable);
    });

    this.uniqueSourceDocumentFiles.forEach((value: any, key: number) => {
      const requiredSourceDocModel = this.getBBCDocumentModel(key);
      const myFile = this.uniqueSourceDocumentFiles.get(requiredSourceDocModel.id);
      formdata.append('bbc_document[][addendum_id]', requiredSourceDocModel.id.toString());
      formdata.append('bbc_document[][borrower_id]', this.borrowerId);
      formdata.append('bbc_document[][file]', myFile, myFile['name']);
    });

    this.ablFileUploadAPIResponse.exchange_rates.forEach(rate => {
      formdata.append('exchange_rates[][currency_id]', rate.currency_id.toString());
      formdata.append('exchange_rates[][exchange_rate_value]', rate.exchange_rate_value != null ? rate.exchange_rate_value.toString() : rate.exchange_rate_value);
    });
    this.uploadFiles(formdata);
  }

  /**
   * This method for replacing null value with empty string
   * @param value
   */
  replaceNullValuesForFormData(value: any): any {
    if (value === null || value === undefined) {
      value = '';
    }
    return value;
  }

  /**
   * This method will take the form data and start uploading to server
   * @param formdata
   */
  uploadFiles(formdata: FormData) {
    this.isFilesProcessing = true;
    this._service.uploadFile(formdata).catch(errorResponse => {
      if (errorResponse !== undefined && errorResponse.error != undefined && errorResponse.error.error != undefined && errorResponse.error.error.message != undefined) {
        this._apiMsgService.add(new APIMessage('danger', errorResponse.error.error.message));
        this.progress.percentage = 0;
      }
      return Observable.throw(errorResponse);
    }).subscribe(event => {
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
   * this method will update the processing icon on IU
   */
  updateUIWithFileProcessingIcon() {
    this.ablFileUploadAPIResponse.uploaded_file.forEach(eachMapping => {
      if (eachMapping.uiBindings.isFileSelected) {
        eachMapping.uiBindings.isProcessingStarted = true;
      }
    });
  }

  /**
   * this method will undo all the ui & image binding for every mapping showin on UI
   */
  undoUIBindings() {
    this.ablFileUploadAPIResponse.uploaded_file.forEach(eachMapping => {
      if (eachMapping.uiBindings.isFileSelected) {
        eachMapping.uiBindings.isProcessingStarted = false;
        eachMapping.uiBindings.labelForSelectFile = 'Choose File';
        eachMapping.uiBindings.isFileSelected = false;
        eachMapping.uiBindings.selectedFile = null;
        /* below is to undo image binding */
        eachMapping.imageBindings.selectedFile = null;
        eachMapping.imageBindings.labelForSelectFile = 'Choose File';
        eachMapping.imageBindings.isFileSelected = false;
      }
    });
  }

  /**
   * This method will fetch the expended row data for requrested id
   * @param event
   */
  loadlazy(event) {
    this.isCancelButtonDisable = false;
    if (this.isExpandRowPermitted) {
      event.data.uiBindings.expendedId = event.data.mapping_id;
      this.getDataOnRowExpand(event.data.mapping_id, event.data.data_type, event.data);
    } else {
      this._apiMsgService.add(new APIMessage('danger', ClientValidationMessages.EXPAND_ROW_USER_PERMISSION));
    }
  }

  /**
   * This method will get called when we click on expend icon
   * @param mapping_id
   * @param data_type
   * @param whereToadd
   */
  getDataOnRowExpand(mapping_id: number, data_type: string, whereToadd: any) {
    this._service.getDataReviewData(this.borrowerId, mapping_id, data_type).subscribe(rowData => {
      if (rowData !== undefined && rowData['data_review'] !== undefined) {
        whereToadd.uiBindings.expendedRowData = rowData['data_review'];
        whereToadd.uiBindings.headers = rowData['headers'];
      }
    });
  }

  /**
   * This method will get called when we try to undo some records in data review screen
   * @param mapping_id
   * @param data_type
   * @param whereToadd
   */
  reloadDataForExpendedRow(mapping_id: number, data_type: string, whereToadd: any) {
    this.getDataOnRowExpand(mapping_id, data_type, whereToadd);
  }

  /**
   * This method will get called to update expected value based on what user entered in text-field
   * @param expected_value
   * @param model
   */
  private updateExpectedValue(expected_value: number, model: ABLFileUpload) {
    model.expected_value = expected_value;
    this.isCancelButtonDisable = false;
  }

  /**
   * This method will get called when user try to select different value from drop down
   * @param value
   * @param model
   */
  private updateCollateralFrom(value: string, model: ABLFileUpload) {
    this.isCancelButtonDisable = false;
    model.select_collateral_from = value;
  }

  /**
 * This method will get called when user try to select different value from drop down
 * @param value
 * @param model
 */
  private updateSelectedLayout(value: string, model: ABLFileUpload) {
    this.isCancelButtonDisable = false;
    this.selectedLayoutId = value;
    console.log("this.selectedLayoutId" + this.selectedLayoutId);
    let filterResult = (model.layouts).filter(obj => {
      return obj.layout_id == value
    })
    if(filterResult.length > 0){
      model.layoutName = filterResult[0].layout_name;
      model.layoutFilePresent = filterResult[0].file_present;
    }else{
      model.layoutName = '';
      model.layoutFilePresent = false;
    }
    // model.select_collateral_from = value;
  }

  /**
   * this method will get called to get all division value based on client selection
   */
  private getDivisionDropdownValues() {
    this._service.getDivisionDropdownValues(this.borrowerId).subscribe(data => {
      this.allDivisionsDropDown = data.divisionscode;
    });
  }

  /**
   * This method will get called when user try to undo some records
   * @param id
   * @param model
   */
  private undoExpendedRowDataFiles(id: number, model: ABLFileUpload) {
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._service.undoExpendedRowDataFiles(this.borrowerId, id).subscribe(popUpResponse => {
          this._helper.openAlertPoup('file mapping deleted', ClientValidationMessages.UNDO_DATA_BASED_ON_ROW_CLICKED);
          this.reloadDataForExpendedRow(model.mapping_id, model.data_type, model);
          this.reloadGridData();
        });
      }
    });
  }

  /**
   * This method will get called to get ABLFileUpload model
   * @param id
   */
  private getBBCDataFileModel(id: number): ABLFileUpload {
    let model: ABLFileUpload = null;
    for (let i = 0; i < this.ablFileUploadAPIResponse.uploaded_file.length; i++) {
      if (id === this.ablFileUploadAPIResponse.uploaded_file[i].id) {
        model = this.ablFileUploadAPIResponse.uploaded_file[i];
        break;
      }
    }
    return model;
  }

  /**
   * This method will get called to get RequiredSourceDocuments model
   * @param id
   */
  private getBBCDocumentModel(id: number): RequiredSourceDocuments {
    let model: RequiredSourceDocuments = null;
    for (let i = 0; i < this.ablFileUploadAPIResponse.bbc_document.length; i++) {
      if (id === this.ablFileUploadAPIResponse.bbc_document[i].id) {
        model = this.ablFileUploadAPIResponse.bbc_document[i];
        break;
      }
    }
    return model;
  }

  /**
   * Method to clear the global search
   */
  clearSearchBox() {
    this.dataTableComponent.reset();
    this.pageNumber = 1;
    this._helper.scrollTopDataTable(CyncConstants.P_DATA_TABLE_NEW_ELEMENT_ID);
    this.searchTerm = '';
    this.globalSearchCloseIcon = false;
    this.globalSearchIcon = true;
    this.filterRecordCount = -1;
    this.reloadGridData();
  }

  /**
	 * This method is used to update the record count when column filter is used
	 * @param event
	 */
  printFilteredData(event) {
    if (event.filteredValue !== undefined) {
      this.filterRecordCount = event.filteredValue.length;
      if (this.filterRecordCount === this.ablFileUploadAPIResponse.uploaded_file.length) {
        this.filterRecordCount = -1;
      }
    }
  }

  /**
   * This method will get called when we try to select some value from division dropdown
   * @param id
   */
  getDivisionId(id: number) {
    this.division_code = id.toString();
    this.reloadGridData();
    this.isCancelButtonDisable = false;
  }

  /**
   * This method will get called when we click on cancel button
   */
  cancelUpdatedValue() {
    this._resetAllProperties();
    this.reloadGridData();
    this.isCancelButtonDisable = true;
  }

  /**
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    this.clientSelectionSubscription.unsubscribe();
  }

  /**
   * This method will get called when user try to search some date at column date
   * @param $event
   * @param dt
   * @param col
   */
  filterColumnOnDateChange($event, dt, col) {
    /*Converting Date to String and passing the string value to filter() method*/
    let inputDate = this._helper.convertDateToStringWithoutTz($event);
    dt.filter(inputDate, col.field, col.filterMatchMode);
  }

  /**
   * This method is to return the routing path when we click on file name under data review
   * @param dataType
   */
  onClickOfFile(dataType: string, id: number) {
    let menuname = '';
    if (dataType === CyncConstants.CASHRECEIPT) {
      menuname = CyncConstants.CASH_RECEIPT;
    }
    if (dataType === CyncConstants.RECEIVABLESUMMARY) {
      menuname = CyncConstants.RECEIVABLE_SUMMARY;
    }
    if (dataType === CyncConstants.ASSET) {
      menuname = CyncConstants.ASSET_ROUTE;
    }
    if (dataType === CyncConstants.PAYABLESUMMARY) {
      menuname = CyncConstants.PAYABLE_SUMMARY;
    }
    if (dataType === CyncConstants.RECEIVABLE) {
      menuname = CyncConstants.RECEIVABLE_DETAIL;
    }
    if (dataType === CyncConstants.PAYABLE) {
      menuname = CyncConstants.PAYABLE_DETAIL;
    }
    if (dataType === CyncConstants.VENDOR) {
      menuname = CyncConstants.VENDOR_ROUTE;
    }
    if (dataType === CyncConstants.CUSTOMER) {
      menuname = CyncConstants.CUSTOMER_ROUTE;
    }

    if (dataType === CyncConstants.BORROWERRECEIVABLE) {
      menuname ='Compare Client Receivables';
    }

    const menuModel = this._navbarComponent.getMenuByMenuName(menuname, this._navbarComponent.subMenusArr);
    return menuModel.path + '&base_route=true&uploaded_file_id=' + id + '&back_url=' + encodeURIComponent(CyncConstants.BBC_DATA_FILE_BACK_URL);
  }

  /**
   * This method is to enable the cancel button
   */
  isCancleDisable() {
    this.isCancelButtonDisable = false;
  }

  /**
   * This method will open the image and file browse window
   * @param field
   */
  openfileBrowse(field) {
    document.getElementById(field).click();
  }

  /**
   * This method is called to open exchange rate popup
   */
  openExchangeRatePoup() {
    this.toggleExchangeRateModal = true;
  }

  /**
	 * Method to get exchange rate array 
	 */
  get exchangeRateControl() {
    return <FormArray>this.exchangeRateForm.get('exchange_rates');
  }

  /**
   * Method to hightlight mandatory fileds if form validations fail
   * @param index
   * @param field
   */
  displayFieldCss(index: number, field: string) {
    return this._helper.getFieldCss(field, this.exchangeRateForm.controls['exchange_rates']['controls'][index]);
  }

  /**
   * Get Form Control field
   * @param index
   * @param field 
   */
  getFormControl(index: number, field: string) {
    return this.exchangeRateForm.controls['exchange_rates']['controls'][index].get(field);
  }

  /**
   * This method will validate decimal precision for every input field value of exchange rate
   */
  setDefaultDecimalPrecision() {
    this.exchangeRatesValueValidations.set(0, '^(?!\\s)([0-9])+$');
    this.exchangeRatesValueValidations.set(1, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1})?\\s*$');
    this.exchangeRatesValueValidations.set(2, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{2})?\\s*$');
    this.exchangeRatesValueValidations.set(3, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{3})?\\s*$');
    this.exchangeRatesValueValidations.set(4, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{4})?\\s*$');
    this.exchangeRatesValueValidations.set(5, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{5})?\\s*$');
    this.exchangeRatesValueValidations.set(6, '^\\s*(?=.*[1-9])\\d*(?:\\.\\d{6})?\\s*$');
  }

  /**
   * This method is get called when user will click on reprocess collateral
   * @param id 
   * @param value 
   * @param model
   */
  reprocessSelectedCollateralFrom(id: number, value: string, model: ABLFileUpload) {
    let endPoint = this._apiMapper.endpoints[CyncConstants.REPROCESS_COLLATERAL_FROM];
    endPoint = endPoint.replace('{rowId}', id);
    let tempModel = new ReprocessCollateralFrom();
    tempModel.select_collateral_from = value;
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to reprocess collateral from ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._service.reprocessCollateralFrom(endPoint, tempModel).subscribe(popUpResponse => {
          this._helper.openAlertPoup('Information', ClientValidationMessages.REPROCESS_COLLATERAL_NAME);
          this.reloadDataForExpendedRow(model.mapping_id, model.data_type, model);
          this.reloadGridData();
        });
      }
    });
  }

  /**
   * This method is to change collateral value based on selected collateral from data review
   * @param value 
   */
  updateCollateralForDataReview(value: string) {
    let model = new DataReview();
    model.default_select_collateral = value;
  }

  /**
   * This method to show the preview icon for pdf, txt, rpt and html
   * @param file_type
   */
  showPDFIcon(file_type: string) {
    if (file_type.toLowerCase() == 'pdf' || file_type.toLowerCase() == 'txt' || file_type.toLowerCase() == 'rpt' || file_type.toLowerCase() == 'html') {
      return true;
    }
  }

  /**
   * This method to open the popup after click on preview icon and dispaly data to popup
   * @param model
   */
  previewModel(model: ABLFileUpload, layoutID: string) {
    let endPoint = this._apiMapper.endpoints[CyncConstants.UPLOADS_PREVIEW];
    //endPoint = endPoint.replace('{mapping_id}', this.selectedLayoutId);
    //endPoint = endPoint.replace('{mapping_id}', model.mapping_id);
    endPoint = endPoint.replace('{mapping_id}', layoutID);
    this._service.getPreviewModel(endPoint).subscribe(data => {
      window.open(data.url + "#toolbar=0", "_blank");
    }, error => {
      console.log(error);
    });
  }

  isCheckPendingLink(value: any) {
    if (value === null || value === "" || value === undefined) {
      return false;
    }else{
      return true;
    }
  }

  /**
  * Click Pending Action Link event
  * @param url 
  */
  clickPendingActionLinkMethod(url: string){
    window.open(url, "_blank");
  }

  /**
  * Mapping icon click event
  * @param borrowerID 
  * @param layoutID 
  */
  mappingIconClickEvent(borrowerID: string, layoutID: string){
    let menu_id = '';
    let mappingListMenuModel = this._navbarComponent.getMenuByMenuName(CyncConstants.MAPPING_LIST_VIEW, this._navbarComponent.subMenusArr);
    if(mappingListMenuModel && mappingListMenuModel['path']){
      menu_id = (mappingListMenuModel['path']).split('menu_id=').pop().split('&')[0];
    }
    let url = "../../borrowers/"+borrowerID+"/mappings/"+layoutID+"/edit?step=S1&menu_id="+ menu_id;
    window.open(url, "_blank");
  }

  /**
  * Mapping Name Click Event
  * @param borrowerID 
  * @param mappingID 
  */
  mappingNameClickEvent(borrowerID: string, mappingID: string){
    let menu_id = '';
    let mappingListMenuModel = this._navbarComponent.getMenuByMenuName(CyncConstants.MAPPING_LIST_VIEW, this._navbarComponent.subMenusArr);
    if(mappingListMenuModel && mappingListMenuModel['path']){
      menu_id = (mappingListMenuModel['path']).split('menu_id=').pop().split('&')[0];
    }
    let url = "../../borrowers/"+borrowerID+"/mappings/"+mappingID+"/edit?step=S1&menu_id="+ menu_id;
    return url;
  }
}