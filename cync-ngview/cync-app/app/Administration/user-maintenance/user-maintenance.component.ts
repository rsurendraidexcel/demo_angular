import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../../app-common/services/http.service';
import { MessageServices } from '../../../app-common/component/message/message.component';

/*Commenting the particle JS code since its not using currently*/
// declare var particlesJS: any;

@Component({
	selector: 'user-maintenance-comp',
	templateUrl: './user-maintenance.component.html'
})

export class UserMaintenanceComponent implements OnInit {

	constructor(private _router: Router, private _service: CustomHttpService, private _message: MessageServices) {
		if (this._router.url == '/userMaintenance') {
			this._router.navigateByUrl(this._router.url + '/create-user');
		}
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		/*Commenting the particle JS code since its not using currently*/
		//particlesJS.load('particles-js', '../assets/particles.json', null);
		this._service.setHeight();
	}

	closeMessageBox() {
		this._message.cync_notify(null, null, 0);
	}
}
