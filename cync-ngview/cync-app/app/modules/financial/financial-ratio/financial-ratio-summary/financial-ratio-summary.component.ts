import { Component, OnInit, OnDestroy } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { AllFinancialRatio, FinancialRatio, FinancialRatioFormula, FinancialRatioOperator } from '../model/financial-ratio.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';

import { FinancialRatioService } from '../service/financial-ratio.service';
// For getting the Individual Project Details
import { ListProject } from '../../financial-analyzer/model/list-project.model';
import { ListProjectService } from '../../financial-analyzer/service/list-project.service';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';

@Component({
	selector: 'app-financial-ratio-summary',
	templateUrl: './financial-ratio-summary.component.html',
	styleUrls: ['./financial-ratio-summary.component.scss']
})
export class FinancialRatioSummaryComponent implements OnInit, OnDestroy {

	isFormLoaded = false;
	financialRatioForm: FormGroup;
	selectedValues: string[] = [];
	mockData: any;
	projectID = CyncConstants.getprojetID();
	selectedRadioBtn = 'financial_ratio';
	headerText = CyncConstants.HEADER_TEXT;
	currentAction: string = CyncConstants.ADD_OPERATION;
	saveAndViewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_VIEW_BTN_TEXT; // button text for save and View button
	listProjectId: string;
	projectName = '';
	clientSelectionSubscription: Subscription;
	checkedvalue: any;
	borrowerId: any;

	constructor(private _apiMapper: APIMapper,
		private _helper: Helper,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _fb: FormBuilder,
		private _message: MessageServices,
		private _projectService: ListProjectService,
		private financialRatioService: FinancialRatioService,
		private _clientSelectionService: ClientSelectionService,
		private _commonApiHelper: CommonAPIs,
		private _radioButtonVisible: RadioButtonService) { }

	ngOnInit() {
		this.borrowerId = CyncConstants.getSelectedClient();
		this.getProjectNameByID(this.getProjectID());
		this.createForm();
		this.getGridData();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(true, this.projectID, this.selectedRadioBtn);
	}

	getProjectNameByID(projectID) {
		const url = this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_BY_ID].replace('{id}', projectID);
		this._projectService.getListProjectById(url).subscribe(res => {
			this.projectName = res.projectName;
		});
	}

	/**
	* This method will get the ProjectID From URL
	*/
	getProjectID(): string {
		let projID = '';
		this._activatedRoute.params.subscribe(params => {
			projID = params['id'];
			this.projectID = params['id'];
		});
		return projID;
	}

	/**
	 * Method defines the finFormArray form arrays
	 */
	createForm() {
		this.financialRatioForm = this._fb.group({
			finFormArray: this._fb.array([])
		});
	}

	initializeRatioFields() {
		return this._fb.group({
			name: new FormControl(),
			id: new FormControl(),
			checked: new FormControl({ value: false }),
			formulas: this._fb.array([]),
			showFormula: new FormControl({ value: true })
		});
	}

	initializeFormulas() {
		return this._fb.group({
			id: new FormControl(),
			checked: new FormControl({ value: false }),
			name: new FormControl(),
			benchMarkValue: new FormControl(),
			expression: new FormControl(),
			display: new FormControl(),
			active: new FormControl(),
			operators: new FormControl(),
			operatorsType: new FormControl(),
			customFormula: new FormControl(false),
		});
	}

	initializeOperatorFields() {
		return this._fb.group({
			display: new FormControl(),
			value: new FormControl(),
			active: new FormControl(),
			selected: new FormControl(),
		});
	}


	/**
	* Method to get finArrayControls
	*/
	get finArrayControls() {
		return <FormArray>this.financialRatioForm.get('finFormArray');
	}

	/**
	 * Method to get formulas array
	 */
	getformulasControl(index: number) {
		return (<FormArray>(<FormArray>this.financialRatioForm.get('finFormArray')).controls[index].get('formulas')).controls;
	}

	/**
	 * Method to operators programs array
	 */
	/*   get operatorsControl() {
		return <FormArray>this.financialRatioForm.get('operators');
	  } */




	/**
	 * Method to get all the grid data
	 */
	getGridData() {
		this._message.showLoader(true);
		const url = this._apiMapper.endpoints[CyncConstants.LIST_RATIO_API] + '?projectId=' + this.projectID + '&clientId=' + this.borrowerId;
		this.financialRatioService.getAllFinancialRatio(url).subscribe(ListRatioData => {
			const showFormulaValue = true;
			this.mapResponseToFormArray(ListRatioData, showFormulaValue);
			this._message.showLoader(false);
		});
	}

	mapResponseToFormArray(listRatioData, val) {
		const formulasControlArray = <FormArray>this.financialRatioForm.controls['finFormArray'];
		if (listRatioData != null && listRatioData !== undefined && listRatioData.length > 0) {
			for (let i = 0; i < listRatioData.length; i++) {
				const ratioObj = listRatioData[i];
				let formulas = ratioObj.formulas;
				const ratioFb = this.initializeRatioFields();
				if (formulas == null) {
					formulas = new Array();
					ratioFb.controls['showFormula'].setValue(false);
				}
				ratioFb.patchValue(ratioObj);
				if (formulas.length > 0) {
					const ratioFormulaArray = <FormArray>ratioFb.controls['formulas'];
					for (let j = 0; j < formulas.length; j++) {
						const formulaFb = this.initializeFormulas();
						if (!formulas[j].hasOwnProperty('operatorsType')) {
							const selectedOperatorObj = formulas[j].operators.find(
								operator => operator.selected === true);
							formulas[j]['operatorsType'] = selectedOperatorObj;
						}
						formulaFb.patchValue(formulas[j]);
						ratioFormulaArray.push(formulaFb);
					}
				}
				formulasControlArray.push(ratioFb);
			}
			this.isFormLoaded = true;
		}
	}

	onKey(event: any, iIndex, jIndex, val) { // without type info
		val = true;
		if (event.target.value.length > 0 && event.target.value != 0) {
			val = true;
		} else {
			val = false;
		}
		(<FormArray>(<FormArray>
			this.financialRatioForm.get('finFormArray')).
			controls[iIndex].get('formulas')).controls[jIndex].
			get('checked').setValue(val);
		(<FormArray>(<FormArray>this.financialRatioForm.get('finFormArray')).controls[iIndex].get('checked')).setValue(val);
	}


	fnClick(event, iIndex, jIndex) {
		console.log("event.target.checked",event.target.checked);
		if (event.target.checked === false) {
			const operator = [];
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('formulas').controls[jIndex].
				get('benchMarkValue').setValue(0);
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('formulas').controls[jIndex].
				get('operatorsType').setValue('');
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('formulas').controls[jIndex].
				get('checked').setValue(false);
			this.resetOperators(iIndex,jIndex);
			const formulas = <FormArray>this.financialRatioForm.controls['finFormArray']['controls'][iIndex].get('formulas');
			let mainRatioCategorySelected = false;
			for (let i = 0; i < formulas.controls.length; i++) {
				const formulaGrp = <FormGroup>formulas.controls[i];
				const checked = formulaGrp.controls['checked'].value;
				if (checked == true) {
					mainRatioCategorySelected = true;
					break;
				}
			}
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('checked').setValue(mainRatioCategorySelected);
		} else {
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('formulas').controls[jIndex].
				get('checked').setValue(true);
			this.financialRatioForm.get('finFormArray')['controls'][iIndex].get('checked').setValue(true);
		}
	}

	onChange(event, operators, operatorsType, iIndex, jIndex, val) {
		val = true;
		(<FormArray>(<FormArray>
			this.financialRatioForm.get('finFormArray')).
			controls[iIndex].get('formulas')).
			controls[jIndex].get('checked').setValue(val);
		(<FormArray>(<FormArray>this.financialRatioForm.
			get('finFormArray')).controls[iIndex].
			get('checked')).setValue(val);
		for (let i = 0; i < operators.length; i++) {
			operators[i].selected = false;
			if (operators[i].value === operatorsType.value) {
				operators[i].selected = !operators[i].selected;
			}
		}
		this.saveDraft();
	}


	saveRatio(model: any) {
		this._message.showLoader(true);
		this.financialRatioService.createAllFinancialRatio(
			this._apiMapper.endpoints[CyncConstants.SAVE_AND_EDIT].
				replace('{projectId}', this.projectID), model.finFormArray).
			subscribe(
				apiResponse => {
					if (apiResponse.status === CyncConstants.STATUS_201 || apiResponse.status === CyncConstants.STATUS_200) {
						this._router.navigateByUrl(MenuPaths.LIST_FINANCE_RATIO_PATH + '/' + this.projectID + '/view');
					} else {
						// this._helper.showApiMessages(message, 'danger');
						this._message.showLoader(false);
					}

				});
	}

	validateAllSelections() {
		const finFormArray = <FormArray>this.financialRatioForm.controls['finFormArray'];
		for (let i = 0; i < finFormArray.length; i++) {
			const formulas = <FormArray>this.financialRatioForm.controls['finFormArray']['controls'][i].get('formulas');
			for (let i = 0; i < formulas.controls.length; i++) {
				const formulaGrp = <FormGroup>formulas.controls[i];
				const checked = formulaGrp.controls['checked'].value;
				const operatorsType = formulaGrp.controls['operatorsType'].value;
				if (checked == true && (operatorsType != undefined || operatorsType != '')) {
					this._message.showLoader(false);
					this._helper.openAlertPoup('information', 'please select operator for ' + formulaGrp.controls['name'].value);
					return false;
				}
			}
		}
		return true;


	}

	resetOperators(ratioIndex: number, formulaIndex: number) {
		const operatorFormArray = this.financialRatioForm.get('finFormArray')['controls'][ratioIndex].get('formulas')
		.controls[formulaIndex].get('operators');
		for (let i = 0; i < operatorFormArray.value.length; i++) {
			operatorFormArray.value[i].selected = false;
		}		
		this.financialRatioForm.get('finFormArray')['controls'][ratioIndex].get('formulas')
		.controls[formulaIndex].get('operators').setValue(operatorFormArray.value);

	}


	/**
   *   //send id dynamically
   */
	/*   showFinancialRatoForm() {
		this._message.showLoader(true);
		debugger
		console.log(this.financialRatioForm);
		this.financialRatioService.getFinancialRatoById(this._apiMapper.endpoints[CyncConstants.LIST_RATIO_API]).subscribe(res => {
		  this.financialRatioForm.patchValue(res);
		  this._message.showLoader(false);
		});
	  } */



	compareById(optionOne, optionTwo): any {
		if (optionTwo) {
			return optionOne.display === optionTwo.display;
		}
	}


	/**
	 * This method is taken care when user will change the client or borrowers
	 */
	registerReloadGridOnClientSelection() {
		const currObj = this;
		this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
			//debugger;
			if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
				setTimeout(function () {
					window.location.href = '../../';
				}, 2000);
			} else {
				this.navigateToFAList();
			}
		});
	}


	getClientDetails() {
		this._message.showLoader(true);
		const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
		this.financialRatioService.getBorrowerDetails(url).subscribe(data => {
			if (data !== undefined && data.borrower !== undefined
				&& data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
				this.borrowerId = data.borrower.id;
			}
			this._message.showLoader(false);
			this.getGridData();
		});
	}

	/**
	* Method to navigate back to FA list
	*/
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}

	/**
	   * unsubscribe the observable for client change
	   */
	ngOnDestroy() {
		if (this.clientSelectionSubscription !== undefined) {
			this.clientSelectionSubscription.unsubscribe();
		}
	}

	/**
	 * This method will navigate the user to Custom Ratios screen
	 */
	goToCustomRatios() {
		this._message.showLoader(true);
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_RATIO_PATH + '/' + this.projectID + '/custom-ratios');
	}

	saveDraft() {
		let model = this.financialRatioForm.value;
		this._commonApiHelper.draftFinancialStmt(this._apiMapper.endpoints[CyncConstants.DRAFT_RATIOS]
			.replace('{projectId}', this.projectID), model.finFormArray).subscribe(result => {

			});
	}
}
