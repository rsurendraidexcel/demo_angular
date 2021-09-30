import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-maintenance',
  templateUrl: './client-maintenance.component.html'
})

/**
 * 
 */
export class ClientMaintenanceComponent implements OnInit {
  
  /**
   * 
   * @param _router 
   */
  constructor(private _router: Router) { }

  /**
   * 
   */
  ngOnInit() {
    if (this._router.url == '/client-maintenance') {
      this._router.navigateByUrl(this._router.url + "/clients");
    }
  }

}
