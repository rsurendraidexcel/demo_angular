import { Component, OnInit } from '@angular/core';
import  {Router} from '@angular/router';
import  {CustomHttpService} from '../../../app-common/services/http.service';
import {MessageServices} from '../../../app-common/component/message/message.component';

/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;
@Component({
    selector: 'generalCode-comp',
    templateUrl: './general-codes.component.html'
}) export class generalCodesComponent {
	currentRoute: string;

	constructor(private _router: Router, private _service: CustomHttpService,  private _message: MessageServices){
		if (this._router.url == '/generalCodes'){
			this._router.navigateByUrl(this._router.url + '/sales-regions');
		}

	}

	ngOnInit(){

		/*Commenting the particle JS code since its not using currently*/
        //particlesJS.load('particles-js', '../assets/particles.json', null);
		this._service.setHeight();
		this.currentRoute = this._router.url;
	}

	updateRouter(routerURL){
		this.currentRoute = routerURL;
		//alert(this.currentRoute);
	}

  	closeMessageBox(){
	this._message.cync_notify(null, null, 0);
    }

}
