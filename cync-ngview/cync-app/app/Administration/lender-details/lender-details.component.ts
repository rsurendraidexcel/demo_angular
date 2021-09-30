import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../../app-common/services/http.service';
import { MessageServices } from '../../../app-common/component/message/message.component';

/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;

@Component({
	selector: 'app-lender-details',
	templateUrl: './lender-details.component.html'
})
export class LenderDetailsComponent {

	constructor(private _router: Router, private _services: CustomHttpService, private _message: MessageServices) {
		if (this._router.url == '/lenderDetails') {
			this._router.navigateByUrl(this._router.url + '/basic-details');
		}
	}
	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");

		/*Commenting the particle JS code since its not using currently*/
		//        particlesJS.load('particles-js', '../assets/particles.json', null);
		this._services.setHeight();

	}

	closeMessageBox() {
		this._message.cync_notify(null, null, 0);
	}

}
