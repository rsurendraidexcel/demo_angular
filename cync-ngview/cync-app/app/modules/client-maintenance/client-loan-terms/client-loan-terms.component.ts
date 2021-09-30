import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Router } from "@angular/router";
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-client-loan-terms',
  templateUrl: './client-loan-terms.component.html'
})
export class ClientLoanComponent implements OnInit {


  constructor(private _router: Router, private _service: CustomHttpService) {
    if (this._router.url == '/client-maintenance/client-loan-terms') {
      this._router.navigateByUrl(this._router.url + "/guarantors");
    }
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
  }


}
