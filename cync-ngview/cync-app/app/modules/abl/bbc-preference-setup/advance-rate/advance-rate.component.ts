import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advance-rate',
  templateUrl: './advance-rate.component.html',
  styleUrls: ['./advance-rate.component.scss']
})
export class AdvanceRateComponent implements OnInit {

  constructor(private _router: Router, private _service: CustomHttpService) { 
  
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
    if(this._router.url == '/bbc-preference-setup/advance-rate'){
			this._router.navigateByUrl(this._router.url+'/collateral-advance-rate');
		}
  }

}
