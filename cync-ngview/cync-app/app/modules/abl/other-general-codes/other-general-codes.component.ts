import { Component, OnInit } from '@angular/core'
import { Router } from "@angular/router";
/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;
@Component({
	selector: 'otherGeneralCode-comp',
	templateUrl: './other-general-codes.component.html'
}) export class OtherGeneralCodesComponent {

	constructor(private _router: Router) {
		if (this._router.url == '/abl/otherGeneralCodes') {
			this._router.navigateByUrl(this._router.url + "/ineligibility-reasons");
		}
	}
	ngOnInit() {

		/*Commenting the particle JS code since its not using currently*/
		//particlesJS.load('particles-js', '../assets/particles.json', null);
		var appbody_cont = window.innerHeight;
		$(window).resize(function () {
			appbody_cont = window.innerHeight;
			if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
			if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
		})
		if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
		if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
	}
}