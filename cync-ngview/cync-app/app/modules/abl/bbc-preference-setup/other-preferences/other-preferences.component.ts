import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import  {Router} from "@angular/router";

@Component({
  selector: 'app-other-preferences',
  templateUrl: './other-preferences.component.html',
  styleUrls: ['./other-preferences.component.css']
})
export class OtherPreferencesComponent implements OnInit {

	subMenu: string = 'activity-tickler';

  	constructor(private _router: Router, private _service: CustomHttpService) {
  		if(this._router.url == '/bbc-preference-setup/other-preferences'){
			this._router.navigateByUrl(this._router.url+"/activity-tickler");
		}
  	}

  	ngOnInit() {
  		$("#cync_app_dashboard").removeClass("loading-modal-initial");
  		this._service.setHeight();
  	}

}
