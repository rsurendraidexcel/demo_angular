import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { AppConfig } from '../../../app.config';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
/*Model call */
import { interestCalendarModel } from './interest-calendar.Model';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service'
import { CyncConstants } from 'app-common/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';


declare var jQuery: any;

@Component({
  selector: 'app-interest-calendar',
  templateUrl: './interest-calendar.component.html',
})
export class InterestCalendarComponent implements OnInit, AfterViewInit {
  userSelection: Date[] = [];
  title: string = "Interest Calendar";
  APIResponseStore: any[];
  currentYear: number = new Date().getFullYear();
  currentDate: Date = new Date();
  isSaveAllowed: boolean = false;
  isRepairAllowed: boolean = false;
  isExtendAllowed: boolean = false;
  interestCalPermArr: any[] = [];
  calendarExtendedTill: number;
  interestType: any = "ABL";
  isFactoringSaveAllowed :boolean = false;

  constructor(private rolesPermComp: CheckPermissionsService, private gridComp: GridComponent, private _router: Router, private _service: CustomHttpService, private config: AppConfig, private msgservices: MessageServices, private _cyncHttpService: CyncHttpService,private helper:Helper) {
    /*Based on the User Role Permissions Enable or Disable the Extend Calendar functionality, repair calendar functionality & bussiness day functionality*/
  }


  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    this.interestCalPermArr = JSON.parse(localStorage.getItem("interestCalendarPermissionsArray"));
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      setTimeout(() => {
        if (this.rolesPermComp.checkPermissions(this.interestCalPermArr, "create") == true) {
          this.isExtendAllowed = true;
        }
        if (this.rolesPermComp.checkPermissions(this.interestCalPermArr, "update") == true) {
          this.isRepairAllowed = true;
          this.isSaveAllowed = true;
          if(this.interestType === "Factoring"){
            this.isFactoringSaveAllowed = true;
          }
        
        }
      }, 600);
    } else if (userRole == CyncConstants.ADMIN_ROLE_TYPE) {
      this.isExtendAllowed = true;
      this.isRepairAllowed = true;
      this.isSaveAllowed = true;
      if(this.interestType === "Factoring"){
        this.isFactoringSaveAllowed = true;
      }
    }
    this._service.setHeight();

  }

  ngAfterViewInit() {
    this.loadInterestCalender(this.currentYear);
  }

  /**
     * loading the interest calender based on year
     */
  loadInterestCalender(year: number): void {
    this.msgservices.showLoader(true);
    this.getChargeCalender(year).then(response => {
      this.APIResponseStore = response.charge_calendars; //storing ApiResponse to component level variable
      var today = new Date(new Date().getFullYear(),
        new Date().getMonth(), new Date().getDate());
      this.renderCalender(today, response);
      this.calendarExtendedTill = response.last_year;
      this.registerDayClickEvent();
      this.msgservices.showLoader(false);
    })
  }

  /**
   * this method will reload the calender on page. 
   * Page does not refresh. only calender content refreshes
   */
  reloadInterestCalender(year: number): void {
    let copySelection = this.userSelection;
    copySelection.length = 0; // reassigning to fresh
    this.msgservices.showLoader(true);
    this.getChargeCalender(year).then(response => {
      this.APIResponseStore = response.charge_calendars; // storing ApiResponse to component level variable
      this.calendarExtendedTill = response.last_year;
      var today = new Date(new Date().getFullYear(),
        new Date().getMonth(), new Date().getDate());
      this.refreshCalenderDataSource(today, response);
      this.msgservices.showLoader(false);
    })
  }

  /**
   * This method will render the calender on UI
   * @param today 
   * @param APIResponse 
   */
  renderCalender(today: Date, APIResponse: any[]): void {
    let _this = this;
    jQuery('#calendar').calendar({
      customDayRenderer: function (element, date) {
        if (date.getTime() === today.getTime()) {
          jQuery(element).css({
            'color': '#3D8BFE',
            'font-weight': 'bold',
            'border': '1px solid #3D8BFE',
            'backgroundColor': '#fafafa'
          })
        }
      },
      dataSource: _this.createCalenderDataSource(APIResponse),
      startYear: _this.currentYear,
      yearChanged: function (e) {
        if (jQuery(e.target).data('calendar') != undefined) {
          let _this = this;
          _this.currentYear = jQuery(e.target).data('calendar').getYear();
          _this.msgservices.showLoader(true);
          _this.getChargeCalender(_this.currentYear).then(result => {
            let dataSource = _this.createCalenderDataSource(result);
            _this.APIResponseStore = result.charge_calendars;//storing new ApiResponse to component level variable bcz year is changed now            
            jQuery(e.target).data('calendar').setDataSource(dataSource);
            _this.msgservices.showLoader(false);
          })
        }
      }.bind(this)
    }
    );
  }

  /**
   * This method will refresh the calender datasource on UI
   * @param today 
   * @param APIResponse 
   */
  refreshCalenderDataSource(today: Date, APIResponse: any[]): void {
    let _this = this;
    jQuery('#calendar').data('calendar').setDataSource(_this.createCalenderDataSource(APIResponse));
  }

  /**
   * This method will register the click event for all the days
   */
  registerDayClickEvent(): void {
    jQuery('.calendar').clickDay(e => {
      if (jQuery(e.element).prop('style').border != "") {
        jQuery(e.element).css('border', '');
        var index = this.userSelection.indexOf(e.date);
        var dummy = this;
        this.userSelection.forEach(function (date, index) {
          if (e.date.getTime() == date.getTime()) {
            console.log("date index " + index);
            dummy.userSelection.splice(index, 1);
          }
        });
      } else {
        jQuery(e.element).css('border', '1px solid #3D8BFE');
        this.userSelection.push(e.date);
      }
    });
  }

  /**
   * This method will save days of calender as business day or non-business day
   */
  saveDetails(): void {
    console.log("user selection : " + this.userSelection);
    let charges_calendars: any[] = [];
    this.userSelection.forEach(element => {
      let dayObject = this.getDayFromResponse(element);
      if (dayObject != null) {
        charges_calendars.push(
          {
            "id": dayObject.id,
            "calendar_date": dayObject.calendar_date,
            "business_day": !this.isBusinessDay(element)
          }
        )
      }
    });
    if (charges_calendars.length > 0) {
      let requestBody = { "charges_calendars": charges_calendars }
      if(this.interestType === "ABL"){
      console.log("request body to patch is : " + JSON.stringify(requestBody));
      this.updateChageCalender(requestBody).then(response => {
        this.msgservices.addSingle('Calendar has updated successfully.', 'success');
        let copyObj = this;
        copyObj.reloadInterestCalender(copyObj.currentYear);
      });
    } else {
      let requestBody = { "charges_calendars": charges_calendars }
      let message
      const popupParam = { 'title': 'Confirmation', message: "By Clicking on 'Yes', Interest will be recalculated for All Clients. Would you like to proceed?", 'msgType': 'warning' };
      this.helper.openConfirmPopup(popupParam).subscribe(result => {
        let copyObj = this;
        if (result){
        this.updateFaxctoringInterestCalendar(requestBody).subscribe(res =>{
          message = res.json().success.messages[0];
          this.msgservices.addSingle( message, 'success');
          copyObj.loadInterestCalenderFactoring();
          charges_calendars = [];
          copyObj.userSelection =[];
        },error => {
          this.msgservices.addSingle( message, 'error');
      })
        }
      });
    }
    }
  }

  /**
   * 
   * @param input 
   */
  isBusinessDay(input: Date): boolean {
    let _APIResponseStore = this.APIResponseStore;
    for (let i = 0; i < _APIResponseStore.length; i++) {
      let formatDate = new Date(_APIResponseStore[i].calendar_date.split("-")[0],
        (Number(_APIResponseStore[i].calendar_date.split("-")[1]) - 1),
        _APIResponseStore[i].calendar_date.split("-")[2]);
      if (input.getTime() === formatDate.getTime()) {
        return _APIResponseStore[i].business_day;
      }
    }
    return false;
  }

  /**
   * This method take date ad input and search into APIResponseStore
   * to get the Id of that date , which is need in
   * API call to upload any perticular date
   * @param input 
   */
  getDayFromResponse(input: Date): any {
    let _APIResponseStore = this.APIResponseStore;
    for (let i = 0; i < _APIResponseStore.length; i++) {
      let formatDate = new Date(_APIResponseStore[i].calendar_date.split("-")[0],
        (Number(_APIResponseStore[i].calendar_date.split("-")[1]) - 1),
        _APIResponseStore[i].calendar_date.split("-")[2]);
      if (input.getTime() === formatDate.getTime()) {
        return _APIResponseStore[i];
      }
    }
  }

  /**
   * 
   * @param currentYear 
   */
  getNextYear(currentYear: Date): number {
    currentYear.setFullYear((currentYear.getFullYear() + 1))
    return currentYear.getFullYear();
  }


  /**
   * This method will create datasource for calender using API response
   * @param APIResponse
   * @returns any[] <p>array of datasource which is for calender events</p>
   */
  createCalenderDataSource(APIResponse: any): any[] {
    var dataSource = [];
    let charge_calendars = APIResponse.charge_calendars;
    for (var i = 0; i < charge_calendars.length; i++) {
      if (!charge_calendars[i].business_day) {
        let startDate = new Date(charge_calendars[i].calendar_date);
        startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
        let endDate = new Date(charge_calendars[i].calendar_date);
        endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
        dataSource.push({
          id: i,
          reason: 'reason for holiday',
          startDate: startDate,
          endDate: endDate,
          color: '#808080'
        });
      }
    }
    return dataSource;
  }

  /**
   * This method will get entire year dates through requested year
   * @param year 
   */
  getChargeCalender(year: number): Promise<any> {
    let startMonth: string = year + "/01/01";
    let endMonth: string = year + "/12/31";
    let endpoint = 'loan_charge_codes/charges_calendars?from_date=' + startMonth + '&to_date=' + endMonth;
    return this._service.getCall(endpoint);
  }

  /**
   * This method will call API to update any day as business day or non business day
   * @param requestBody
   */
  updateChageCalender(requestBody: any): Promise<any> {
    let endpoint = 'loan_charge_codes/charges_calendars/update_all';
    let userRole = localStorage.getItem('cyncUserRole'); /*Logged In User*/
    let hasPermission: boolean = this.rolesPermComp.checkPermissions(this.interestCalPermArr, "update");
    if (userRole === CyncConstants.ADMIN_ROLE_TYPE) {
      hasPermission = true;
    }
    let requestModel = { url: endpoint, model: requestBody }
    if (hasPermission) {
      return this._service.patchCallRor(requestModel);
    }
  }

  /**
   * this method call API to reapair calender
   */
  repairCalender(): void {
    let endpoint = 'loan_charge_codes/repair_calendar';
    this.gridComp.cyncAlertConfirm('warning', 'Repair Calendar will make default business days. <br/> Would you like to Repair Calendar?', true, false);
    document.getElementById('modal_action_yes').addEventListener('click', () => {
      setTimeout(function () {
        (<any>$('#cync_alerts')).modal('hide');
      }, 200);
      let requestModel = { url: endpoint, model: null }
      this.msgservices.showLoader(true);
      this._service.postCallpatch(requestModel).then(res => {
        this.msgservices.addSingle('Calendar has Repaired successfully.', 'success');
        this.reloadInterestCalender(this.currentYear);
      });
    });

    document.getElementById('modal_action_no').addEventListener('click', () => {
      (<any>$('#cync_alerts')).modal('hide');
    });
  }

  /**
   * this method call API to extend calender
   */
  extendCalender(): void {
    let endpoint = 'loan_charge_codes/extend_calendar';
    const extend_date = {
      "to_date": this.getNextYear(this.currentDate)
    };
    let requestModel = { url: endpoint, model: extend_date }
    this.msgservices.showLoader(true);
    this._service.postCallpatch(requestModel).then(res => {
      this.msgservices.addSingle('Calendar has extended successfully.', 'success');
      this.reloadInterestCalender(this.currentYear);
    });
  }

  onChange(event) {
    console.log(event.target.value);
    if (event.target.value === "Factoring") {
      $('#calendar').data('calendar').setDataSource([]);
      this.loadInterestCalenderFactoring();
      this.disableDaysForFactoring();
      this.interestType = event.target.value;
      this.isRepairAllowed = false;
      this.isExtendAllowed = false;
      this.isSaveAllowed = false;
      this.isFactoringSaveAllowed = true;
    } else {

      this.loadInterestCalender(this.currentYear);
      this.interestType = event.target.value;
      this.isRepairAllowed = true;
      this.isExtendAllowed = true;
      this.isSaveAllowed = true;
      this.isFactoringSaveAllowed = false;
    }
  }

  disableDaysForFactoring() {
    let currentYear = new Date().getFullYear();
    let currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth();
    jQuery('#calendar').data('calendar').setMinDate(new Date(currentYear, currentMonth - 1, 16));
     
    jQuery('#calendar').data('calendar').setMaxDate(new Date(currentYear, 11, 31));
  }



  getFactoringInterestCalendar() {
    let currentYear = new Date().getFullYear();
    let startMonth: string = currentYear + "/01/01";
    let endMonth: string = currentYear + "/12/31";
    let endpoint = 'loan_charge_codes/charges_calendars?from_date=' + startMonth + '&to_date=' + endMonth;
    return this._cyncHttpService.getService(CyncConstants.FACTORING_HOST, endpoint);
  }

  loadInterestCalenderFactoring() {
    this.msgservices.showLoader(true);
    let _shadoObject = this;
    this.getFactoringInterestCalendar().subscribe(response  => {
      let tempData = response.json();
      this.APIResponseStore = tempData.charge_calendars
      let dataSource = [];
      let charge_calendars = tempData.charge_calendars;
      for (var i = 0; i < charge_calendars.length; i++) {
        if (!charge_calendars[i].business_day) {
          let startDate = new Date(charge_calendars[i].calendar_date);
          startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
          let endDate = new Date(charge_calendars[i].calendar_date);
          endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

          dataSource.push({ id: i, name: 'Factoring for Holiday',startDate: startDate,endDate: endDate});
        }
      }
      setTimeout((_shadoObject) => {
       // console.log("<==Aftere Factoring Business days filter==>", dataSource);
        $('#calendar').data('calendar').setDataSource(dataSource);
        _shadoObject.registerDayClickEvent();
        _shadoObject.msgservices.showLoader(false);
      }, 500);
    })
  }
  

  updateFaxctoringInterestCalendar(requestBody:any){
    let endpoint = 'loan_charge_codes/charges_calendars/update_all';
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    let hasPermission: boolean = this.rolesPermComp.checkPermissions(this.interestCalPermArr, "update");
    if (userRole === CyncConstants.ADMIN_ROLE_TYPE) {
      hasPermission = true;
    }
    // let requestModel = { url: endpoint, model: requestBody }
    if (hasPermission) {
      return this._cyncHttpService.patchService(CyncConstants.FACTORING_HOST, endpoint, requestBody);
      }
    }

}
