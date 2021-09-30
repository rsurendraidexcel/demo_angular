import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { BasicDetailsModel } from './basic-details.model';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  basicDetailsInformation: BasicDetailsModel;
  basicDetailsID: number;
  accessLimitations: any;
  lenderInfoID = 1;
  chooseCategory: string;
  formatted_time: string;
  collapseID: number;
  countryName: string;
  stateName: string;
  basicDetailsPermArr: any[] = [];
  isEditIconEnabled: boolean = true;

  constructor(private rolesPermComp: CheckPermissionsService, private route: Router, private _services: CustomHttpService, private messageservives: MessageServices, private activatedroute: ActivatedRoute, private location: Location) {
    this.getLenderDetails();
    /*Based on the User Role Permissions Enable or Disable the EditIcon */
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      setTimeout(() => {
        this.basicDetailsPermArr = JSON.parse(localStorage.getItem("basicDetailsPermissionsArray"));
        this.isEditIconEnabled = this.rolesPermComp.checkPermissions(this.basicDetailsPermArr, "edit");
      }, 600);
    }
  }

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._services.setHeight();
  }

  getLenderDetails() {
    this._services.getCall("lender").then(i => {
      this.basicDetailsInformation = this._services.bindData(i).lender_details;
      this.basicDetailsID = this.basicDetailsInformation.basic_information.id;
      this._services.getCall("general_codes/countries/all_countries").then(i => {
        let countryListInfo: any[] = this._services.bindData(i);
        for (let i = 0; i < countryListInfo.length; i++) {
          if (countryListInfo[i].id == this.basicDetailsInformation.basic_information.country) {
            this.countryName = countryListInfo[i].name;
            this._services.getCall("general_codes/state_provinces/state_provinces_list?country_id=" + countryListInfo[i].id).then(i => {
              let stateListInfo = this._services.bindData(i);
              for (let i = 0; i < stateListInfo.length; i++) {
                if (stateListInfo[i].name == this.basicDetailsInformation.basic_information.state_province) {
                  this.stateName = stateListInfo[i].name;
                }
              }
            });
          }
        }
      });
    });
    this._services.getCall("access_limitations").then(i => {
      this.accessLimitations = this._services.bindData(i).access_limitations;
    });
  }


  goToEditLink(editSection: string, lenderid: number): void {
    let id = lenderid;
    this.chooseCategory = editSection;
    switch (this.chooseCategory) {
      case 'lenderBasicDetails': {
        this.collapseID = 1;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      case 'applicationLogo': {
        this.collapseID = 2;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);

        break;
      }
      case 'factoringSetup': {
        this.collapseID = 3;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      case 'address': {
        this.collapseID = 4;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      case 'passwordPolicy': {
        this.collapseID = 5;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      case 'displayLinks': {
        this.collapseID = 6;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      case 'loginAccessLimitation': {
        this.collapseID = 7;
        this.route.navigateByUrl('/lenderDetails/basic-details/edit/' + id + '/' + this.collapseID);
        break;
      }
      default: {

        this.messageservives.cync_notify("info", "Page is not Found", 2000);
      }
    }
  }

  formatDateToUTC(date: string): string {
    const now = new Date(date);
    const now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    return this.timeTo12HrFormat(now_utc.getHours() + ':' + now_utc.getMinutes());
  }

  timeTo12HrFormat(time) {
    const time_part_array = time.split(':');
    let ampm = 'AM';
    if (time_part_array[0] > 12 && time_part_array[0] < 24) {
      ampm = 'PM';
      time_part_array[0] = time_part_array[0] - 12;
    }
    if (time_part_array[0] == 12) {
      ampm = 'PM';
      time_part_array[0] = time_part_array[0];
    }
    if (time_part_array[0] == 0) {
      ampm = 'AM';
      time_part_array[0] = 12;
    }
    if (time_part_array[0] >= 0 && time_part_array[0] <= 9) {
      time_part_array[0] = '0' + time_part_array[0];
    }
    if (time_part_array[1] >= 0 && time_part_array[1] <= 9) {
      time_part_array[1] = '0' + time_part_array[1];
    }
    this.formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
    return this.formatted_time;
  }
}

