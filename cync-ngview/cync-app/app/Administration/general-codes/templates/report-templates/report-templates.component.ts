import { Component, OnInit, Input } from '@angular/core';
import { AppConfig } from '../../../../app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { CyncTextEditorComponent } from '@cyncCommon/component/cync-text-editor/cync-text-editor.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';
import { DragulaService } from 'ng2-dragula';
import { ReportTemplateService } from '../services/report-template.service';
import { Helper } from '@cyncCommon/utils/helper';
import { LenderAPIResponseModel, PlaceHolderChoiceModel } from '../models/report-templates.model';
// import { setTimeout } from 'timers';

/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;

/**
* Place holders value array
*/
const placeHolderObjectsArray = [
	{ id: 1, name: "Report Name", value: "report_name" },
	{ id: 2, name: "Client Name", value: "client_name" },
	{ id: 3, name: "Current Date", value: "current_date" },
	{ id: 4, name: "BBC DATE", value: "bbc_date" }
];


@Component({
	selector: 'app-report-templates',
	templateUrl: './report-templates.component.html'
})
export class ReportTemplatesComponent implements  OnInit {

	lenderId: string;
	reportTemplatesId: any;
	isDisable = true;
	reportTemplatesDtls: any;
	editReportTemplates: FormGroup;
	reportTemplatesList: any;
	content: any;
	requestModel: any;
	id: any;
	productType: string;
	selectedValue: string;
	hideEditor: string = "hide";
	hideSaveCancel: string = "hide";
	hidePlaceHolder: string = "hide";
	hideRadioButton: string = "hide"
	hideName: string = "hide";
	hideEdit: string = "hide";
	checked: boolean = false;
	selectedContent: string = 'reportTemplate';
	productTypeReport: string = "";
	productLetterTypeList: any;
	reportTemplatespermArr: any[] = [];
	isEditIconEnabled: boolean = true;
	assetsPath = CyncConstants.getAssetsPath();
	showExportReportPage: boolean = false;
	isCollapseOne: boolean = false;

	/** 
	* Report Template Variables
	*/
	fileName = '';
	reportTemplateForm: FormGroup;
	selectedPlaceHolderArray = [];
	selectedSeperatorValue = '';
	isAPIResponseLoaded = false;
	placeholderCtrl: FormArray;
	currentDate = '';
	isReportDisable = true;
	mockPlaceHolder: PlaceHolderChoiceModel[] = placeHolderObjectsArray;

	constructor(
		private rolesPermComp: CheckPermissionsService,
		private _router: Router,
		private _message: MessageServices,
		private _service: CustomHttpService,
		private config: AppConfig,
		private textEditor: CyncTextEditorComponent,
		private dragulaService: DragulaService,
		private fb: FormBuilder,
		private _reportTemplateService: ReportTemplateService,
		private _helper: Helper) {

		/*Based on the User Role Permissions Enable or Disable the Edit Icon*/
		let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
		if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
			/*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
			setTimeout(() => {
				this.reportTemplatespermArr = JSON.parse(localStorage.getItem("reportTemplatesPermissionsArray"));
				this.isEditIconEnabled = this.rolesPermComp.checkPermissions(this.reportTemplatespermArr, "update");
			}, 600);
		}
		this.editReportTemplates = new FormGroup({
			selectedValue: new FormControl('', Validators.compose([Validators.required])),
			content: new FormControl('', Validators.compose([Validators.required])),
			product_Type: new FormControl('', Validators.compose([Validators.required]))
		});
		this._service.getCall('/lender/subscriptions').then(i => {
			this.productLetterTypeList = this._service.bindData(i).subscriptions;
		});
		this.lenderId = this.config.getConfig('lenderId');
		this.editReportTemplates.controls['product_Type'].setValue(null);
		this.productTypeReport = "undefined";
		dragulaService.destroy("PLACEHOLDER");
		dragulaService.createGroup("PLACEHOLDER", {
			revertOnSpill: true
		});
	}

	onChangeProductType(productTypeReport: string) {
		this.productType = productTypeReport;
		this.hideEditor = "hide";
		this.hidePlaceHolder = "hide";
		this.hideSaveCancel = "hide";
		this.hideName = "";
		this.hideRadioButton = "";
		if (this.productType == "FACTORING" || this.productType == "FINANCIAL" || this.productType == "undefined") {
			this.hideRadioButton = "hide";
			this.hideName = "hide";
			this.hideEdit = "hide";
		} else {
			this.hideEditor = "";
			this.hidePlaceHolder = "";
			this.hideSaveCancel = "";
			this.hideName = "";
			this.hideRadioButton = "";
			if (this.productType == "FACTORING") {
				this.hideRadioButton = "hide";
				this.hideName = "hide";
				this.hideEdit = "hide";
			} else {
				this.hideEditor = "";
				this.hidePlaceHolder = "";
				this.hideSaveCancel = "";
				this.hideName = "";
				this.hideEdit = "";
				let templateName = 'payoff_quote';
				this._service.getCall('report_templates?report_type=' + this.editReportTemplates.controls['product_Type'].value + '&name=' + templateName).then(i => {
					this.reportTemplatesList = this._service.bindData(i);
					this.reportTemplatesId = this.reportTemplatesList.id;
					this.editReportTemplates.controls['content'].setValue(this.reportTemplatesList.content);
					//this.textEditor.setEditorContent(false);
					this.textEditor.setEditorContent(this.reportTemplatesList.content);
				});
			}
			this.editReportTemplates.patchValue({ selectedValue: null });
		}

	}

	onClickRadioButton(templateName) {
		if (this.productType == "ABL" && templateName == 'payoff_quote') {
			this.hideEditor = "";
			this.hidePlaceHolder = "";
			this.hideSaveCancel = "";
			this.hideEdit = "";
			this.showExportReportPage = false;
			this._service.getCall('report_templates?report_type=' + this.editReportTemplates.controls['product_Type'].value + '&name=' + templateName).then(i => {
				this.reportTemplatesList = this._service.bindData(i);
				this.reportTemplatesId = this.reportTemplatesList.id;
				this.editReportTemplates.controls['content'].setValue(this.reportTemplatesList.content);
				this.textEditor.setEditorContent(this.reportTemplatesList.content);
			});
		} else if (this.productType == "FACTORING" && templateName == 'payoff_quote') {
			this.hideEditor = "";
			this.hidePlaceHolder = "";
			this.hideSaveCancel = "";
			this.hideEdit = "";
			this.showExportReportPage = false;
			this._service.getCall('report_templates?report_type=' + this.editReportTemplates.controls['product_Type'].value + '&name=' + templateName).then(i => {
				this.reportTemplatesList = this._service.bindData(i);
				this.reportTemplatesId = this.reportTemplatesList.id;
				this.editReportTemplates.controls['content'].setValue(this.reportTemplatesList.content);
				this.textEditor.setEditorContent(this.reportTemplatesList.content);
			});
		} else if (templateName == 'manage-default-template') {
			this.showExportReportPage = true;
		}
	}

	fnCollapseOne() {
		this.isCollapseOne = !this.isCollapseOne;
	}

	onClickEdit() {
		this.textEditor.getEnableEditing();
		this.isDisable = false;
	}

	saveReportTemplates() {
		this._message.showLoader(true);
		const formData: FormData = new FormData();
		formData.append('report_template[content]', this.textEditor.getEditorContent());
		this.requestModel = { url: 'report_templates/' + this.reportTemplatesId, model: formData };
		this._service.patchCallForFileUpload(this.requestModel).then(i => this.navigateToHome());

	}

	navigateToHome() {
		this.isDisable = true;
		this._message.showLoader(false);
		this.textEditor.getDisableEditing();
		this._message.alertMessage("Record saved successfully.", "success",3000);
		//this.navigateToHomeCancel();  
	}

	navigateToHomeCancel() {
		this.isDisable = true;
		this.editReportTemplates.reset();
		this.hideEditor = "hide";
		this.hidePlaceHolder = "hide";
		this.hideSaveCancel = "hide";
		this.hideRadioButton = "hide";
		this.hideName = "hide";
		this.hideEdit = "hide";
		this.productTypeReport = "";
		this.textEditor.getDisableEditing();
		this.productTypeReport = "undefined";
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");

		/*Commenting the particle JS code since its not using currently*/
		//      particlesJS.load('particles-js', '../assets/particles.json', null);
		this._service.setHeight();
		this.createReportForm();
		this.getLenderDetails();
		this._message.showLoader(false);
	}

	// ---------------------------------- Report Template code start --------------------------------------
	/**
	* Initial Form creation
	*/
	createReportForm() {
		this.reportTemplateForm = this.fb.group({
			'lender_details': this.fb.group({
				'export_default_value': this.fb.group({
					'place_holder': this.initPlaceHolderValue(),
					'split_holder': new FormControl()
				})
			})
		});
	};

	/**
	* Initialized Place holder values
	*/
	initPlaceHolderValue(): FormArray {
		const arr = this.mockPlaceHolder.map(s => {
			return this.fb.group({
				selected: false,
				id: s.id,
				name: s.name,
				value: s.value
			});
		});
		return this.fb.array(arr);
	}

	/**
	* Get Place holder controls
	*/
	get place_holder(): FormArray {
		return this.reportTemplateForm.get('lender_details').get('export_default_value').get('place_holder') as FormArray;
	}

	/**
	* Get lender details
	*/
	getLenderDetails() {
		this._message.showLoader(true);
		this._reportTemplateService.getLenderDetails(CyncConstants.LENDER_DETAILS).subscribe(res => {
			this.isAPIResponseLoaded = true;
			this.reportTemplateForm.patchValue(res);
			let resultSet = res.lender_details.export_default_value;
			this.selectedSeperatorValue = resultSet.split_holder;
			this.selectedPlaceHolderArray = resultSet.place_holder;
			if (resultSet !== null && resultSet !== undefined && resultSet.place_holder !== null && resultSet.place_holder !== undefined) {
				if (resultSet.place_holder.length > 0) {
					let filterRes = this.convertPlaceHolderArray(resultSet.place_holder);
					let existingPlaceHolderValues = this.mockPlaceHolder.map(x => {
						return {
							selected: (filterRes.find(y => y.id === x.id)) ? true : false,
							id: x.id,
							name: x.name,
							value: x.value
						}
					});

					let finalSortedPlaceHolderArray = [];
					// Selected place holder object array
					let selectedPHolderArray = existingPlaceHolderValues.filter(function (pilot) {
						return pilot.selected === true;
					});
					// Sort Selected place holder array
					for (let k = 0; k < this.selectedPlaceHolderArray.length; k++) {
						let obj = selectedPHolderArray.find(o => o.value === this.selectedPlaceHolderArray[k]);
						finalSortedPlaceHolderArray.push(obj);
					}
					// No selected place holder object array
					let notSelectedPHolderArray = existingPlaceHolderValues.filter(function (pilot) {
						return pilot.selected === false;
					});
					let finalArray = finalSortedPlaceHolderArray.concat(notSelectedPHolderArray);

					const exportDefaultFormGroup: FormGroup = <FormGroup>(<FormGroup>this.reportTemplateForm.controls.lender_details).controls.export_default_value;
					exportDefaultFormGroup.patchValue({
						place_holder: finalArray
					});
				} else {
					this.isReportDisable = true;
				}
			}
			this._message.showLoader(false);
			this.updateFileName(this.selectedSeperatorValue, this.selectedPlaceHolderArray);
		});
	}

	/**
	 * Update file name method
	 * @param septrValue 
	 * @param placeHolderArray 
	 */
	updateFileName(septrValue: string, placeHolderArray: any) {
		if (septrValue === 'NONE' || septrValue === 'none') {
			septrValue = '';
		} else if (septrValue === 'SPACE' || septrValue === 'space') {
			septrValue = ' ';
		}
		this.fileName = '';
		this.currentDate = this._helper.convertDateToString(new Date());
		if (placeHolderArray.length > 0) {
			if (placeHolderArray.length == 1) {
				this.fileName = this.getPlaceHolderModifiedValue(placeHolderArray[0]);
			} else {
				for (let i = 0; i < placeHolderArray.length; i++) {
					if (i !== placeHolderArray.length - 1) {
						this.fileName = this.fileName + this.getPlaceHolderModifiedValue(placeHolderArray[i]) + septrValue;
					} else {
						this.fileName = this.fileName + this.getPlaceHolderModifiedValue(placeHolderArray[i]);
					}
				}
			}
		} else {
			this.fileName = '';
		}
	}

	/**
	* Convert array of string to array of objects.
	* @param resultData: Array of string.
	*/
	convertPlaceHolderArray(resultData: any) {
		let resultArray = [];
		for (let i = 0; i < resultData.length; i++) {
			switch (resultData[i]) {
				case 'report_name':
					resultArray.push({
						id: 1,
						name: 'Report Name',
						value: 'report_name'
					});
					break;
				case 'client_name':
					resultArray.push({
						id: 2,
						name: 'Client Name',
						value: 'client_name'
					});
					break;
				case 'current_date':
					resultArray.push({
						id: 3,
						name: 'Current Date',
						value: 'current_date'
					});
					break;
				case 'bbc_date':
					resultArray.push({
						id: 4,
						name: 'BBC DATE',
						value: 'bbc_date'
					});
					break;
			}
		}
		return resultArray;
	}

	/**
	* Save report template data method
	* @param model: Lender API Response model
	*/
	saveFileNameReportTemplate(model: LenderAPIResponseModel) {
		this._message.showLoader(true);
		let UpdatedModelByID = this.getPlaceHolderValueByID(model);
		model.lender_details.export_default_value.place_holder = UpdatedModelByID;
		let requestBody = new LenderAPIResponseModel();
		requestBody['lender'] = model.lender_details;
		this._reportTemplateService.updateLenderDetails(CyncConstants.UPDATE_REPORT_LENDER_DETAILS, requestBody).subscribe(lenderRes => {
			if (lenderRes.status == CyncConstants.STATUS_204 || lenderRes.status == CyncConstants.STATUS_200) {
				this._message.showLoader(false);
				this.isReportDisable = true;
				this._message.addSingle("Report Template data saved successfully.", "success");
			} else {
				this._message.showLoader(false);
				this._message.addSingle("Some error occured while saving data.", "error");
			}
		}, error => {
			this._message.showLoader(false);
			this._message.addSingle(JSON.parse(error._body).error, "error");
		}, );
	}

	/**
	* Convert Array of objects to array of string for before send request to server.
	* @param dataObject: Array of objects.
	*/
	getPlaceHolderValueByID(dataObject: any) {
		let selectedPlaceHolders = dataObject.lender_details.export_default_value.place_holder;
		let resultStringArray = [];
		if (selectedPlaceHolders.length > 0) {
			for (let i = 0; i < selectedPlaceHolders.length; i++) {
				if (selectedPlaceHolders[i].selected === true) {
					switch (selectedPlaceHolders[i].id) {
						case 1:
							resultStringArray.push('report_name');
							break;
						case 2:
							resultStringArray.push('client_name');
							break;
						case 3:
							resultStringArray.push('current_date');
							break;
						case 4:
							resultStringArray.push('bbc_date');
							break;
					}
				}
			}
			return resultStringArray;
		} else {
			return resultStringArray;
		}
	}

	/**
	* Drag and drop sort method for Place holder value
	* @param arrayList 
	*/
	fnCallOnColumnSort(arrayList: any) {
		let tempSelectedPlaceHolderArray = [];
		for (let i = 0; i < arrayList.length; i++) {
			if (arrayList[i].controls.selected.value === true) {
				tempSelectedPlaceHolderArray.push(arrayList[i].controls.value.value)
			}
		}
		if(this.selectedPlaceHolderArray.length > 0){
			this.isReportDisable = false;
		}
		this.selectedPlaceHolderArray = tempSelectedPlaceHolderArray;
		this.updateFileName(this.selectedSeperatorValue, tempSelectedPlaceHolderArray);
	}

	/**
	* Place Holder checkbox selection method
	* @param event 
	* @param selectedValue
	*/
	placeHolderValueChange(event, selectedValue) {
		const exportDefaultFormGroup: FormGroup = <FormGroup>(<FormGroup>this.reportTemplateForm.controls.lender_details).controls.export_default_value;
		let tempPlaceHolderResult = exportDefaultFormGroup.controls.place_holder.value;
		let filterResult = tempPlaceHolderResult
			.filter(function (pilot) {
				return pilot.selected === true;
			})
			.map(function (resultArray) {
				return resultArray.value;
			});
		this.selectedPlaceHolderArray = filterResult;
		if (this.selectedPlaceHolderArray.length > 0) {
			this.isReportDisable = false;
		} else {
			this.isReportDisable = true;
		}
		this.updateFileName(this.selectedSeperatorValue, this.selectedPlaceHolderArray);
	}

	/**
	* Change Seperator value for place holder in drop down value method
	* @param selectedValue 
	*/
	changeSeperatorPlaceHolder(selectedValue: string) {
		if (this.selectedPlaceHolderArray.length > 0) {
			this.isReportDisable = false;
		} else {
			this.isReportDisable = true;
		}
		this.selectedSeperatorValue = selectedValue;
		this.updateFileName(this.selectedSeperatorValue, this.selectedPlaceHolderArray);
	}

	/**
	* Reset File name report template while click on cancel button
	*/
	navigateToHomeFileNameReportTemplate() {
		this.isReportDisable = true;
		this._message.showLoader(true);
		this.getLenderDetails();
	}

	/**
	* Get Place holder modified value according to place holder id.
	* @param checkboxValue
	*/
	getPlaceHolderModifiedValue(checkboxValue: string) {
		let resultString = '';
		this.currentDate = this._helper.convertDateToStringDifferentFormat(new Date());
		switch (checkboxValue) {
			case 'current_date':
				resultString = this.currentDate;
				break;
			case 'client_name':
				resultString = 'Client Name';
				break;
			case 'report_name':
				resultString = 'Report Name';
				break;
			case 'bbc_date':
				resultString = this.currentDate;
				break;
		}
		return resultString;
	}

}

