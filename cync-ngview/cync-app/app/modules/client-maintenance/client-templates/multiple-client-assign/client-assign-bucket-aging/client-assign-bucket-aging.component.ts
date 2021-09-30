import { Component, OnInit } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientTemplatesService } from '../../service/client-templates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';

@Component({
	selector: 'app-client-assign-bucket-aging',
	templateUrl: './client-assign-bucket-aging.component.html',
	styleUrls: ['./client-assign-bucket-aging.component.scss']
})
export class ClientAssignBucketAgingComponent implements OnInit {
	arBucketAgingRowData: any;
	arBucketAgingcolumnDefs: any;
	arBucketAgingGridApi: any;
	arBucketAgingGridParams: any;
	arBucketAgingGridOptions: GridOptions;
	arBucketAgingGridColumnApi: any;
	arBucketAgingDefaultColDef: any;

	apBucketAgingRowData: any;
	apBucketAgingcolumnDefs: any;
	apBucketAgingGridApi: any;
	apBucketAgingGridParams: any;
	apBucketAgingGridOptions: GridOptions;
	apBucketAgingGridColumnApi: any;
	apBucketAgingDefaultColDef: any;

	isDataLoaded: boolean;
	id: any;
	bucketName: any;
	arBucketAgingSelectedRows: any = [];
	apBucketAgingSelectedRows: any = [];
	arBucketAgingId: number = 0;
	apBucketAgingId: number = 0;
	params: any;
	templateViewtype: string;
	templateViewid: any;
	allBucketAgingData: any;
	isDisabledBucketName = false;
	bucketAgingData: any = [];

	constructor(
		private apiMapper: APIMapper,
		private helper: Helper,
		private message: MessageServices,
		private clientTemplatesService: ClientTemplatesService,
		private router: Router,
		private route: ActivatedRoute
	) {

		this.route.params.subscribe(params => this.id = params.id);
		this.isDataLoaded = false;

		this.arBucketAgingGridOptions = {
			columnDefs: this.arBucketAgingcolumnDefs,
			enableBrowserTooltips: true,
		}

		this.apBucketAgingGridOptions = {
			columnDefs: this.apBucketAgingcolumnDefs,
			enableBrowserTooltips: true,
		}

		/**
        * Initialized ar bucket aging grid column defination
        */
		this.arBucketAgingcolumnDefs = [
			{
				headerName: "Bucket Number",
				field: "bucket_number",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				checkboxSelection: true,
				width: 300,
				headerCheckboxSelection: true
			},
			{
				headerName: "Bucket Name",
				field: "bucket_name",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			},
			{
				headerName: "Days From",
				field: "days_from",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			},
			{
				headerName: "Days To",
				field: "days_to",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			}
		];

		/**
        * Initialized ar bucket aging grid column defination
        */
		this.apBucketAgingcolumnDefs = [
			{
				headerName: "Bucket Number",
				field: "bucket_number",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				checkboxSelection: true,
				width: 300,
				headerCheckboxSelection: true
			},
			{
				headerName: "Bucket Name",
				field: "bucket_name",
				filter: 'agTextColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			},
			{
				headerName: "Days From",
				field: "days_from",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			},
			{
				headerName: "Days To",
				field: "days_to",
				filter: 'agNumberColumnFilter',
				cellStyle: { 'text-align': 'left', border: "1px solid #A9A9A9", padding: '2px' },
				resizable: true,
				width: 300,
				editable: true
			}
		];

		this.arBucketAgingDefaultColDef = {
			sortable: true,
			filter: true,
		};

		this.apBucketAgingDefaultColDef = {
			sortable: true,
			filter: true,
		};

		this.arBucketAgingRowData = [];
		this.apBucketAgingRowData = [];

	}

	ngOnInit() {

		if(this.id != "assigned"){
			this.getBuckingAgingData(this.id);
		}

		/**
		 *  Geting dropdown change detection
		 */

		 this.clientTemplatesService.getDropdownChangeData().subscribe(response => {
			if(response){
				this.getBuckingAgingData(response);
			}
		 })
		 this.clientTemplatesService.getConfirmMultiAsignDataFetch().subscribe(data => {
            if (data==="fetch") {
				this.saveBucketAgingData();
			  this.clientTemplatesService.setMultiClientBucketAging(this.bucketAgingData);
            }
		  })
	}

	/**
 * on Ar bucket aging row selected
 * @param event 
 */
	onArBucketAgingRowSelected(event: any) {
		this.arBucketAgingSelectedRows = this.arBucketAgingGridOptions.api.getSelectedRows();
	}

	/**
	 * on Ap bucket aging row selected
	 * @param event 
	 */
	onApBucketAgingRowSelected(event: any) {
		this.apBucketAgingSelectedRows = this.apBucketAgingGridOptions.api.getSelectedRows();
	}

	
	/**
    * Initialize Bucket Aging data
    */
	getBuckingAgingData(id: any) {
		const url = this.apiMapper.endpoints[CyncConstants.BUCKET_AGING_LIST].replace('{id}', id);
		this.clientTemplatesService.getBucketAgingService(url).subscribe(response => {
			this.isDataLoaded = true;
			this.arBucketAgingRowData = <any>JSON.parse(response._body).data.bucket_ageings.data;
			this.apBucketAgingRowData = <any>JSON.parse(response._body).data.payable_bucket_ageings.data;
			this.bucketName = <any>JSON.parse(response._body).data.retention_label;
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		});
	}

	/**
    * Ar bucket aging onGridReady
    * @param params 
    */
	arBucketAgingOnGridReady(params: any) {
		this.arBucketAgingGridParams = params;
		this.arBucketAgingGridApi = params.api;
		this.arBucketAgingGridColumnApi = params.columnApi;
		this.arBucketAgingGridApi.showLoadingOverlay();
		//this.arBucketAgingGridOptions.api.sizeColumnsToFit();
	}

	/**
	 * Ap bucket aging onGridReady
	 * @param params 
	 */
	apBucketAgingOnGridReady(params: any) {
		this.apBucketAgingGridParams = params;
		this.apBucketAgingGridApi = params.api;
		this.apBucketAgingGridColumnApi = params.columnApi;
		this.apBucketAgingGridApi.showLoadingOverlay();
	}

	/**
     * This method add new row in arbucket aging
     */
	arBucketAgingAddNew() {
		const newItem = this.arBucketAgingAddNewRowData();
		this.arBucketAgingGridApi.updateRowData({ add: [newItem] });
	}

	// arBucket aging New Row Data
	arBucketAgingAddNewRowData(): any {
		this.arBucketAgingId++;
		const newRow = {
			id: '',
			bucket_number: '',
			bucket_days: '',
			bucket_name: '',
			days_from: '',
			days_to: '',
			arId: this.arBucketAgingId,
			is_ar_new: true
		};
		return newRow;
	}

	/**
	 * This method add new row in apbucket aging
	 */
	apBucketAgingAddNew() {
		const newItem = this.apBucketAgingAddNewRowData();
		this.apBucketAgingGridApi.updateRowData({ add: [newItem] });
	}

	// apBucket aging New Row Data
	apBucketAgingAddNewRowData(): any {
		this.apBucketAgingId++;
		const newRow = {
			id: '',
			bucket_number: '',
			bucket_days: '',
			bucket_name: '',
			days_from: '',
			days_to: '',
			apId: this.apBucketAgingId,
			is_ap_new: true
		};
		return newRow;
	}

	/**
	 * This method delete the rows of ARbucket aging
	 */
	deleteArBucketAgingData() {
		const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete?' }
		this.helper.openConfirmPopup(popupParams).subscribe(result => {
			if (result == true) {
				for (let eachobject of this.arBucketAgingSelectedRows) {
					if (eachobject.hasOwnProperty('is_ar_new') === false) {
						let ids = [];
						let deleteRows = this.arBucketAgingGridOptions.api.getSelectedRows();
						deleteRows.forEach(element => {
							ids.push(element.id)
						});
						const url = this.apiMapper.endpoints[CyncConstants.DELETE_AR_BUCKET_AGING].replace('{ids}', ids);
						this.clientTemplatesService.deleteArBucketAgingService(url).subscribe(response => {
							const message = 'Bucket Aging deleted successfully';
							this.helper.showApiMessages(message, 'success');
							this.getBuckingAgingData(this.id);
							this.arBucketAgingGridOptions.api.refreshCells();
						});
					}
					else {
						const selectedRow = this.arBucketAgingGridApi.getSelectedRows();
						this.arBucketAgingGridApi.updateRowData({ remove: selectedRow });
						const message = 'Bucket Aging deleted successfully';
						this.helper.showApiMessages(message, 'success');
					}
				}
			}
		});
	}

	/**
	 * This method delete the rows of APbucket aging
	 */
	deleteApBucketAgingData() {
		const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete?' }
		this.helper.openConfirmPopup(popupParams).subscribe(result => {
			if (result === true) {
				for (let eachobject of this.apBucketAgingSelectedRows) {
					if (eachobject.hasOwnProperty('is_ap_new') === false) {
						let ids = [];
						let deleteRows = this.apBucketAgingGridOptions.api.getSelectedRows();
						deleteRows.forEach(element => {
							ids.push(element.id)
						});
						const url = this.apiMapper.endpoints[CyncConstants.DELETE_AP_BUCKET_AGING].replace('{ids}', ids);
						this.clientTemplatesService.deleteApBucketAgingService(url).subscribe(response => {
							const message = 'Bucket Aging deleted successfully.';
							this.helper.showApiMessages(message, 'success');
							this.getBuckingAgingData(this.id);
							this.apBucketAgingGridOptions.api.refreshCells();
						});
					}
					else {
						const selectedRow = this.apBucketAgingGridApi.getSelectedRows();
						this.apBucketAgingGridApi.updateRowData({ remove: selectedRow });
						const message = 'Bucket Aging deleted successfully.';
						this.helper.showApiMessages(message, 'success');
					}
				}
			}
		});
	}

	onModelUpdated($event) {
		if (this.arBucketAgingGridApi && this.arBucketAgingGridApi.rowModel.rowsToDisplay.length == 0) {
			this.arBucketAgingGridApi.showNoRowsOverlay();
		}
		if (this.arBucketAgingGridApi && this.arBucketAgingGridApi.rowModel.rowsToDisplay.length > 0) {
			this.arBucketAgingGridApi.hideOverlay();
		}
	}

	/**
	 * This method reset the rows of ARbucket aging
	 */
	cancelArBucketAgingData() {
		const url = this.apiMapper.endpoints[CyncConstants.BUCKET_AGING_LIST].replace('{id}', this.id);
		this.clientTemplatesService.getBucketAgingService(url).subscribe(response => {
			if (<any>JSON.parse(response._body).data.bucket_ageings.length == 0) {
				this.arBucketAgingRowData = <any>JSON.parse(response._body).data.bucket_ageings;
			} else {
				this.arBucketAgingRowData = <any>JSON.parse(response._body).data.bucket_ageings.data;
			}
			this.isDataLoaded = true;
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		});
		this.arBucketAgingSelectedRows = [];
	}

	/**
	 * This method reset the rows of APbucket aging
	 */
	cancelApBucketAgingData() {
		const url = this.apiMapper.endpoints[CyncConstants.BUCKET_AGING_LIST].replace('{id}', this.id);
		this.clientTemplatesService.getBucketAgingService(url).subscribe(response => {
			if (<any>JSON.parse(response._body).data.payable_bucket_ageings.length == 0) {
				this.apBucketAgingRowData = <any>JSON.parse(response._body).data.payable_bucket_ageings
			} else {
				this.apBucketAgingRowData = <any>JSON.parse(response._body).data.payable_bucket_ageings.data;
			}
			this.isDataLoaded = true;
			this.message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this.message.showLoader(false);
		});
		this.apBucketAgingSelectedRows = [];
	}
	
	/**
	 * This method disable bucket aging when view type
	 */
	disablewhenView() {
		if (this.templateViewtype == 'view') {
			this.isDisabledBucketName = true;
			$("#saveBucket").prop('disabled', true);
			$("#cancelBucket").prop('disabled', true);
			$("i#arNew, i#arCancel, i#deleteArBucket, i#deleteApBucket, i#apNew, i#apCancel").addClass("fa-2x f_s_20 clr_grey icon_disabled operation_disabled");

			let arBucketcolDef = this.arBucketAgingcolumnDefs[0];
			arBucketcolDef.checkboxSelection = false;
			arBucketcolDef.headerCheckboxSelection = false;
			this.arBucketAgingcolumnDefs[1].editable = false;
			this.arBucketAgingcolumnDefs[2].editable = false;
			this.arBucketAgingcolumnDefs[3].editable = false;
			this.arBucketAgingcolumnDefs[0].cellStyle = { 'background-color': '#2d2b2b21' };
			this.arBucketAgingcolumnDefs[1].cellStyle = { 'background-color': '#2d2b2b21' };
			this.arBucketAgingcolumnDefs[2].cellStyle = { 'background-color': '#2d2b2b21' };
			this.arBucketAgingcolumnDefs[3].cellStyle = { 'background-color': '#2d2b2b21' };

			let apBucketcolDef = this.apBucketAgingcolumnDefs[0];
			apBucketcolDef.checkboxSelection = false;
			apBucketcolDef.headerCheckboxSelection = false;
			this.apBucketAgingcolumnDefs[1].editable = false;
			this.apBucketAgingcolumnDefs[2].editable = false;
			this.apBucketAgingcolumnDefs[3].editable = false;
			this.apBucketAgingcolumnDefs[0].cellStyle = { 'background-color': '#2d2b2b21' };
			this.apBucketAgingcolumnDefs[1].cellStyle = { 'background-color': '#2d2b2b21' };
			this.apBucketAgingcolumnDefs[2].cellStyle = { 'background-color': '#2d2b2b21' };
			this.apBucketAgingcolumnDefs[3].cellStyle = { 'background-color': '#2d2b2b21' };

		}
	}
	/*
   *to get system definded ineligible reasons
   */
	getListOfSystemDefinedIneligibleReasons() {
		const url = this.apiMapper.endpoints[CyncConstants.GET_SYSTEM_DEFINED_INELIGIBILITY_REASONS].replace("{client_template_id}", this.id);
		this.clientTemplatesService.getIneligibleReasonList(url).subscribe(response => {
			let unSavedIneligibleReasons = <any>JSON.parse(response._body).ineligible_reasons
			let IneligibleReasons = [];
			unSavedIneligibleReasons.forEach(element => {
				IneligibleReasons.push(element)
			});
			this.clientTemplatesService.setUnsavedIneligibleReason(IneligibleReasons);
		});
	}

	/*
	*to get saved ineligible reason data
	*/
	getTemplateData() {
		let url = this.apiMapper.endpoints[CyncConstants.GET_TEMPLATE_DATA].replace('{id}', this.id);
		this.clientTemplatesService.gettemplatedetailsService(url).subscribe(response => {
			let savedIneligibleReasons = JSON.parse(response._body).data.ineligible_calculations;
			if (typeof savedIneligibleReasons === "object") {
				savedIneligibleReasons = JSON.parse(response._body).data.ineligible_calculations.data
				this.clientTemplatesService.setSavedIneligibleReason(savedIneligibleReasons);
			} else {
				this.clientTemplatesService.setSavedIneligibleReason([]);
			}
		})
	}

		/**
	 * This method save the data of bucket aging
	 */
	saveBucketAgingData() {
		this.apBucketAgingGridApi.stopEditing();
		this.arBucketAgingGridApi.stopEditing();

		let requestBody = {
			client_template: {
				retention_label: '',
				bucket_ageings: [],
				payable_bucket_ageings: []
			}
		};
        
		if(this.arBucketAgingGridOptions.api === null){
          return;
		}
		else {

			requestBody.client_template['retention_label'] = this.bucketName;
             // ar bucket aging Save data
		this.arBucketAgingGridOptions.api.forEachNode(nodeData => {
			let arBucketRowData = [];
			arBucketRowData.push(nodeData.data);
			if (arBucketRowData.length > 0) {
				arBucketRowData.forEach((elm, index) => {
					let dataObject = {
						bucket_name: `${elm.bucket_name}`,
						days_from: elm.days_from,
						days_to: elm.days_to
					};
					requestBody.client_template.bucket_ageings.push(dataObject);
				});
			}
		});

		// ap bucket aging Save data
		this.apBucketAgingGridOptions.api.forEachNode(nodeData => {
			let apBucketRowData = [];
			apBucketRowData.push(nodeData.data);
			if (apBucketRowData.length > 0) {
				apBucketRowData.forEach((elm, index) => {
					let dataObject = {
						bucket_name: `${elm.bucket_name}`,
						days_from: elm.days_from,
						days_to: elm.days_to,
					};
					requestBody.client_template.payable_bucket_ageings.push(dataObject);
				});
			}
		});
		this.bucketAgingData = requestBody;
		}
		
	}

}
