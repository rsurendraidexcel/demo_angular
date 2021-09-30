import { Injectable } from '@angular/core';


@Injectable()
export class CustomErrorService {

  iconRequired: boolean = false;
  title: string = '';
  message: string = '';
  reloadRequired: boolean = false;
  errorPopupActivated: boolean = false;
  failedRequests: number = 0;


  constructor() { }

  /**
   * This method will set the Popup Message parameters for Network Errors other than notifications
   * @param _title 
   * @param _message 
   * @param _iconRequired 
   * @param _reloadRequired 
   */
  setOopsMessage(_title, _message, _iconRequired = false, _reloadRequired = false) {

    this.title = _title;
    this.message = _message;
    this.iconRequired = _iconRequired;
    this.reloadRequired = _reloadRequired;

    /**
     * @see CYNCPS-1850 https://idexcel.atlassian.net/browse/CYNCPS-1850
     * Now it will not open the popup message if one request got failes, 
     * as it looks like the modern browsers having inbuilt mechanism to retry failed requests automatically 
     */
    if (this.failedRequests > 2) {
      this.errorPopupActivated = true;
    }

    /**
     * @see CYNCPS-1850 https://idexcel.atlassian.net/browse/CYNCPS-1850
     * Now it will not open the popup message if one request got failes, 
     * as it looks like the modern browsers having inbuilt mechanism to retry failed requests automatically 
     */
    if (this.failedRequests > 2) {
      this.errorPopupActivated = true;
    }


  }


  /**
   * This method will reset the Faile requests Count to 0
   */
  resetFailedRequests() {
    this.failedRequests = 0;
  }

}
