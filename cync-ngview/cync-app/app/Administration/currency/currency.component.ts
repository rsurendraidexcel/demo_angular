import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageServices } from '../../../app-common/component/message/message.component';

/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;


@Component({
	selector: 'currency-comp',
	templateUrl: './currency.component.html'
}) export class currencyComponent {

	constructor(private _router: Router, private _message: MessageServices) {
		if (this._router.url == '/currency') {
			this._router.navigateByUrl(this._router.url + '/currency-definition');
		}
	}

	ngOnInit() {

		/*Commenting the particle JS code since its not using currently*/
		//		particlesJS.load('particles-js', '../assets/particles.json', null);
		var appbody_cont = window.innerHeight;
		$(window).resize(function () {
			appbody_cont = window.innerHeight;
			if (document.getElementById('app-body-container')) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
			if (document.getElementById('main_contents')) { document.getElementById('main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
		});
		if (document.getElementById('app-body-container')) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
		if (document.getElementById('main_contents')) { document.getElementById('main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
	}

	closeMessageBox() {
		this._message.cync_notify(null, null, 0);
	}

}
