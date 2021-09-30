import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { UdfMappingService } from '../service/udf-mapping.service';
import { UDFDetailsModel, Program, ClientProgramParam, CommonIdNameModel, UDFLOVModel, UDFMappingModel, LoanSetupProgramParam } from '../model/udf-mapping.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { SortablejsOptions } from 'angular-sortablejs/dist';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of, interval } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ListUdfMappingComponent } from '@app/Administration/user-defined-field/udf-mapping/list-udf-mapping/list-udf-mapping.component';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { Subject } from 'rxjs/Subject';
import { EDITOR_VALUE_ACCESSOR } from 'primeng/primeng';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';
import { MAT_SLIDER_VALUE_ACCESSOR } from '@angular/material';

@Component({
  selector: 'app-manage-udf-mapping',
  templateUrl: './manage-udf-mapping.component.html',
  styleUrls: ['./manage-udf-mapping.component.scss']
})
export class ManageUdfMappingComponent implements OnInit {
  udfMappingForm: FormGroup;
  public static UDF_LOVS = 'udf_lovs';
  public static PROGRAMS_LOVS = 'programs_lovs';
  public static CLIENT_PROGRAM_PARAMS_LOVS = 'client_program_params_lovs';
  public static GET_LOAN_PROGRAM_LOV = 'get_loan_programs_lov';
  public static GET_LOAN_ACTIVITY_PROGRAM_LOV = 'get_loan_activity_programs_lov';
  public static REPORTS_LIST = 'reports_list';
  public static GET_PARAMETERS_FOR_PROGRAMS = 'get_parameters_for_programs';
  public static GET_CLIENTS_FOR_PARAM = 'get_clients_for_param';
  public static SEARCH_CLIENTS_FOR_LS_PROGRAM = 'search_for_loan_setup_lov';
  public static GET_UDF_DETAILS_BY_ID = 'get_udf_details_by_id';
  public static GET_UDF_MAPPING_BY_PROGRAM_ID = 'get_udf_mapping_by_program_id';
  public static UPDATE_UDF_MAPPINGS = 'update-udf-mapping';
  public static REPORT_PROGRAM = 'R';
  public static CLIENT_DETAILS_PROGRAM = 'CD';
  public static LOAN_SETUP_PROGRAM = 'LS';
  public static DUPLICATE_UDF_MAPPING_MESSAGE = 'Mapping for {field} {value} is already present';
  public static GET_CLIENTS_BY_UDF_ID = 'get-clients-by-udf-id';
  public static FIELD_CONSTANT = '{field}';
  public static VALUE_CONSTANT = '{value}';
  public static UDF_FIELD_NAME = 'UDF';
  public static PROGRAM_FIELD_NAME = 'Program';
  public static NUMERIC_FIELD_TYPE = 'N';
  public static GET_LAST_SEQUENCE = 'get_last_sequence';
  public static GET_CLIENTS_BY_PROGRAM_ID = 'get_clients_by_programe_id';
  udf_details: CommonIdNameModel[];
  programs_lovs: Program[];
  program_param_lovs: ClientProgramParam[];
  program_lovs_except_for_LS: ClientProgramParam[];
  loan_program_lovs: LoanSetupProgramParam[];
  loan_activity_program_lovs: LoanSetupProgramParam[];
  allClients: any;
  selectedClients: any;
  originalSelectedClients: any = [];
  allManagementReports: any;
  selectedReports: any;
  currentAction: string = CyncConstants.ADD_OPERATION;
  previousValue: any;
  showClientListSpinner = false;
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;
  saveButtonText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  udfMappingProgramId: number;
  isReportProgram = false;
  programParamValue: string;
  clientMappingSearchTerm$ = new Subject<string>();
  lastSequence: number = 1;
  programesForClientSelection = ['DEB', 'DR', 'SR', 'ENSI', 'CR', 'R'];
  isUDFValueFieldRequiredToShow: boolean = true; // by default we have to show udf value field on ui
  programesToGetExistingMappedClients = ['DEB', 'DR', 'SR', 'ENSI', 'CR']; // this array to for the programes where we need to get existing mapped clients
  // and show them into client mapping 
  showLoaderForExistingMappedClients = false;
  programesWhereClientOrReportSelectedIsNotRequired = ['CS', 'LS', 'CL'];
  programesWhereUDFValueIsRequired = ['CD'];
  reportTemplate: any;
  isReportFlag:boolean = false;
  // isLoanSetupProgram:boolean = false;
  udfParamDetails:any;
  programsPrefixed:string;
  /**
   * Constructor for initialising other components
   * used in UDF Mapping Component
   * @param _fb
   * @param _apiMapper
   * @param _udfMappingService
   * @param _helper
   * @param _route
   * @param _msgLoader
   * @param _router
   */
  constructor(private _fb: FormBuilder,
    private _apiMapper: APIMapper,
    private _udfMappingService: UdfMappingService,
    private _helper: Helper,
    private _route: ActivatedRoute,
    private _msgLoader: MessageServices,
    private _router: Router) { }

  /**
   * Initialising all the values required for ngOnInit
   */
  ngOnInit() {
    this.createForm();
    this._msgLoader.showLoader(true);
    this.getDropDownValues().subscribe(result => {
      this.populateDropDown(result);
      this._renderForm();
      this._msgLoader.showLoader(false);
    });
  }

  /**
   * Method to populate all the models used for drop downs in UDF Mapping page
   * @param result
   */
  populateDropDown(result: any) {

    this.udf_details = result[0];
    this.programs_lovs = result[1];
    this.program_param_lovs = result[2];
    this.program_lovs_except_for_LS = result[2];
    //this.allManagementReports = result[3];

    const originalReportList = result[3];
    this.loan_program_lovs = result[4];
    this.loan_activity_program_lovs = result[5];

    const index = (originalReportList).findIndex(obj => obj.name === "Collateral Analysis – Comparative Report");
    if (index != -1) {
      let filteredReportList = originalReportList.filter((obj) => obj.name !== 'Underwriting Trend Report');
      const filteredReportObject = originalReportList.filter((obj) => obj.name === 'Underwriting Trend Report');
      if (filteredReportObject.length > 0) {
        filteredReportList.splice(index + 1, 0, filteredReportObject[0]);
      }
      this.allManagementReports = filteredReportList;
      
    } else {
      this.allManagementReports = originalReportList;
      
    }
  }

  /**
   * Render Form with values as per the Add / Edit operation
   */
  _renderForm() {
    this.addFirstRow();
    this.currentAction = CyncConstants.ADD_OPERATION;
  }

  /**
   * This method gets calle din case of EDIT UDF Mapping
   * and binds the data that we get from GET api with angular form
   * @param programId
   */
  showUdfProgramMappingForm(programId: number) {
    this._msgLoader.showLoader(true);
    this.udfMappingProgramId = programId;
    const url = this._apiMapper.endpoints[ManageUdfMappingComponent.GET_UDF_MAPPING_BY_PROGRAM_ID].replace("{programId}", programId);
    this._udfMappingService.getUDFMappingDetailsById(url).subscribe(udfProgramMappingRes => {
      //this.udfMappingForm.patchValue(udfProgramMappingRes);
      this.mapResponseToFormArray(udfProgramMappingRes);
      this._msgLoader.showLoader(false);
    });
  }

  /**
   * Get Form Group for Client Details Program
   */
  isClientProgramPresent(): boolean {
    let flag = false;
    let clientProgramGroup = this.getClientProgram();
    if (clientProgramGroup !== undefined) {
      flag = true;
    }
    return flag;
  }

  /**
   * Method to get the Client Details Program
   */
  getClientProgram(): FormGroup {
    let clientFormGroup: FormGroup;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
      for (let i = 0; i < programControl.controls.length; i++) {
        const programGroup = <FormGroup>programControl.controls[i];
        const programId = programGroup.controls['program_id'].value;
        const programValue = this.getProgramCodeById(programId);
        if (this._helper.compareIgnoreCase(programValue, ManageUdfMappingComponent.CLIENT_DETAILS_PROGRAM)) {
          clientFormGroup = programGroup;
          break;
        }
      }
    }
    return clientFormGroup;
  }


  onChangeOfUdfParamValue(index: number) {
    
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      const udfGroup = <FormGroup>udfControl.controls[index];
      if (udfGroup !== undefined) {
        const udfValue = udfGroup.controls['udf_value'].value;
             if (udfValue === null || udfValue == undefined || udfValue === '') {
          let validations = [];
          if (udfGroup.controls['udf_value_validations'] !== undefined) {
            validations = udfGroup.controls['udf_value_validations'].value;
          }
          if (this.isClientProgramPresent() && this.isClientSelectedForClientDetailsPrograme()) {
            if (validations.indexOf(Validators.required) === -1) {
              validations.push(Validators.required);
              udfGroup.controls['udf_value_req_for_mapping'] = new FormControl({ value: true, disabled: true }, Validators.compose([]));
            }
          } else if (udfGroup.controls['udf_value_req_for_mapping'] !== undefined) {
            validations = validations.filter(v => (v !== Validators.required));
            udfGroup.removeControl('udf_value_req_for_mapping');
          }

          udfGroup.controls['udf_value'].setValidators(Validators.compose(validations));
          if (udfGroup.controls['udf_value_validations'] !== undefined)
            udfGroup.controls['udf_value_validations'].setValue(validations);
          udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });

          udfGroup.controls['udf_value'].reset();

        } else if (this.isClientProgramPresent()) {
          let clientProgramGroup = this.getClientProgram();
          clientProgramGroup.controls['mappings'].setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
          clientProgramGroup.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
          if (!this.isClientSelectedForClientDetailsPrograme()) {
            clientProgramGroup.controls['mappings'].reset();
          }
        }

      }
    }
  }

  /**
   * Map the GET UDF Mapping api response with the udf and programs formarrays
   * @param udfProgramMappingRes
   */
  mapResponseToFormArray(udfProgramMappingRes) {
    let udfsControlArray = <FormArray>this.udfMappingForm.controls['udfs'];
    udfProgramMappingRes.udfs.forEach(udf => {
      const fb = this.initUdfRows();
      fb.patchValue(udf);
      if (!this.checkIfOnlyReportProgram()) {
        this.mapUdfDetailsForUdf(fb, udf.id);
      }

      udfsControlArray.push(fb);
    });
    let programsControlArray = <FormArray>this.udfMappingForm.controls['programs'];
    udfProgramMappingRes.programs.forEach(program => {
      const fb = this.initProgramRows();
      fb.patchValue(program);

      //This is called in case of Edit, which has a single program
      if (this.isReportTemplate(program.program_id)) {
        // this.allManagementReports = this._udfMappingService.getListBoxModelForClientReport(this.allManagementReports);
        // fb.controls.reports_mapping.patchValue(this.allManagementReports);
        this.selectedReports = program.mappings;
        this.isReportProgram = true;
        // this.selectedReports = this._udfMappingService.getListBoxModelForClientReport(program.reports_mapping);
      } else {
        this.originalSelectedClients = JSON.parse(JSON.stringify(program.mappings));
        this.selectedClients = JSON.parse(JSON.stringify(program.mappings));
        this.allClients = JSON.parse(JSON.stringify(program.mappings));
      }
      programsControlArray.push(fb);
    });
  }

  /**
   * Get Drop down values using APIs
   */
  getDropDownValues(): Observable<any[]> {
    // return Observable.forkJoin(
    // this._udfMappingService.getUdfValues(this._apiMapper.endpoints[ManageUdfMappingComponent.UDF_LOVS]),
    // this._udfMappingService.getPrograms(this._apiMapper.endpoints[ManageUdfMappingComponent.PROGRAMS_LOVS]),
    // this._udfMappingService.getClientProgramParams(this._apiMapper.endpoints[ManageUdfMappingComponent.CLIENT_PROGRAM_PARAMS_LOVS]),
    // this._udfMappingService.getManagementReports(this._apiMapper.endpoints[ManageUdfMappingComponent.REPORTS_LIST]),
    // old comments this._udfMappingService.getLastSequence(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_LAST_SEQUENCE])
    //);

    let res1 = this._udfMappingService.getUdfValues(this._apiMapper.endpoints[ManageUdfMappingComponent.UDF_LOVS]);
    let res2 = this._udfMappingService.getPrograms(this._apiMapper.endpoints[ManageUdfMappingComponent.PROGRAMS_LOVS]);
    let res3 = this._udfMappingService.getClientProgramParams(this._apiMapper.endpoints[ManageUdfMappingComponent.CLIENT_PROGRAM_PARAMS_LOVS]);
    let res4 = this._udfMappingService.getManagementReports(this._apiMapper.endpoints[ManageUdfMappingComponent.REPORTS_LIST]);
    // let res5 = this._udfMappingService.getLoanSetupProgramParams(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_LOAN_PROGRAM_LOV]);
    // let res6 = this._udfMappingService.getLoanActivityProgramParams(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_LOAN_ACTIVITY_PROGRAM_LOV]);

    return forkJoin([res1, res2, res3, res4]);
  }


  /**
   * Method defines the udf and program form arrays
   */
  createForm() {
    this.udfMappingForm = this._fb.group({
      udfs: this._fb.array([]),
      programs: this._fb.array([])
    });
    //this.addFirstRow();
  }

  /**
   * Method to initialise the udf rows
   */
  initUdfRows() {
    return this._fb.group({
      sequence: new FormControl({ value: 1 }, Validators.compose([])),
      id: new FormControl('', Validators.compose([Validators.required])),
      //udf_selected: new FormControl(false, Validators.compose([])),
      udf_value: new FormControl('', Validators.compose([])),
      udf_value_validations: new FormControl({ value: [], disabled: true }, Validators.compose([])),
      is_lov: new FormControl({ value: false, disabled: true }, Validators.compose([]))
    });
  }

  /**
   * Method to initialize the program rows
   */
  initProgramRows() {
    return this._fb.group({
      program_id: new FormControl('', Validators.compose([Validators.required])),
      isAllProgramSelected: new FormControl(false, Validators.compose([])),
      // program_selected: new FormControl(false, Validators.compose([])),
      program_param_option: new FormControl(null, Validators.compose([])),
      program_param_value: new FormControl('', Validators.compose([])),
      program_name: new FormControl('', Validators.compose([])),
      mappings: new FormControl([], Validators.compose([])),
      prjClients: new FormControl({ value: [], disabled: true }, Validators.compose([])),
      prjClientsSpinner: new FormControl({ value: false, disabled: true }, Validators.compose([])),
      prjSelectedClients: new FormControl({ value: new Array(), disabled: true }, Validators.compose([])),
      prjSearchClientTerm: new FormControl({ value: new Subject<string>(), disabled: true }),
      prjClientsAvailable: new FormControl({ value: false, disabled: true }, Validators.compose([])),
      reportOrClientSelectionFlag: new FormControl({ value: true, disabled: true }, Validators.compose([])),
      prjLoanSetup: new FormControl({ value: true, disabled: true }, Validators.compose([])),
      prjColletralLoanUpload: new FormControl({ value: true, disabled: true }, Validators.compose([]))
      //program_params: this._fb.array([])MAT_SLIDER_VALUE_ACCESSOR
    });
  }

  /**
   * Method to add default row for UDF Mapping add page
   */
  addFirstRow() {
    this.addUdfRow();
    this.addProgramRow();
  }

  /**
   * Method to add row to programs form array
   */
  addProgramRow() {
    const control = <FormArray>this.udfMappingForm.controls['programs'];
    const addrCtrl = this.initProgramRows();
    control.push(addrCtrl);
  }

  /**
   * Method to add row to udf form array
   */
  addUdfRow() {
    const control = <FormArray>this.udfMappingForm.controls['udfs'];
    const addrCtrl = this.initUdfRows();
    control.push(addrCtrl);
  }

  /**
   * Method to record the value previously selected for udf / program
   * This is used to add validtaion that same udf or same program cannot be added twice
   * @param index
   * @param formArrayName
   * @param formControlName
   */
  recordPreviousValue(index: number, formArrayName: string, formControlName: string) {
    const formArray = (<FormArray>this.udfMappingForm.controls[formArrayName]);
    if (formArray !== undefined && formArray.controls !== undefined) {
      const formGroup = <FormGroup>formArray.controls[index];
      this.previousValue = formGroup.controls[formControlName].value;
    }
  }

  /**
   * Method for Program Param on change event
   * @param index
   */
  onChangeProgramParamOption(index: number) {

    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined) {
      const programGroup = <FormGroup>programControl.controls[index];
      const programParamOption = programGroup.controls['program_param_option'].value;
      if (programParamOption !== undefined && programParamOption !== null) {
        programGroup.controls['program_param_value'].setValue('');
        this.selectedClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
        this.allClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
      }
    }
  }

  /**
   * Method for Program on change event
   * @param index
   */
  onChangeProgramParam(index: number) {
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined) {
      const programGroup = <FormGroup>programControl.controls[index];
      const programId = programGroup.controls['program_id'].value;

      let programSelected = this.findProgramById(programId);
      if (programSelected !== undefined) {
        const programName = programSelected.column_display;
        const message = ManageUdfMappingComponent.DUPLICATE_UDF_MAPPING_MESSAGE.
          replace(ManageUdfMappingComponent.FIELD_CONSTANT, ManageUdfMappingComponent.PROGRAM_FIELD_NAME).
          replace(ManageUdfMappingComponent.VALUE_CONSTANT, programName);
        if (this.checkIfValueAleadySelected(programId, programControl.value, 'program_id')) {
          (<FormControl>programGroup.controls['program_id']).setValue(this.previousValue);
          this._helper.openAlertPoup("Information", message);
          return;
        }
        this._udfMappingService.getLastSequence(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_LAST_SEQUENCE].replace('{programId}', programId)).subscribe(res => {
          this.lastSequence = res + 1;
        });

        programGroup.controls['program_name'].setValue(programSelected.column_value);
      }
       // Default Initialize value for Loan Setup and Colletral Loan Upload
       programGroup.controls['prjLoanSetup'].setValue(true);
       programGroup.controls['prjColletralLoanUpload'].setValue(true);

      // setting default client selection is to true, 
      programGroup.controls['reportOrClientSelectionFlag'].setValue(true);
      if (!this.isClientOrReportSelectionRequired(programSelected.column_value)) {
        if (this.checkIfSelectedProgrameRequiredUDFValue()) {
          this.isUDFValueFieldRequiredToShow = true;
        } else {
          this.isUDFValueFieldRequiredToShow = false;
        }
        programGroup.controls['reportOrClientSelectionFlag'].setValue(false);
        this.isReportProgram = false;
        this.resetAllUdfValues(false);
      } else if (this.checkIfSelectedProgrameRequiredUDFValue()) {
        this.isUDFValueFieldRequiredToShow = true;
        this.isReportProgram = false;
        this.resetAllUdfValues(false);
      } else if (!this.checkIfSelectedProgrameRequiredUDFValue()) {
        this.isUDFValueFieldRequiredToShow = false;
        this.isReportProgram = false;
        this.resetAllUdfValues(false);
      } else if (this.checkIfOnlyReportProgram()) {
        this.allClients = [];
        this.selectedClients = [];
        this.programParamValue = '';
        programGroup.controls['program_param_option'].reset();
        programGroup.controls['program_param_value'].reset();
        this.resetAllUdfValues(false);
        this.isReportProgram = true;
        this.isUDFValueFieldRequiredToShow = false;
      } else {
        this.resetAllUdfValues(true);
        this.isReportProgram = false;
        this.isUDFValueFieldRequiredToShow = true;
      }


      if (this.isReportTemplate(programId)) {
        programGroup.controls['mappings'].setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
        programGroup.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
      } else {
        if (this.checkIfUdfValuePresent() && this.isUDFValueFieldRequired(programSelected.column_value)) {
          programGroup.controls['mappings'].setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
          programGroup.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
        } else {
          programGroup.controls['mappings'].clearValidators();
          programGroup.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
        }

      }

      // calling to api to get existing mapped clients to perticular program by their programe id
      this.showLoaderForExistingMappedClients = false;
      if (this.isProgramNeedsMaapedClients(programId)) {
        this.showLoaderForExistingMappedClients = true;
        this._udfMappingService.getMappedClientsByProgrameId(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_BY_PROGRAM_ID]
          .replace('{programId}', programId)).subscribe(clients => {
            this.showLoaderForExistingMappedClients = false;
            if (clients.length > 0) {
              programGroup.controls['mappings'].setValue(JSON.parse(JSON.stringify(clients)));
              programGroup.controls['prjClients'].setValue(JSON.parse(JSON.stringify(clients)));
              programGroup.controls['prjClientsAvailable'].setValue(true);
            }
          })
      }
    
        if (programSelected.column_value === "LS") {
            programGroup.controls['prjLoanSetup'].setValue(false);
            this.programsPrefixed="LS";
          }else if(programSelected.column_value === "CL"){
            programGroup.controls['prjColletralLoanUpload'].setValue(false);
            this.programsPrefixed="CL";
        } else{
          this.programsPrefixed='default';
        }
    }

  }

  /**
   * Method for UDF on change event
   * @param index
   * @param event
   */
  onChangeUdfParam(index: number, event: any) {
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      const udfGroup = <FormGroup>udfControl.controls[index];
      // In case of Add Page if the udfParam DropDown is changed again the remove/add LOV avlues depending upon validationType
      udfGroup.controls['is_lov'].setValue(false);

      const udfId = udfGroup.controls['id'].value;
      let udfSelected = this.findUdfById(udfId);
      if (udfSelected !== undefined) {
        const udfName = udfSelected.name;
        const message = ManageUdfMappingComponent.DUPLICATE_UDF_MAPPING_MESSAGE.
          replace(ManageUdfMappingComponent.FIELD_CONSTANT, ManageUdfMappingComponent.UDF_FIELD_NAME).
          replace(ManageUdfMappingComponent.VALUE_CONSTANT, udfName);
        // this.showAlertPopUpOnSelectOfDuplicate(event, 'id', udfControl.value, udfId, message, (<FormControl>udfGroup.controls['id']));
        if (this.checkIfValueAleadySelected(udfId, udfControl.value, 'id')) {
          (<FormControl>udfGroup.controls['id']).setValue(this.previousValue);
          //event.preventDefault();
          this._helper.openAlertPoup("Information", message);
          return;
        }
      }
      udfGroup.controls['udf_value'].clearValidators();
      udfGroup.controls['udf_value_validations'].setValue([]);
      udfGroup.controls['udf_value'].enable();
      udfGroup.controls['udf_value'].reset();
      if (this.checkIfUDFValueFieldIsRequired()) {
        this.mapUdfDetailsForUdf(udfGroup, udfId);
      }

    }
  }

  /**
 * this method will verify that if any program which is selected and if udf value is not required for that perticular programe
 * or not
 */
  checkIfUDFValueFieldIsRequired(): boolean {
    let flag = false;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
      for (let i = 0; i < programControl.controls.length; i++) {
        const programGroup = <FormGroup>programControl.controls[i];
        const programId = programGroup.controls['program_id'].value;
        const program_code = this.getProgramCodeById(programId);
        if (this.isUDFValueFieldRequired(program_code)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }



  /**
   * Method to check if programs array contains only Report program
   * If only Reposrt program is selected then the udf values fields ar enot displayed
   */
  checkIfOnlyReportProgram(): boolean {
    let flag = false;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length == 1) {
      const programGroup = <FormGroup>programControl.controls[0];
      if (programGroup.controls['program_id'] != undefined) {
        const programId = programGroup.controls['program_id'].value;
        if (this.isReportTemplate(programId)) {
          flag = true;
          this.isReportProgram = true;
        }
      }
    }
    return flag;
  }

  /**
   * Method to check if programs array contains only Client program
   * If only Reposrt program is selected then the udf values fields ar enot displayed
   */
  checkIfOnlyClientProgram(): boolean {
    let flag = false;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length == 1) {
      const programGroup = <FormGroup>programControl.controls[0];
      if (programGroup.controls['program_id'] != undefined) {
        const programId = programGroup.controls['program_id'].value;
        if (this.isClientTemplate(programId)) {
          flag = true;
        }
      }
    }
    return flag;
  }

  /**
   * this method check , whether any of selected programe required to have UDF value or not
   */
  checkIfSelectedProgrameRequiredUDFValue(): boolean {
    let flag = false;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
      for (let i = 0; i < programControl.controls.length; i++) {
        const programGroup = <FormGroup>programControl.controls[i];
        const programId = programGroup.controls['program_id'].value;
        let programSelected = this.findProgramById(programId);
        if (this.isUDFValueMandatory(programSelected.column_value)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }




  /**
   * Method to check user has selected client details 
   */
  checkIfClientDetailsProgramSelected(): boolean {
    let flag = false;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
      for (let i = 0; i < programControl.controls.length; i++) {
        const programGroup = <FormGroup>programControl.controls[i];
        if (programGroup.controls['program_id'] != undefined) {
          const programId = programGroup.controls['program_id'].value;
          if (this.isClientTemplate(programId)) {
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }

  /**
   * Method to check if programs array contains only Report program
   * If only Reposrt program is selected then the udf values fields ar enot displayed
   */
  checkIfNoProgramPresent(): boolean {
    let flag = true;
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
      for (let i = 0; i < programControl.controls.length; i++) {
        const programGroup = <FormGroup>programControl.controls[i];
        if (programGroup.controls['program_id'] != undefined
          && programGroup.controls['program_id'].value !== undefined
          && programGroup.controls['program_id'].value !== null
          && programGroup.controls['program_id'].value > 0) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  }

  /**
   * Method to check if any udf value is present
   */
  checkIfUdfValuePresent(): boolean {
    let flag = false;
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      for (let i = 0; i < udfControl.controls.length; i++) {
        const udfGroup = <FormGroup>udfControl.controls[i];
        if (udfGroup !== undefined && udfGroup.controls['udf_value'] !== undefined
          && udfGroup.controls['udf_value'].value !== undefined
          && udfGroup.controls['udf_value'].value !== null
          && udfGroup.controls['udf_value'].value !== ''
          && (udfGroup.controls['udf_is_unique_value'] == undefined || udfGroup.controls['udf_is_unique_value'].value == undefined
            || udfGroup.controls['udf_is_unique_value'].value == null || !udfGroup.controls['udf_is_unique_value'].value)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  /**
   * Method to rest udf value and reste all the validations applied of udf values
   */
  resetAllUdfValues(setValidations: boolean) {
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      for (let i = 0; i < udfControl.controls.length; i++) {
        const udfGroup = <FormGroup>udfControl.controls[i];
        if (udfGroup !== undefined && udfGroup.controls['udf_value'] !== undefined) {
          if (setValidations) {
            let validations = udfGroup.controls['udf_value_validations'].value;

            if (udfGroup.controls['udf_is_unique_value'] != undefined && udfGroup.controls['udf_is_unique_value'].value) {
              if (udfGroup.controls['udf_is_unique_value_default'] !== undefined && udfGroup.controls['udf_is_unique_value_default'].value !== undefined) {
                udfGroup.controls['udf_value'].setValue(udfGroup.controls['udf_is_unique_value_default'].value);
              }
            }

            if (!this.isClientSelectedForClientDetailsPrograme()) {
              if ((udfGroup.controls['udf_value_req_for_mapping'] !== undefined
                && udfGroup.controls['udf_value_req_for_mapping'].value
                && (udfGroup.controls['udf_value'].value === null || udfGroup.controls['udf_value'].value === ''))
                && (udfGroup.controls['udf_is_mandatory'] === undefined
                  || !udfGroup.controls['udf_is_mandatory'].value)) {
                validations = validations.filter(v => (v !== Validators.required));
                // udfGroup.controls['udf_value_req_for_mapping'].setValue(false);
              }
            }

            if (udfGroup.controls['is_lov'] != undefined && udfGroup.controls['is_lov'].value
              && udfGroup.controls['udf_param_lovs'] !== undefined && udfGroup.controls['udf_param_lovs'].value.length > 0) {
              const defaultLOV = udfGroup.controls['udf_param_lovs'].value.find(u => u.is_default_value);
              if (defaultLOV != undefined) {
                // isLovDefaulValueSet = true;
                udfGroup.controls['udf_value'].setValue(defaultLOV.lov_value);
              }
            }

            udfGroup.controls['udf_value'].setValidators(Validators.compose(validations));
          } else {
            udfGroup.controls['udf_value'].setValidators(Validators.compose([]));
            // udfGroup.controls['udf_value'].reset();
          }

          udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
          const prevValue = udfGroup.controls['udf_value'].value;
          udfGroup.controls['udf_value'].reset();
          udfGroup.controls['udf_value'].setValue(prevValue);
          this._msgLoader.showLoader(false);
        }
      }
    }
  }

  /**
   * On click of client mappings check if the udf value is blank then make form invalid
   */
  checkUdfValues(allListItems, event, idx) {

    /**
    * Program Control Check selecte all option selected or not. 
    */
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined) {
      const programGroup = <FormGroup>programControl.controls[idx];
      if (allListItems.length == event.value.length) {
        programGroup.controls['isAllProgramSelected'].setValue(true);
      } else {
        programGroup.controls['isAllProgramSelected'].setValue(false);
      }
    }

    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      for (let i = 0; i < udfControl.controls.length; i++) {
        const udfGroup = <FormGroup>udfControl.controls[i];
        if (udfGroup.controls['udf_is_mandatory'] === undefined || !udfGroup.controls['udf_is_mandatory'].value) {
          let validations = [];
          if (udfGroup.controls['udf_value_validations'] !== undefined) {
            validations = udfGroup.controls['udf_value_validations'].value;
          }

          if (this.isClientSelectedForClientDetailsPrograme() && (udfGroup.controls['udf_value'] !== undefined && udfGroup.controls['udf_value'] !== null)) {
            if (validations.indexOf(Validators.required) === -1)
              validations.push(Validators.required);
            if (udfGroup.controls['udf_value_req_for_mapping'] === undefined) {
              udfGroup.controls['udf_value_req_for_mapping'] = new FormControl({ value: true, disabled: true }, Validators.compose([]));
            } else {
              udfGroup.controls['udf_value_req_for_mapping'].setValue(true);
            }
            // udfGroup.controls['udf_value'].markAsDirty();
          } else {
            validations = validations.filter(v => (v !== Validators.required));
            udfGroup.removeControl('udf_value_req_for_mapping');
          }

          udfGroup.controls['udf_value'].setValidators(Validators.compose(validations));
          if (udfGroup.controls['udf_value_validations'] !== undefined)
            udfGroup.controls['udf_value_validations'].setValue(validations);
          udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
          const prevValue = udfGroup.controls['udf_value'].value;
          udfGroup.controls['udf_value'].reset();
          udfGroup.controls['udf_value'].setValue(prevValue);
        }

      }
    }
  }



  /**
   * Method to get the details for the selcted UDF
   * and map the response with angular page
   * @param udfGroup
   * @param udfId
   */
  mapUdfDetailsForUdf(udfGroup: FormGroup, udfId: number) {
    const url = this._apiMapper.endpoints[ManageUdfMappingComponent.GET_UDF_DETAILS_BY_ID].replace("{udfId}", udfId.toString());
    this._udfMappingService.getUdfDetailsById(url).subscribe(udfParamDetails => {
     this.udfParamDetails = udfParamDetails;
      // Update mandatory details
      udfGroup.controls['udf_is_mandatory'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
      udfGroup.controls['udf_is_mandatory'].setValue(udfParamDetails.is_mandatory);
      let validationsForUdfValueField = [];
      if (udfParamDetails.field_type === ManageUdfMappingComponent.NUMERIC_FIELD_TYPE) {
        validationsForUdfValueField.push(Validators.pattern('^[0-9]*$'));
      }
      udfGroup.controls['udf_is_updatable'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
      udfGroup.controls['udf_is_updatable'].setValue(udfParamDetails.is_updatable);

      udfGroup.controls['udf_is_unique_value'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
      udfGroup.controls['udf_is_unique_value'].setValue(udfParamDetails.is_unique_value);

      udfGroup.controls['udf_is_unique_value_default'] = new FormControl({ value: '', disabled: true }, Validators.compose([]));
      udfGroup.controls['udf_is_unique_value_default'].setValue(udfParamDetails.udf_value);
      if (udfParamDetails.is_unique_value) {
        udfGroup.controls['udf_value'].setValue(udfParamDetails.udf_value);
        // udfGroup.controls['udf_value'].disable();
      }
      if (udfParamDetails.is_mandatory) {
        validationsForUdfValueField.push(Validators.required);
        // udfGroup.controls['udf_value'].setValidators(Validators.compose([Validators.required]));
      }
      const validationType = udfParamDetails.validation_type;
      let isLovDefaulValueSet = false;
      if (validationType !== undefined && this._helper.compareIgnoreCase(validationType,
        CyncConstants.UDF_FIELD_VALIDATION_TYPE_LOV)) {
        udfGroup.controls['is_lov'].setValue(true);
        if (udfParamDetails.is_sort_by_alphabetic) {
          if (udfParamDetails.field_type === ManageUdfMappingComponent.NUMERIC_FIELD_TYPE) {
            udfParamDetails.list_of_values = udfParamDetails.list_of_values.sort((a, b) =>
              Number(a.lov_value) > Number(b.lov_value) ? 1 : -1
            )
          } else {
            udfParamDetails.list_of_values = udfParamDetails.list_of_values.sort((a, b) =>
              a.lov_value > b.lov_value ? 1 : -1
            )
          }
        }
        udfGroup.controls['udf_param_lovs'] = new FormControl({ value: '', disabled: true }, Validators.compose([]));
        udfGroup.controls['udf_param_lovs'].setValue(<UDFLOVModel[]>udfParamDetails.list_of_values);
        if (udfParamDetails.list_of_values != undefined && udfParamDetails.list_of_values.length > 0) {
          const defaultLOV = udfParamDetails.list_of_values.find(u => u.is_default_value);
          if (defaultLOV != undefined) {
            isLovDefaulValueSet = true;
            udfGroup.controls['udf_value'].setValue(defaultLOV.lov_value);
          }
        }
      } else if (validationType !== undefined && this._helper.compareIgnoreCase(validationType,
        CyncConstants.RANGE_VALIDATION_TYPE)) {
        const value_range = udfParamDetails.value_range;
        if (value_range !== undefined) {
          validationsForUdfValueField.push(Validators.min(value_range.range_min));
          validationsForUdfValueField.push(Validators.max(value_range.range_max));
        }
      } else if (validationType !== undefined && this._helper.compareIgnoreCase(validationType,
        CyncConstants.LENGTH_VALIDATION_TYPE)) {
        const value_length = udfParamDetails.value_length;
        if (value_length !== undefined) {
          let min_length: number;
          let max_length: number;
          if (value_length.is_fixed_length) {
            min_length = value_length.length_value;
            max_length = value_length.length_value;
          } else {
            min_length = value_length.min_length;
            max_length = value_length.max_length;
          }
          validationsForUdfValueField.push(Validators.minLength(min_length));
          validationsForUdfValueField.push(Validators.maxLength(max_length));
        }
      }
      if (!udfParamDetails.is_mandatory && this.isClientSelectedForClientDetailsPrograme()) {
        udfGroup.controls['udf_value_req_for_mapping'] = new FormControl({ value: true, disabled: true }, Validators.compose([]));
        validationsForUdfValueField.push(Validators.required);
      }
     
      udfGroup.controls['udf_value'].setValidators(Validators.compose(validationsForUdfValueField));
      udfGroup.controls['udf_value_validations'].setValue(validationsForUdfValueField);
      udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
      if (!udfParamDetails.is_unique_value && !isLovDefaulValueSet) {
        udfGroup.controls['udf_value'].reset();
      }

      if ((this.checkOnlyUniqueValuesPresent()) || (udfGroup.controls['udf_value'].value === undefined || udfGroup.controls['udf_value'].value === null
        || udfGroup.controls['udf_value'].value === '')) {
        if (this.isClientProgramPresent() && !this.isClientSelectedForClientDetailsPrograme()) {
          let clientProgramGroup = this.getClientProgram();
          clientProgramGroup.controls['mappings'].setValidators(Validators.compose([]));
          clientProgramGroup.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
          clientProgramGroup.controls['mappings'].reset();
        }

      }
    });

  }

  checkOnlyUniqueValuesPresent(): boolean {
    let flag = true;
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      for (let i = 0; i < udfControl.controls.length; i++) {
        const udfGroup = <FormGroup>udfControl.controls[i];
        if (udfGroup.controls['udf_is_unique_value'] === undefined || !udfGroup.controls['udf_is_unique_value'].value) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  }

  /**
   * Method to get the client mappings
   * @param event
   * @param programIndex
   */
  onProgramParamKey(event: any, programIndex: number) {
    const paramValue = event.target.value;
    this.clientMappingSearchTerm$.next(paramValue);
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];
    if (programControl !== undefined && programControl.controls !== undefined) {
      this.showClientListSpinner = true;
      const programGroup = <FormGroup>programControl.controls[programIndex];

      let localSubject = new Subject<string>();
      localSubject = programGroup.get('prjSearchClientTerm').value;
      localSubject.next(paramValue);
      programGroup.get('prjSearchClientTerm').setValue(localSubject);

      programGroup.controls['prjClientsSpinner'].setValue(true);
      const program_param_option = programGroup.controls['program_param_option'].value;
      this._udfMappingService.searchClientMappings(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_FOR_PARAM], program_param_option, localSubject).subscribe(clients => {
        this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClientsAvailable').setValue(true);
        this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClients').setValue(clients);
        this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClientsSpinner').setValue(false);
      });
    }
  }

  /**
   * Method to get the client mappings
   * @param event
   * @param programIndex
   */
  onProgramParamSearch(programIndex: number) {
    const programControl = <FormArray>this.udfMappingForm.controls['programs'];

    if (programControl !== undefined && programControl.controls !== undefined) {
      this.showClientListSpinner = true;
      const programGroup = <FormGroup>programControl.controls[programIndex];
      const paramValue = programGroup.get('program_param_value').value;
      let localSubject = new Subject<string>();
      localSubject = programGroup.get('prjSearchClientTerm').value;
      localSubject.next(paramValue);
      programGroup.get('prjSearchClientTerm').setValue(localSubject);
      programGroup.controls['prjClientsSpinner'].setValue(true);
      const program_param_option = programGroup.controls['program_param_option'].value;
        this._udfMappingService.getClientsBasedOnProgramParamSearch(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_FOR_PARAM], program_param_option, paramValue, CyncConstants.UDF_RESPONSE_LIMIT).subscribe(clients => {
          this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClientsAvailable').setValue(true);
          this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClients').setValue(clients);
          this.udfMappingForm.controls['programs']['controls'][programIndex].get('prjClientsSpinner').setValue(false);
        });
      
    }
  }

  /**
   * Check if UDF Field Exists
   */
  checkIsUdfPresent(): boolean {
    let flag = false;
    const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
    if (udfControl !== undefined && udfControl.controls !== undefined) {
      for (let i = 0; i < udfControl.controls.length; i++) {
        const udfGroup = <FormGroup>udfControl.controls[i];
        if (udfGroup.controls['id'] !== undefined && this.isParamDefined(udfGroup.controls['id'].value)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  /**
   * Method to check if the Program Selected is report
   * @param program_id
   */
  isReportTemplate(program_id: number): boolean {
      this.isReportFlag = false;
      if (program_id !== undefined) {
        const program_code = this.getProgramCodeById(program_id);
        if (program_code !== undefined && program_code.length > 0) {
          this.isReportFlag = this._helper.compareIgnoreCase(program_code, ManageUdfMappingComponent.REPORT_PROGRAM);
        }
     
      return this.isReportFlag;
    } else {
      return false;
    }
  }
  

  /**
   * Method to check if the Program Selected is Client
   * @param program_id
   */
  isClientTemplate(program_id: number): boolean {
    let isClientFlag = false;
    if (program_id !== undefined) {
      const program_code = this.getProgramCodeById(program_id);
      if (program_code !== undefined && program_code.length > 0) {
        isClientFlag = this._helper.compareIgnoreCase(program_code, ManageUdfMappingComponent.CLIENT_DETAILS_PROGRAM);
      }
    }
    return isClientFlag;
  }

  /**
   * Method to get the Program Code by Program Id
   * @param id
   */
  getProgramCodeById(id: number): string {
    let program_code: string;
    if (this.programs_lovs !== undefined) {
      const program = this.findProgramById(id);
      if (program !== undefined) {
        program_code = program.column_value;
      }
    }
    return program_code;
  }

  /**
   * Get Program Details By Id
   * @param id
   */
  findProgramById(id: number): Program {
    let program: Program;
    if (this.programs_lovs !== undefined) {
      program = this.programs_lovs.find(p => p.id === id);
    }
    return program;
  }

  /**
   * Get Udf Details By Id
   * @param id
   */
  findUdfById(id: number): CommonIdNameModel {
    let udf: CommonIdNameModel;
    if (this.udf_details !== undefined) {
      udf = this.udf_details.find(u => u.id === id);
    }
    return udf;
  }

  /**
   * This Method is used to check if the current action is add
   */
  isCurrentActionAdd(): boolean {
    return this._helper.isCurrentActionAdd(this.currentAction);
  }


  /**
   * Method to validate if client mappings are defined
   * @param programGroup
   */
  isClientMappingsDefined(programGroup: FormGroup): boolean {
    return programGroup.controls['mappings'] !== undefined &&
      programGroup.controls['mappings'].value !== undefined &&
      programGroup.controls['mappings'].value !== null &&
      (programGroup.controls['mappings'].value.length > 0);
  }

  /**
   * Method to save Udf Mappings
   * @param model
   * @param isValid
   * @param isNew
   */
  saveUdfMapping(model: UDFMappingModel, isValid: boolean, isNew: boolean) {
    this._msgLoader.showLoader(true);
    this.createUDFMapping(model, isNew);
  }

  /**
   * Method to create UDF Mapping
   * @param udfMappingModel
   * @param isNew
   */
  createUDFMapping(udfMappingModel: UDFMappingModel, isNew: boolean) {
    this._msgLoader.showLoader(true);

    //Flash message code if selected all checked start
    let selectedAllValuesArray = (udfMappingModel.programs).map(function (obj) {
      return obj.isAllProgramSelected
    });
    const isAllSelectedInArray = selectedAllValuesArray.includes(true);
    if (isAllSelectedInArray) {
      this._helper.showApiMessages(ClientValidationMessages.UDF_MAPPING_PROGRESS_MESSAGE, 'success');
    }
    //Flash message code end

    this._udfMappingService.saveUdfMapping(this._apiMapper.endpoints[ListUdfMappingComponent.UDF_MAPPING_API], udfMappingModel).subscribe(res => {
      // Showing success message if selected all option is false.
      if (!isAllSelectedInArray) {
        this._helper.showApiMessages(ClientValidationMessages.SAVE_UDF_MAPPING, 'success');
      }
      // this._helper.showApiMessages(ClientValidationMessages.SAVE_UDF_MAPPING, 'success');

      if (!isNew) {
        this.navigateToUdfMappingList();
        this._msgLoader.showLoader(false);
      } else {
        this.udfMappingForm.reset();
        this.udfMappingForm.setControl('udfs', this._fb.array([]));
        this.udfMappingForm.setControl('programs', this._fb.array([]));
        this.allClients = [];
        this.selectedClients = [];
        this.addFirstRow();
        this._msgLoader.showLoader(false);
      }
    });
  }

  /**
   * Method to Update Udf Mapping
   * @param model
   * @param isValid
   */
  updateUdfMapping(model: UDFMappingModel) {
    this._udfMappingService.updateUdfMapping(this._apiMapper.endpoints[ManageUdfMappingComponent.UPDATE_UDF_MAPPINGS], model).subscribe(res => {
      this._helper.showApiMessages(ClientValidationMessages.UPDATE_UDF_MAPPING, 'success');
      this.navigateToUdfMappingList();
    });
  }

  /**
   * Get unique selected clients
   * @param list
   */
  getUniqueSelectedClients(list: any[]): any[] {
    if (list !== undefined && list.length > 0) {
      for (var i = 0; i < list.length; ++i) {
        for (var j = i + 1; j < list.length; ++j) {
          if (list[i].id === list[j].id)
            list.splice(j--, 1);
        }
      }
    }
    return list;
  }

  /**
   * Navigate to UDF Mapping Listing Page
   */
  navigateToUdfMappingList() {
    this._router.navigateByUrl('udf/udf-mapping');
  }

  /**
   * Is UDF/Program Defined
   * @param param
   */
  isParamDefined(param: any): boolean {
    let isDefined = false;
    if (param !== undefined && param !== null) {
      if (typeof param === 'string') {
        if (param.length > 0) {
          isDefined = true;
        }
      } else {
        isDefined = true;
      }
    }
    return isDefined;
  }

  /**
   * Populate udfs in sortable array
   */
  eventOptions: SortablejsOptions = {
    onUpdate: (event) => {
      if (event !== undefined) {

      }
      const newIndex = event.newIndex;
      const oldIndex = event.oldIndex;

      const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];

      udfControl.controls[oldIndex] = udfControl.controls.splice(newIndex, 1, udfControl.controls[oldIndex])[0];

    }
  };

  /**
   * Method to validate if maximum number of programs/udfs hav ebeen added
   * @param arrList1
   * @param arrList2
   */
  checkAddRowsAllowed(arrList1: any, arrList2: any): boolean {
    let addRowAllowed = true;
    if (arrList1 !== undefined && arrList2 !== undefined && arrList1.length === arrList2.length) {
      addRowAllowed = false;
    }
    return addRowAllowed;
  }

  /**
   * Method to delete UDF program row
   * @param index
   * @param formArrayKey
   */
  deleteUdfProgramRow(index: number, formArrayKey: string) {
    (<FormArray>this.udfMappingForm.controls[formArrayKey]).removeAt(index);
    if (this._helper.compareIgnoreCase(formArrayKey, 'programs')) {
      if (!this.checkIfUDFValueFieldIsRequired()) {
        this.isUDFValueFieldRequiredToShow = false;
        this.resetAllUdfValues(false);
      } else if (this.checkIfNoProgramPresent()) {
        this.allClients = [];
        this.selectedClients = [];
        this.programParamValue = '';
        this.selectedReports = [];
        this.resetAllUdfValues(true);
      } else if (this.checkIfOnlyReportProgram()) {
        this.allClients = [];
        this.selectedClients = [];
        this.programParamValue = '';
        this.isUDFValueFieldRequiredToShow = false;
        this.resetAllUdfValues(false);
      } else if (this.checkIfOnlyClientProgram()) {
        this.resetAllUdfValues(true);
        this.isUDFValueFieldRequiredToShow = true;
        this.selectedReports = [];
      }
    }

  }

  /**
   * Method to validate if udf/ program has been already selected from drop down
   * @param value
   * @param list
   * @param keyName
   */
  checkIfValueAleadySelected(value: any, list: any[], keyName: string): boolean {
    let valuePresent = false;
    const valueFromList = list.filter(v => v[keyName] === value);
    if (valueFromList !== undefined && valueFromList.length > 1) {
      valuePresent = true;
    }
    return valuePresent;
  }

  /**
   * Method to show alert popup saying the UDF/program is already selected
   * @param event
   * @param keyName
   * @param list
   * @param value
   * @param message
   * @param formControl
   */
  showAlertPopUpOnSelectOfDuplicate(event: any, keyName: string, list: any[], value: any, message: string, formControl: FormControl) {
    if (this.checkIfValueAleadySelected(value, list, keyName)) {
      formControl.setValue(this.previousValue);
      //event.preventDefault();
      this._helper.openAlertPoup("Information", message);
    }
  }

  /**
   * If user has not done any changes to form , this method is to check same and disable action btn save/update
   */
  isFormValid(): boolean {
    if (CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      return !this.udfMappingForm.valid;
    }
  }


  /**
   * Method to get udfs array
   */
  get UdfsControl() {
    return <FormArray>this.udfMappingForm.get('udfs');
  }

  /**
   * Method to get programs array
   */
  get programsControl() {
    return <FormArray>this.udfMappingForm.get('programs');
  }

  /**
   * method to get value of specific form control name for requested index from program control array
   */
  getProgrameFormControlValue(index: number, field: string) {
      if(this.programsPrefixed==='LS'){
         return this.udfMappingForm.controls['programs']['controls'][index].get('prjLoanSetup').value;
      } else if(this.programsPrefixed==='CL'){
        return this.udfMappingForm.controls['programs']['controls'][index].get('prjColletralLoanUpload').value;
      }else {
        return this.udfMappingForm.controls['programs']['controls'][index].get(field).value;
      }
  }

  /**
   * Get Form Control field
   * @param field
   */
  getFormControl(controlName: string, formArrayName: string, index: number) {
    // return this.udfMappingForm.get(field);
    const formArray = <FormArray>this.udfMappingForm.controls[formArrayName];
    if (formArray !== undefined) {
      const formGroup = <FormGroup>formArray.controls[index];
      if (formGroup !== undefined) {
        return formGroup.controls[controlName];
      }
    }
  }

  /**
  * this method is just to check if input field (where we will enter UDF value) is required to show or not on UI
  */
  isUDFValueFieldRequired(program_id): boolean {
    let program = this.programesForClientSelection.find(i => i === program_id);
    return !(program != undefined);
  }

  /**
   * method to check if UDF value is required for requested programe or not
   */
  isUDFValueMandatory(program_name) {
    let program = this.programesWhereUDFValueIsRequired.find(i => i === program_name);
    if (program != null) {
      return true;
    }
    return false;
  }

  /**
   * this method is to check if report selection or client selection drop down is required for requested programe id or not
   */
  isClientOrReportSelectionRequired(program_id) {
    let program = this.programesWhereClientOrReportSelectedIsNotRequired.find(i => i === program_id);
    return !(program != undefined);
  }

  /**
   * this method is just to tell whether once user select any programe , do we need to get mapped client for it or not
   */
  isProgramNeedsMaapedClients(program_id): boolean {
    let programObj = this.findProgramById(program_id);
    let program = this.programesToGetExistingMappedClients.find(i => i === programObj.column_value);
    return program != undefined;
  }

  /**
   * this method will check if any of client selected for a program client details
   */
  isClientSelectedForClientDetailsPrograme() {

    let flag = false;
    if (this.checkIfClientDetailsProgramSelected()) {
      const programControl = <FormArray>this.udfMappingForm.controls['programs'];
      if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
        for (let i = 0; i < programControl.controls.length; i++) {
          const programGroup = <FormGroup>programControl.controls[i];
          const programId = programGroup.controls['program_id'].value;
          if (this.isClientTemplate(programId)) {
            if (programGroup.get('mappings').value != null &&
              programGroup.get('mappings').value != undefined && programGroup.get('mappings').value.length > 0) {
              flag = true;
              break;
            }
          }
        }
      }
    }
    return flag;
  }

}