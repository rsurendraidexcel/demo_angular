import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { LoanSummaryService } from '../loan-summary.service';

@Component({
	selector: 'app-loan-document',
	templateUrl: './loan-document.component.html',
	styleUrls: ['./loan-document.component.scss']
})
export class LoanDocumentComponent implements OnInit {

	check_images: any;
	public params: any;
	data: any;

	constructor(
		private _loanSummaryService: LoanSummaryService,
		private _apiMapper: APIMapper,

	) { }

	ngOnInit() {
		if (this.params.data.Loan_Documents != null && this.params.data.Loan_Documents != undefined && this.params.data.Loan_Documents != '') {
			this.data = this.params.data.Loan_Documents ? this.params.data.Loan_Documents.toString().split(',') : [];
		} else {
			this.data = [];
		}
	}

	agInit(params) {
		this.params = params;
	}

	public onClick(event: any) {
		let id = event.substring(0, event.indexOf("$"));
		let loanType  = this.params.data.Loan_Type ? this.params.data.Loan_Type : '';
		const url = this._apiMapper.endpoints[CyncConstants.GET_LOAN_SUMMARY_DOCUMENT_URL].replace('{id}', id).replace('{loan_type}', loanType);
		this._loanSummaryService.getLoanDocumentImageUrl(url).subscribe(res => {
			let apiResUrl = res.url
			window.open(apiResUrl, "_blank");
		});
	}
}
