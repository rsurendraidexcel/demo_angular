import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { FinancialStatementModel, ParameterDataModel, TimelineValuesModel } from '../models/financial-statements.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-financial-statements-setup-cashflow',
	templateUrl: './financial-statements-setup-cashflow.component.html',
	styleUrls: ['./financial-statements-setup-cashflow.component.scss']
})
export class FinancialStatementsSetupCashflowComponent implements OnInit, OnDestroy, DoCheck {

	saveActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT;
	backBtnText: string = CyncConstants.ADD_EDIT_PAGE_BACK_BTN_TEXT;
	financialStatementForm: FormGroup;
	financialStatementAPIResponse: any;
	isFormLoaded = false;
	projectID = CyncConstants.getprojetID();
	selectedRadioBtn = 'finanical_statements';
	public previousURL: any;
	enableFinanceStatementComplete = false;
	enableFinanceRatioComplete = false;
	projectName = '';
	assetsPath: string = CyncConstants.getAssetsPath();
	clientSelectionSubscription: Subscription;
	timeLineList = 0;
	finStatementDataTableHeight: any;
	isFullScreen = false;
	deletedCustomParameters: Array<any> = [];

	constructor(
		private _message: MessageServices,
		private _router: Router,
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private _financialStatementsService: FinancialStatementsService,
		private _commonApiHelper: CommonAPIs,
		private _clientSelectionService: ClientSelectionService,
		private _radioButtonVisible: RadioButtonService
	) {

		// Fetching previous url value
		this._router.events
			.filter(e => e instanceof RoutesRecognized)
			.pairwise()
			.subscribe((event: any[]) => {
				CyncConstants.setPreviousURL(event[0].urlAfterRedirects);
			});
	}

	ngOnInit() {
		this.previousURL = CyncConstants.getPreviousURL();
		this._message.showLoader(true);
		this.createForm();
		this.initializeFinancialStatemets();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(this.enableFinanceStatementComplete, this.projectID, this.selectedRadioBtn);
	}

	/**
	* Initial Form Creation
	*/
	createForm() {
		this.financialStatementForm = this.fb.group({
			'id': new FormControl(),
			'projectId': new FormControl(),
			'timeLinesList': new FormControl(),
			'balanceSheetData': new FormControl(),
			'incomeStatementData': new FormControl(),
			'cashFlowData': this.fb.group({
				'cashProvidedByOpActParams': this.fb.array([]),
				'changesInWorkingCapitalParams': this.fb.array([]),
				'cashProvidedByOperatingActivitiesTotal': this.fb.array([]),
				'cashUsedForInvestActParams': this.fb.array([]),
				'cashUsedForInvestingActivitiesTotal': this.fb.array([]),
				'cashUsedForFinActParams': this.fb.array([]),
				'cashUsedForFinancingActivitiesTotal': this.fb.array([]),
				'incrOrDecrInCashAndCashEquiParams': this.fb.array([]),
				'incrOrDecrInCashAndCashEquivalentsTotal': this.fb.array([]),
				'cashAndCashEquiAtYearEndParams': this.fb.array([]),
				'cashAndCashEquiAtYearEndTotal': this.fb.array([])
			}),
			'deletedCustomParameters': new FormControl(),
			'validateFinStmt': new FormControl()
		});
	}

	/**
	* Initialize Parameter Data
	*/
	initializeParameterData() {
		return this.fb.group({
			'parameter': new FormControl('', Validators.compose([Validators.required])),
			'data': this.fb.array([]),
			'customParameter': new FormControl(),
			'id': new FormControl(),
			'newcustomfield': new FormControl({ value: false, disabled: true }, Validators.compose([])),
			'uniqueId': new FormControl()
		});
	}

	/**
	* Initialize Data
	*/
	initializeData() {
		return this.fb.group({
			'timeLine': new FormControl(),
			'value': new FormControl()
		});
	}

	/**
	* This method is use to get project details
	* @param projectID
	*/
	getProjectDetails(projectID) {
		this._financialStatementsService.getProjectDetails(this._apiMapper.endpoints[CyncConstants.GET_PROJECT_DETAILS]
			.replace('{projectId}', projectID)).subscribe(res => {
				this.projectName = res.projectName;
			});
	}

	/**
	* Initialize Financial statements
	*/
	initializeFinancialStatemets() {
		// Getting project-ID from route URL
		this.route.params.subscribe(params => {
			this.projectID = params['id'];
			this._commonApiHelper.getServiceProjectStatus(this.projectID).subscribe(financeProjectStatus => {
				this.enableFinanceStatementComplete = financeProjectStatus.financeStatementComplete;
				this.enableFinanceRatioComplete = financeProjectStatus.financeRatioComplete;
			});
		});
		this.getProjectDetails(this.projectID);

		this._financialStatementsService.getFinancialStatements(
			this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', this.projectID))
			.subscribe(res => {
				this.financialStatementAPIResponse = res;
				this.timeLineList = res.timeLinesList.length;
				this.financialStatementForm.patchValue(res);
				if (res !== undefined && res.cashFlowData !== undefined) {
					const cashFlowFormGroup: FormGroup = <FormGroup>this.financialStatementForm.controls.cashFlowData;
					// Operating Activity Working Capital
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.cashProvidedByOpActParams,
						res.cashFlowData.cashProvidedByOpActParams);
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.changesInWorkingCapitalParams,
						res.cashFlowData.changesInWorkingCapitalParams);
					this.patchData(<FormArray>cashFlowFormGroup.controls.cashProvidedByOperatingActivitiesTotal,
						res.cashFlowData.cashProvidedByOperatingActivitiesTotal);

					// Investing Activities
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.cashUsedForInvestActParams, res.cashFlowData.cashUsedForInvestActParams);
					this.patchData(<FormArray>cashFlowFormGroup.controls.cashUsedForInvestingActivitiesTotal,
						res.cashFlowData.cashUsedForInvestingActivitiesTotal);

					// Financing Activities
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.cashUsedForFinActParams, res.cashFlowData.cashUsedForFinActParams);
					this.patchData(<FormArray>cashFlowFormGroup.controls.cashUsedForFinancingActivitiesTotal,
						res.cashFlowData.cashUsedForFinancingActivitiesTotal);

					// Effect Of Exchange Rate
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.incrOrDecrInCashAndCashEquiParams,
						res.cashFlowData.incrOrDecrInCashAndCashEquiParams);
					this.patchData(<FormArray>cashFlowFormGroup.controls.incrOrDecrInCashAndCashEquivalentsTotal,
						res.cashFlowData.incrOrDecrInCashAndCashEquivalentsTotal);

					// Cash Equivalent Year
					this.patchParameterData(<FormArray>cashFlowFormGroup.controls.cashAndCashEquiAtYearEndParams,
						res.cashFlowData.cashAndCashEquiAtYearEndParams);
					this.patchData(<FormArray>cashFlowFormGroup.controls.cashAndCashEquiAtYearEndTotal,
						res.cashFlowData.cashAndCashEquiAtYearEndTotal);
				}

				this.isFormLoaded = true;
				this._message.showLoader(false);
			});
	}

	/**
	* Patch Parameter Data Object
	*/
	patchParameterData(parameterFormArray: FormArray, parameterDataList: any[]) {
		for (let i = 0; i < parameterDataList.length; i++) {
			const parameterData = parameterDataList[i];
			const parameterFormGroup = this.initializeParameterData();
			parameterFormGroup.patchValue(parameterData);
			this.patchData(<FormArray>parameterFormGroup.controls['data'], parameterData['data']);
			parameterFormArray.push(parameterFormGroup);
		}
	}

	/**
  	* Patch Data Object
  	*/
	patchData(dataFormArray: FormArray, dataList: any[]) {
		for (let j = 0; j < dataList.length; j++) {
			const data = dataList[j];
			const dataGroup = this.initializeData();
			dataGroup.patchValue(data);
			dataFormArray.push(dataGroup);
		}
	}

	/**
	* This method is taken care when user will change the client or borrowers
	*/
	registerReloadGridOnClientSelection() {
		const currObj = this;
		this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
			if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
				setTimeout(function () {
					window.location.href = '../../';
				}, 2000);
			} else {
				this.navigateToFAList();
			}
		});
	}

	/**
	* Method to navigate back to FA list
	*/
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}


	/**
	* Expand to full sceren
	*/
	fnExpand() {
		this.isFullScreen = !this.isFullScreen;
	}

	/**
	* Resize the Table
	*/
	ngDoCheck() {
		this.resizetheTable();
	}

	/**
	* Resize the Financial statement data table to view the horizontal scrollbar
	*/
	resizetheTable() {
		if (document.getElementById('cync_main_contents_wradio-list')) {
			const getContainerSize = document.getElementById('cync_main_contents_wradio-list').style.height;
			this.finStatementDataTableHeight = parseInt(getContainerSize) - 13;
		}
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
	* Save Cash Flow Data
	*/
	saveCashFlow(model: FinancialStatementModel) {
		this._message.showLoader(true);
		this.deleteExtraCustomField(model, 'newcustomfield');
		model.financeStatementType = 'CASH_FLOW';
		model.validateFinStmt = true;
		model.deletedCustomParameters = this.deletedCustomParameters;
		let requestBody = new FinancialStatementModel();
		requestBody = model;
		if (this.financialStatementAPIResponse.id !== null) {
			this._helper.globalErrorMsg = false;
			this._financialStatementsService.updateFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.UPDATE_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', this.projectID),
				requestBody).subscribe(responseData => {
					this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_CASH_FLOW_UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
					this.deletedCustomParameters = [];
					this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
						.replace('{projectId}', this.projectID));
					this._helper.globalErrorMsg = true;
				}, error => {
					if (error.status === 412) {
						this.cashFlowUpdatePopup(requestBody, error);
					}
					this._helper.globalErrorMsg = true;
				});
		} else {
			this._helper.globalErrorMsg = false;
			this._financialStatementsService.saveFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.SAVE_FINANCIAL_STATEMENT_PROJECT_DATA], requestBody).subscribe(responseData => {
					this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_CASH_FLOW_SAVE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
					this.deletedCustomParameters = [];
					this._router.navigateByUrl(
						this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
							.replace('{projectId}', this.projectID));
					this._helper.globalErrorMsg = true;
				}, error => {
					if (error.status === 412) {
						this.cashFlowUpdatePopup(requestBody, error);
					}
					this._helper.globalErrorMsg = true;
				});
		}
	}

	/**
	* Show Cash flow pop up window
	*/
	cashFlowUpdatePopup(model: any, errorObj: any) {
		let errorObject;
		let errorMessage = '';
		if (errorObject !== null || errorObject !== undefined) {
			errorObject = JSON.parse(errorObj._body);
			errorMessage = errorObject.error.message;
		}
		this._helper.cashFlowPopup({
			'title': CyncConstants.CONFIRMATION_POPUP_TITLE, 'message': errorMessage,
			'msgType': 'warning'
		}).subscribe(result => {
			if (result) {
				this._message.showLoader(true);
				this._router.navigateByUrl(
					this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
						.replace('{projectId}', this.projectID));
			} else {
				this._message.showLoader(true);
				if (result === false) {
					model.validateFinStmt = false;
					this._financialStatementsService.updateFinancialStatements(
						this._apiMapper.endpoints[CyncConstants.UPDATE_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', this.projectID),
						model).subscribe(responseData => {
							this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_CASH_FLOW_UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
							this.deletedCustomParameters = [];
							this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
								.replace('{projectId}', this.projectID));
							this._message.showLoader(false);
						});
				} else {
					this._message.showLoader(false);
				}
			}
		});
	}
	/**
	* Delete Extra field according to key name.
	*/
	deleteExtraCustomField(model: FinancialStatementModel, keyName: string) {
		const paramaterArray = ['cashProvidedByOpActParams',
			'changesInWorkingCapitalParams',
			'cashUsedForInvestActParams',
			'cashUsedForFinActParams',
			'incrOrDecrInCashAndCashEquiParams',
			'cashAndCashEquiAtYearEndParams'];
		for (let i = 0; i < paramaterArray.length; i++) {
			for (let j = 0; j < model.cashFlowData[paramaterArray[i]].length; j++) {
				delete model.cashFlowData[paramaterArray[i]][j][keyName];
			}
		}
	}

	/**
	* Cancel button click event
	*/
	cancelButtonClick() {
		this.deletedCustomParameters = [];
		this._message.showLoader(true);
		this.redirectUrlOnCancel();
	}

	/**
	* Method to re-direct the page to respective page based on the previous url
	*/
	redirectUrlOnCancel() {
		const urlString = this.previousURL;
		if (urlString !== undefined && urlString !== null && urlString !== '' && urlString.indexOf('summary') > -1) {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		} else {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		}
		this._message.showLoader(false);
	}

	/**
	* Get parameter data controls
	*/
	getParameterDataFormArray(arrayName: string) {
		return (<FormArray>this.financialStatementForm.get('cashFlowData').get(arrayName)).controls;
	}

	/**
	* Get data controls for assets
	*/
	getDataControls(dataForm: FormGroup) {
		return (<FormArray>dataForm.controls.data).controls;
	}

	/**
	* Final Total formula calculation only total data model
	* Timeline value
	*/
	isCashFlowValid(timeLine: string): boolean {

		let isMatched = false;
		const cashEquivalentEndOfYearTotalArray = <FormArray>this.financialStatementForm.get('cashFlowData').get('cashAndCashEquiAtYearEndTotal');
		const balanceSheetCurrentDataArray = this.financialStatementAPIResponse.balanceSheetData.assets.currentData;
		const filteredEvents = balanceSheetCurrentDataArray.filter(function (event) {
			return event.uniqueId === 'CASH_EQUIVALENTS_AND_SHORT_TERM_INVESTMENTS'; // Cash, cash equivalents, and short-term Object ID
		});

		if (cashEquivalentEndOfYearTotalArray !== null && cashEquivalentEndOfYearTotalArray !== undefined
			&& filteredEvents !== null && filteredEvents !== undefined) {
			const filteredEventTimelineObject = (filteredEvents[0].data).filter(function (event) {
				return event.timeLine === timeLine;
			});
			const cashEquivalentEndYearTotalValue = this.getFormGroupByFormArrayControlAndTimeLine(
				cashEquivalentEndOfYearTotalArray.controls, timeLine).controls.value.value;
			const filteredEventTimelineValue = filteredEventTimelineObject[0].value;
			if ((cashEquivalentEndYearTotalValue - filteredEventTimelineValue) === 0) {
				isMatched = true;
			}
		}
		return isMatched;
	}

	/**
	* Method to get Form Group e.g totalNonCurrent, totalCurrent etc for a particular Timeline
	* @param formArrayControls
	* @param timeLine
	*/
	getFormGroupByFormArrayControlAndTimeLine(formArrayControls: AbstractControl[], timeLine: string): FormGroup {
		if (formArrayControls !== null && formArrayControls !== undefined) {
			for (let i = 0; i < formArrayControls.length; i++) {
				const totalFormGroup = <FormGroup>formArrayControls[i];
				if (timeLine === totalFormGroup.get('timeLine').value) {
					return totalFormGroup;
				}
			}
		}
	}

	/**
	* Total formula calculation for input data model
	* Total Form Group name
	* Timeline value
	* Model data list
	*/
	getDataTotal(totalFormGroup: FormGroup, timeline: string, modelList: any) {
		let value = 0;
		for (let i = 0; i < modelList.length; i++) {

			const model = modelList[i].value;
			const data = model.data.filter(obj => obj.timeLine === timeline);
			if (data !== null && data[0].value !== '') {
				value = value + parseFloat(data[0].value);
			}
		}
		const roundOfValue = Math.round(value * 100) / 100;
		totalFormGroup.controls.value.setValue(roundOfValue);
		return value;
	}

	/**
	* Method to get Form Group e.g totalNonCurrent, totalCurrent etc for a particular Timeline
	* @param formArrayName
	* @param timeLine
	*/
	getFormGroupByTimeLine(formArrayName: string, timeLine: string): FormGroup {
		const formArrayControls = (<FormArray>this.financialStatementForm
			.get('cashFlowData').get(formArrayName)).controls;
		if (formArrayControls !== null && formArrayControls !== undefined) {
			for (let i = 0; i < formArrayControls.length; i++) {
				const totalFormGroup = <FormGroup>formArrayControls[i];
				if (timeLine === totalFormGroup.get('timeLine').value) {
					return totalFormGroup;
				}
			}
		}
	}

	/**
	* Update Total Values of Cash Flow
	* @param currTotalArrayName
	* @param timeLine
	*/
	updateCashFlowTotal(timeLine: string, valueControl: FormControl) {
		this.draftFinanceStatement();
		const value = valueControl.value;
		if (value === null) {
			valueControl.setValue(0);
		} else {
			const roundOfValue = Math.round(parseFloat(value) * 100) / 100;
			valueControl.setValue(roundOfValue);
		}

		// Update Cash Flows From Operating Activities Value
		const operatingActivityTotalFormGroup = this.getFormGroupByTimeLine('cashProvidedByOperatingActivitiesTotal', timeLine);
		const cashProvidedByOpActParams = this.getParameterDataFormArray('cashProvidedByOpActParams');
		const changesInWorkingCapitalParams = this.getParameterDataFormArray('changesInWorkingCapitalParams');

		let operatingActivityTotalValue = 0;
		if (operatingActivityTotalFormGroup !== null && operatingActivityTotalFormGroup !== undefined) {
			// Net Income value calculations
			const netIncomeTotal = this.getDataTotal(operatingActivityTotalFormGroup, timeLine, cashProvidedByOpActParams);
			const roundOfNetIncomeTotalValue = Math.round(netIncomeTotal * 100) / 100;

			// Working Capital value calculations
			const workingCapitalTotal = this.getDataTotal(operatingActivityTotalFormGroup, timeLine, changesInWorkingCapitalParams);
			const roundOfWorkingCapitalTotalValue = Math.round(workingCapitalTotal * 100) / 100;
			operatingActivityTotalValue = roundOfNetIncomeTotalValue + roundOfWorkingCapitalTotalValue;
			operatingActivityTotalFormGroup.controls.value.setValue(operatingActivityTotalValue);
		}

		// Update Cash Flows from Investing Activities Value
		const investingActivitiesTotalFormGroup = this.getFormGroupByTimeLine('cashUsedForInvestingActivitiesTotal', timeLine);
		const investingActivitiesParams = this.getParameterDataFormArray('cashUsedForInvestActParams');
		let investingActivityTotalValue = 0;
		if (investingActivitiesTotalFormGroup !== null && investingActivitiesTotalFormGroup !== undefined) {
			const investingActivityTotal = this.getDataTotal(investingActivitiesTotalFormGroup, timeLine, investingActivitiesParams);
			const roundOfInvestingActivityTotalValue = Math.round(investingActivityTotal * 100) / 100;
			investingActivityTotalValue = roundOfInvestingActivityTotalValue;
			investingActivitiesTotalFormGroup.controls.value.setValue(roundOfInvestingActivityTotalValue);
		}

		// Update Cash Flows from Financing Activities Value
		const financingActivitiesTotalFormGroup = this.getFormGroupByTimeLine('cashUsedForFinancingActivitiesTotal', timeLine);
		const financingActivitiesParams = this.getParameterDataFormArray('cashUsedForFinActParams');
		let financingActivitiesTotalValue = 0;
		if (financingActivitiesTotalFormGroup !== null && financingActivitiesTotalFormGroup !== undefined) {
			const financingActivityTotal = this.getDataTotal(financingActivitiesTotalFormGroup, timeLine, financingActivitiesParams);
			const roundOfFinancingActivityTotalValue = Math.round(financingActivityTotal * 100) / 100;
			financingActivitiesTotalValue = roundOfFinancingActivityTotalValue;
			financingActivitiesTotalFormGroup.controls.value.setValue(roundOfFinancingActivityTotalValue);
		}

		// Update Effect Of Exchange Rate  Value && Cash Equivalent Total value
		const cashFlowActivitiesTotal = operatingActivityTotalValue + investingActivityTotalValue + financingActivitiesTotalValue;
		let finalCashEquivalentValue = 0;
		const cashEquivalentTotalGroup = this.getFormGroupByTimeLine('incrOrDecrInCashAndCashEquivalentsTotal', timeLine);
		const effectOfExchangeRateParams = this.getParameterDataFormArray('incrOrDecrInCashAndCashEquiParams');
		if (cashEquivalentTotalGroup !== null && cashEquivalentTotalGroup !== undefined) {

			const effectOfExchangeRateTotal = this.getDataTotal(cashEquivalentTotalGroup, timeLine, effectOfExchangeRateParams);
			const roundOfEffectOfExchangeRateTotalValue = Math.round(effectOfExchangeRateTotal * 100) / 100;
			finalCashEquivalentValue = cashFlowActivitiesTotal + roundOfEffectOfExchangeRateTotalValue;
			const roundOfcashEquivalentTotalValue = Math.round(finalCashEquivalentValue * 100) / 100;
			cashEquivalentTotalGroup.controls.value.setValue(roundOfcashEquivalentTotalValue);
		}

		// Update Cash Equivalent Beginning Year && Cash Equivalent End Of Year Total value
		const cashEquivalentEndOfYearTotalGroup = this.getFormGroupByTimeLine('cashAndCashEquiAtYearEndTotal', timeLine);
		const cashEquivalentBeginningYearParams = this.getParameterDataFormArray('cashAndCashEquiAtYearEndParams');
		if (cashEquivalentEndOfYearTotalGroup !== null && cashEquivalentEndOfYearTotalGroup !== undefined) {

			const cashEquivalentBeginTotal = this.getDataTotal(cashEquivalentEndOfYearTotalGroup, timeLine, cashEquivalentBeginningYearParams);
			const roundOfCashEquivalentBeginTotalValue = Math.round(cashEquivalentBeginTotal * 100) / 100;
			const finalCashEquivalenEndYearTotal = finalCashEquivalentValue + roundOfCashEquivalentBeginTotalValue;
			const roundOfCashEquivalentEndOfYearTotalValue = Math.round(finalCashEquivalenEndYearTotal * 100) / 100;
			cashEquivalentEndOfYearTotalGroup.controls.value.setValue(roundOfCashEquivalentEndOfYearTotalValue);
		}
	}

	/**
	* Add new Custom Field
	*/
	addCustomField(parentControl: string) {
		let parentDataControl;
		parentDataControl = <FormGroup>(<FormGroup>this.financialStatementForm.controls.cashFlowData).controls[parentControl];

		const addParamsCtrl = this.initializeParameterData();
		addParamsCtrl.controls.newcustomfield.setValue(true);
		addParamsCtrl.controls.customParameter.setValue(true);
		for (let i = 0; i < this.financialStatementAPIResponse.timeLinesList.length; i++) {
			const dataControl = <FormArray>(addParamsCtrl.controls.data);
			const dataFormControl = this.initializeData();
			dataFormControl.controls.timeLine.setValue(this.financialStatementAPIResponse.timeLinesList[i]);
			dataFormControl.controls.value.setValue(0);
			dataControl.push(dataFormControl);
		}
		// parentDataControl.push(addParamsCtrl);	 // Add custom field end of form
		if (parentControl === 'cashProvidedByOpActParams') {
			parentDataControl.insert(1, addParamsCtrl); // Add custom field in second position for net Income
		} else {
			parentDataControl.insert(0, addParamsCtrl); // Add custom field in first position
		}

	}

	/**
	* Delete Custom Field
	*/
	deleteCustomField(index: number, parentControl: string, paramsFormArray: FormGroup) {
		this._message.showLoader(true);
		this.updateDeletedCustomFieldTotalValue(paramsFormArray.value, parentControl);
		const isNewCustomField = paramsFormArray.get('newcustomfield').value;
		(<FormArray>(<FormGroup>this.financialStatementForm.controls.cashFlowData).controls[parentControl]).removeAt(index);

		// Deleting existing custom field
		if (!isNewCustomField) {
			const customParamID = paramsFormArray.get('id').value;
			this.deletedCustomParameters.push(customParamID);
		}
		// this.draftFinanceStatement();
		this._message.showLoader(false);
	}

	/**
	* Update Custom Field Parameter Value while on key press.
	*/
	updateCustomParamValue(indexValue: number, paramValue: string, paramsFormArray: FormGroup) {

		const customParamValue = paramValue.trim();
		if (customParamValue !== null && customParamValue !== undefined && customParamValue !== '') {
			const model = this.financialStatementForm.getRawValue();
			this.duplicateParamsValidation(model, customParamValue);
		} else {
			this.financialStatementForm.setErrors({ 'invalid': true });
		}
	}

	/**
	* Duplicate key validation
	*/
	duplicateParamsValidation(model: FinancialStatementModel, keyName: string) {

		let duplicateCount = 0;
		const keyNameLowerCase = keyName.toLowerCase();
		const paramaterArray = ['cashProvidedByOpActParams',
			'changesInWorkingCapitalParams',
			'cashUsedForInvestActParams',
			'cashUsedForFinActParams',
			'incrOrDecrInCashAndCashEquiParams',
			'cashAndCashEquiAtYearEndParams'];
		for (let i = 0; i < paramaterArray.length; i++) {
			for (let j = 0; j < model.cashFlowData[paramaterArray[i]].length; j++) {
				if ((model.cashFlowData[paramaterArray[i]][j].parameter.trim()).toLowerCase() === keyNameLowerCase) {
					duplicateCount++;
				}
			}
		}

		if (duplicateCount > 1) {
			this._helper.openAlertPoup('warning_msg', 'Duplicate key exists: ' + keyName);
			this.financialStatementForm.setErrors({ 'invalid': true });
		}
	}


	/**
	* Method to update total value while deleting custom field
	* @param dataObject
	* @param parentControl
	*/
	updateDeletedCustomFieldTotalValue(dataObject: any, parentControl: string) {

		const deletedCustomFieldDataArray = dataObject.data;
		for (let i = 0; i < deletedCustomFieldDataArray.length; i++) {
			let updatedOperatingActivityTotal;
			let updatedInvestingActivitiesTotal;
			let updatedFinancingActivitiesTotal;
			let updatedCashEquivalentTotal;
			let updatedCashEquivalentEndOfYearTotal;
			const operatingActivityTotalFormGroup = this.getFormGroupByTimeLine('cashProvidedByOperatingActivitiesTotal',
				deletedCustomFieldDataArray[i].timeLine);
			const investingActivitiesTotalFormGroup = this.getFormGroupByTimeLine('cashUsedForInvestingActivitiesTotal',
				deletedCustomFieldDataArray[i].timeLine);
			const financingActivitiesTotalFormGroup = this.getFormGroupByTimeLine('cashUsedForFinancingActivitiesTotal',
				deletedCustomFieldDataArray[i].timeLine);
			const cashEquivalentTotalFormGroup = this.getFormGroupByTimeLine('incrOrDecrInCashAndCashEquivalentsTotal',
				deletedCustomFieldDataArray[i].timeLine);
			const cashEquivalentEndOfYearTotalFormGroup = this.getFormGroupByTimeLine('cashAndCashEquiAtYearEndTotal',
				deletedCustomFieldDataArray[i].timeLine);

			switch (parentControl) {
				case 'cashProvidedByOpActParams':
					updatedOperatingActivityTotal = operatingActivityTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentTotal = cashEquivalentTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentEndOfYearTotal = cashEquivalentEndOfYearTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					operatingActivityTotalFormGroup.controls.value.setValue(Math.round(updatedOperatingActivityTotal * 100) / 100);
					cashEquivalentTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentTotal * 100) / 100);
					cashEquivalentEndOfYearTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentEndOfYearTotal * 100) / 100);
					break;
				case 'changesInWorkingCapitalParams':
					updatedOperatingActivityTotal = operatingActivityTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentTotal = cashEquivalentTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentEndOfYearTotal = cashEquivalentEndOfYearTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					operatingActivityTotalFormGroup.controls.value.setValue(Math.round(updatedOperatingActivityTotal * 100) / 100);
					cashEquivalentTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentTotal * 100) / 100);
					cashEquivalentEndOfYearTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentEndOfYearTotal * 100) / 100);
					break;
				case 'cashUsedForInvestActParams':
					updatedInvestingActivitiesTotal = investingActivitiesTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentTotal = cashEquivalentTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentEndOfYearTotal = cashEquivalentEndOfYearTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					investingActivitiesTotalFormGroup.controls.value.setValue(Math.round(updatedInvestingActivitiesTotal * 100) / 100);
					cashEquivalentTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentTotal * 100) / 100);
					cashEquivalentEndOfYearTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentEndOfYearTotal * 100) / 100);
					break;
				case 'cashUsedForFinActParams':
					updatedFinancingActivitiesTotal = financingActivitiesTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentTotal = cashEquivalentTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					updatedCashEquivalentEndOfYearTotal = cashEquivalentEndOfYearTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					financingActivitiesTotalFormGroup.controls.value.setValue(Math.round(updatedFinancingActivitiesTotal * 100) / 100);
					cashEquivalentTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentTotal * 100) / 100);
					cashEquivalentEndOfYearTotalFormGroup.controls.value.setValue(Math.round(updatedCashEquivalentEndOfYearTotal * 100) / 100);
					break;
			}
		}
	}

	/**
 	* method to create draft version of financial statement
 	*/
	draftFinanceStatement() {
		const model = this.financialStatementForm.getRawValue();
		this.deleteExtraCustomField(model, 'newcustomfield');
		model.financeStatementType = 'CASH_FLOW';
		let requestBody = new FinancialStatementModel();
		requestBody = model;
		this._commonApiHelper.draftFinancialStmt(this._apiMapper.endpoints[CyncConstants.DRAFT_FINANCE_STMT]
			.replace('{projectId}', this.projectID), requestBody).subscribe(res => {
				// console.log('drafted ', res.status === 201);
			});

	}
}