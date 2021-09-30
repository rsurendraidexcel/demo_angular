import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { UdfMappingService } from '../service/udf-mapping.service';
import { UDFDetailsModel, Program, ClientProgramParam, CommonIdNameModel, UDFLOVModel, UDFMappingModel, UdfIdValuePair, UDFModelForClientMappings } from '../model/udf-mapping.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { SortablejsOptions } from 'angular-sortablejs/dist';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ListUdfMappingComponent } from '@app/Administration/user-defined-field/udf-mapping/list-udf-mapping/list-udf-mapping.component';
import { ClientValidationMessages } from '@cyncCommon/utils/client-validation-message';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { Subject } from 'rxjs/Subject';
import { ManageUdfMappingComponent } from '@app/Administration/user-defined-field/udf-mapping/manage-udf-mapping/manage-udf-mapping.component';
import { forkJoin, of, interval } from 'rxjs';

@Component({
	selector: 'app-edit-udf-mapping',
	templateUrl: './edit-udf-mapping.component.html',
	styleUrls: ['./edit-udf-mapping.component.scss']
})
export class EditUdfMappingComponent implements OnInit {

	udfMappingForm: FormGroup;
	public static UDF_LOVS = 'udf_lovs';
	public static PROGRAMS_LOVS = 'programs_lovs';
	public static CLIENT_PROGRAM_PARAMS_LOVS = 'client_program_params_lovs';
	public static REPORTS_LIST = 'reports_list';
	public static GET_PARAMETERS_FOR_PROGRAMS = 'get_parameters_for_programs';
	public static GET_CLIENTS_FOR_PARAM = 'get_clients_for_param';
	public static GET_UDF_DETAILS_BY_ID = 'get_udf_details_by_id';
	public static GET_UDF_MAPPING_BY_PROGRAM_ID = 'get_udf_mapping_by_program_id';
	public static UPDATE_UDF_MAPPINGS = 'update-udf-mapping';
	public static REPORT_PROGRAM = 'R';
	public static CLIENT_DETAILS_PROGRAM = 'CD';
	public static DUPLICATE_UDF_MAPPING_MESSAGE = 'Mapping for {field} {value} is already present';
	public static GET_CLIENTS_BY_UDF_ID = 'get-clients-by-udf-id';
	public static FIELD_CONSTANT = '{field}';
	public static VALUE_CONSTANT = '{value}';
	public static UDF_FIELD_NAME = 'UDF';
	public static PROGRAM_FIELD_NAME = 'Program';
	public static NUMERIC_FIELD_TYPE = 'N';
	udf_details: CommonIdNameModel[];
	programs_lovs: Program[];
	program_param_lovs: ClientProgramParam[];
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
	udfIdForSequenceOne: number;
	udfValueForSequenceOne: any;
	programesForClientSelection = ['DEB','DR','SR','ENSI','CR','R'];
	isUDFValueFieldRequiredToShow : boolean = true; // by default we have to show udf value field on ui
	programesWhereClientOrReportSelectedIsNotRequired = ['CS'];
	// isLoanSetupProgram :boolean = true;
	programsPrefixed: string;
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
		
		// this.allManagementReports = result[3];

		const originalReportList = result[3];
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

	searchUdfParam(event: any, index: number) {
		const formArray = (<FormArray>this.udfMappingForm.controls['udfs']);
		if (formArray !== undefined && formArray.controls !== undefined) {
			const udfGroup = <FormGroup>formArray.controls[index];
			const originalList = JSON.parse(JSON.stringify(udfGroup.controls['udf_value_options_original'].value));
			const filteredList = originalList.filter(u => u.startsWith(event.query));
			udfGroup.controls['udf_value_options'].setValue(filteredList);

		}
	}

	/**
	 * Render Form with values as per the Add / Edit operation
	 */
	_renderForm() {
		/* getting router parameters */
		this._route.params.subscribe(params => {
			const udfProgrmaMappingId = params['id'];
			// if (udfProgrmaMappingId !== undefined && !this._helper.isCurrentActionAdd(udfProgrmaMappingId)) {
			this.currentAction = CyncConstants.EDIT_OPERATION;
			this.showUdfProgramMappingForm(udfProgrmaMappingId);
			// } else {
			//   this.addFirstRow();
			//   this.currentAction = CyncConstants.ADD_OPERATION;
			// }
		});
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
			if(udfProgramMappingRes.programs[0].program_code === 'LS' && udfProgramMappingRes.programs[0].program_name === "Loan Set Up" ){
				this.programsPrefixed='LS';
			}else if(udfProgramMappingRes.programs[0].program_code ==='CL' && udfProgramMappingRes.programs[0].program_name==="Collateral Loan Upload"){
				this.programsPrefixed='CL';
			}else {
				 this.programsPrefixed='default';             
			}
			// Sorting the udfs based on sequence
			const sortedUdfs = udfProgramMappingRes.udfs.sort((o1, o2) => {
				if (o1.sequence > o2.sequence) {
					return 1;
				} else if (o1.sequence < o2.sequence) {
					return -1;
				} else {
					return 0;
				}
			});

			udfProgramMappingRes.udfs = sortedUdfs;
			
			this.mapResponseToFormArray(udfProgramMappingRes);
			this._msgLoader.showLoader(false);
		});
	}

	/**
	 * Get Form Group for Client Details Program
	 */
	isClientProgramPresent(): boolean {
		let flag = false;
		const programControl = <FormArray>this.udfMappingForm.controls['programs'];
		if (programControl !== undefined && programControl.controls !== undefined && programControl.controls.length > 0) {
			for (let i = 0; i < programControl.controls.length; i++) {
				const programGroup = <FormGroup>programControl.controls[i];
				const programId = programGroup.controls['program_id'].value;
				const programValue = this.getProgramCodeById(programId);
				if (this._helper.compareIgnoreCase(programValue, ManageUdfMappingComponent.CLIENT_DETAILS_PROGRAM)) {
					flag = true;
					break;
				}
			}
		}
		return flag;
	}


	/**
	 * This method gets called on change of udf param value
	 * @param index
	 */
	onChangeUdfParamValue(index: number) {
		if (!this.isCurrentActionAdd() && this.isClientProgramPresent()) {
			// const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
			// if (udfControl !== undefined && udfControl.controls !== undefined) {
			//   const udfGroup = <FormGroup>udfControl.controls[index];
			//   if (udfGroup !== undefined) {
			//     const udfId = udfGroup.controls['id'].value;
			//     const udfValue = udfGroup.controls['udf_value'].value;
			//     const url = this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_BY_UDF_ID].replace('{udfId}', udfId)
			//       .replace('{udfValue}', udfValue);
			//     this._udfMappingService.getClientsForUdfSelected(url).subscribe(res => {
			//       this.originalSelectedClients = JSON.parse(JSON.stringify(res));
			//       this.allClients = JSON.parse(JSON.stringify(res));;
			//       this.selectedClients = JSON.parse(JSON.stringify(res));;
			//     });
			//   }
			// }
			this.getClientsForSelectedUdfs();
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
				this.mapUdfDetailsForUdf(fb, udf.id, udf.udf_value, udf.sequence);
			}

			udfsControlArray.push(fb);
		});
		let programsControlArray = <FormArray>this.udfMappingForm.controls['programs'];
		udfProgramMappingRes.programs.forEach(program => {
			const fb = this.initProgramRows();
			fb.patchValue(program);
			//This is called in case of Edit, which has a single program
			if(!this.isClientOrReportSelectionRequired(program.program_code)){
				this.isReportProgram = false;
				this.isUDFValueFieldRequiredToShow = false;
				fb.controls['reportOrClientSelectionFlag'].setValue(false);
			}else if (this.isReportTemplate(program.program_id)) {				
				this.selectedReports = program.mappings;
				this.isReportProgram = true;
				this.isUDFValueFieldRequiredToShow = false;
				fb.controls['mappings'].setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
				fb.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
			}else if(!this.isUDFValueFieldRequired(program.program_code)){
				fb.controls['mappings'].setValidators(Validators.compose([]));
				fb.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
				this.originalSelectedClients = JSON.parse(JSON.stringify(program.mappings));
				this.selectedClients = JSON.parse(JSON.stringify(program.mappings));
				this.allClients = JSON.parse(JSON.stringify(program.mappings));
				this.isReportProgram = false ;
				this.isUDFValueFieldRequiredToShow = false;
			} else {
				fb.controls['mappings'].setValidators(Validators.compose([]));
				fb.controls['mappings'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
				this.originalSelectedClients = JSON.parse(JSON.stringify(program.mappings));
				this.selectedClients = JSON.parse(JSON.stringify(program.mappings));
				this.allClients = JSON.parse(JSON.stringify(program.mappings));
				this.isUDFValueFieldRequiredToShow = true ;
			}
			programsControlArray.push(fb);
		});
	}

	/**
	 * Scan all the udfs and get clients for all the selected
	 * Return a map with clients Selected
	 */
	getClientsForSelectedUdfs() {

   //commenting this method to prevent client selection change on each UDF value change => cyncps-4316
 

		// let udfsControlArray = <FormArray>this.udfMappingForm.controls['udfs'];
		// if (udfsControlArray !== undefined && udfsControlArray.length > 0) {
		// 	this.showClientListSpinner = true;
		// 	let arrSelectedUdfs: UdfIdValuePair[] = [];
		// 	for (let i = 0; i < udfsControlArray.length; i++) {
		// 		const udfGroup = <FormGroup>udfsControlArray.controls[i];
		// 		if (udfGroup !== undefined) {
		// 			const udfId = udfGroup.controls['id'].value;
		// 			const udfValue = udfGroup.controls['udf_value'].value;
		// 			if (udfValue !== undefined && udfValue !== '') {

		// 				const udfIdValuePair: UdfIdValuePair = {
		// 					'udf_id': udfId,
		// 					'udf_value': udfValue
		// 				}
		// 				arrSelectedUdfs.push(udfIdValuePair);
		// 				// this.showClientListSpinner = false;
		// 			}
		// 		}
		// 	}


		// 	if (arrSelectedUdfs.length > 0) {
		// 		const udfModelForClientMappings: UDFModelForClientMappings = {
		// 			'udfs': arrSelectedUdfs
		// 		}
		// 		// Call Patch Api here and get the client mappings and inside that
		// 		const url = this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_BY_UDF_ID];
		// 		this._udfMappingService.getClientMappingsForUdf(url, udfModelForClientMappings).subscribe(res => {
		// 			this.allClients = JSON.parse(JSON.stringify(res));
		// 			this.selectedClients = JSON.parse(JSON.stringify(res));
		// 			this.originalSelectedClients = JSON.parse(JSON.stringify(res));
		// 			this.showClientListSpinner = false;
		// 		});
		// 	} else {
		// 		this.allClients = [];
		// 		this.selectedClients = [];
		// 		this.originalSelectedClients = [];
		// 		this.showClientListSpinner = false;
		// 	}
		// }
	}

	/**
	 * Get Drop down values using APIs
	 */
	getDropDownValues(): Observable<any[]> {
		let response1 = this._udfMappingService.getUdfValues(this._apiMapper.endpoints[ManageUdfMappingComponent.UDF_LOVS]);
		let response2 = this._udfMappingService.getPrograms(this._apiMapper.endpoints[ManageUdfMappingComponent.PROGRAMS_LOVS]);
		let response3 = this._udfMappingService.getClientProgramParams(this._apiMapper.endpoints[ManageUdfMappingComponent.CLIENT_PROGRAM_PARAMS_LOVS]);
		let response4 = this._udfMappingService.getManagementReports(this._apiMapper.endpoints[ManageUdfMappingComponent.REPORTS_LIST]);
		return forkJoin([response1 , response2 , response3 , response4]);
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
			udf_value_options: new FormControl({ value: [], disabled: true }, Validators.compose([])),
			udf_value_options_original: new FormControl({ value: [], disabled: true }, Validators.compose([])),
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
			program_value: new FormControl(null, Validators.compose([])),
			program_param_value: new FormControl('', Validators.compose([])),
			program_code: new FormControl('', Validators.compose([])),
			mappings: new FormControl([], Validators.compose([])),
			reportOrClientSelectionFlag : new FormControl({ value: true, disabled: true }, Validators.compose([]))
			//program_params: this._fb.array([])
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
			if (this.checkIfOnlyReportProgram()) {
				this.resetAllUdfValues();
				this.isReportProgram = true;
			}
			let programSelected = this.findProgramById(programId);
			if (programSelected !== undefined) {
				const programName = programSelected.column_display;
				const message = ManageUdfMappingComponent.DUPLICATE_UDF_MAPPING_MESSAGE.
					replace(ManageUdfMappingComponent.FIELD_CONSTANT, ManageUdfMappingComponent.PROGRAM_FIELD_NAME).
					replace(ManageUdfMappingComponent.VALUE_CONSTANT, programName);
				this.showAlertPopUpOnSelectOfDuplicate(event, 'program_id',
					programControl.value, programId, message,
					(<FormControl>programGroup.controls['program_id']));

				programGroup.controls['program_name'].setValue(programSelected.column_value);
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
			// In case of Add Page if the udfParam DropDown is cahnged again the remove/add LOV avlues depending upon validationType
			udfGroup.controls['is_lov'].setValue(false);

			const udfId = udfGroup.controls['id'].value;
			let udfSelected = this.findUdfById(udfId);
			if (udfSelected !== undefined) {
				const udfName = udfSelected.name;
				const message = ManageUdfMappingComponent.DUPLICATE_UDF_MAPPING_MESSAGE.
					replace(ManageUdfMappingComponent.FIELD_CONSTANT, ManageUdfMappingComponent.UDF_FIELD_NAME).
					replace(ManageUdfMappingComponent.VALUE_CONSTANT, udfName);
				this.showAlertPopUpOnSelectOfDuplicate(event, 'id', udfControl.value, udfId, message, (<FormControl>udfGroup.controls['id']));
			}
			udfGroup.controls['udf_value'].clearValidators();
			// if (this.isCurrentActionAdd())
			// udfGroup.controls['udf_value'].reset();
			this.mapUdfDetailsForUdf(udfGroup, udfId, udfGroup.controls['udf_value'].value, index);

		}
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
	 * Method to rest udf value and reste all the validations applied of udf values
	 */
	resetAllUdfValues() {
		const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];
		if (udfControl !== undefined && udfControl.controls !== undefined) {
			for (let i = 0; i < udfControl.controls.length; i++) {
				const udfGroup = <FormGroup>udfControl.controls[i];
				if (udfGroup !== undefined && udfGroup.controls['udf_value'] !== undefined) {
					udfGroup.controls['udf_value'].setValidators(Validators.compose([]));
					udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
					udfGroup.controls['udf_value'].reset();
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
	mapUdfDetailsForUdf(udfGroup: FormGroup, udfId: number, value: any, sequence: number) {
		const url = this._apiMapper.endpoints[ManageUdfMappingComponent.GET_UDF_DETAILS_BY_ID].replace("{udfId}", udfId.toString());
		this._udfMappingService.getUdfDetailsById(url).subscribe(udfParamDetails => {
			// For Edit Mandatory Validation is not required
			// udfGroup.controls['udf_is_mandatory'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
			// udfGroup.controls['udf_is_mandatory'].setValue(udfParamDetails.is_mandatory);
			let validationsForUdfValueField = [];
			if (udfParamDetails.field_type === ManageUdfMappingComponent.NUMERIC_FIELD_TYPE) {
				validationsForUdfValueField.push(Validators.pattern('^[0-9]*$'));
			}
			// udfGroup.controls['udf_is_updatable'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
			// udfGroup.controls['udf_is_updatable'].setValue(udfParamDetails.is_updatable);

			// udfGroup.controls['udf_is_unique_value'] = new FormControl({ value: false, disabled: true }, Validators.compose([]));
			// udfGroup.controls['udf_is_unique_value'].setValue(udfParamDetails.is_unique_value);

			// If field is unique or updatable then show the field as lov
			let isUnique = false;
			let isUpdatable = false;
			if ((udfParamDetails.is_unique_value !== undefined && udfParamDetails.is_unique_value)) {
				isUnique = true;
			}
			if ((udfParamDetails.is_updatable !== undefined && udfParamDetails.is_updatable)) {
				isUpdatable = true;
			}
			if (isUnique || !isUpdatable) {
				udfGroup.controls['is_lov'].setValue(true);
				udfGroup.controls['udf_param_lovs'] = new FormControl({ value: '', disabled: true }, Validators.compose([]));
				let uDFLOVModel : UDFLOVModel;
				if (udfParamDetails.udf_values_for_auto_complete !== undefined && udfParamDetails.udf_values_for_auto_complete.length > 0) {
					uDFLOVModel = new UDFLOVModel();
					uDFLOVModel.lov_value = udfParamDetails.udf_values_for_auto_complete[0];
					uDFLOVModel.description = udfParamDetails.udf_values_for_auto_complete[0];
				}
				if(uDFLOVModel!==undefined)
					udfGroup.controls['udf_param_lovs'].setValue([uDFLOVModel]);
			}

			// For Edit Mandatory Validation is not required

			// if (udfParamDetails.is_mandatory) {
			//   validationsForUdfValueField.push(Validators.required);
			//   // udfGroup.controls['udf_value'].setValidators(Validators.compose([Validators.required]));
			// }
			const validationType = udfParamDetails.validation_type;

			if (!isUnique && isUpdatable && validationType !== undefined && this._helper.compareIgnoreCase(validationType,
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

			// write logic to populate options
			if (!isUnique && isUpdatable && !(validationType !== undefined && this._helper.compareIgnoreCase(validationType,
				CyncConstants.UDF_FIELD_VALIDATION_TYPE_LOV))) {
				const options = udfParamDetails.udf_values_for_auto_complete;
				udfGroup.controls['udf_value_options'].setValue(options);
				udfGroup.controls['udf_value_options_original'].setValue(options);
			}

			// Value should be set by default for sequence 1
			if (sequence === 1) {
				udfGroup.controls['udf_value'].setValue(value);
				this.udfIdForSequenceOne = udfId;
				this.udfValueForSequenceOne = value;
			}
			else {
				udfGroup.controls['udf_value'].setValue('');
			}

			udfGroup.controls['udf_value'].setValidators(Validators.compose(validationsForUdfValueField));
			udfGroup.controls['udf_value'].updateValueAndValidity({ emitEvent: false, onlySelf: true });


		});

	}

	/**
	 * Method to get the client mappings
	 * @param event
	 * @param programIndex
	 */
	onProgramParamKey(event: any, programIndex: number) {
		const paramValue = this.programParamValue;
		this.clientMappingSearchTerm$.next(paramValue);
		if (paramValue == undefined || paramValue == null || paramValue.length == 0) {
			this.selectedClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
			this.allClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
			return;
		}
		const programControl = <FormArray>this.udfMappingForm.controls['programs'];
		if (programControl !== undefined && programControl.controls !== undefined) {
			this.showClientListSpinner = true;
			const programGroup = <FormGroup>programControl.controls[programIndex];
			const program_param_option = programGroup.controls['program_param_option'].value;
			this._udfMappingService.searchClientMappings(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_FOR_PARAM], program_param_option, this.clientMappingSearchTerm$).subscribe(clients => {
				this.allClients = clients;
				this.showClientListSpinner = false;
			});
		}
	}

	/**
	 * Method to get the client mappings
	 * @param event
	 * @param programIndex
	 */
	onProgramParamSearch(programIndex: number) {
		const paramValue = this.programParamValue;
		//this.clientMappingSearchTerm$.next(paramValue);
		if (paramValue == undefined || paramValue == null || paramValue.length == 0) {
			this.selectedClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
			this.allClients = JSON.parse(JSON.stringify(this.originalSelectedClients));
			return;
		}
		const programControl = <FormArray>this.udfMappingForm.controls['programs'];
		if (programControl !== undefined && programControl.controls !== undefined) {
			this.showClientListSpinner = true;
			const programGroup = <FormGroup>programControl.controls[programIndex];
			const program_param_option = programGroup.controls['program_param_option'].value;
			this._udfMappingService.getClientsBasedOnProgramParamSearch(this._apiMapper.endpoints[ManageUdfMappingComponent.GET_CLIENTS_FOR_PARAM], program_param_option,  this.programParamValue, CyncConstants.UDF_RESPONSE_LIMIT).subscribe(clients => {
				this.allClients = clients;
				this.showClientListSpinner = false;
			});
		}
	}	

	/**
	 * Method to check if the Program Selected is report
	 * @param program_id
	 */
	isReportTemplate(program_id: number): boolean {
		let isReportFlag = false;
		if (program_id !== undefined) {
			const program_code = this.getProgramCodeById(program_id);
			if (program_code !== undefined && program_code.length > 0) {
				isReportFlag = this._helper.compareIgnoreCase(program_code, ManageUdfMappingComponent.REPORT_PROGRAM);
			}
		}
		return isReportFlag;
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
	 * Method to set the Clients for Updating Udf Mapping
	 */
	setSelectedClientsForUpdateUdfMapping() {
		// Code to set selectedClients
		let allClientsFromListBox = JSON.parse(JSON.stringify(this.allClients));
		let selectedClientsFromListBox = JSON.parse(JSON.stringify(this.selectedClients));
		if (allClientsFromListBox !== undefined && allClientsFromListBox.length > 0) {
			let uniqueClients = allClientsFromListBox.filter(c => selectedClientsFromListBox.find(s => s.id === c.id) == undefined);
			if (uniqueClients !== undefined && uniqueClients.length > 0) {
				this.originalSelectedClients = this.originalSelectedClients.filter(o => uniqueClients.find(u => u.id == o.id) == undefined);
				this.originalSelectedClients.push.apply(this.originalSelectedClients, this.selectedClients);
				this.originalSelectedClients = this.getUniqueSelectedClients(this.originalSelectedClients);
			}
		}


		const programControlFormArray = <FormArray>this.udfMappingForm.controls['programs'];
		if (programControlFormArray !== undefined && programControlFormArray.length > 0) {
			for (let i = 0; i < programControlFormArray.length; i++) {
				const programGroup = <FormGroup>programControlFormArray.controls[i];
				if (programGroup !== undefined && this.isClientMappingsDefined(programGroup)) {
					programGroup.controls['mappings'].setValue(this.originalSelectedClients);
				}
			}
		}
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
		// if (this.isCurrentActionAdd()) {
		// this.createUDFMapping(model, isNew);
		// } else {
		this.updateUdfMapping(model);
		// }

		// const value_string = JSON.stringify(model);
		// console.log('value_string: ' + value_string);
	}

	/**
	 * Method to create UDF Mapping
	 * @param udfMappingModel
	 * @param isNew
	 */
	createUDFMapping(udfMappingModel: UDFMappingModel, isNew: boolean) {
		this._msgLoader.showLoader(true);
		this._udfMappingService.saveUdfMapping(this._apiMapper.endpoints[ListUdfMappingComponent.UDF_MAPPING_API], udfMappingModel).subscribe(res => {
			this._helper.showApiMessages(ClientValidationMessages.SAVE_UDF_MAPPING, 'success');
			this._msgLoader.showLoader(false);
			if (!isNew) {
				this.navigateToUdfMappingList();
			} else {
				// On Click of Save and New the form should get reset and Drop Downs should be reloaded
				this.udfMappingForm.reset();
				this.udfMappingForm.setControl('udfs', this._fb.array([]));
				this.udfMappingForm.setControl('programs', this._fb.array([]));
				this.addFirstRow();
				//this.getDropDownValues();
			}
		});
	}

	/**
	 * Method to Update Udf Mapping
	 * @param model
	 * @param isValid
	 */
	updateUdfMapping(model: UDFMappingModel) {
		this._msgLoader.showLoader(true);

		//Flash message code if selected all checked start
		let selectedAllValuesArray = (model.programs).map(function (obj) {
			return obj.isAllProgramSelected
		});
		const isAllSelectedInArray = selectedAllValuesArray.includes(true);
		if(isAllSelectedInArray){
			this._helper.showApiMessages(ClientValidationMessages.UDF_MAPPING_PROGRESS_MESSAGE, 'success');
		}
		//Flash message code end

		this._udfMappingService.updateUdfMapping(this._apiMapper.endpoints[ManageUdfMappingComponent.UPDATE_UDF_MAPPINGS], model).subscribe(res => {
			// Showing success message if selected all option is false.
			if(!isAllSelectedInArray){
				this._helper.showApiMessages(ClientValidationMessages.UPDATE_UDF_MAPPING, 'success');
			}
			// this._helper.showApiMessages(ClientValidationMessages.UPDATE_UDF_MAPPING, 'success');
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
		this._msgLoader.showLoader(false);
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
				const newIndex = event.newIndex;
				const oldIndex = event.oldIndex;
				const udfControl = <FormArray>this.udfMappingForm.controls['udfs'];

				udfControl.controls[oldIndex] = udfControl.controls.splice(newIndex, 1, udfControl.controls[oldIndex])[0];
				this.udfMappingForm.markAsDirty();
			}

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
		this.udfMappingForm.markAsDirty();
	}

	/**
	 * Method to validate if udf/ program has been already selected
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

		// const programControlFormArray = <FormArray>this.udfMappingForm.controls['programs'];
		// if (programControlFormArray !== undefined && programControlFormArray.length > 0) {
		// 	for (let i = 0; i < programControlFormArray.length; i++) {
		// 		const programGroup = <FormGroup>programControlFormArray.controls[i];
		// 		if (programGroup !== undefined) {
		// 			if (programGroup.controls['program_id'] != undefined) {
		// 				const programId = programGroup.controls['program_id'].value;
		// 				if (!this.isReportTemplate(programId)) {
		// 					if (!this.isClientMappingsDefined(programGroup)) {
		// 						return true;
		// 					}
		// 				}

		// 			}

		// 		}
		// 	}
		// }

		// if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
		// 	return !this.udfMappingForm.valid;
		// }

		if (CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
			// we have to disable form btn
			return !this.udfMappingForm.valid || this.udfMappingForm.pristine
		} else {
			// we dont have to disable btn
			return false;
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
  isUDFValueFieldRequired(program_id) : boolean {
    let program =  this.programesForClientSelection.find(i=> i ===program_id);
    return !(program!= undefined);
   }

     /**
   * this method is to check if report selection or client selection drop down is required for requested programe id or not
   */
  isClientOrReportSelectionRequired(program_id){
    let program = this.programesWhereClientOrReportSelectedIsNotRequired.find(i => i === program_id);
    return !(program != undefined);
  }

  /**
   * method to get value of specific form control name for requested index from program control array
   */
  getProgrameFormControlValue(index: number, field: string) {
    return this.udfMappingForm.controls['programs']['controls'][index].get(field).value;
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
			if(allListItems.length == event.value.length){
			programGroup.controls['isAllProgramSelected'].setValue(true);
			}else{
			programGroup.controls['isAllProgramSelected'].setValue(false);
			}
		}
	}
}
