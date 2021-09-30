import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { MultiCrossAgeGridInputComponent } from './multi-cross-age-grid-input/multi-cross-age-grid-input.component';
import { MultiIconComponent } from './multi-icon/multi-icon.component';
import { MultiCheckboxComponent } from './multi-checkbox/multi-checkbox.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientTemplatesService } from '@app/modules/client-maintenance/client-templates/service/client-templates.service';

@Component({
	selector: 'app-multi-cross-age-buckets-grid',
	templateUrl: './cross-age-buckets-grid.component.html',
	styleUrls: ['./cross-age-buckets-grid.component.scss']
})
export class MultiCrossAgeBucketsGridComponent implements OnInit {
	@ViewChild('rePaymentGrid') rePaymentGrid: ElementRef;

	basicParameterId: any;
	crossAgingDefaultColDef: any;
	crossbucketRowData: any;
	crossAgingGridParams: any;
	crossAgingGridApi: any;
	crossAgingGridColumnApi: any;
	crossBucketAgingId: number;
	crossbucketGridOptions: GridOptions;
	frameworkComponents: any;
	crossBucketSelectedRows: any = [];
	context: any;
	columnDefs: any;
	previousData: any;

	constructor(private clientTemplatesService: ClientTemplatesService,
		public dialogRef: MatDialogRef<MultiCrossAgeBucketsGridComponent>,
		private apiMapper: APIMapper,
		private helper: Helper,
		private message: MessageServices,
		@Inject(MAT_DIALOG_DATA) public data) {

		this.basicParameterId = this.data.data;
		this.crossAgingDefaultColDef = {
			sortable: true,
			filter: true,
		};
		this.crossbucketRowData = [];

		this.columnDefs = [
			{
				headerName: 'Bucket Name',
				field: 'bucket_name',
				sortable: true,
				editable: false,
				checkboxSelection: true,
				width: 200
			},
			{
				headerName: 'Aging',
				field: 'ageing',
				sortable: true,
				cellRendererFramework: MultiCheckboxComponent,
				width: 200
			},
			{
				headerName: '%',
				field: 'pct',
				sortable: true,
				editable: true,
				width: 200
			},
			{
				headerName: '% Based On',
				field: 'based_on',
				sortable: true,
				cellRendererFramework: MultiCrossAgeGridInputComponent,
				width: 200
			},
			{
				headerName: 'Action',
				field: '',
				filter: false,
				cellRendererFramework: MultiIconComponent,
				width: 200
			}
		];
		this.crossbucketGridOptions = {
			context: {
				componentCheck: this
			},
		}

	}

	ngOnInit() {
		this.getcrossagingData(this.basicParameterId)
	}

	crossAgingOnGridReady(params) {
		this.crossAgingGridParams = params;
		this.crossAgingGridApi = params.api;
		this.crossAgingGridColumnApi = params.columnApi;
		this.crossAgingGridApi.sizeColumnsToFit();
		this.crossAgingGridApi.showLoadingOverlay();
	}

	defaultColDef = {
		filter: "agTextColumnFilter"
	}

	onModelUpdated($event) {
		if (this.crossAgingGridApi && this.crossAgingGridApi.rowModel.rowsToDisplay.length == 0) {
			this.crossAgingGridApi.showNoRowsOverlay();
		}
		if (this.crossAgingGridApi && this.crossAgingGridApi.rowModel.rowsToDisplay.length > 0) {
			this.crossAgingGridApi.hideOverlay();
		}
	}


	getcrossagingData(id) {
		console.log("coming here")
		const url = 'parameters/' + id + '/get_cross_aging_buckets';
		this.clientTemplatesService.getcrossAgingData(url).subscribe(response => {
			this.previousData = <any>JSON.parse(response._body).cross_ageing_buckets;
			this.crossbucketRowData = <any>JSON.parse(response._body).cross_ageing_buckets;
			const temData = <any>JSON.parse(response._body).cross_ageing_buckets;
			temData.map((elm) =>   elm.edited = false );
			this.crossbucketRowData= temData;
		}, error => {
			this.message.showLoader(false);
		});
	}

	basedOnValueChanged(data: any) {
		console.log('cell value print*****', data.based_on);
	}

	onAgingChanged(data: any) {
		if (data.ageing === true) {
			data.ageing = '1';
		}
		else {
			data.ageing = '0';
		}
	}

	onSaveData(data: any) {

		let postBody = {
			"parameter": {
				"ageing": (data.ageing === null ? '0' : data.ageing),
				"pct": data.pct,
				"based_on": data.based_on,
				"bucket_id": data.id
			}
		}
		var id = this.basicParameterId;
		const url = 'parameters/' + id + '/update_cross_aging_buckets';
		this.clientTemplatesService.saveCrossAgingData(url, postBody).subscribe(response => {
			const message = 'Cross Age has been successfully updated';
			this.helper.showApiMessages(message, 'success');
		}, error => {
			this.message.showLoader(false);
		});
	}

	onResetData(params: any) {
		const previousValue = this.previousData;
		let i = params.rowIndex

		let newData = {
			bucket_name: previousValue[i].bucket_name,
			ageing: previousValue[i].ageing,
			pct : previousValue[i].pct,
			based_on: previousValue[i].based_on,
			bucket_id: previousValue[i].bucket_id,
			edited: false
		  };
		  let rowNode = this.crossbucketGridOptions.api.getRowNode(i);

		  rowNode.setData(newData);
		  this.crossbucketGridOptions.api.redrawRows()
	}

	onCellValueChanged(params){
		if(params.data.pct != this.previousData[params.rowIndex].pct){
			params.data.edited = true;
		}
		else{
			params.data.edited = false;
		}
	}
	
	CloseClick() {
		this.dialogRef.close();
	  }
}
