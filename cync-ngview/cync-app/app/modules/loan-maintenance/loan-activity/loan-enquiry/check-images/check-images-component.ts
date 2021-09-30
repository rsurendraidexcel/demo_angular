import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanEnquiryService } from '../loan-enquiry.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
declare var $: any;

@Component({
	selector: 'app-check-images',
	templateUrl: './check-images-component.html',
	styleUrls: ['./check-images-component.scss']
})
export class CheckImageComponent implements OnInit {

	check_images: any;
	public params: any;
	data: any;

	constructor(
		private router: Router,
		private _loanEnquiryService: LoanEnquiryService,
		private _apiMapper: APIMapper,

	) { }

	ngOnInit() {
		if (this.params.data.check_image != null && this.params.data.check_image != undefined && this.params.data.check_image != '') {
			this.data = this.params.data.check_image ? this.params.data.check_image.toString().split(',') : [];
		} else {
			this.data = [];
		}
	}

	agInit(params) {
		this.params = params;
	}

	public onClick(event: any) {
		let id = event.substring(0, event.indexOf(":"));
		const url = this._apiMapper.endpoints[CyncConstants.GET_CHECK_IMAGES_URL].replace('{id}', id);
		this._loanEnquiryService.getCheckImageUrl(url).subscribe(res => {
			let apiResUrl = res.url
			window.open(apiResUrl, "_blank");
		});
	}
}
