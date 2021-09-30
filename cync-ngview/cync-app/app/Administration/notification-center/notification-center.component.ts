import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../../app-common/services/http.service';
import {MessageServices} from '../../../app-common/component/message/message.component';

/*Commenting the particle JS code since its not using currently*/
// declare var particlesJS: any;
@Component({
    selector: 'notificationCenter-comp',
    templateUrl: './notification-center.component.html'
}) export class NotificationCenterComponent {

constructor(private _router: Router, private _service: CustomHttpService, private _message: MessageServices){
	if (this._router.url == '/notificationCenter'){
		this._router.navigateByUrl(this._router.url + '/global-setting');
	}
}

ngOnInit(){
	/*Commenting the particle JS code since its not using currently*/
//	particlesJS.load('particles-js', '../assets/particles.json', null);
	this._service.setHeight();
  }

 closeMessageBox(){
	this._message.cync_notify(null, null, 0);
  }
}
