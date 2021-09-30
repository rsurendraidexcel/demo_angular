import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FromToDateSearchModel } from './from-to-date-search.model';

@Component({
	selector: 'app-from-to-date-search',
	templateUrl: './from-to-date-search.component.html',
	styleUrls: ['./from-to-date-search.component.scss']
})

export class FromToDateSearchComponent implements OnInit {

	@Input() fromToDateSearchModel: FromToDateSearchModel;
	@Output() searchButtonClicked = new EventEmitter<any>();
	current_date: Date;
	from_date: Date;
	to_date: Date;

	constructor(
		private _helper: Helper,
		private _message: MessageServices
	) {
		this.current_date = new Date(this._helper.convertDateToString(new Date()));
	}

	ngOnInit() {
		this.mainFunction();
	}

	/**
	 * Main function
	 */

	 mainFunction(){
		 setTimeout(()=>{
		
			let currentDate = this.current_date;
			//this.from_date = new Date(currentDate.setDate(currentDate.getDate() - 365));
			if(this.fromToDateSearchModel && this.fromToDateSearchModel.type == "loan-inquiry"){
			  this.from_date = this.fromToDateSearchModel.from_date;
				this.to_date = this.fromToDateSearchModel.to_date
			}else{
			this.from_date = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
			this.to_date = new Date(this._helper.convertDateToString(new Date()));
		
			}
		 },2000)

	 }

	/**
	* Search Button Click event
	*/
	searchButtonClick() {
		if (this.from_date != undefined && this.from_date != null && this.to_date != undefined && this.to_date != null) {
			if (this.to_date >= this.from_date) {
				this.searchButtonClicked.emit({
					'type': this.fromToDateSearchModel.type,
					'from_date': this.from_date,
					'to_date': this.to_date
				});
			} else {
				this._helper.showApiMessages(CyncConstants.SELECT_DATE_VALIDATION_ERROR_MESSAGE, 'danger');
			}
		} else {
			this._helper.showApiMessages(CyncConstants.SELECT_DATE_SEARCH_ERROR_MESSAGE, 'danger');
		}
	}

	/**
	* Select from date event
	* @param event 
	*/
	fromDateSelectMethod(event: any) {

	}

	/**
	* Select to date event
	* @param event 
	*/
	toDateSelectMethod(event: any) {

	}
}
