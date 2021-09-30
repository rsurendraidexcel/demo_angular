import { Component, OnInit, Input, ElementRef, ViewChild, HostListener, NgZone } from '@angular/core';
import { CarService } from './grid.service';
import { Http, Response, Headers, RequestOptions, ConnectionBackend } from '@angular/http';
import { GridModel } from './grid.model';
import { CustomHttpService } from '../../services/http.service';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Router } from "@angular/router";
import { currencyDefinitionModel, Currencies } from '@app/Administration/currency/currency-definition/currency.definition.Model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { DeleteModal } from '@cyncCommon/component/message/delete.modal.component';
import { AppConfig } from '@app/app.config';
import { Location } from '@angular/common';
import { exchangeRatesComponent } from '@app/Administration/currency/exchange-rates/exchange.rates.component';
import { LazyLoadEvent } from 'primeng/primeng';
import { URLSearchParams } from '@angular/http';
import { HtmlFilterPipe } from '../../Pipes/html-filter.pipe';
import { CalendarEvent } from 'angular-calendar';
import { subDays, addDays } from 'date-fns';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { navbarComponent } from '@app/navbar/navbar.component';

declare var $: any;

@Component({
  selector: 'grid',
  templateUrl: './grid.html'
})

export class GridComponent implements OnInit {

  @Input()
  gridModel: GridModel;
  @ViewChild(DataTable) dataTableComponent: DataTable;
  locationBack: any;
  gridData: any = [];
  ShowmoreData: any = [];
  datasource: any = [];
  lazyGridData: any = [];
  lazyDataSize: number = 30;
  searchData: any = [];
  searchHolidayYear: any = [];
  newsearchData: any = [];
  gridDataSelectBox: any = [];
  searchDataWeekend: any = [];
  data: any;
  isDisableEdit: boolean = false;
  isDisableDelete: boolean = false;
  selectedRows: any = [];
  lenderId: any;
  editUrl: any;
  token: any;
  authToken: any;
  deleteReqModel: any;
  isEdited = false;
  editField: string;
  requestModel: any;
  amountValue: any;
  deleteCount = 0;
  fromDate: any;
  toDate: any;
  exchangeRateDate: any;
  currenctCuttoffTime: any;
  fieldName: string;
  currencyDetailsAll: any;
  currencyDetailsApproved: Array<string> = [];
  currencyWeekendDetailsApproved: Array<string> = [];
  recordTotal: number;
  searchCurrency: any;
  searchYear: any;
  display = false;
  holidayWeekend0: any;
  holidayWeekend1: any;
  holidayWeekend2: any;
  holidayWeekend3: any;
  holidayWeekend4: any;
  holidayWeekend5: any;
  holidayWeekend6: any;
  holidayWeekend: ['Saturday', 'Sunday'];
  weekendHolidayArray: any[] = [];
  isEnteredYear: boolean = true;
  isEnteredMonth: boolean = true;
  isSelectedCurrency: boolean = true;
  isSearch: boolean = false;
  searchClient: string = null;
  searchAction: string = null;
  searchProgram: string = null;
  searchUser: string = null;
  searchFrmDate: Date;
  searchToDate: Date;
  taskName: string;
  automatedStatus: string;
  searchFrmDate_1: Date;
  searchToDate_1: Date;
  taskNameArray: Array<string> = [];
  logTypes: any = [];
  currencyPairArray: any = [];
  totalRecords: number;
  loading = false;
  rateHistory: any;
  gridDataLen: number;
  userList: any;
  searchValue: string = '';
  completeTaskRowArray: string = '';
  isSearchBox: boolean = true;
  isCloseBox: boolean = false;
  isAdvanceSearchEnabled = false;
  columnOptions: any = [];
  cols: any = [];/*private rolesAndPermissions: RolesAndPermissionsComponent,*/

  currencyHolidayResultSet: any = [];
  viewCalenderDisplay: boolean = false;
  /* calendarOptions:Object = {};*/
  viewCalenderCustomizedArray: any = [];
  searchViewCalenderResult: any = [];

  //View Calender
  viewDate: Date = new Date();
  view = 'month';
  events: CalendarEvent[] = [];
  //excludeDays: number[] = [0, 6];//exclude saturday & sunday
  excludeDays: number[] = [];  // exclude weekends

  showCount = 1;
  CurrencyHolidayWeekendModel: any;

  clientList: any;
  exceptionDescList: any;
  reportingDescList: any;
  reportingColumnList: any;
  selectRangeList: any;
  selectFromList: any;
  selectFromCollateral: any;
  selectYearList: any;
  programList: any;

  clientNameList: any;
  classificationList: any;
  showFromDateCalender: boolean = false;
  showToDateCalender: boolean = false;
  enableFromDate: Date;
  enableToDate: Date;
  from_canlendar_date: any;
  to_canlendar_date: any;
  showNotificationMsgPopup: boolean = false;
  notificationMessage: any;
  Searchvalues: any;
  visible: boolean = true;
  rowcount: number = CyncConstants.getDefaultRowCount();
  exportHeaderArray: any;
  exportRowArray: any;
  exportColArray: any[] = [];
  display1: boolean;
  display2: boolean;
  checked: any[] = [];
  exportSelectedCol: any[] = [];
  hourStart: any;
  minutesStart: any;
  hourEnd: any;
  minutesEnd: any;
  load_more: boolean = false;
  loadCount: number = 0;
  loadCountarr: any = [];
  searchClientName: string = null;
  searchReportingParameters: string = null;
  searchClassification: string = null;
  searchFromDueDate: Date;
  searchToDueDate: Date;
  searchReport: any = [];

  deleteIds: string = '';
  clickCount: number = 0;
  clickCountShow: number = 0;
  showTotalrecords: number = 0;
  auditLogSearched: boolean = false;
  automatedLogSearched: boolean = false;
  message: string;
  onClickCount: number = 0;
  idArray: any[] = [];
  activationMail: any;
  resendEmail: any;
  recordCount: number = -1;

  //Changes for CYNCUXT-2811 begin
  userSelectedForStatusChange: any;
  userStatusAction: string;
  statusChangeUserName: string;
  //Changes for CYNCUXT-2811 ends//
  formatted_time: string = "";
  //Code Changes for CYNCUXT-2967 point 10 begin
  isDataLoading: boolean = false;
  isGlobalSearchEnabled: boolean = false;
  //Code Changes for CYNCUXT-2967 point 10 ends

  customKeyArr: any[] = [];
  notificationLogCreatedDate: Date;
  auditLogAdvanceSearchMaxDate: Date;
  todaysDate: Date;
  currentDate: string;
  watchsearchException: string;
  columnSearch: string;
  rangeSearch: string;
  disableSelectRange: boolean = false;
  disableToYear: boolean = false;
  disableYear: boolean = false;
  searchCollateral: string;
  dataTableElement: any = [];
  assetsPath = CyncConstants.getAssetsPath();
  unlockMail: any;
  isActiveContained: boolean = false;
  isDisableSystemParameterEdit: boolean = false;

  skipWeekends(direction: 'back' | 'forward'): void {
    if (this.view === 'day') {
      if (direction === 'back') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
      } else if (direction === 'forward') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
      }
    }
  }

  constructor(
    private navBarComponent: navbarComponent,
    private _helper: Helper,
    private rolesPermComp: CheckPermissionsService,
    private history: exchangeRatesComponent,
    private _delete: DeleteModal, private _location: Location,
    private config: AppConfig, private _service: CustomHttpService,
    private _router: Router, private _message: MessageServices) {
    this.lenderId = this.config.getConfig('lenderId');
    this.auditLogAdvanceSearchMaxDate = new Date();

  }

  getData() {
    if (this.isEdited) {
      this.isEdited = false;
      this._message.addSingle('Record saved successfully.', 'success');
    }
    if (this.gridModel !== undefined) {
      this._message.showLoader(true);
      this._service.getCall<any>(this.gridModel.apiDef.getApi).then(result => {
        if (result.recordTotal == 0) {
          this.recordTotal = result.recordTotal;
        } else {
          this.recordTotal = result.recordTotal;
        }
        if (this.gridModel.type === 'Currency Holiday') {
          this.viewCalenderCustomizedArray = [];
          this.currencyHolidayResultSet = result.currencyHolidays;
          for (var i = 0; i < result.currencyHolidays.length; i++) {
            this.viewCalenderCustomizedArray.push({
              start: new Date(result.currencyHolidays[i].fromDate),
              end: new Date(result.currencyHolidays[i].toDate),
              title: result.currencyHolidays[i].holidayDescription,
              color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF'
              },
              id: result.currencyHolidays[i].currency.id
            });
            if (result.currencyHolidays[i].holidaysStatus == true) {
              result.currencyHolidays[i].holidaysStatus = 'Active';
            } else {
              result.currencyHolidays[i].holidaysStatus = 'Inactive';
            }
            this.fromDate = this.formatDate(result.currencyHolidays[i].fromDate);
            result.currencyHolidays[i].fromDate = this.fromDate;
            this.toDate = this.formatDate(result.currencyHolidays[i].toDate);
            result.currencyHolidays[i].toDate = this.toDate;
          }
        } else if (this.gridModel.type === 'Exchange Rate') {
          for (var i = 0; i < result.exchangeRate.length; i++) {
            this.exchangeRateDate = this.formatDate(result.exchangeRate[i].createdAt);
            result.exchangeRate[i].createdAt = this.exchangeRateDate;
          }
        } else if (this.gridModel.type === 'Automated Task Logs') {
          for (var i = 0; i < result.rake_logs.length; i++) {
            this.taskNameArray.push(result.rake_logs[i].task_name);
          }
        }
        else if (this.gridModel.type === 'Notification Logs') {
          this.logTypes.push({ label: 'Email', value: 'Email' });
          this.logTypes.push({ label: 'Text', value: 'Text' });
        }
        else if (this.gridModel.type === 'Exchange Rate History') {
          for (var i = 0; i < result.exchangeRateHistories.length; i++) {
            result.exchangeRateHistories[i].createdAt = this.formatDate(result.exchangeRateHistories[i].createdAt);
            result.exchangeRateHistories[i].currencyPair.currencyIdBase = result.exchangeRateHistories[i].currencyPair.currencyIdBase.currencyCode + '-' + result.exchangeRateHistories[i].currencyPair.currencyIdTo.currencyCode;
            this.currencyPairArray.push(result.exchangeRateHistories[i].currencyPair.currencyIdBase);
            for (let rateCount = 0; rateCount < result.exchangeRateHistories[i].rateDetails.length; rateCount++) {
              if (result.exchangeRateHistories[i].rateDetails[rateCount].rateType !== undefined) result.exchangeRateHistories[i]['rateTypeNames'] = (result.exchangeRateHistories[i].rateDetails[rateCount].rateType.rateTypeName);
              result.exchangeRateHistories[i]['midRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].midRate);
              result.exchangeRateHistories[i]['buySpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buySpread);
              result.exchangeRateHistories[i]['sellSpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellSpread);
              result.exchangeRateHistories[i]['buyRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buyRate);
              result.exchangeRateHistories[i]['sellRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellRate);
            }
          }
          var unique = this.currencyPairArray.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
          })
          this.currencyPairArray = [];
          for (var j = 0; j < unique.length; j++) {
            this.currencyPairArray.push({ label: unique[j], value: unique[j] });
          }
        } else if (this.gridModel.type === 'Factoring Charge Code') {
          for (var i = 0; i < result.charge_code.length; i++) {
            if (result.charge_code[i].charge_type === 'E') {
              result.charge_code[i].charge_type = 'Absolute';
            }
            if (result.charge_code[i].charge_type === 'F') {
              result.charge_code[i].charge_type = 'Advance';
            }
            if (result.charge_code[i].charge_type === 'I') {
              result.charge_code[i].charge_type = 'Invoice';
            }
            if (result.charge_code[i].charge_type === 'O') {
              result.charge_code[i].charge_type = 'Loan';
            }
            if (result.charge_code[i].frequency === 'MO') {
              result.charge_code[i].frequency = 'Monthly';
            }
            if (result.charge_code[i].frequency === 'MA') {
              result.charge_code[i].frequency = 'Manual';
            }
            if (result.charge_code[i].frequency === 'QA') {
              result.charge_code[i].frequency = 'Quarterly';
            }
            if (result.charge_code[i].frequency === 'OT') {
              result.charge_code[i].frequency = 'One Time';
            }
            if (result.charge_code[i].frequency === 'AN') {
              result.charge_code[i].frequency = 'Annually';
            }
            if (result.charge_code[i].frequency === 'WE') {
              result.charge_code[i].frequency = 'Weekly';
            }
            if (result.charge_code[i].frequency === 'BD') {
              result.charge_code[i].frequency = 'Bus Daily';
            }
            if (result.charge_code[i].frequency === 'DA') {
              result.charge_code[i].frequency = 'Daily';
            }
          }
        } else if (this.gridModel.type === 'Users') {
          for (let i = 0; i < result.users.length; i++) {
            if (result.users[i].user_type === 'E') {
              result.users[i].user_type = 'Emergency';
            }
            if (result.users[i].user_type === 'N' || result.users[i].user_type === 'normal') {
              result.users[i].user_type = 'Normal';
            }
            if (result.users[i].extended_time_after_end !== null && result.users[i].extended_time_before_start !== null) {
              this.hourStart = Math.floor(result.users[i].extended_time_before_start / 60);
              this.minutesStart = result.users[i].extended_time_before_start % 60;
              this.hourStart = this.hourStart < 10 ? '0' + this.hourStart : this.hourStart;
              this.minutesStart = this.minutesStart < 10 ? '0' + this.minutesStart : this.minutesStart;
              this.hourEnd = Math.floor(result.users[i].extended_time_after_end / 60);
              this.minutesEnd = result.users[i].extended_time_after_end % 60;
              this.hourEnd = this.hourEnd < 10 ? '0' + this.hourEnd : this.hourEnd;
              this.minutesEnd = this.minutesEnd < 10 ? '0' + this.minutesEnd : this.minutesEnd;
              result.users[i].extended_time_before_start = this.hourStart + ':' + this.minutesStart;
              result.users[i].extended_time_after_end = this.hourEnd + ':' + this.minutesEnd;
            }
          }
        }
        this.bindData(result);
      });
    }
  }

  formatDate(date) {
    if (date == null || date.length == 0) return date;
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('/');
  }

  formatTimeForAuditLog(date_time): string {
    if (date_time != null && date_time.indexOf(".") != -1) {
      let splitedDate: any[] = date_time.split(".");
      return splitedDate[0].split("T")[0] + " " + this.timeTo12HrFormat(splitedDate[0].split("T")[1]);
    } else if (date_time != null && date_time.indexOf(" ") != -1) {
      let splittedDate: any[] = date_time.split(" ");
      return splittedDate[0] + " " + this.timeTo12HrFormat(splittedDate[1]);
    }
    return date_time;
  }

  timeTo12HrFormat(time) {
    var time_part_array = time.split(":");
    let ampm: string;
    let hours;
    if (time_part_array[0] > 12 && time_part_array[0] < 24) {
      ampm = 'PM';
      hours = time_part_array[0] - 12;
      if (hours > 0 && hours <= 9) hours = '0' + hours;
    }
    if (time_part_array[0] == 0) {
      ampm = 'AM';
      hours = 12;
    }
    if (time_part_array[0] > 0 && time_part_array[0] < 12) {
      ampm = 'AM';
      hours = time_part_array[0];
    }
    if (time_part_array[0] == 12) {
      ampm = 'PM';
      hours = time_part_array[0];
    }
    if (hours != undefined && ampm != undefined && ampm.length > 0) {
      return hours + ':' + time_part_array[1] + ':' + time_part_array[2] + ' ' + ampm;
    }
  }

  formatDateTime(date) {
    let now = new Date(date);
    let offSet = -300;
    now.setTime(now.getTime() + offSet * 60 * 1000);
    let now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    let month = '' + (now_utc.getMonth() + 1);
    let day = '' + now_utc.getDate();
    const year = now_utc.getFullYear();
    let hour = '' + now_utc.getHours();
    let minutes = '' + now_utc.getMinutes();
    let seconds = '' + now_utc.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;
    return [month, day, year].join('/') + '\n' + [hour, minutes, seconds].join(':');
  }

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);
    this.loading = true;
    this.searchCurrency = null;
    this.getData();
    if (this.gridModel.type === 'Currency Holiday') {
      this._service.getCall("/v1/lenders/" + this.lenderId + "/currencies/").then(i => {
        this.currencyDetailsAll = this._service.bindData(i)
        if (this.currencyDetailsAll.currencies != null) {
          for (let currencies of this.currencyDetailsAll.currencies) {
            if (currencies.status == 'approved') {
              this.currencyDetailsApproved.push(currencies);
            }
          }
        }
      });
    }
    this.searchData.searchClient = '';
    this.searchData.searchAction = '';
    this.searchData.searchProgram = '';
    this.searchData.searchUser = '';
    this.searchData.searchFrmDate = '';
    this.searchData.searchToDate = '';
    this.searchData.automatedStatus = '';
    /*Get the logged in User's role permissions for all grid pages */
    this.getPermissionsOfLoggedInUser();
  }

  isDisableAdd: boolean = false;
  salesRegionsPermissionsArray: any[] = [];
  naicsCodesPermissionsArray: any[] = [];
  commentTypesPermissionsArray: any[] = [];
  systemParametersPermissionsArray: any[] = [];
  adjustmentReasonsPermissionsArray: any[] = [];
  currencyDefPermissionsArray: any[] = [];
  currencyPairPermissionsArray: any[] = [];
  rateTypePermissionsArray: any[] = [];
  exchangeRatePermissionsArray: any[] = [];
  currencyHolidayPermissionsArray: any[] = [];
  userCreationPermissionsArray: any[] = [];

  getPermissionsOfLoggedInUser() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    setTimeout(() => {
      /*On Load not getting the data from local storage hence using settimeout */
      /*Getting all the permissions from Local storage*/
      if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) { /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
        this.salesRegionsPermissionsArray = JSON.parse(localStorage.getItem("salesRegionsPermissionsArray"));
        this.naicsCodesPermissionsArray = JSON.parse(localStorage.getItem("naicsCodesPermissionsArray"));
        this.commentTypesPermissionsArray = JSON.parse(localStorage.getItem("commentTypesPermissionsArray"));
        this.systemParametersPermissionsArray = JSON.parse(localStorage.getItem("systemParametersPermissionsArray"));
        this.adjustmentReasonsPermissionsArray = JSON.parse(localStorage.getItem("adjustmentReasonsPermissionsArray"));
        this.currencyDefPermissionsArray = JSON.parse(localStorage.getItem("currencyDefPermissionsArray"));
        this.currencyPairPermissionsArray = JSON.parse(localStorage.getItem("currencyPairPermissionsArray"));
        this.rateTypePermissionsArray = JSON.parse(localStorage.getItem("rateTypePermissionsArray"));
        this.exchangeRatePermissionsArray = JSON.parse(localStorage.getItem("exchangeRatePermissionsArray"));
        this.currencyHolidayPermissionsArray = JSON.parse(localStorage.getItem("currencyHolidayPermissionsArray"));
        this.userCreationPermissionsArray = JSON.parse(localStorage.getItem("userCreationPermissionsArray"));
      }
      this.enableOrDisableAddIconBasedOnPermission();
    }, 600);
  }

  enableOrDisableAddIconBasedOnPermission() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        if (this.salesRegionsPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'NAICS Codes') {
        if (this.naicsCodesPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Comments Type') {
        if (this.commentTypesPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'System Parameters') {
        if (this.systemParametersPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Adjustment Reasons') {
        if (this.adjustmentReasonsPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, 'create');
        }
      }

      if (this.gridModel.type == 'Currency Definition') {
        if (this.currencyDefPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Currency Pair') {
        if (this.currencyPairPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Rate Type') {
        if (this.rateTypePermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Currency Holiday') {
        if (this.currencyHolidayPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, 'create');
        }
      }
      if (this.gridModel.type == 'Users') {
        if (this.userCreationPermissionsArray.length > 0) {
          this.isDisableAdd = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, 'create');
        }
      }
    } else {
      this.isDisableAdd = true;
    }
  }


  goToAdd() {
    /*Please Dont Remove Below Commented Code */
    this.checkCreatePermByGridType();
    /*this._router.navigateByUrl(this._router.url+"/add");*/

  }

  checkCreatePermByGridType() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.salesRegionsPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "create");
        /*console.log(">>>1. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "create");
        /*console.log(">>>2. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Comments Type') {
        /*console.log("=======>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "create");
        /*console.log(">>>3. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'System Parameters') {
        /*console.log("=======>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "create");
        /*console.log(">>>4. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Adjustment Reasons') {
        /*console.log("=======>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "create");
        /*console.log(">>>5. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Definition') {
        /*console.log("=======>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "create");
        /*console.log(">>>6. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Pair') {
        /*console.log("=======>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "create");
        /*console.log(">>>7. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Rate Type') {
        /*console.log("=======>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "create");
        /*console.log(">>>8. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Holiday') {
        /*console.log("=======>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "create");
        /*console.log(">>>9. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);

      } else if (this.gridModel.type == 'Users') {
        /*console.log("=======>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "create");
        /*console.log(">>>10. hasPermission---"+hasPermission);*/
        this.routeToAddPage(hasPermission);
      }
    } else {
      this.routeToAddPage(true);
    }
  }

  routeToAddPage(hasPermission) {
    if (hasPermission) {
      this._router.navigateByUrl(this._router.url + "/add");
    }
  }

  goToView(result: any) {
    
    let event1: any = result.originalEvent;
    if (this.clickCount === 0 && result.type == 'row') {
      this.selectedRows = null;
    } else if (this.clickCount !== 0 && result.type == 'row') {
      this.selectedRows = '';
    }
    this.clickCount++;
    if (this.clickCount > 1) {
      this.clickCount = 0;
    }
    if (this.gridModel.type == 'Users') {
    let somearr = [];
    if(this.selectedRows.length != null){
      for(let i =0; i< this.selectedRows.length; i++){
        somearr.push(this.selectedRows[i].active);
        
      }
        
      if(somearr.includes(true)){
        this.isActiveContained = true;
      }
  else{
    this.isActiveContained = false;
  }
      
    }
    else{
      this.isActiveContained = false;
    }
  }
 
    let conditionForReturn = ((event1.checked != undefined && event1.checked == true) ||
      ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('fa fa-check icon-green'))
      || ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('fa fa-times icon-red'))
      || ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('fa fa-pencil pad-left10')));
    if (conditionForReturn) {
      this.checkPermByGridType();
      return;
    }
    else if ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('no_view')) {
      $("#activationEmailModalID").show();
      $("#modal_settings_overlay").css({
        "z-index": "0",
        "display": "block"
      })
      return;
      /*Code changes for CYNCUXT-2811 begin*/
    } else if ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('email_disabled_user')) {
      return;
    } else if ($(event1.target).attr('class') !== undefined && $(event1.target).attr('class').includes('user_status')) {
      event1.preventDefault();
      $("#statusChangeModalId").show();
      $("#modal_settings_overlay").css({
        "z-index": "0",
        "display": "block"
      })
      return;
    }
    this.checkPermByGridType();
    if (this.gridModel.type !== 'System Parameters') {
      let resultData = result.data.id;
      this.checkPermissionForUpdatePage(resultData, result);
    }
    
  }

  routingToUpdatePage(hasPermission, rowId) {
    if (hasPermission) {
      this._router.navigateByUrl(this._router.url + "/" + rowId);
    }
  }

  checkPermissionForUpdatePage(rowId, result) {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'NAICS Codes') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Comments Type') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'System Parameters') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Adjustment Reasons') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Currency Definition') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Currency Pair') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Rate Type') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Currency Holiday') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      } else if (this.gridModel.type == 'Users') {
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "update");
        this.routingToUpdatePage(hasPermission, rowId);
      }
    } else {
      this.routingToUpdatePage(true, rowId);
    }

  }

  checkPermByGridType() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("------>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);
      } else if (this.gridModel.type == 'Comments Type') {

        /*console.log("------>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'System Parameters') {

        /*console.log("------>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Adjustment Reasons') {

        /*console.log("------>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Definition') {

        /*console.log("------>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Pair') {

        /*console.log("------>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Rate Type') {

        /*console.log("------>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Holiday') {

        /*console.log("------>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      } else if (this.gridModel.type == 'Users') {

        /*console.log("------>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "update");
        this.enableOrDisableEditIcon(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "destroy");
        this.enableOrDisableDeleteIcon(hasDeletePermission);

      }
    } else {
      this.enableOrDisableEditIcon(true);
      this.enableOrDisableDeleteIcon(true);
    }
  }

  enableOrDisableEditIcon(hasPermission) {
    /*console.log(">>this.selectedCurrency-----",this.selectedCurrency);
    console.log(">>this.selectedCurrency.length----",this.selectedCurrency.length);*/
    if (hasPermission) {
      this.isDisableEdit = this.selectedRows != undefined && this.selectedRows.length <= 1;
    } else {
      this.isDisableEdit = hasPermission;
    }
  }

  enableOrDisableDeleteIcon(hasDeletePermission) {
    
    if (hasDeletePermission) {
      this.isDisableDelete = this.selectedRows != undefined && this.selectedRows.length >= 0;
    } else {
      this.isDisableDelete = hasDeletePermission;
    }
  }

  goToEdit(event: any) {
    /*Please Dont Remove Below Commented Code */
    this.checkUpdatePermByGridType();
    /*if(this.selectedCurrency!== undefined && this.selectedCurrency.length == 1){    
      this._message.showLoader(true);   
      this._router.navigateByUrl(this._router.url+"/"+this.selectedCurrency[0].id);
    }*/
  }

  checkUpdatePermByGridType() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.salesRegionsPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Comments Type') {
        /*console.log("=======>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'System Parameters') {
        /*console.log("=======>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Adjustment Reasons') {
        /*console.log("=======>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Definition') {
        /*console.log("=======>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Pair') {
        /*console.log("=======>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Rate Type') {
        /*console.log("=======>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Currency Holiday') {
        /*console.log("=======>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "update");
        this.routeToEditPage(hasPermission);

      } else if (this.gridModel.type == 'Users') {
        /*console.log("=======>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "update");
        this.routeToEditPage(hasPermission);
      }
    } else {
      this.routeToEditPage(true);
    }
  }

  routeToEditPage(hasPermission) {
    if (hasPermission) {
      if (this.selectedRows !== undefined && this.selectedRows.length == 1) {
        this._message.showLoader(true);
        this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].id);
      }
    }
  }

  delete() {
    /*Please Dont Remove Below Commented Code */
    this.checkDeletePermByGridType();
    /*if(this.selectedCurrency !== undefined && this.selectedCurrency.length > 0){
     this.cync_modal('warning', 'Are you sure you want to delete?',true, false);
    }*/
  }

  checkDeletePermByGridType() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.salesRegionsPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      }
      else if (this.gridModel.type == 'Comments Type') {
        /*console.log("=======>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'System Parameters') {
        /*console.log("=======>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Adjustment Reasons') {
        /*console.log("=======>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Currency Definition') {
        /*console.log("=======>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Currency Pair') {
        /*console.log("=======>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Rate Type') {
        /*console.log("=======>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Currency Holiday') {
        /*console.log("=======>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);

      } else if (this.gridModel.type == 'Users') {
        /*console.log("=======>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "destroy");
        this.routeToDeletePage(hasPermission);
      }
    } else {
      this.routeToDeletePage(true);
    }
  }

  routeToDeletePage(hasPermission) {
    if (hasPermission) {
      if (this.selectedRows !== undefined && this.selectedRows.length > 0) {
        this.idArray = [];
        if (this.gridModel.type == 'Adjustment Reasons' || this.gridModel.type == 'Comments Type') {
          for (let ids of this.selectedRows) {
            this.idArray.push(ids.name);
          }
        }

        if (this.gridModel.type == 'Sales Regions') {
          for (let ids of this.selectedRows) {
            this.idArray.push(ids.region);
          }
        }

        if (this.gridModel.type == 'NAICS Codes') {
          for (let ids of this.selectedRows) {
            this.idArray.push(ids.code);
          }
        }

        if (this.gridModel.type == 'Users') {
          if(this.isActiveContained == true){
            this.cync_modal('warning', 'Selection contains active user. User must have inactive status before deleting.', false, false);
          }
          for (let ids of this.selectedRows) {
            this.idArray.push(ids.login);
          }
        }
        this.cync_modal('warning', 'Are you sure you want to delete ' + '\' ' + this.idArray.join(' \' , \' ') + ' \'' + ' ?' + ' ', true, false);
      }
    }
  }

  cync_modal(type, message, is_prompt, auto_hide) {
    $('#cync_alerts .modal-body').text(message);
    if (type == 'warning') { $('#cync_alerts .modal-header').css('background', '#ea5859').html('<i class="fa fa-5x fa-exclamation-triangle clr_white f_s_64"></i>'); }
    if (type == 'success') { $('#cync_alerts .modal-header').css('background', 'green').html('<i class="fa fa-5x fa-check clr_white f_s_64"></i>'); }
    if (type == 'info') { $('#cync_alerts .modal-header').css('background', '#4dbbf8').html('<i class="fa fa-5x fa-info-circle clr_white f_s_64"></i>'); }
    if (type == 'danger') { $('#cync_alerts .modal-header').css('background', '#eb595a').html('<i class="fa fa-5x fa-ban clr_white f_s_64"></i>'); }
    if (is_prompt == true) {
      $('#cync_alerts .modal-footer').html('<p><button id="modal_action_yes" type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" >Yes</button> <button  id="modal_action_no"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">No</button></p>');
    } else {
      $('#cync_alerts .modal-footer').html('<p><button  id="modal_action_close"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">Close</button></p>');
    }
    (<any>$('#cync_alerts')).modal('show');
    if (auto_hide == true) {
      (<any>$('#cync_alerts')).modal('show');
      setTimeout(function () {
        (<any>$('#cync_alerts')).modal('hide');
      }, 2000);
    }
    document.getElementById('modal_action_yes').addEventListener('click', () => this.deleteData());
    document.getElementById('modal_action_no').addEventListener('click', () => this.unCheckAll());
  }

  cyncAlertConfirm(type, message, is_prompt, auto_hide) {
    $('#cync_alerts .modal-body').html('<p>' + message + '</p>');
    if (type == 'warning') { $('#cync_alerts .modal-header').css('background', '#ea5859').html('<i class="fa fa-5x fa-exclamation-triangle clr_white f_s_64"></i>'); }
    if (type == 'success') { $('#cync_alerts .modal-header').css('background', 'green').html('<i class="fa fa-5x fa-check clr_white f_s_64"></i>'); }
    if (type == 'info') { $('#cync_alerts .modal-header').css('background', '#4dbbf8').html('<i class="fa fa-5x fa-info-circle clr_white f_s_64"></i>'); }
    if (type == 'danger') { $('#cync_alerts .modal-header').css('background', '#eb595a').html('<i class="fa fa-5x fa-ban clr_white f_s_64"></i>'); }
    if (is_prompt == true) {
      $('#cync_alerts .modal-footer').html('<p><button id="modal_action_yes" type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" >Yes</button> <button  id="modal_action_no"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">No</button></p>');
    } else {
      $('#cync_alerts .modal-footer').html('<p><button  id="modal_action_close"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">Close</button></p>');
    }
    (<any>$('#cync_alerts')).modal('show');

    if (auto_hide == true) {
      (<any>$('#cync_alerts')).modal('show');
      setTimeout(function () {
        (<any>$('#cync_alerts')).modal('hide');
      }, 2000)
    }
  }

  deleteData() {
    if (this.locationBack === 'delete') {
      this._message.showLoader(true);
      this._service.deleteCall(this.deleteReqModel).then(i => {
        /*Check If Api returns the proper response, only then show the success message*/
        if (i != undefined) {
          this.deleteSuccess(i);
        } else {
          this._location.back();
        }
      });
      (<any>$('#cync_alerts')).modal('hide');
    } else {
      this.deleteCount = 0;
      this._message.showLoader(true);
      for (let ids of this.selectedRows) {
        this.deleteIds += ids.id;
        this.deleteIds = this.deleteIds + ',';
      }
      if (this.gridModel.type == 'Users') {
        /*Only for Delete Multiple users from grid*/
        var request = { model: {}, url: "admin/users/?ids=" + this.deleteIds }
        this._service.deleteCall(request).then(i => {
          /*Check If Api returns the proper response, only then show the success message*/
          if (i != undefined) {
            this.deleteSuccess(i);
          } else {
            this._location.back();
          }
        });
        this.deleteIds = '';
      } else {
        var request = { model: {}, url: this.gridModel.apiDef.getApi.split('?')[0] + "?ids=" + this.deleteIds }
        this._service.deleteCall(request).then(i => {
          /*Check If Api returns the proper response, only then show the success message*/
          if (i != undefined) {
            this.showCount = 1;
            this.deleteSuccess(i);
          } else {
            this._location.back();
          }
        });
        this.deleteIds = '';
      }
      (<any>$('#cync_alerts')).modal('hide');
    }
  }

  deleteFromView(_id, apiUrl) {
    if (_id !== undefined) {
      this.deleteReqModel = { model: {}, url: apiUrl + _id };
      this.locationBack = 'delete';
      this.cync_modal('warning', 'Are you sure you want to delete?', true, false);
    }
  }

  deleteBank(_id, _bankName, apiUrl) {
    if (_bankName !== undefined && _id !== undefined) {
      this.deleteReqModel = { model: {}, url: apiUrl + _id };
      this.locationBack = 'delete';
      this.cync_modal('warning', 'Are you sure you want to delete ' + '\' ' + _bankName + ' \'' + ' ?', true, false);
    }
  }

  deleteRoleAndPermission(_id, _roleName, apiUrl) {
    if (_roleName !== undefined && _id !== undefined) {
      this.deleteReqModel = { model: {}, url: apiUrl + _id };
      this.locationBack = 'delete';
      this.cync_modal('warning', 'Are you sure you want to delete ' + '\' ' + _roleName + ' \'' + ' ?', true, false);
    }
  }

  goToEditFromView(_id) {
    if (_id !== undefined) {
      this.editUrl = this._router.url.split('/');
      this._router.navigateByUrl(this.editUrl[1] + '/' + this.editUrl[2] + '/' + _id);
    }
  }

  deleteSuccess(data: any) {
    if (this.locationBack !== 'delete') {
      this.deleteCount++;
      if (this.deleteCount == 1) {
        this.getData();
        if (this.selectedRows.length >= 1) {
          this._message.addSingle('Record deleted successfully', 'success');
        }
        this.selectedRows = [];
      } else {
        this.getData();
        //  this._message.addSingle('Records deleted successfully','success');
      }
    } else {
      if (this._router.url === '/userMaintenance/roles-and-permissions' || this._router.url === '/lenderDetails/bank-account-details') {
        this._message.showLoader(false);
        this._message.addSingle('Record deleted successfully', 'success');
      } else {
        this._location.back();
        this.selectedRows = [];
        this._message.addSingle('Record deleted successfully', 'success');
      }
    }
  }

  bindData(result: any) {
    if (this.gridModel.type == 'Currency Definition') {
      this.gridData = result.currencies;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Currency Pair') {
      this.gridData = result.currencyPairs;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Rate Type') {
      this.gridData = result.rateTypes;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Exchange Rate') {
      this.gridData = result.exchangeRate;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Currency Holiday') {
      this.gridData = result.currencyHolidays;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Exchange Rate History') {
      this.gridData = result.exchangeRateHistories;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Ineligibility Reasons') {
      this.gridData = result.ineligibility_reason;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'ABL Charge Code') {
      this.gridData = result.charge_code;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Factoring Charge Code') {
      this.gridData = result.charge_code;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Cash Receipt Source Code') {
      this.gridData = result.cash_receipt_source_code;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Interest Rate Codes') {
      this.gridData = result.interest_rate_codes;
      this.showTotalrecords = result.recordTotal;
      this.datasource = result.interest_rate_codes;
    }
    if (this.gridModel.type == 'NAICS Codes') {
      this.gridData = result.naics_codes;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Sales Regions') {
      this.gridData = result.sales_regions;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Watch List') {
      this.gridData = undefined;
    }
    if (this.gridModel.type == 'Asset Amortization') {
      this.gridData = undefined;
    }
    if (this.gridModel.type == 'Exception Reporting') {
      this.gridData = undefined;
    }

    if (this.gridModel.type == 'File Classifications') {
      this.gridData = result.file_classifications;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Adjustment Reasons') {
      this.gridData = result.adjustment_reasons;
      this.showTotalrecords = result.recordTotal;
    }
    if (this.gridModel.type == 'Exceptions') {
      this.gridData = result.lender_exceptions;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'ABL GL Transactions') {
      this.gridData = result.gl_transactions;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'ABL GL Setup') {
      this.gridData = result.gl_account_details;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'System Parameters') {
      this.gridData = result.system_parameters;
      this.showTotalrecords = result.recordTotal;
      this.systemParamClientSearch();
      this.systemParamReportComments();
      this.isDisableSystemParameterEdit = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, 'update');
    }

    if (this.gridModel.type == 'Audit Logs') {
      //this.gridData = this.formatAuditLogFieldValue(result.audits,false);
      this.gridData = result.audits;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Document Compliance Reporting') {
      this.gridData = result.addendum_tasks;
    }
    if (this.gridModel.type == 'Automated Task Logs') {
      //this.gridData = this.formatAutomatedLogFieldValue(result.rake_logs, false);
      for (var i = 0; i < result.rake_logs.length; i++) {
        this.taskNameArray.push(result.rake_logs[i].task_name);
        this.taskNameArray = this.taskNameArray.filter(this.onlyUnique);
      }
      this.gridData = result.rake_logs;
      this.showTotalrecords = result.recordTotal;
      for (var i = 0; i < result.rake_logs.length; i++) {
        this.gridDataSelectBox[i] = result.rake_logs[i];
      }
    }

    if (this.gridModel.type == 'Notification Logs') {
      this.gridData = result.notification_logs;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Cash Receipt Source Codes') {
      this.gridData = result.cash_receipt_source_code;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Comments Type') {
      this.gridData = result.comment_types;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Credit Sources') {
      this.gridData = result.credit_sources;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Follow up Actions') {
      this.gridData = result.follow_up_actions;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Users') {
      this.gridData = result.users;
      this.showTotalrecords = result.recordTotal;
    }

    if (this.gridModel.type == 'Tickler Tasks') {
      this.gridData = result.tickler_tasks;
    }

    if (this.gridModel.type == 'Collateral Reserves') {
      this.gridData = result.inventory_retains;
      this._service.getCall('/borrowers/' + sessionStorage.getItem('borrowerId') + '/inventory_reserves/get_collateral_type').then(descr => {
        this.selectFromCollateral = this._service.bindData(descr).collateral_type;
      });
    }

    if (this.gridModel.type == 'Activity Tickler') {
      this.gridData = result.lender_tickler;
    }

    if (this.gridModel.type == 'Report Comments') {
      this.gridData = result.comment_sets;
    }

    if (this.gridModel.type == 'Comments') {
      this.gridData = result.comments;
    }

    if (this.gridModel.type == 'Borrower Exceptions') {
      this.gridData = result.borrower_exception;
    }
    if (this.gridModel.type == 'Client Creation') {
      this.gridData = result.borrowers;
      this.showTotalrecords = result.recordTotal;
    }
    this.isDisableEdit = this.selectedRows != undefined && this.selectedRows == 1;
    this.isDisableDelete = this.selectedRows != undefined && this.selectedRows > 0;
    this.isDataLoading = true;
    this._message.showLoader(false);
  }

  allClientSearchParam: any
  systemParamClientSearch() {
    this._service.getCall('/system_parameters/list_client_display_values').then(response => {
      this.allClientSearchParam = this._service.bindData(response).client_display_values;
    });
  }

  reportCommentsParam: any
  systemParamReportComments() {
    this._service.getCall('/system_parameters/list_comment_display_values').then(response => {
      this.reportCommentsParam = this._service.bindData(response).comment_display_values;
    });
  }

  editData(row, event: any) {
    this.selectedRows = [];
    this.editField = row.name;
    this.amountValue = row.value;
    this.isEdited = true;
    if (row.name == 'CLIENT_SEARCH_DISPLAY') {
      this.sysParamClientSearch = row.value;
    }
    if (row.name == 'MANUAL_INELIGIBLES_INELIGIBLE_SUMMARY') {
      this.sysParamManualEligibleSummary = row.value;
    }
    if (row.name == 'DISPLAY_FUNDING_BATCH_REPORT_HEADER') {
      this.sysParamDisplayFundingBatchReportHeader = row.value
  }
    if (row.name == 'DEFAULT_COMMENT') {
      this.sysParamDefaultComment = row.value;
    }
    if (row.name == 'DEBTOR_MATCH_PCT') {
      this.sysParamDropDown = row.value;
    }
    if (row.name == 'REPORT_COMMENTS') {
      this.sysParamReportComment = row.value;
    }
    if (row.name == 'PAGE_DISPLAY') {
      this.sysParamPageDisplay = row.value;
    }
    if (row.name == 'DISPLAY_AGINGS') {
      this.sysParamAgingsDisplay = row.value;
    }
    if (row.name == 'LOGO_DISPLAY_REPORTS') {
      this.sysParamLogoDisplay = row.value;
    }
    if (row.name == 'PURGE_SUMMARY_FILES') {
      this.sysParamPurgeSummary = row.value;
    }  
      if (row.name == 'CLIENT_DETAILS_REQUIRES_STATE_PROVINCE') {
      this.sysParamClientDetails = row.value;
    }
    // if (row.name == 'CONTRA_INELIGIBLE') {
    //   this.sysParamContraIneligible = row.value;
    // }
    if (row.name == 'PRIMARY_MANAGER_REQUIRED') {
      this.sysParamPrimaryManager = row.value;
    }
    if (row.name == 'COLLATERAL_ADV_RATE_DECIMALS') {
      this.sysParamCollateralAdvRateDisplay = row.value;
    }
    if (row.name == 'EXCHANGE_RATE') {
      this.sysParamExchangeRate = row.value;
    }
    if (row.name == 'AGING_DATE') {
      this.sysParamAgingDate = row.value;
    }
    if (row.name == 'DEFAULT_CLIENT_STATUS') {
      this.sysParamDefaultClientStatus = row.value
    }
    if (row.name == 'LOAN_ID_DROPDOWN') {
      this.sysParamLoanidDropdown = row.value
    }
    if (row.name == 'AFFILIATE_LENDER_REQUIRED') {
      this.sysParamAffiliateLenderRequired = row.value
    }
  }

  cancelEdit(row) {
    this.selectedRows = [];
    this.isEdited = false;
  }

  sysParamDropDown: any = '50';
  sysParamDefaultComment: any = '1';
  sysParamManualEligibleSummary: any = 'BC';
  sysParamClientSearch: any = 'NA';
  sysParamReportComment: any = 'BC';
  sysParamPageDisplay: any = '8';
  sysParamAgingsDisplay: any = 'N';
  sysParamPrimaryManager: any = 'N';
  sysParamLogoDisplay = 'true';
  sysParamPurgeSummary = 'BF';
  sysParamClientDetails = 'N';
  sysParamCollateralAdvRateDisplay: any = '2';
  sysParamExchangeRate: any = 'N';
  sysParamAgingDate: any = 'N';
  sysParamDefaultClientStatus: any = '0';
  sysParamLoanidDropdown:any = '0';
  sysParamAffiliateLenderRequired: any = '0';
  sysParamDisplayFundingBatchReportHeader: any = 'N';

  saveEdit(row, value) {
    this.selectedRows = [];
    const sysParamModel = {
      'system_parameter': {
        'value': value
      }
    }
    this.requestModel = { url: '/system_parameters/' + row.id, model: sysParamModel }
    this._service.patchCallRor(this.requestModel).then(i => {
      if (i != undefined) {
        if (row.name == 'PAGE_DISPLAY') {
          this._message.addSingle('Record saved successfully.', 'success');
          CyncConstants.setDefaultRowCount(value);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else if (row.name == 'CLIENT_SEARCH_DISPLAY') {
          this.navBarComponent.listClients();
          this.getData();
        } else {
          this.getData();
        }
      }
    });
  }

  selectAllChkBox() {
    if (this.gridModel.type == 'Users') {
      let somearr = [];
      if(this.selectedRows.length != null){
        for(let i =0; i< this.selectedRows.length; i++){
          somearr.push(this.selectedRows[i].active);
          
        }
            
        if(somearr.includes(true)){
          this.isActiveContained = true;
        }
    else{
      this.isActiveContained = false;
    }
        
      }
      else{
        this.isActiveContained = false;
      }
    }
    this.selectAllCustomDeletePermission();
  }

  selectAllCustomDeletePermission() {
    /*While selecting all rows check for Delete permission only if the user has a role other than Administrator*/
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("------>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Comments Type') {
        /*console.log("------>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'System Parameters') {
        /*console.log("------>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Adjustment Reasons') {
        /*console.log("------>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Currency Definition') {
        /*console.log("------>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Currency Pair') {
        /*console.log("------>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Rate Type') {
        /*console.log("------>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Currency Holiday') {
        /*console.log("------>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      } else if (this.gridModel.type == 'Users') {
        /*console.log("------>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconOnAllChk(hasDeletePermission);
      }
    } else {
      /*Admin Role has Delete permission hence passing true as parameter*/
      this.enableOrDisableDeleteIconOnAllChk(true);
    }
  }

  enableOrDisableDeleteIconOnAllChk(hasDeletePermission) {
    /*Based on the Delete Permission enable or disable the delete icon*/
    if (hasDeletePermission) {
      this.isDisableDelete = this.selectedRows != undefined && this.selectedRows.length >= 0;
      if (this.selectedRows.length == 0) {
        this.isDisableDelete = false;
      }
      if (this.selectedRows.length == 1) {
        this.isDisableEdit = true;
      } else {
        this.isDisableEdit = false;
      }
    } else {
      this.isDisableDelete = hasDeletePermission;
    }
  }

  unSelectChkBox() {
    /*console.log("::::::::::this.selectedCurrency.length--------",this.selectedCurrency.length);*/
    this.chkPermByGridTypeBasedOnChkBox();
    if (this.gridModel.type == 'Users') {
    let somearr = []
    if(this.selectedRows.length != null){
      for(let i =0; i< this.selectedRows.length; i++){
        somearr.push(this.selectedRows[i].active);
   
      }
        
      if(somearr.includes(true)){
        this.isActiveContained = true;
      }
      else{
        this.isActiveContained = false;
      }
      
    }
    else{
      this.isActiveContained = false;
    }
  }
  }

  chkPermByGridTypeBasedOnChkBox() {
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      if (this.gridModel.type == 'Sales Regions') {
        /*console.log("=======>this.naicsCodesPermissionsArray--------",this.salesRegionsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.salesRegionsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'NAICS Codes') {
        /*console.log("------>this.naicsCodesPermissionsArray--------",this.naicsCodesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.naicsCodesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);
      } else if (this.gridModel.type == 'Comments Type') {

        /*console.log("------>this.commentTypesPermissionsArray--------",this.commentTypesPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.commentTypesPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'System Parameters') {

        /*console.log("------>this.systemParametersPermissionsArray--------",this.systemParametersPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.systemParametersPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Adjustment Reasons') {

        /*console.log("------>this.adjustmentReasonsPermissionsArray--------",this.adjustmentReasonsPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.adjustmentReasonsPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Definition') {

        /*console.log("------>this.currencyDefPermissionsArray--------",this.currencyDefPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyDefPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Pair') {

        /*console.log("------>this.currencyPairPermissionsArray--------",this.currencyPairPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyPairPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Rate Type') {

        /*console.log("------>this.rateTypePermissionsArray--------",this.rateTypePermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.rateTypePermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Currency Holiday') {

        /*console.log("------>this.currencyHolidayPermissionsArray--------",this.currencyHolidayPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.currencyHolidayPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);

      } else if (this.gridModel.type == 'Users') {

        /*console.log("------>this.userCreationPermissionsArray--------",this.userCreationPermissionsArray);*/
        let hasPermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "update");
        this.enableOrDisableEditIconByChkBox(hasPermission);
        let hasDeletePermission = this.rolesPermComp.checkPermissions(this.userCreationPermissionsArray, "destroy");
        this.enableOrDisableDeleteIconByChkBox(hasDeletePermission);
      }
    } else {
      this.enableOrDisableEditIconByChkBox(true);
      this.enableOrDisableDeleteIconByChkBox(true);
    }
  }

  enableOrDisableEditIconByChkBox(hasPermission) {
    if (hasPermission) {
      this.isDisableEdit = this.selectedRows != undefined && this.selectedRows.length == 1;
    } else {
      this.isDisableEdit = hasPermission;
    }
  }

  enableOrDisableDeleteIconByChkBox(hasDeletePermission) {
    if (hasDeletePermission) {
      this.isDisableDelete = this.selectedRows != undefined && this.selectedRows.length >= 1;
    } else {
      this.isDisableDelete = hasDeletePermission;
    }
  }

  navigateToHistory() {
    //this._router.navigateByUrl('/currency/exchange-rates-history');
    this.history.showHistory();
  }

  unCheckAll() {
    this.selectedRows = [];
    this.isDisableEdit = false;
    this.isDisableDelete = false;
  }

  loadCurrencyHolidays() {
    if (this.searchCurrency != null && this.searchYear != undefined) {
      // this._message.showLoader(true)
      this.searchData = this.gridData;
      this.gridData = [];
      var gridLength = this.searchData.length;
      let spliceCount = 0;
      for (var i = 0; i < gridLength; i++) {
        if (this.searchData[i].year == this.searchYear && this.searchData[i].currency.id == this.searchCurrency) {
          this.gridData[spliceCount] = this.searchData.splice(i, 1)[0];
          spliceCount++;
          i--;
          gridLength--;
        }
      }
      // this._message.showLoader(false)
    }
    if (this.searchYear == undefined || this.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
    if (this.searchCurrency == null) {
      this.isSelectedCurrency = false;
    } else {
      this.isSelectedCurrency = true;
    }
  }

  resetCurrencyHolidaySearch() {
    if (this.searchYear != undefined) {
      this.searchYear = undefined;
      this.searchCurrency = null;
      this.getData();
    }
  }

  showDialogForExport() {
    this.exportColArray = [];
    this.exportSelectedCol = [];
    this.checked = [];
    for (let i = 0; i < this.gridModel.columnDef.length; i++) {
      this.exportColArray.push(this.gridModel.columnDef[i].header);
      this.checked.push(true);
    }
    this.exportSelectedCol = this.checked;
    this.display1 = true;
  }

  selectColForExport(event, selectedCol) {
    this.exportSelectedCol = selectedCol;
  }

  showDialog() {
    this.weekendHolidayArray = [];
    this.searchDataWeekend = [];
    if (this.searchYear == undefined || this.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
    if (this.searchCurrency == undefined || this.searchCurrency == '' || this.searchCurrency == null) {
      this.isSelectedCurrency = false;
    } else {
      this.isSelectedCurrency = true;
    }
    if (this.searchCurrency && this.isEnteredYear) {
      this.searchData = JSON.parse(JSON.stringify(this.currencyDetailsApproved));
      var gridLength = this.searchData.length;
      for (var i = 0; i < gridLength; i++) {
        if (this.searchData[i].id == this.searchCurrency) {
          this.searchDataWeekend = this.searchData.splice(i, 1);
          i--;
          gridLength--;
        }
      }
      if (this.searchDataWeekend[0].weekend != undefined) {
        this.holidayWeekend0 = '';
        this.holidayWeekend1 = '';
        this.holidayWeekend2 = '';
        this.holidayWeekend3 = '';
        this.holidayWeekend4 = '';
        this.holidayWeekend5 = '';
        this.holidayWeekend6 = '';
        if (this.searchDataWeekend[0].weekend[0] == 'Sunday') {
          this.holidayWeekend0 = 'Sunday';
          this.weekendHolidayArray.push('Sunday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Monday') {
          this.holidayWeekend1 = 'Monday';
          this.weekendHolidayArray.push('Monday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Tuesday') {
          this.holidayWeekend2 = 'Tuesday';
          this.weekendHolidayArray.push('Tuesday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Wednesday') {
          this.holidayWeekend3 = 'Wednesday';
          this.weekendHolidayArray.push('Wednesday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Thursday') {
          this.holidayWeekend4 = 'Thursday';
          this.weekendHolidayArray.push('Thursday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Friday') {
          this.holidayWeekend5 = 'Friday';
          this.weekendHolidayArray.push('Friday');
        } else if (this.searchDataWeekend[0].weekend[0] == 'Saturday') {
          this.holidayWeekend6 = 'Saturday';
          this.weekendHolidayArray.push('Saturday');
        }

        if (this.searchDataWeekend[0].weekend[1] == 'Sunday') {
          this.holidayWeekend0 = 'Sunday';
          this.weekendHolidayArray.push('Sunday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Monday') {
          this.holidayWeekend1 = 'Monday';
          this.weekendHolidayArray.push('Monday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Tuesday') {
          this.holidayWeekend2 = 'Tuesday';
          this.weekendHolidayArray.push('Tuesday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Wednesday') {
          this.holidayWeekend3 = 'Wednesday';
          this.weekendHolidayArray.push('Wednesday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Thursday') {
          this.holidayWeekend4 = 'Thursday';
          this.weekendHolidayArray.push('Thursday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Friday') {
          this.holidayWeekend5 = 'Friday';
          this.weekendHolidayArray.push('Friday');
        } else if (this.searchDataWeekend[0].weekend[1] == 'Saturday') {
          this.holidayWeekend6 = 'Saturday';
          this.weekendHolidayArray.push('Saturday');
        }
      }
      this.display = true;
    }
  }

  weekendDayChange(id, event) {
    if (id === 'Sunday' && event === true) {
      this.holidayWeekend0 = 'Sunday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Sunday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Monday' && event === true) {
      this.holidayWeekend1 = 'Monday';
      this.weekendHolidayArray.push(id);
    }
    else if (id === 'Monday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Tuesday' && event === true) {
      this.holidayWeekend2 = 'Tuesday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Tuesday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Wednesday' && event === true) {
      this.holidayWeekend3 = 'Wednesday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Wednesday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Thursday' && event === true) {
      this.holidayWeekend4 = 'Thursday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Thursday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Friday' && event === true) {
      this.holidayWeekend5 = 'Friday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Friday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
    if (id === 'Saturday' && event === true) {
      this.holidayWeekend6 = 'Saturday';
      this.weekendHolidayArray.push(id);
    } else if (id === 'Saturday' && event === false) {
      for (let i = 0; i < this.weekendHolidayArray.length; i++) {
        if (this.weekendHolidayArray[i] == id) {
          this.weekendHolidayArray.splice(i, 1);
          break;
        }
      }
    }
  }

  OnClickModifyWeekend() {

    this.CurrencyHolidayWeekendModel = {
      "id": this.searchDataWeekend[0].id,
      "approverComments": this.searchDataWeekend[0].approverComments,
      "status": this.searchDataWeekend[0].status,
      "currencyName": this.searchDataWeekend[0].currencyName,
      "currencyDescription": this.searchDataWeekend[0].currencyDescription,
      "currencyCode": this.searchDataWeekend[0].currencyCode,
      "ccyCountry": {
        "id": this.searchDataWeekend[0].ccyCountry.id,
      },
      "currencyDecimalPrecision": this.searchDataWeekend[0].currencyDecimalPrecision,
      "currencyRoundingUnit": this.searchDataWeekend[0].currencyRoundingUnit,
      "currencyRoundingPrefs": {
        "id": this.searchDataWeekend[0].currencyRoundingPrefs.id,
      },
      "currencyCutoffTime": null,
      "currencyFormatMask": {
        "id": this.searchDataWeekend[0].currencyFormatMask.id,
      },
      "weekend": this.weekendHolidayArray
    }
    var requestModel = { url: '/v1/lenders/' + this.lenderId + '/currencies/' + this.searchDataWeekend[0].id, model: this.CurrencyHolidayWeekendModel }
    this._service.putCall(requestModel).then(i => this.approveCurrencyHolidayWeekend(i));
  }

  approveCurrencyHolidayWeekend(data: any) {
    if (data.status == 204) {
      var requestModel = { url: data.url, model: this.CurrencyHolidayWeekendModel }
      this._service.patchCall(requestModel).then(i => this.navigateToHomeCurrencyHoliday());
    }
  }

  navigateToHomeCurrencyHoliday() {
    this._message.addSingle("Weekend Updated successfully.", "success");
    this.display = false;
    this.currencyDetailsApproved = [];
    this._service.getCall("/v1/lenders/" + this.lenderId + "/currencies/").then(i => {
      this.currencyDetailsAll = this._service.bindData(i)
      if (this.currencyDetailsAll.currencies != null) {
        for (let currencies of this.currencyDetailsAll.currencies) {
          if (currencies.status == 'approved') {
            this.currencyDetailsApproved.push(currencies);
          }
        }
      }
    });
  }

  currencyViewCalender() {
    this.searchViewCalenderResult = [];
    if (this.searchYear == undefined || this.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
    if (this.searchCurrency == null) {
      this.isSelectedCurrency = false;
    } else {
      this.isSelectedCurrency = true;
    }
    if (this.searchCurrency && this.isEnteredYear) {
      this.viewCalenderDisplay = true;

      for (var i = 0; i < this.viewCalenderCustomizedArray.length; i++) {
        if (this.viewCalenderCustomizedArray[i].id == this.searchCurrency) {
          this.searchViewCalenderResult.push(this.viewCalenderCustomizedArray[i]);
        }
      }
      var tempYear = this.searchYear + "-01-01";
      this.viewDate = new Date(tempYear);
      this.events = this.searchViewCalenderResult;
    }
  }

  requiredCheckCurrency() {
    if (this.searchCurrency == null) {
      this.isSelectedCurrency = false;
    } else {
      this.isSelectedCurrency = true;
    }
  }

  requiredCheckYear() {
    if (this.searchYear == undefined || this.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
  }

  enableSearch() {
    this.isAdvanceSearchEnabled = true;
    if (!this.isSearch) {
      if (this.gridModel.type === 'Audit Logs' && this.userList === undefined && this.clientList === undefined) {
        this._service.getCall('admin/users?audit_logs=true').then(users => {
          this.userList = users['users'];
          this._service.getCall('borrowers').then(clients => {
            this.clientList = clients['borrowers'];
            this._service.getCall('/audits/get_programs').then(programs => {
              this.fillprogramList(programs['programs']);
              this._message.showLoader(false);
              this.isSearch = true;
              this.auditLogSearched = false;
            })
          })
        });
      } else if (this.userList !== undefined && this.clientList !== undefined) {
        this.isSearch = true;
        this.auditLogSearched = false;
      }
      else if (this.gridModel.type === 'Automated Task Logs') {
        this.isSearch = true;
        this._message.showLoader(true);
        setTimeout(() => {
          this.automatedLogSearched = false;
          this._message.showLoader(false);
        }, 1000);

      }
    }
  }

  enableSearchCancel() {
    this.isAdvanceSearchEnabled = false;
    if (this.isSearch) {
      this.isSearch = false;
      this.searchData.searchClient = '';
      this.searchData.searchAction = '';
      this.searchData.searchProgram = '';
      this.searchData.searchUser = '';
      this.searchData.searchFrmDate = '';
      this.searchData.searchToDate = '';

      this.searchData.taskName = '';
      this.searchData.searchFrmDate_1 = '';
      this.searchData.searchToDate_1 = '';
      this.searchData.automatedStatus = '';
      if (this.auditLogSearched && this.gridModel.type === 'Audit Logs') {
        this.getData();
      } else if (this.automatedLogSearched && this.gridModel.type === 'Automated Task Logs') {
        this.getData();
      }
    }
  }

  auditLogSearch(searchData, isConcat) {
    this.isGlobalSearchEnabled = false;
    let searchParam = [];
    let filter = '';
    // if searchFrmDate is selected searchToDate is needed 
    // if searchToDate is selected searchFrmDate is needed 
    // searchFrmDate must be less then searchToDate
    // searchToDate must be greater than searchFrmDate
    // disable the dates using current date.
    if (!this.validatAuditLogAdvanceSearchRequest(searchData)) {
      return;
    }

    this.auditLogSearched = true;
    if (searchData.searchClient != null) {
      searchParam.push("borrower_id=" + `${searchData.searchClient}`);
    }
    if (searchData.searchAction != null) {
      searchParam.push("event=" + `${searchData.searchAction}`);
    }
    if (searchData.searchProgram != null) {
      searchParam.push("program=" + `${searchData.searchProgram}`);
    }
    if (searchData.searchUser != null) {
      searchParam.push("user_id=" + `${searchData.searchUser}`);
    }
    if (searchData.searchFrmDate != null && searchData.searchFrmDate != '') {
      searchParam.push("from_date=" + this.formatDate(searchData.searchFrmDate));
    }
    if (searchData.searchToDate != null && searchData.searchToDate != '') {
      searchParam.push("to_date=" + this.formatDate(searchData.searchToDate));
    }
    if (searchData.info_one != null) {
      searchParam.push("info_one=" + `${searchData.info_one}`);
   }
 
    if (searchParam.length > 0) {
      filter = searchParam.join('&');
    }
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter', filter.toString());
    let endpoint = "";

    // if isConcat is true ,this will get data from api and append to grid data
    // if false , it will do a fresh advace search
    if (!isConcat) {
      endpoint = this.gridModel.apiDef.getApi;
    } else {
      endpoint = 'audits?page=' + this.showCount + '&size=' + this.rowcount;
    }
    this._service.getCallQuertParams(endpoint, filter).then(result => {
      if (isConcat) {
        //let response  = this.formatAuditLogFieldValue(result["audits"],false);
        this.gridData = this.gridData.concat(result["audits"]);
      } else {
        //this.gridData = this.formatAuditLogFieldValue(result["audits"],false);
        this.gridData = result["audits"];
      }
      this._message.showLoader(false);
    })
  }

  automatedLogSearch(searchData, isConcat) {
    let searchParam = [];
    let filter = '';
    this.automatedLogSearched = true;
    if (searchData.taskName != null) {
      searchParam.push("task_name=" + `${searchData.taskName}`);
    }
    if (searchData.searchFrmDate_1 != null) {
      searchParam.push("from_date=" + this.formatDate(searchData.searchFrmDate_1));
    }
    if (searchData.searchToDate_1 != null) {
      searchParam.push("to_date=" + this.formatDate(searchData.searchToDate_1));
    }
    if (searchData.automatedStatus != null) {
      searchParam.push("status=" + `${searchData.automatedStatus}`);
    }

    if (searchParam.length > 0) {
      filter = searchParam.join('&');
    }
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter', filter.toString());
    let endpoint = "";

    if (!isConcat) {
      endpoint = this.gridModel.apiDef.getApi;
    } else {
      endpoint = 'rake_logs?page=' + this.showCount + '&size=' + this.rowcount;
    }

    this._service.getCallQuertParams(endpoint, filter).then(result => {
      if (isConcat) {
        //let response = this.formatAutomatedLogFieldValue(result["rake_logs"], false);
        this.gridData = this.gridData.concat(result["rake_logs"]);
      } else {
        //this.gridData = this.formatAutomatedLogFieldValue(result["rake_logs"], false);
        this.gridData = result["rake_logs"];
      }
      this._message.showLoader(false);
    })
  }

  onSelectFromDate(onselectedDate: Date) {
    this.enableFromDate = onselectedDate;
    var DD = '' + this.enableFromDate.getDate();
    var MM = '' + (this.enableFromDate.getMonth() + 1);
    var YYYY = this.enableFromDate.getFullYear();
    if (DD.length < 2) DD = '0' + DD;
    if (MM.length < 2) MM = '0' + MM;
    this.from_canlendar_date = YYYY + "-" + MM + "-" + DD;
    if (((this.from_canlendar_date != undefined && this.from_canlendar_date.length > 0)) &&
      ((this.to_canlendar_date != undefined && this.to_canlendar_date.length > 0))) {
      this._service.getCall<any>('/v1/lenders/cynclender1/exchangeratehistories/dates?fromDate='
        + this.from_canlendar_date + '&toDate=' + this.to_canlendar_date).then(result => {

          if (this.gridModel.type === 'Exchange Rate History') {
            for (var i = 0; i < result.exchangeRateHistories.length; i++) {
              result.exchangeRateHistories[i].createdAt = this.formatDate(result.exchangeRateHistories[i].createdAt);
              result.exchangeRateHistories[i].currencyPair.currencyIdBase = result.exchangeRateHistories[i].currencyPair.currencyIdBase.currencyCode + '-' + result.exchangeRateHistories[i].currencyPair.currencyIdTo.currencyCode;
              this.currencyPairArray.push(result.exchangeRateHistories[i].currencyPair.currencyIdBase);

              for (let rateCount = 0; rateCount < result.exchangeRateHistories[i].rateDetails.length; rateCount++) {
                if (result.exchangeRateHistories[i].rateDetails[rateCount].rateType !== undefined) result.exchangeRateHistories[i]['rateTypeNames'] = (result.exchangeRateHistories[i].rateDetails[rateCount].rateType.rateTypeName);
                result.exchangeRateHistories[i]['midRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].midRate);
                result.exchangeRateHistories[i]['buySpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buySpread);
                result.exchangeRateHistories[i]['sellSpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellSpread);
                result.exchangeRateHistories[i]['buyRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buyRate);
                result.exchangeRateHistories[i]['sellRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellRate);
              }
            }

          }
          this.bindData(result);
        });
    }
  }

  onSelectToDate(onselectedDate: Date) {
    this.enableToDate = onselectedDate;
    var DD = '' + this.enableToDate.getDate();
    var MM = '' + (this.enableToDate.getMonth() + 1);
    var YYYY = this.enableToDate.getFullYear();
    if (DD.length < 2) DD = '0' + DD;
    if (MM.length < 2) MM = '0' + MM;
    this.to_canlendar_date = YYYY + "-" + MM + "-" + DD;
    if (((this.from_canlendar_date != undefined && this.from_canlendar_date.length > 0)) &&
      ((this.to_canlendar_date != undefined && this.to_canlendar_date.length > 0))) {
      this._service.getCall<any>('/v1/lenders/cynclender1/exchangeratehistories/dates?fromDate='
        + this.from_canlendar_date + '&toDate=' + this.to_canlendar_date).then(result => {
          if (this.gridModel.type === 'Exchange Rate History') {
            for (var i = 0; i < result.exchangeRateHistories.length; i++) {
              result.exchangeRateHistories[i].createdAt = this.formatDate(result.exchangeRateHistories[i].createdAt);
              result.exchangeRateHistories[i].currencyPair.currencyIdBase = result.exchangeRateHistories[i].currencyPair.currencyIdBase.currencyCode + '-' + result.exchangeRateHistories[i].currencyPair.currencyIdTo.currencyCode;
              this.currencyPairArray.push(result.exchangeRateHistories[i].currencyPair.currencyIdBase);

              for (let rateCount = 0; rateCount < result.exchangeRateHistories[i].rateDetails.length; rateCount++) {
                if (result.exchangeRateHistories[i].rateDetails[rateCount].rateType !== undefined) result.exchangeRateHistories[i]['rateTypeNames'] = (result.exchangeRateHistories[i].rateDetails[rateCount].rateType.rateTypeName);
                result.exchangeRateHistories[i]['midRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].midRate);
                result.exchangeRateHistories[i]['buySpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buySpread);
                result.exchangeRateHistories[i]['sellSpread'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellSpread);
                result.exchangeRateHistories[i]['buyRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].buyRate);
                result.exchangeRateHistories[i]['sellRate'] = (result.exchangeRateHistories[i].rateDetails[rateCount].sellRate);
              }
            }
          }
          this.bindData(result);
        });
    }
  }

  styleType: any;
  showNotificationPopup(message) {
    if (this.showNotificationMsgPopup) {
      this.showNotificationMsgPopup = false;
    } else {
      let tempString: String = message;
      let htmlContent = this.replaceHtmlCharEntity(this.convert(message));
      this.notificationMessage = htmlContent;
      this.showNotificationMsgPopup = true;
    }
  }

  convert(str): string {
    return str.replace(/\\u([a-f0-9]{4})/gi, function (found, code) {
      return String.fromCharCode(parseInt(code, 16));
    });
  }

  /**
  *
  * this method will replace the chars like &gt; or &lt;
  */
  replaceHtmlCharEntity(htmlContent: string): string {
    return htmlContent.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }

  onKey(event: any) {
    this.showCount = 1;
    this.isGlobalSearchEnabled = true;
    if (event.target.value == '') {
      this.isCloseBox = false;
      this.isSearchBox = true;
    }
    else {
      this.isCloseBox = true;
      this.isSearchBox = false;
    }
    if (event.target.value == undefined) {
      event.target.value = '';
      this.isCloseBox = false;
      this.isSearchBox = true;
    }
    if (this.gridModel.type === 'NAICS Codes') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/general_codes/naics_codes?search='
        + this.Searchvalues + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.gridData = result['naics_codes'];
          this.showTotalrecords = result.recordTotal;
        });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'Comments Type') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/general_codes/comment_types?search='
        + this.Searchvalues + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.gridData = result['comment_types'];
          this.showTotalrecords = result.recordTotal;
        });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'Audit Logs') {
      this.Searchvalues = event.target.value;
      let currentObj = this;
      this._service.getCall<any>('/audits?search=' + this.Searchvalues).then(result => {
        this.gridData = result.audits;
      });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'Automated Task Logs') {
      this.Searchvalues = event.target.value;
      let currentObject = this;
      this._service.getCall<any>('/rake_logs?search=' + this.Searchvalues).then(result => {
        this.gridData = result.rake_logs;
      });
      this._message.showLoader(false);
    }
    if (this.gridModel.type === 'Sales Regions') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/general_codes/sales_regions?search='
        + this.Searchvalues + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.gridData = result['sales_regions'];
          this.showTotalrecords = result.recordTotal;
        });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'System Parameters') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/system_parameters?search='
        + this.Searchvalues + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.gridData = result['system_parameters'];
          this.showTotalrecords = result.recordTotal;
        });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'Notification Logs') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/notification_logs?common_search='
        + this.Searchvalues).then(result => {
          this.gridData = result['notification_logs'];
        });
      this._message.showLoader(false);
    }

    if (this.gridModel.type === 'Adjustment Reasons') {
      this.Searchvalues = event.target.value;
      this._service.getCall<any>('/general_codes/adjustment_reasons?search='
        + this.Searchvalues + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.gridData = result['adjustment_reasons'];
          this.showTotalrecords = result.recordTotal;
        });
      this._message.showLoader(false);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.dataTableElement = event.target;
    if ("webkitAppearance" in document.body.style && this.isAdvanceSearchEnabled == false) {
      //  fix the header at the top in Google Chrome browser 
      this.dataTableElement.querySelector("thead").style.webkitTransform = `translateY(${this.dataTableElement.scrollTop}px)`;
    }
    else {
      this.dataTableElement.querySelector("thead").style.webkitTransform = `unset`;
    }

    /*Disabling Fixes for Internet explorer and mozilla , as its taking time to stick the header after scroll*/
    // this.dataTableElement.querySelector("thead").style.msTransform = `translateY(${this.dataTableElement.scrollTop}px)`;


    this.loadCount = this.loadCount + 1;
    /**
     * The following code deprecated as a fix for CYNCPS-1853
     * More details https://idexcel.atlassian.net/browse/CYNCPS-1853
    
    var target = document.getElementById('main_contents');
    var height_pre = Math.trunc(target.scrollHeight);
    var height_client = Math.trunc(target.clientHeight);
    var scroll_top = (Math.trunc(target.scrollTop)+10);
    if (scroll_top >= (height_pre - height_client)) { this.load_more = true; } else { this.load_more = false; }
    */
    if ( this._helper !== undefined && this._helper.isScollbarAtBottom('main_contents')) { 
      this.load_more = true; 
    } else { 
      this.load_more = false; 
    }

    if (this.load_more == true) {
      this.showCount = this.showCount + 1;

      /* Below condition is checked For pages which does not use grid to avoid error messages in browser console */
      if (this.gridModel === undefined) return;

      if (this.gridModel.type === 'NAICS Codes') {
        this._service.getCall<any>('general_codes/naics_codes?search=' + this.searchValue + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.ShowmoreData = result['naics_codes'];
          this.showTotalrecords = result.recordTotal;
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }
        });
        this._message.showLoader(false);

      }

      if (this.gridModel.type === 'Comments Type') {
        this._service.getCall<any>('general_codes/comment_types?search=' + this.searchValue + '&page=' + this.showCount + '&rows=' + this.rowcount).then(result => {
          this.ShowmoreData = result['comment_types'];
          this.showTotalrecords = result.recordTotal;
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }
        });
        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'Audit Logs') {
        this._message.showLoader(true);
        let endpoint = "";
        if (this.isGlobalSearchEnabled) {
          endpoint = '/audits?search=' + this.Searchvalues + '&page=' + this.showCount + '&size=' + this.rowcount;
          this._service.getCall<any>(endpoint).then(result => {
            this.ShowmoreData = result['audits'];
            let allAuditData = this.ShowmoreData;
            //this.formatAuditLogFieldValue(allAuditData,true);// this will append data to grid data
            this.gridData = this.gridData.concat(result.audits);
          });
        }
        if (!this.isAdvanceSearchEnabled) {
          endpoint = 'audits?page=' + this.showCount + '&size=' + this.rowcount;
          this._service.getCall<any>(endpoint).then(result => {
            this.ShowmoreData = result['audits'];
            let allAuditData = this.ShowmoreData;
            //this.formatAuditLogFieldValue(allAuditData,true);// this will append data to grid data
            this.gridData = this.gridData.concat(result.audits);
          });
        } else {
          this.auditLogSearch(this.searchData, true);
        }

        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'Automated Task Logs') {
        let endpoint = "";
        if (!this.isAdvanceSearchEnabled) {
          endpoint = 'rake_logs?page=' + this.showCount + '&size=' + this.rowcount;
          this._service.getCall<any>(endpoint).then(result => {
            this.ShowmoreData = result['rake_logs'];
            let allAutomatedData = this.ShowmoreData;
            //this.formatAutomatedLogFieldValue(allAutomatedData, true);// this will append data to grid data
            this.gridData = this.gridData.concat(result.rake_logs);
          });
        } else {
          this.automatedLogSearch(this.searchData, true);
        }
        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'Sales Regions') {
        this._service.getCall<any>('general_codes/sales_regions?search=' + this.searchValue + '&page=' + this.showCount + '&rows=' + this.rowcount + '&order_by=updated_at&sort_by=desc').then(result => {
          this.ShowmoreData = result['sales_regions'];
          this.showTotalrecords = result.recordTotal;
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }
        });
        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'System Parameters') {
        this._service.getCall<any>('system_parameters?search=' + this.searchValue + '&page=' + this.showCount + '&rows=' + this.rowcount).then(result => {
          this.ShowmoreData = result['system_parameters'];
          this.showTotalrecords = result.recordTotal;
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }
        });
        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'Notification Logs') {
        this._service.getCall<any>('notification_logs?page=' + this.showCount + '&size=' + this.rowcount).then(result => {
          this.ShowmoreData = result['notification_logs'];
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }
        });
        this._message.showLoader(false);
      }

      if (this.gridModel.type === 'Adjustment Reasons') {
        this._service.getCall<any>('general_codes/adjustment_reasons?search=' + this.searchValue + '&page=' + this.showCount + '&rows=' + this.rowcount).then(result => {
          this.ShowmoreData = result['adjustment_reasons'];
          this.showTotalrecords = result.recordTotal;
          for (var i = 0; i < this.ShowmoreData.length; i++) {
            this.gridData = this.gridData.concat(this.ShowmoreData[i]);
          }

        });
        this._message.showLoader(false);
      }


    }
  }

  exportToCsv(exportedCol) {
    let searchParam = [];
    let filter = '';
    let params: URLSearchParams = new URLSearchParams();
    for (let col = 0; col < exportedCol.length; col++) {
      if (exportedCol[col] != false) {
        /*for(let i=0;i<this.gridModel.columnDef.length;i++){*/
        this.exportHeaderArray = this.gridModel.columnDef[col].field;
        searchParam.push("cols[]=" + `${this.exportHeaderArray}`);
        /* } */
      } else {
        continue;
      }
    }
    if (searchParam.length > 0) {
      for (let j = 0; j < this.selectedRows.length; j++) {
        this.exportRowArray = this.selectedRows[j].id;
        searchParam.push("rows[]=" + `${this.exportRowArray}`);
      }
    } else {
      this.display2 = true;
      this.display1 = true;
    }
    params.set('filter', filter.toString());
    filter = searchParam.join('&');

    if (this.gridModel.type == "Currency Definition" || this.gridModel.type == "Currency Pair") {
      if (searchParam.length > 0) {
        this.display1 = false;
        this._service.getExportCall(this.gridModel.apiDef.getApi + "/export", null).subscribe(blob => {
          //Changes for CYNCUXT-2863 begin
          this.downloadFile(blob, this.gridModel.type);
          //Changes for CYNCUXT-2863 ends
        });
      } else {
        this.display2 = true;
        this.display1 = true;
      }
    }
    else {
      if (searchParam.length > 0) {
        this.display1 = false;
        this._service.getExportCall(this.gridModel.apiDef.getApi.split('?')[0], filter).subscribe(blob => {
          //Changes for CYNCUXT-2863 begin
          this.downloadFile(blob, this.gridModel.type);
          //Changes for CYNCUXT-2863 ends
          this._message.showLoader(false);
        })
      } else {
        this.display2 = true;
        this.display1 = true;
      }
    }
  }

  //Changes for CYNCUXT-2863 begin
  downloadFile(blob: Blob, filename: string) {
    //Changes for CYNCUXT-2863 begin
    let xlsFileName = filename + '.xls';
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, xlsFileName);
    } else {
      var link = document.createElement('a');
      document.body.appendChild(link);
      link.href = window.URL.createObjectURL(blob);
      link.download = xlsFileName; //changed to xls as per Anoop's review
      link.click();
    }
    this.selectedRows = [];
  }
  //Changes for CYNCUXT-2863 ends

  clearSearchBox() {
    this.dataTableComponent.reset();
    this.searchValue = '';
    this.isCloseBox = false;
    this.isSearchBox = true;
    this.recordCount = -1;
    this.showCount = 1;
  }

  resndEmail(sendEmail) {
    //Code Changes for CYNCUXT-2811 begin
    this.addHideModalBackdropStyle();
    if (sendEmail.active == 'false' || !sendEmail.active) {
      return;
    }
    //Code Changes for CYNCUXT-2811 ends
    this.activationMail = sendEmail;
    this.resendEmail = sendEmail.user_name;
  }

  //Code Changes for CYNCUXT-2811 begin
  fnCloseActivationEmailModal() {
    this.addShowModalBackdropStyle();
    $("#activationEmailModalID").hide();
  }
  //Code Changes for CYNCUXT-2811 begin

  fnActivationEmail() {
    const sendEmailModel = {
      "user": {
        "resend_activation_email": true,
        "selected_user_role_id": this.activationMail.role
      }
    };
    this.requestModel = { url: 'admin/users/' + this.activationMail.id, model: sendEmailModel }
    this._service.patchCallRor(this.requestModel).then(res => {
      //console.log(res)
    });
    //Code Changes for CYNCUXT-2811 begin
    this.fnCloseActivationEmailModal();
    //Code Changes for CYNCUXT-2811 ends
  }

  /*Code changes for CYNCUXT-2811 begin*/

  addHideModalBackdropStyle() {
    $(".create-user-summary .input-group .form-control").css({
      "z-index": "0",
    });

    $("#app-body-container.create-user-summary").css({
      "position": "static",
    });

    $(".create-user-summary .ui-datatable-scrollable-header").css({
      "position": "static",
    });

  }

  addShowModalBackdropStyle() {
    $(".create-user-summary .input-group .form-control").css({
      "z-index": "2",
    });

    $("#app-body-container.create-user-summary").css({
      "position": "relative",
    });

    $(".create-user-summary div.ui-widget-header.ui-datatable-scrollable-header").css({
      "position": "sticky",
    });

    $("#modal_settings_overlay").css({
      "z-index": "100",
      "display": "none"
    });
  }




  showUserStatusModal(userSelected) {
    this.addHideModalBackdropStyle();
    this.userSelectedForStatusChange = userSelected;
    if (this.userSelectedForStatusChange.active || this.userSelectedForStatusChange.active == 'true') {
      this.userStatusAction = "De-Activate";
    } else {
      this.userStatusAction = "Activate";
    }
    this.statusChangeUserName = this.userSelectedForStatusChange.user_name;
  }

  fnChangeUserStatus() {
    this.closeUserStatusModal();
    $("#cync_app_dashboard").addClass("loading");
    const statusChangeModel = {
      "user": {
        "active": !this.userSelectedForStatusChange.active,
        "selected_user_role_id": this.userSelectedForStatusChange.role
      }
    };

    this.requestModel = { url: 'admin/users/' + this.userSelectedForStatusChange.id, model: statusChangeModel }
    this._service.patchCallRor(this.requestModel).then(res => {
      //Code changes done for hard-coding grid-data with new status as calling get and update api hitting performance
      //this.getData();
      this.gridData.find(x => x.id == this.userSelectedForStatusChange.id).active = !this.userSelectedForStatusChange.active;
      $("#cync_app_dashboard").removeClass("loading");
      //Performance Changes Ends
    });
  }

  closeUserStatusModal() {
    this.addShowModalBackdropStyle();
    $("#statusChangeModalId").hide();

    //this._router.navigateByUrl("userMaintenance/create-user"); 
  }
  /*Code changes for CYNCUXT-2811 ends*/

  printFilteredData(event) {//debugger;
    // console.log("::event.filteredValue----", event);
    if (event.filteredValue != undefined) {
      this.recordCount = event.filteredValue.length;
      if (this.recordCount == this.gridData.length) {
        this.recordCount = -1;
      }
    }
  }

  /**
  *
  *
  */
  formatAuditLogFieldValue(auditLogData: any, concat: boolean) {
    let allAuditData = auditLogData;
    for (let i = 0; i < allAuditData.length; i++) {
      let allFeilds = allAuditData[i].fields;
      for (let k = 0; k < allFeilds.length; k++) {
        if (allFeilds[k].old_value != null || allFeilds[k].old_value != undefined) {
          allFeilds[k].old_value = this.formatAuditLogFieldValues(allAuditData[i].program, allFeilds[k].old_value);
        }

        if (allFeilds[k].new_value != null || allFeilds[k].new_value != undefined) {
          allFeilds[k].new_value = this.formatAuditLogFieldValues(allAuditData[i].program, allFeilds[k].new_value);
        }
      }
      allAuditData[i].date_time = this.formatTimeForAuditLog(allAuditData[i].date_time);
      if (concat == true) {
        let existingGridData = this.gridData;
        this.gridData = existingGridData.concat(allAuditData[i]);
      }
    }

    /*if(concat == true){
        let existingGridData = this.gridData;
        this.gridData = existingGridData.concat(allAuditData);
     }else{
       this.gridData =  allAuditData;
     }*/
    return allAuditData;
  }

  /**
   *
   *
   */
  formatAuditLogFieldValues(program: string, value: any) {
    if (value == null || value.length == 0) return value;
    if (program === "Users") {
      if (typeof value === "string") {
        let splitedVal = value.split("at");
        if (splitedVal.length == 2) {
          return this.formatDateForNewValue(splitedVal[0].trim()) + " " + splitedVal[1].trim();
        }
      }
    }
    return value;
  }

  formatDateForNewValue(date: string) {
    if (date.indexOf('/') !== -1) {
      let splitedDate = date.split("/");
      return splitedDate[2] + "-" + splitedDate[0] + "-" + splitedDate[1];
    }
  }

  /**
  *
  */
  formatAutomatedLogFieldValue(automatedLogData: any, concat: boolean) {
    let allAutomatedLogData = automatedLogData;
    for (let i = 0; i < allAutomatedLogData.length; i++) {
      this.taskNameArray.push(allAutomatedLogData[i].task_name);
      this.taskNameArray = this.taskNameArray.filter(this.onlyUnique);
      allAutomatedLogData[i].start_time = this.formatTimeForAuditLog(allAutomatedLogData[i].start_time);
      allAutomatedLogData[i].end_time = this.formatTimeForAuditLog(allAutomatedLogData[i].end_time);
      if (concat == true) {
        let existingGridData = this.gridData;
        this.gridData = existingGridData.concat(allAutomatedLogData[i]);
      }
    }
    return allAutomatedLogData;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  OnClickCompleteTasks() {
    if (this.selectedRows.length > 0) {
      this.completeTaskRowArray = '';
      for (let j = 0; j < this.selectedRows.length; j++) {
        this.completeTaskRowArray = this.completeTaskRowArray + this.selectedRows[j].id + ',';
      }
      this.requestModel = { url: 'tickler_tasks/complete_status?completed_tasks=' + this.completeTaskRowArray, model: null }
      this._service.patchCallRor(this.requestModel).then(i => this.navigateToHomeCompleteTasks());
    }
    else {
      this._message.addSingle("Select atleast one Tickler Task to Complete ", "error");
    }
  }

  navigateToHomeCompleteTasks() {
    this._message.addSingle("Tickler Task Updated successfully", "success");
    this.unCheckAll();
    // this.reLoadRecords();
    this._message.showLoader(false);
  }

  WatchListSearch(searchData) {
    if (searchData.searchYear == undefined || searchData.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
    if (searchData.searchMonth == undefined || searchData.searchMonth == '') {
      this.isEnteredMonth = false;
    } else {
      this.isEnteredMonth = true;
    }

    if (this.isEnteredYear && this.isEnteredMonth) {
      if (searchData.searchException == undefined) {
        this.watchsearchException = '';
      } else {
        this.watchsearchException = searchData.searchException;
      }
      this._service.getCall<any>('/exception_statistics_reportings/search?exception_description='
        + this.watchsearchException + '&month=' + searchData.searchMonth + '&year=' + searchData.searchYear + '&client_total=' + this.exceptionDescList.client_total).then(result => {
          this.gridData = result['exception_statistics_reportings'];
        });
      this._message.showLoader(false);
    }
  }

  checkRequiredYear(searchData) {
    if (searchData.searchYear == undefined || searchData.searchYear == '') {
      this.isEnteredYear = false;
    } else {
      this.isEnteredYear = true;
    }
  }

  checkRequiredMonth(searchData) {
    if (searchData.searchMonth == undefined || searchData.searchMonth == '') {
      this.isEnteredMonth = false;
    } else {
      this.isEnteredMonth = true;
    }
  }

  checkRequiredColumn(searchData) {
    searchData.selectFromYear = undefined;
    searchData.selectToYear = undefined;
    this.disableSelectRange = true;
    this.disableYear = false;
    searchData.selectRange = undefined;
    this.disableToYear = false;
    searchData.selectYear = undefined;
    this.rangeSearch = undefined;
    if (searchData.reportingColumn == "Period") {
      this.columnSearch = "P";
    }
    else if (searchData.reportingColumn == "Year") {
      this.columnSearch = "Y";
    }
    else if (searchData.reportingColumn == "Quarter") {
      this.columnSearch = "Q";
    }
    else if (searchData.reportingColumn == "6 months") {
      this.columnSearch = "H";
    }
    this._service.getCall('borrowers/borrower_exceptions/populate_filters?display_type=' + this.columnSearch).then(descr => {
      this.selectRangeList = this._service.bindData(descr).select_range;
      this.selectRangeList = Object.keys(this.selectRangeList);
    });
  }

  checkRequiredRange(searchData) {
    searchData.selectFromYear = undefined;
    searchData.selectToYear = undefined;
    searchData.selectYear = undefined;
    if (searchData.selectRange == "Current Year") {
      this.rangeSearch = "C";
      this.disableToYear = false;
      this.disableYear = false;
    }
    else if (searchData.selectRange == "Year Range") {
      this.selectFromList = [];
      this.rangeSearch = "YR";
      this.disableToYear = true;
      this.disableYear = false;
      this._service.getCall('borrowers/borrower_exceptions/populate_range_filters?filter_type=' + this.rangeSearch).then(descr => {
        this.selectFromList = this._service.bindData(descr).range_filters;
      });
    }
    else if (searchData.selectRange == "Period Range") {
      this.selectFromList = [];
      this.rangeSearch = "PR";
      this.disableToYear = true;
      this.disableYear = false;
      this._service.getCall('borrowers/borrower_exceptions/populate_range_filters?filter_type=' + this.rangeSearch).then(descr => {
        this.selectFromList = this._service.bindData(descr).range_filters;
      });
    }
    else if (searchData.selectRange == "Year") {
      this.selectYearList = [];
      this.rangeSearch = "Y";
      this.disableToYear = false;
      this.disableYear = true;
      this._service.getCall('borrowers/borrower_exceptions/populate_range_filters?filter_type=' + this.rangeSearch).then(descr => {
        this.selectYearList = this._service.bindData(descr).range_filters;
      });
    }
  }

  generateExceptionReporting(searchData) {
    if (searchData.reportingException == undefined) {
      searchData.reportingException = 'nil';
    }
    if (this.disableYear && searchData.selectYear != undefined) {
      this._service.getCall<any>('borrowers/borrower_exceptions/populate_report?exception_id='
        + searchData.reportingException + '&display_type=' + this.columnSearch + '&filter_type=' + this.rangeSearch + '&from=' + searchData.selectYear).then(result => {
          this.gridData = result['exception_reporting'];
        });
      this._message.showLoader(false);
    }
    if (this.disableToYear && searchData.selectFromYear != undefined && searchData.selectToYear != undefined) {
      this._service.getCall<any>('borrowers/borrower_exceptions/populate_report?exception_id='
        + searchData.reportingException + '&display_type=' + this.columnSearch + '&filter_type=' + this.rangeSearch + '&from=' + searchData.selectFromYear + '&to=' + searchData.selectToYear).then(result => {
          this.gridData = result['exception_reporting'];
        });
      this._message.showLoader(false);
    }
    if (!this.disableToYear && !this.disableYear && this.columnSearch != undefined && this.rangeSearch != undefined) {
      this._service.getCall<any>('borrowers/borrower_exceptions/populate_report?exception_id='
        + searchData.reportingException + '&display_type=' + this.columnSearch + '&filter_type=' + this.rangeSearch).then(result => {
          this.gridData = result['exception_reporting'];
        });
      this._message.showLoader(false);
    }
    if (searchData.reportingException == 'nil') {
      searchData.reportingException = undefined;
    }

  }


  dilutionAnalysis(selectDilution) {
    sessionStorage.setItem('borrowerId', selectDilution);
    //console.log(selectDilution);
    // this.dilution_data.dilutionAnalysisData();
  }

  changeCollateralType(searchData) {
    if (searchData.selectCollateralType == undefined) {
      this.searchCollateral = '';
    } else {
      this.searchCollateral = searchData.selectCollateralType;
    }
    this._service.getCall<any>('borrowers/' + sessionStorage.getItem('borrowerId') + '/inventory_reserves?search=' + this.searchCollateral).then(result => {
      this.gridData = result['inventory_retains'];
    });
    this._message.showLoader(false);
  }


  setCollateralType() {
    this.gridData = [];
    this.searchCollateral = '';
    this._service.getCall<any>('borrowers/' + sessionStorage.getItem('borrowerId') + '/inventory_reserves?search=' + this.searchCollateral).then(result => {
      this.gridData = result['inventory_retains'];
      console.log(this.gridData);
    });
    //  this._message.showLoader(false);
  }

  fillprogramList(apiResponse: any) {
    let customObj: any;
    for (let obj of apiResponse) {
      for (let key in obj) {
        // console.log("      key:", key, "value:", obj[key]);
        customObj = {
          'key': key,
          'value': obj[key]
        }
      }
      this.customKeyArr.push(customObj);
    }

  }

  /**
  *In Notification Logs for Created Date column search:
  *On change of Date, filter the columns 
  */
  filterColumnOnDateChange($event, dt, col) {
    /*Converting Date to String and passing the string value to filter() method*/
    let inputDate: Date = $event;
    let tempDate: any = inputDate.getDate();
    let tempMonth: any = inputDate.getMonth() + 1;
    let year: any = inputDate.getFullYear();
    let date: string;
    let month: string;
    let inputDateInString: string;
    if (tempDate < 10) {
      date = "0" + tempDate;
      /*console.log("date -----",date);*/
    }
    if (tempMonth < 10) {
      month = "0" + tempMonth;
      /*console.log("month -----",month);*/
    }
    if (tempDate < 10) {
      inputDateInString = tempMonth + "/" + date + "/" + year;
      /*console.log("1...inputDateInString -----",inputDateInString);*/
      dt.filter(inputDateInString, col.field, col.filterMatchMode);

    } else if (tempMonth < 10) {
      inputDateInString = month + "/" + tempDate + "/" + year;
      /*console.log("2...inputDateInString -----",inputDateInString);*/
      dt.filter(inputDateInString, col.field, col.filterMatchMode);
    }
    else {
      inputDateInString = tempMonth + "/" + tempDate + "/" + year;
      /*console.log("3...inputDateInString -----",inputDateInString);*/
      dt.filter(inputDateInString, col.field, col.filterMatchMode);
    }


  }

  /**
   *  method to validate audit log advance search request object
   * @param searchData 
   */
  public validatAuditLogAdvanceSearchRequest(searchData): boolean {
    if (searchData.searchFrmDate == null || searchData.searchFrmDate == '' || searchData.searchFrmDate.length == 0) {
      this._helper.openAlertPoup('Information', 'please select from date !');
      return false;
    }
    if (searchData.searchToDate == null || searchData.searchToDate == '' || searchData.searchToDate.length == 0) {
      this._helper.openAlertPoup('Information', 'please select to date !');
      return false;
    }
    if (searchData.searchFrmDate != null && (searchData.searchToDate == null || searchData.searchToDate == '')) {
      this._helper.openAlertPoup('Information', 'please select to date !');
      return false;
    }
    if (searchData.searchToDate != null && (searchData.searchFrmDate == null || searchData.searchFrmDate == '')) {
      this._helper.openAlertPoup('Information', 'please select from date !');
      return false;
    }

    const fromDt = searchData.searchFrmDate
    const toDt = searchData.searchToDate
    if (fromDt.getTime() > toDt.getTime()) {
      this._helper.openAlertPoup('Information', 'From date can not be greater than To date');
      return false;
    }

    return true;
  }

  unlockUserAccount(unlockRow){
    $(".create-user-summary .input-group .form-control").css({
      "z-index": "0",
    });

    $("#app-body-container.create-user-summary").css({
      "position": "static",
    });

    $(".create-user-summary .ui-datatable-scrollable-header").css({
      "position": "static",
    });
    $("#unlockAccountEmailModalID").show();
    this.unlockMail = unlockRow;
  }

  CloseUnlockEmailPopup(){
    this.addShowModalBackdropStyle();
    $("#activationEmailModalID").hide();
    $("#unlockAccountEmailModalID").hide();
  }

  sendUnlockEmail(){
    this._service.getCall('/users/'+this.unlockMail.id+'/unlock_user').then(i => {
    });
    this._message.showLoader(false);
    this.CloseUnlockEmailPopup();
  }
}