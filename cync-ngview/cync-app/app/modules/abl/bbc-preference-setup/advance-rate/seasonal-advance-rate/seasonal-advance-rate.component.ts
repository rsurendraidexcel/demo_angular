import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { navbarComponent } from '@app/navbar/navbar.component';

@Component({
  selector: 'app-seasonal-advance-rate',
  templateUrl: './seasonal-advance-rate.component.html',
  styleUrls: ['./seasonal-advance-rate.component.css']
})
export class SeasonalAdvanceRateComponent implements OnInit {

  constructor(
    private _service: CustomHttpService, 
    private _navbar:navbarComponent) { }
  
    ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
  }
}

