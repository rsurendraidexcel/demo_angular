import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../app/app.config';
declare var $: any;

@Component({
  selector: 'cync-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  access: string;
  private parsedToken: any;
  private isAuthenticated: boolean;
  cyncCookie: any;
  constructor(private config: AppConfig, private cookieService: CookieService) {
    this.cyncCookie = this.cookieService.get('cync_authorization');
    // console.log('app--'+this.cyncCookie);
    if (this.cyncCookie == '' || this.cyncCookie == null) {
      //window.location.href = '../../';  
      this.cyncCookie = 'samplecookie';
    }
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
  
  }

  /**
  * Change the height of elements dynamically each time after the components view has been modified.
  */
  ngDoCheck() {
    AppComponent.ResponsiveHeight();
  }

  /**
    * change the height of elements dynamically
    */
  public static ResponsiveHeight() {
    this.adjustHeight("cync_main_contents", 355);
    this.adjustHeight("cync_app-body-container", 200);
    this.adjustHeight("cync_app-body-container-radio", 200);
    this.adjustHeight("component_html_wradio", 310);
    this.adjustHeight("cync_main_contents_wradio", 487);
    this.adjustHeight("cync_main_contents_wradio-list", 427);
    this.adjustHeight("cync_main_contents_wradio-mapping", 435);
    this.adjustHeight("cync_main_contents_wradio-def-list", 425);

    this.adjustHeight("component_html_financial_wradio", 220);
    this.adjustHeight("cync_main_financial_contents", 370);
    //this.adjustHeight("cync_main_financial_stament_contents", 405);

    this.adjustHeight("dialog1", 355);
    this.adjustHeight("dialog2", 355);
    this.adjustHeight("dialog3", 355);

    /**
     * Container for inner Containers
     */
    this.adjustHeight("innerContainer", 460);

  }

  /**
   * validate element exists or not then change the height
   * @param el Element ID
   * @param newHeight New height
   * The new height is (total available height minus header and breadcrumb portion)
   */
  public static adjustHeight(el: string, newHeight: number) {
    let appbody_cont = window.innerHeight;
    if (document.getElementById(el)) { document.getElementById(el).style.height = (appbody_cont - newHeight) + 'px'; }
  }
}