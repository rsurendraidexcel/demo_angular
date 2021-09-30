import { Component, OnInit, Input } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BbcReviewService } from '../../../services/bbc-review.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Subject } from 'rxjs';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
	selector: 'app-rollforward-division-collateral',
	templateUrl: './rollforward-division-collateral.component.html',
	styleUrls: ['./rollforward-division-collateral.component.scss']
})
export class RollforwardDivisionCollateralComponent implements OnInit {

	rollForwardDivisionCollateralRowData: any;
	rollForwardColDef: any;
	rollForwardDivisionCollateralGridOptions: GridOptions;
	clientId: any;
	isDataLoaded: boolean;
	divisionList: any;
	arturnday: any;
	unreconciled:any;
	priorBalanceTotalAccountsReceivable: any;
	balanceAmount: any;
	rollForwardDivisionCollateralDefaultColDef : any;
	receivable_aging_total:any;
	rollForwardDivisionCollateralGridApi: any;
	rollForwardDivisionCollateralGridParams: any;
	rollForwardDivisionCollateralGridColumnApi: any;
	rollforward_to_adjust_collateral:boolean=  false;
	@Input() parentSubject: Subject<any>;

	constructor(
		private bbcReviewService: BbcReviewService,
		private helper: Helper,
		private clientSelectSrv: ClientSelectionService 
	) {
		this.isDataLoaded = false;
		this.clientId = CyncConstants.getSelectedClient(); 

		this.rollForwardDivisionCollateralGridOptions = {
			columnDefs: this.rollForwardColDef,
			enableBrowserTooltips: true,
		}

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
			}
		];
		this.rollForwardDivisionCollateralDefaultColDef = {
			sortable: true,
			filter: true,
		};
		this.rollForwardDivisionCollateralRowData = [];
	}

	ngOnInit() {
		this.clientSelectSrv.clientSelected.subscribe( dt => {
			 this.clientId = dt;
			 this.afterBorrowChangeLoad();
		});
		this.loadDefaultdata();
		this.onDisableData();
	}

	/* After Change BorrowLoad */
    afterBorrowChangeLoad(){
		this.loadDefaultdata();
		this.onDisableData();
	}

	rollForwardDivisionCollateralOnGridReady(params: any) {
		this.rollForwardDivisionCollateralGridParams = params;
		this.rollForwardDivisionCollateralGridApi = params.api;
		this.rollForwardDivisionCollateralGridColumnApi = params.columnApi;
		this.rollForwardDivisionCollateralGridApi.sizeColumnsToFit();
		this.rollForwardDivisionCollateralGridApi.showLoadingOverlay();
	}

	onModelUpdated($event) {
		if (this.rollForwardDivisionCollateralGridApi && this.rollForwardDivisionCollateralGridApi.rowModel.rowsToDisplay.length == 0) {
			this.rollForwardDivisionCollateralGridApi.showNoRowsOverlay();
		}
		if (this.rollForwardDivisionCollateralGridApi && this.rollForwardDivisionCollateralGridApi.rowModel.rowsToDisplay.length > 0) {
			this.rollForwardDivisionCollateralGridApi.hideOverlay();
		}
	}

	/**
	* this method takes the grid data from service and assign it to row data of grid!! 
	* the data flow from service to component
	*/
	loadDefaultdata() {
		this.bbcReviewService.getRollForward().subscribe(data => {
			if (data != "") {
				this.arturnday = data.ar_turn_days === '' || data.ar_turn_days === null ? 0 : data.ar_turn_days;
				this.priorBalanceTotalAccountsReceivable = data.roll_forward[0].description;
				let k = data.roll_forward[0].balance_amount;
				this.balanceAmount = this.helper.CurrencyCellRendererRoundOff(k);
				if(data.rollforward_to_adjust_collateral === true)
				{
				data.roll_forward =
				 data.roll_forward.filter(obj => (obj.description !== 'Prior Balance - Total Accounts Receivable')
				  && (obj.description !== 'Unreconciled'));
					this.receivable_aging_total = this.helper.CurrencyCellRendererRoundOff(data.receivable_aging_total);
					this.unreconciled = this.helper.CurrencyCellRendererRoundOff(data.unreconciled);
					this.rollforward_to_adjust_collateral = true;
				}
				else{
					data.roll_forward = data.roll_forward.filter(obj => obj.description !== 'Prior Balance - Total Accounts Receivable');
				  this.rollforward_to_adjust_collateral = false;
				}
				this.rollForwardDivisionCollateralRowData = data.roll_forward;
			}
		});
	}

	/**
     * this method hide the arturndays row whith the onchange of division value
     */
	onDisableData() {
		this.parentSubject.subscribe(event => {
			if (event != '') {
				$("#arturnday").css("display", "none");
			}
			else {
				$("#arturnday").css("display", "block");
			}
		});
	}
}
