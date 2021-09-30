import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { Helper } from '@cyncCommon/utils/helper';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import * as moment from 'moment';
import { ManualRollforwardEntryComponent } from './sub-component/manual-rollforward-entry/manual-rollforward-entry.component';
import { MatDialog } from '@angular/material';
import { BbcReviewService } from '../services/bbc-review.service';
import { EditRollForwardEntryComponent } from './sub-component/edit-roll-forward-entry/edit-roll-forward-entry.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-inventory-roll-forward',
	templateUrl: './inventory-roll-forward.component.html',
	styleUrls: ['./inventory-roll-forward.component.scss']
})
export class InventoryRollForwardComponent implements OnInit {
	public RollForwardDivisionCollateralGroup: FormGroup;
	rollForwardDivisionCollateralRowData: any;
	rollForwordLogsRowData: any;
	rollForwardLogColdef: any;
	rollForwardLogGridOptions: GridOptions;
	rollForwardLogdefaultColDef: any;
	selectedRolls: any = [];
	frameworkComponents: any;
	rollForwardColDef: any;
	rollForwardDivisionCollateralGridOptions: GridOptions;
	clientId: any;
	isDataLoaded: boolean;
	divisionList: any;
	arturnday: any;
	unreconciled: any;
	priorBalanceTotalInventory: any;
	balanceAmount: any;
	rollForwardDivisionCollateralDefaultColDef: any;
	receivable_aging_total: any;
	rollForwardDivisionCollateralGridApi: any;
	rollForwardDivisionCollateralGridParams: any;
	rollForwardDivisionCollateralGridColumnApi: any;
	rollforward_to_adjust_collateral: boolean = false;
	divisonData: any;
	productGroupData: any;
	collateralData: any;
	rollForwardData: any;
	asset_inventory_total: any;
	divisionId: any;
	collateralId: any;
	productGroupId: any;
	bbcList: any; 
	queryDate: any;
	editMode: boolean = false;

	constructor(private fb: FormBuilder,
		private helper: Helper,
		public dialog: MatDialog,
		public bbcReviewService: BbcReviewService,
		private apiMapper: APIMapper,
		private clientSelectSrv: ClientSelectionService,
		private message: MessageServices,
    private activatedRoute: ActivatedRoute
	) {
		this.clientId = CyncConstants.getSelectedClient();
		this.rollForwardDivisionCollateralGridOptions = {
			columnDefs: this.rollForwardColDef,
			enableBrowserTooltips: true,
		}
		this.getRouteParams();

		/**
		* Initialized grid column defination
		*/
		this.rollForwardColDef = [
			{
				headerName: 'Description',
				field: 'description',
				width: 850,
				resizable: true
			},
			{
				headerName: 'Balance Amount',
				field: 'balance_amount',
				cellStyle: { 'text-align': 'right' },
				resizable: true,
				valueFormatter: this.helper.CurrencyCellRendererRoundOff
			},
			{
				headerName: 'sequence',
				field: 'sequence',
				hide: true,
				sortable: true,
				sort: { direction: 'asc', priority: 0 }
			},
		];
		this.rollForwardDivisionCollateralDefaultColDef = {
			sortable: true,
			filter: true,
		};
		this.rollForwardDivisionCollateralRowData = [];
		this.rollForwardLogGridOptions = {
			rowData: this.rollForwordLogsRowData,
			context: {
				componentParent: this
			},
			suppressCellSelection: true
		},
			this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
		this.rollForwardLogdefaultColDef = {

			filter: true,
			agSetColumnFilter: true,
			suppressCellSelection: true,
			suppressRowClickSelection: true,
			resizable: true
		}

		this.rollForwardLogColdef = [
			{
				headerName: '',
				width: 70,
				headerCheckboxSelection: true,
				checkboxSelection: params => { if (params.data.user.toLowerCase() === "manual") { return true; } else { return false; } },
				cellStyle: { 'text-align': 'left' },
				filter: false
			},

			{
				headerName: 'Date',
				width: 160,
				suppressSizeToFit: true,
				field: 'activity_date',
				filter: 'agDateColumnFilter',
				cellClass: "dateFormat",
				sortable: true,
				// headerCheckboxSelection: true,
				// checkboxSelection: params => { if (params.data.user.toLowerCase() === "manual") { return true; } else { return false; } },
				cellStyle: { 'text-align': 'left' },
				valueFormatter: this.dateFormatter,
				filterParams: {
					comparator: function (filterLocalDateAtMidnight, cellValue) {
						var dateAsString = moment(cellValue).format('DD/MM/YYYY');
						var dateParts = dateAsString.split("/");
						var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
						if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
							return 0;
						}
						if (cellDate < filterLocalDateAtMidnight) {
							return -1;
						}
						if (cellDate > filterLocalDateAtMidnight) {
							return 1;
						}
					}
				},

			},
			{
				headerName: 'Division',
				field: 'division_name',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'left' },
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: 'Collateral',
				field: 'collateral_name',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'left' },
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: 'Product Group',
				field: 'product_group',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'left' },
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: 'Purchases',
				field: 'purchases',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this.helper.CurrencyCellRenderer,
				cellClass: "exportValueTwoDecimalPlaces",
			},
			{
				headerName: 'Credits',
				field: 'credits',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this.helper.CurrencyCellRenderer,
				cellClass: "exportValueTwoDecimalPlaces",
			},
			{
				headerName: 'Removals',
				field: 'removals',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this.helper.CurrencyCellRenderer,
				cellClass: "exportValueTwoDecimalPlaces",
			},
			{
				headerName: 'Adjustments',
				field: 'new_adjustment',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this.helper.CurrencyCellRenderer,
				cellClass: "exportValueTwoDecimalPlaces",
			},
			{
				headerName: 'BBC Adjustment',
				field: 'bbc_adjustment',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this.helper.CurrencyCellRenderer,
				cellClass: "exportValueTwoDecimalPlaces",
			}
		];
	}

	ngOnInit() {
		this.clientSelectSrv.clientSelected.subscribe(dt => {
			this.clientId = dt;
			this.afterChangeBorrowLoad();
		
		});
		this.afterChangeBorrowLoad();
		this.bbcReviewService.getActionInventory().subscribe(res =>{
			if (res === 'save' || res === 'edit') {
				this.getRollForwardData();
				this.getRollForwardLogData();
				 this.rollForwardLogGridOptions.api.refreshCells();
				this.selectedRolls = []
			}
		});
	}
	afterChangeBorrowLoad() {
		this.divisionId = -1
		this.collateralId = -1
		this.productGroupId = -1
		this.rollForwardGroup();
		this.getDivisonData();
		this.getProductGroupData();
		this.getRollForwardData();
		this.getRollForwardLogData()
	}

	rollForwardDivisionCollateralOnGridReady(params: any) {
		this.rollForwardDivisionCollateralGridParams = params;
		this.rollForwardDivisionCollateralGridApi = params.api;
		this.rollForwardDivisionCollateralGridColumnApi = params.columnApi;
		this.rollForwardDivisionCollateralGridApi.sizeColumnsToFit();

	}
	/**
	* rollForwardGroup form creation
	*/
	rollForwardGroup() {
		this.RollForwardDivisionCollateralGroup = this.fb.group({
			division: [''],
			collateral: [''],
			bbc_date: [''],
			product_group: ['']
		});
	}

	getRollForwardData() {
		this.message.showLoader(true);
		let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARDS].replace('{clientId}', this.clientId);
		url += "?balance_name_id="+this.divisionId ;
  	url += "&collateral_id="+this.collateralId ;
  	url += "&product_group_id="+this.productGroupId ;
		if(this.queryDate){
      url += "&bbc_date="+this.queryDate ;
		}
		this.bbcReviewService.getInventoryRollForwardDataForDivisonAll(url).subscribe(res => {
			let apiRes = <any>JSON.parse(res._body);
			if (apiRes.bbc_recalculate_required == true) {
				const popupParams = { 'title': 'Confirmation', message: CyncConstants.PROCESS_BBC_WARNING_MESSAGE }
				this.helper.openConfirmPopup(popupParams).subscribe(result => {
					if (result === true) {
						const url = this.apiMapper.endpoints[CyncConstants.BBC_RECALCULATION].replace('{clientId}', this.clientId)
						this.bbcReviewService.getBbcStart(url).subscribe(response => {
							const list = <any>JSON.parse(response._body);
							this.bbcList = list;
							this.message.showLoader(false);
						}, error => {
							this.isDataLoaded = false;
							this.message.showLoader(false);
						}
						)
					}
				});
			}
			if(apiRes.bbc_mode == "unreleased"){
        this.editMode = true;
			}else{
				this.editMode = false;
			}

		   this.loadDefaultData(apiRes);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);

		})
	}

	getRouteParams() {
    this.activatedRoute.queryParams.subscribe( params => {
        this.queryDate = params.bbc_date;
    });
  }

	getDivisonData() {
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_DIVISION_LIST].replace('{clientId}', this.clientId);

		this.bbcReviewService.getDivisionData(url).subscribe(response => {
			this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.divisonData = list.divisions;

		}, error => {
			this.isDataLoaded = false;

		}
		)
	}
	getProductGroupData(collateral_id=this.collateralId) {
		if(this.divisionId != -1 ){
			const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME].replace('{clientId}', this.clientId).replace("{collateral_id}", collateral_id);

			this.bbcReviewService.getProductGroupData(url).subscribe(response => {
				this.isDataLoaded = true;
				const list = <any>JSON.parse(response._body);
				this.productGroupData = list.product_groups;

			}, error => {
				this.isDataLoaded = false;

			}
			)
	    }else{
	    	this.productGroupData = []
	    }
	}
	getCollateralData(divisionId: any) {
		const url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID].replace('{clientId}', this.clientId).replace("{division_id}", divisionId);

		this.bbcReviewService.getCollateralData(url).subscribe(response => {
			this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.collateralData = list.collaterals;

		}, error => {
			this.isDataLoaded = false;

		}
		)
	}

	onChangeDivision(event) {
		this.divisionId = event.target.value;
		if (event.target.value === "-1") {
		 	this.productGroupData = [];
      this.collateralData = [];
      this.collateralId = -1;
      this.productGroupId = -1;
      this.divisionId = -1;
		}else{
			this.collateralId = -1;
			this.productGroupId = -1;
			this.getCollateralData(event.target.value);
		}
		this.getRollForwardData();
	}

	onChangeCollateral(event) {
		this.collateralId = event.target.value;
		if (event.target.value === "-1") {
			this.productGroupData = [];
      this.productGroupId = -1;
      this.collateralId = -1;
		} else {
			this.productGroupId = -1;
			this.getProductGroupDataBasedOnCollateralId();
		}
		this.getRollForwardData();
	}

	getProductGroupDataBasedOnCollateralId() {
		// const url = this.apiMapper.endpoints[CyncConstants.GET_COLLATERAL_BASED_PRODUCT_GROUP].replace('{clientId}', this.clientId).replace("{collateral_advance_rate_id}", this.collateralId);
		let url = "borrowers/{clientId}/inventory_rollforwards/product_groups?collateral_advance_rate_id={collateral_id}".replace('{clientId}', this.clientId).replace("{collateral_id}", this.collateralId);
		if(this.queryDate){
      url += "&bbc_date="+this.queryDate ;
		}
		this.bbcReviewService.getProductGroupData(url).subscribe(response => {
			this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.productGroupData = list.product_groups;
      
		}, error => {
			this.isDataLoaded = false;

		}
		)
	}


	onChangeProductGroup(event) {
		this.productGroupId = event.target.value;
		if (event.target.value === "-1") {
    	this.productGroupId = -1;
		}
		this.getRollForwardData();
	}

	// iventoryRollForwardDataWithDivisionID(divisionId: any) {
	// 	this.message.showLoader(true);
	// 	let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_WITH_DIVISION_ID].replace('{clientId}', this.clientId).replace("{division_id}", divisionId).replace('{clientId}', this.clientId);
 //    if(this.queryDate){
 //      url += "&bbc_date="+this.queryDate ;
	// 	}
	// 	this.bbcReviewService.getInventoryRollForwardDataForDivisonAll(url).subscribe(res => {
	// 		let apiRes = <any>JSON.parse(res._body)
	// 		this.loadDefaultData(apiRes);
	// 	}, error => {
	// 		this.isDataLoaded = false;
	// 		this.message.showLoader(false);

	// 	})
	// }
	// iventoryRollForwardDataWithDivisionIdCollateralId(collateralId) {

		// this.message.showLoader(true);
		// let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_WITH_DIVISION_ID_COLLATERAL_ID].replace('{clientId}', this.clientId).replace("{division_id}", this.divisionId).replace('{collateral_id}', this.collateralId);
  //   if(this.queryDate){
  //     url += "&bbc_date="+this.queryDate ;
		// }
		// this.bbcReviewService.getInventoryRollForwardDataForDivisonAll(url).subscribe(res => {
		// 	let apiRes = <any>JSON.parse(res._body)
		// 	this.rollForwardDivisionCollateralRowData = apiRes.records;
		// 	this.loadDefaultData(apiRes);
		// }, error => {
		// 	this.isDataLoaded = false;
		// 	this.message.showLoader(false);

		// })
	// }
	getRollForwardLogData() {
		this.message.showLoader(true);
		let url = this.apiMapper.endpoints[CyncConstants.GET_INVENTORY_ROLLFORWARD_LOG_DATA].replace('{clientId}', this.clientId);
		if(this.queryDate){
    	url += "?bbc_date="+this.queryDate ;
		}
		this.bbcReviewService.rollForwardDataService(url).subscribe(res=>{
			let apiRes = <any>JSON.parse(res._body)
		   this.rollForwordLogsRowData =  apiRes.inventory_rollforward_logs;
		   this.message.showLoader(false);
	   }, error => {
		   this.isDataLoaded = false;
		   this.message.showLoader(false);
	   })
	}
	/**
 * Add Button Form Open Dialog box
 */
	addRollForwardLogData() {
		const dialogRef = this.dialog.open(ManualRollforwardEntryComponent, {
			height: '285px',
			width: "100vw",
			disableClose: true,
			data: { selectedRollForwardlog: this.selectedRolls, rollforward_to_adjust_collateral: this.rollforward_to_adjust_collateral },
			autoFocus: false,
			panelClass: 'full-width-dialog-invoice'
		});
	}
	/**
* on click edit button open popup to edit
* 
*/
	editRollForwardLogData() {
		let selectedManualRolls = this.rollForwardLogGridOptions.api.getSelectedRows();
		const dialogRef = this.dialog.open(EditRollForwardEntryComponent, {
			height: 'auto',
			width: "97vw",
			autoFocus: false,
			disableClose: true,
			data: { selectedRollForwardlog: selectedManualRolls, rollforward_to_adjust_collateral: this.rollforward_to_adjust_collateral },
			panelClass: 'full-width-dialog-invoice'
		});
	}
  /**
   * Delate Button Action Icon
   */
  deleteRollforwardLogData() {
    const popupParams = { 'title': 'Confirmation', message: 'Are you sure you want to delete?' }
    this.helper.openConfirmPopup(popupParams).subscribe(result => {
      if (result === true) {
        let ids = [];
        let deleteRows = this.rollForwardLogGridOptions.api.getSelectedRows();
        // deleteRows = deleteRows.filter(elm => {
        //   return elm.user.toLowerCase() === "manual";
        // })
        deleteRows.forEach(element => {
          if(element.user.toLowerCase() === 'manual'){
          	ids.push(element.id)
        }
		});
		let params = new HttpParams();
		ids.forEach((actorName:string) =>{
		  params = params.append(`ids[]`,actorName);
		})
		deleteRows.toString();
        const url = this.apiMapper.endpoints[CyncConstants.DELETE_INVENTORY_ROLLFORWARD_LOG_DATA].replace('{clientId}', this.clientId).replace('{ids}',params);
        this.bbcReviewService.deleteRollForwardLogService(url).subscribe(response => {
          const message = 'Deleted Successfully';
          this.selectedRolls = [];
          this.helper.showApiMessages(message, 'success');
		      this.getRollForwardData();
		      this.getRollForwardLogData();
          this.rollForwardLogGridOptions.api.refreshCells();
        });
      }

    });
  }
	/**
   * on row selected selected rows will be edited or deleted
   * 
   */
  onRowSelected(event: any) {
    this.selectedRolls = this.rollForwardLogGridOptions.api.getSelectedRows();
    if (this.selectedRolls === this.rollForwordLogsRowData.length) {
      this.selectedRolls = [];
    }
  }
	/**
* on Ready Grid Load
* 
*/
	onGridReadyRollForward(params: any) {
		// this.gridApi = params.api;
		// this.gridColumnApi = params.columnApi;
		this.rollForwardLogGridOptions.api.sizeColumnsToFit();
	}
	/*
*format activity date
*/
	dateFormatter(params: any) {
		return moment(params.value).format('MM/DD/YYYY');
	}
	/** ag-grid will by default lowercase the input string, 
   * This method restrict the uppercase letter to be automatically converted into 
   *  lowercase in ag-grid filter 
   */
	getFilterTextValue(filter, value, filterText) {
		const filterTextLoweCase = filterText.toLowerCase();
		const valueLowerCase = value.toString().toLowerCase();
		let index;
		switch (filter) {
			case 'contains':
				return valueLowerCase.indexOf(filterTextLoweCase) >= 0;
			case 'notContains':
				return valueLowerCase.indexOf(filterTextLoweCase) === -1;
			case 'equals':
				return valueLowerCase === filterTextLoweCase;
			case 'notEqual':
				return valueLowerCase !== filterTextLoweCase;
			case 'startsWith':
				return valueLowerCase.indexOf(filterTextLoweCase) === 0;
			case 'endsWith':
				index = valueLowerCase.lastIndexOf(filterTextLoweCase);
				return index >= 0 && index === (valueLowerCase.length - filterTextLoweCase.length);
			default:
				// should never happen
				console.warn(`invalid filter type ${filter}`);
				return false;
		}
	}
	loadDefaultData(apiRes:any){	
	let bbcDate = apiRes.bbc_date;
	this.RollForwardDivisionCollateralGroup.get('bbc_date').setValue(bbcDate);
	this.bbcReviewService.setRollForwardInventory(bbcDate);
	this.arturnday = apiRes.ar_turn_days === '' || apiRes.ar_turn_days === null ? 0 : apiRes.ar_turn_days;
	if(apiRes.records.length > 0){	
	let pb = apiRes.records.filter(obj => obj.description == 'Prior Balance - Total Inventory');
	if(pb[0]){
	this.priorBalanceTotalInventory = pb[0].description;
	this.balanceAmount = this.helper.CurrencyCellRendererRoundOff(pb[0].balance_amount);
    }
	}
	if(apiRes.inventory_rollforward_collateral_value === true){
	this.rollforward_to_adjust_collateral = true;
	if(apiRes.records[1].description === "Unreconciled"){
      this.unreconciled = this.helper.CurrencyCellRendererRoundOff(apiRes.records[1].balance_amount);
     }else{		
     this.unreconciled = this.helper.CurrencyCellRendererRoundOff(apiRes.unreconciled);
	}
	apiRes.records = apiRes.records.filter(obj => obj.description !== 'Unreconciled');
	this.asset_inventory_total = apiRes.asset_inventory_total === '' || apiRes.asset_inventory_total === null ? 0 : this.helper.CurrencyCellRendererRoundOff(apiRes.asset_inventory_total);
	} else{
	this.rollforward_to_adjust_collateral = false;
	}
	let finalRecords = apiRes.records.filter(obj => obj.description !== 'Prior Balance - Total Inventory');
	this.rollForwardDivisionCollateralRowData = finalRecords;
	var sort = [{ colId: 'sequence', sort: 'asc' }];
    this.rollForwardDivisionCollateralGridOptions.api.setSortModel(sort);
	this.message.showLoader(false);
}
}
