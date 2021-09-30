import { Component, OnInit } from '@angular/core'
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '@app/app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { Router } from "@angular/router";
import { InterestRateCodes, interestDetailsModel } from './interest-rate-codes.model';

@Component({
	selector: 'interest-rate-code-view-comp',
	templateUrl: './interest-rate-codes-view.component.html'
})

export class InterestRateCodesViewComponent {

	lenderId: string;
	constructor(private _router: Router,
		private _grid: GridComponent,
		private _message: MessageServices,
		private route: ActivatedRoute,
		private _service: CustomHttpService,
		private _location: Location,
		private config: AppConfig) {
		this.lenderId = this.config.getConfig('lenderId');
	}

	viewDetails: InterestRateCodes = new InterestRateCodes();
	interestDetails: interestDetailsModel = new interestDetailsModel();
	interestRateDefId: any;
	apiURL: any;

	ngOnInit() {
		this.apiURL = "loan_charge_codes/interest_rate_codes/";
		this.route.params.subscribe(params => {
			this.interestRateDefId = params['id'];
			if (this.interestRateDefId !== undefined) {
				this._service.getCall(this.apiURL + this.interestRateDefId).then(i => {
					this.viewDetails = this._service.bindData(i)
				});
				this._service.getCall(this.apiURL + this.interestRateDefId + "/interest_rates").then(i => {
					this.interestDetails = this._service.bindData(i);
					for (let count = 0; count < this.interestDetails.interest_rates.length; count++) {
						this.interestDetails.interest_rates[count].rate_date = this._grid.formatDate(this.interestDetails.interest_rates[count].rate_date);
					}
				});
			}
		});
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this._service.setHeight();
	}

	navigateToHome() {
		this._router.navigateByUrl('/otherGeneralCodes/interest-rate-codes');
	}

	delete() {
		this._grid.deleteFromView(this.interestRateDefId, this.apiURL);
	}

	edit() {
		this._grid.goToEditFromView(this.interestRateDefId);
	}

}
