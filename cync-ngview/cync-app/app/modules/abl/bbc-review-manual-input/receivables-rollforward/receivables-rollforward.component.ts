import { Component, OnInit, Inject } from '@angular/core';
import { BbcReviewService } from '../services/bbc-review.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import * as moment from 'moment-timezone';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { Helper } from '@cyncCommon/utils/helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
	selector: 'app-receivables-rollforward',
	templateUrl: './receivables-rollforward.component.html',
	styleUrls: ['./receivables-rollforward.component.scss']
})
export class ReceivablesRollforwardComponent implements OnInit {

	divisionList: any;
	bbcList: any;
	collateralList: any;
	isDataLoaded: boolean;
	clientId: any; 
	divisionId: any;
	selectedDivision = '';
	selectedCollateral = '';
	serviceData: any;
	public RollForwardDivisionCollateralGroup: FormGroup;
	rollForwardDetails: any = [];
	parentSubject: Subject<any> = new Subject();

	constructor(
		private fb: FormBuilder,
		private bbcReviewService: BbcReviewService,
		private apiMapper: APIMapper,
		private message: MessageServices,
		private helper: Helper,
		private clientSelectSrv: ClientSelectionService 
	) {
		this.isDataLoaded = false;
		this.clientId = CyncConstants.getSelectedClient();
		this.rollForwardGroup();
	}

	ngOnInit() {
		    this.clientSelectSrv.clientSelected.subscribe( dt => {
				this.clientId = dt;	
				this.afterChangeBorrowLoad();
			});

			this.getDivisionList();
			if(this.RollForwardDivisionCollateralGroup.get('division').value === '') {
				this.initializeData();
			}
			this.getData();	
	}

   /* After Change BorrowLoad */
    afterChangeBorrowLoad(){
		this.getDivisionList();
		if(this.RollForwardDivisionCollateralGroup.get('division').value === '') {
			this.initializeData();
		}
		 this.getData();	
	}

	/**
	* rollForwardGroup form creation
	*/
	rollForwardGroup() {
		this.RollForwardDivisionCollateralGroup = this.fb.group({
			division: [''],
			collateral: [''],
			bbc_date: ['']
		});
	}

	/**
	* Set roll forward form group details
	*/
	setrollForwardDetails() {
		//	this.RollForwardDivisionCollateralGroup.get('division').setValue('');
		//	this.RollForwardDivisionCollateralGroup.get('collateral').setValue('');
		this.RollForwardDivisionCollateralGroup.get('bbc_date').setValue(this.serviceData.bbc_date);
	}

	/**
	* This method will call on change of division value
	*/
	onChangeDivision(event: any) {
		this.parentSubject.next(event.target.value);
		if (this.RollForwardDivisionCollateralGroup.get('division').value === '') {
			$("#collateralId").css("display", "none");
			this.initializeData();
		}
		else {
			this.onSelectedDivision(event.target.value)
			$("#collateralId").css("display", "block");
		}
	}

	/**
	* On division initializeDataelection event
	* @param data initializeData
	*/
	onSelectedDivision(divID: any) {
		this.selectedDivision = divID;
		this.getRollForwardDivisionGridData(divID);
		this.getCollateralList(divID);
	}

	/**
	* This method will call on change of collateral value
	*/
	onChangeCollateral(event: any) {
		if (this.RollForwardDivisionCollateralGroup.get('collateral').value != '') {
            this.onSelectedCollateral(event.target.value)
		}
		else {
			this.getRollForwardDivisionGridData(this.selectedDivision);
		}
	}

	/**
	* On collateral selection event
	* @param data 
	*/
	onSelectedCollateral(collateralID: any) {
		this.selectedCollateral = collateralID;
		this.getRollForwardCollteralGridData(collateralID);
	}

	/*
	 * This method will give data if the division id is null and option selected is All 
	 */
	initializeData() {
		const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_ID_NULL].replace('{clientId}', this.clientId);
		this.bbcReviewService.getinitializeData(url).subscribe(response => {
			this.isDataLoaded = true;
			let gridlist = <any>JSON.parse(response._body);
			this.bbcReviewService.setRollForward(gridlist);
			if (gridlist.bbc_recalculate_required == true) {
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
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		}
		)
	}

	/*
	 * Get division list 
	 */
	getDivisionList() {
		this.message.showLoader(true);
		const url = this.apiMapper.endpoints[CyncConstants.GET_DIVISION_LIST].replace('{clientId}', this.clientId);

		this.bbcReviewService.getDivisionList(url).subscribe(response => {
			this.isDataLoaded = true;
			const list = <any>JSON.parse(response._body);
			this.divisionList = list.division;
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		}
		)
	}

	/**
	 * this method give grid data with collateral id null and division id not null
	 */
	getRollForwardDivisionGridData(divID: any) {
		const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_ID].replace('{clientId}', this.clientId).replace('{division_id}', divID)
		this.bbcReviewService.getRollForwardGridData(url).subscribe(response => {
			this.isDataLoaded = true;
			let res = <any>JSON.parse(response._body);
			this.bbcReviewService.setRollForward(res);
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		}
		)
	}

	/**
	* this method give collateral list based on division list
    */
	getCollateralList(divID: any) {
		const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_COLLATERAL_LIST].replace('{clientId}', this.clientId).replace('{division_id}', divID).replace('{clientId}', this.clientId)
		this.bbcReviewService.getCollateralList(url).subscribe(response => {
			this.isDataLoaded = true;
			let collaterallist = <any>JSON.parse(response._body);
			this.collateralList = collaterallist.collateral_advance_rate_id;
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		}
		)
	}

	/**
	* this method give data grid data based on collateral selection
    */
	getRollForwardCollteralGridData(collateralID: any) {
		const url = this.apiMapper.endpoints[CyncConstants.DIVISION_LIST_WITH_COLLATERAL_LIST_ID].replace('{clientId}', this.clientId).
			replace('{division_id}', this.selectedDivision).replace('{collateral_id}', collateralID);

		this.bbcReviewService.getCollateralList(url).subscribe(response => {
			this.isDataLoaded = true;
			let res = <any>JSON.parse(response._body);
			this.bbcReviewService.setRollForward(res);
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		}
		)
	}

	/**
    *  get data from the service subscribes
    */
	getData() {
		this.bbcReviewService.getRollForward().subscribe(data => {
			this.serviceData = data;
			this.setrollForwardDetails();
		});
	}
}
