import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Router } from "@angular/router";

@Component({
	selector: 'app-bucket-ageing',
	templateUrl: './bucket-ageing.component.html',
	styleUrls: ['./bucket-ageing.component.scss']
})
export class BucketAgeingComponent implements OnInit {

	constructor(private _router: Router, private _service: CustomHttpService) {
		if (this._router.url == '/bbc-preference-setup/bucket-ageing') {
			this._router.navigateByUrl(this._router.url + "/ar-bucket-ageing");
		}
	}

	ngOnInit() {

	}

}
