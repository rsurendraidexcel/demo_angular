import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { CyncHttpService } from '../../../../app-common/services/custom.http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { navbarComponent } from '../../../navbar/navbar.component';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';
import { AffilatedLenderList, AffiliatedLender } from './affiliatedLender.model';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { HttpResponse } from '@angular/common/http';
import { Helper } from '@cyncCommon/utils/helper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basic-details-edit',
  templateUrl: './basic-details-edit.component.html'
})
export class BasicDetailsEditComponent implements OnInit {

  basicDetailsEditInfo: any;
  countryListInfo: any;
  affiliatedLender: any;
  affiliatedLenderList: Array<AffilatedLenderList>; 
  affiliatedLenderForm: FormGroup;
  stateListInfo: any[];
  selectedState: any;
  isDisable: boolean = true;
  accessLimitationsEdit: any;
  basicDetailsEditInfoForm: FormGroup;
  accessLimitationsForm: FormGroup;
  imgLogoPath: any;
  reqFileAttachmentSize: any;
  factoringIsAccrued: boolean = false;
  requestModel: any;
  requestModel1: any;
  formatted_time: any;
  displayDomain: any;
  displayLinkProtocols: any;
  basicDetailsPermArr: any[] = [];
  isEditIconEnabled: boolean = true;
  updateEnabled: boolean = true;
  isaddIconEnabled: boolean = true;
  monStartTime: string;
  tueStartTime: string;
  wedStartTime: string;
  thurStartTime: string;
  friStartTime: string;
  satStartTime: string;
  sunStartTime: string;
  monEndTime: string;
  tueEndTime: string;
  wedEndTime: string;
  thurEndTime: string;
  friEndTime: string;
  satEndTime: string;
  sunEndTime: string;
  isLenderNameValid: boolean = true;
  isDelateIconEnabled: boolean = true;
  lenderBasic: boolean = false;
  affilited_lender: boolean = false;
  navigationLender: boolean = false;
  affiliatedElement: any;
  subNavigation: boolean = false;
  actionButtonSubmitEdit: boolean = false;
  imgLogoPathAffiliteLender: any;

  constructor(private route: Router,
    private _location: Location,
    private _message: MessageServices,
    private activeRoute: ActivatedRoute,
    private _services: CustomHttpService,
    private _apiMsgService: APIMessagesService,
    private _cyncHttpService: CyncHttpService,
    private navbar: navbarComponent,
    private fb: FormBuilder,
    private _helper: Helper,
    private rolesPermComp: CheckPermissionsService) {

    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      // setTimeout(() => {
        this.basicDetailsPermArr = JSON.parse(localStorage.getItem("basicDetailsPermissionsArray"));
        this.updateEnabled = this.rolesPermComp.checkPermissions(this.basicDetailsPermArr, "update");
        if(this.updateEnabled === true){
          this.isEditIconEnabled = true;
          this.isaddIconEnabled = true;
          this.isDelateIconEnabled = true;
        }
        else if(this.updateEnabled === false){
          this.isEditIconEnabled = false;
          this.isaddIconEnabled = false;
          this.isDelateIconEnabled = false;
        }
        
        
      // }, 1000);
      console.log("isEditIconEnabled",this.basicDetailsPermArr, this.isEditIconEnabled)
    }
    this.basicDetailsEditInfoForm = this.fb.group({
      'display_name': new FormControl('', Validators.compose([])),
      'email': new FormControl('', Validators.compose([])),
      'email_sender_name': new FormControl('', Validators.compose([])),
      'street_address': new FormControl('', Validators.compose([])),
      'other_address': new FormControl('', Validators.compose([])),
      'city': new FormControl('', Validators.compose([])),
      'currency': new FormControl('', Validators.compose([])),
      'lender_code': new FormControl('', Validators.compose([])),
      'state_province': new FormControl('', Validators.compose([])),
      'country': new FormControl('', Validators.compose([])),
      'zip_code': new FormControl('', Validators.compose([])),
      'phone_no': new FormControl('', Validators.compose([])),
      'fax_no': new FormControl('', Validators.compose([])),
      'time_zone': new FormControl('', Validators.compose([])),
      'logo_path': new FormControl('', Validators.compose([])),
      'factoring_fees_rule_is_accrued': new FormControl('', Validators.compose([])),
      'no_of_uppercase_in_passwrd': new FormControl('', Validators.compose([])),
      'no_of_lowercase_in_passwrd': new FormControl('', Validators.compose([])),
      'no_of_digit_in_passwrd': new FormControl('', Validators.compose([])),
      'no_of_special_character_for_passwrd': new FormControl('', Validators.compose([])),
      'no_of_login_attempt': new FormControl('', Validators.compose([])),
      'character_repitition_limit': new FormControl('', Validators.compose([])),
      'passwrd_minimum_length': new FormControl('', Validators.compose([])),
      'passwrd_maximum_length': new FormControl('', Validators.compose([])),
      'passwrd_expire_in': new FormControl('', Validators.compose([])),
      'password_expire_notification_days': new FormControl('', Validators.compose([])),
      'passwrd_reuse_count': new FormControl('', Validators.compose([])),
      'restricted_passwrd_words': new FormControl('', Validators.compose([])),
      'automatic_emails': new FormControl('', Validators.compose([])),
      'message_to_user': new FormControl('', Validators.compose([])),
      'no_of_days_to_deactivate': new FormControl('', Validators.compose([])),
      'no_of_days_to_delete': new FormControl('', Validators.compose([])),
      'enable_links_footer': new FormControl('', Validators.compose([])),
      'security_link': new FormControl('', Validators.compose([])),
      'privacy_link': new FormControl('', Validators.compose([])),
      'termsandconditions_link': new FormControl('', Validators.compose([])),
      'disclaimers_link': new FormControl('', Validators.compose([])),
      'disallow_repeated_letters': new FormControl('', Validators.compose([])),
      'is_delete_user': new FormControl('', Validators.compose([])),
      'is_deactivate_user': new FormControl('', Validators.compose([])),
      'multi_factor_auth': new FormControl('', Validators.compose([])),

      'mon_access_start_time': new FormControl('', Validators.compose([])),
      'mon_access_end_time': new FormControl('', Validators.compose([])),
      'tue_access_start_time': new FormControl('', Validators.compose([])),
      'tue_access_end_time': new FormControl('', Validators.compose([])),
      'wed_access_start_time': new FormControl('', Validators.compose([])),
      'wed_access_end_time': new FormControl('', Validators.compose([])),
      'thur_access_start_time': new FormControl('', Validators.compose([])),
      'thur_access_end_time': new FormControl('', Validators.compose([])),
      'fri_access_start_time': new FormControl('', Validators.compose([])),
      'fri_access_end_time': new FormControl('', Validators.compose([])),
      'sat_access_start_time': new FormControl('', Validators.compose([])),
      'sat_access_end_time': new FormControl('', Validators.compose([])),
      'sun_access_start_time': new FormControl('', Validators.compose([])),
      'sun_access_end_time': new FormControl('', Validators.compose([])),
      'limitation_status': new FormControl('', Validators.compose([]))
    });
//affiliate lender form 
    this.affiliatedLenderForm = this.fb.group({
      'name': new FormControl('', Validators.compose([])),
      'email': new FormControl('', Validators.compose([])),
      'address_1': new FormControl('', Validators.compose([])),
      'address_2': new FormControl('', Validators.compose([])),
      'currency': new FormControl('', Validators.compose([])),
      'affiliate_lender_code': new FormControl('', Validators.compose([])),
      'country': new FormControl('null', Validators.compose([])),
      'city': new FormControl('', Validators.compose([])),
      'state_province_id': new FormControl('', Validators.compose([])),
      'zip_code': new FormControl('', Validators.compose([])),
      'phone_no': new FormControl('', Validators.compose([])),
      'time_zone': new FormControl('', Validators.compose([])),
      'fax_no': new FormControl('', Validators.compose([])),
      'logo_path': new FormControl('', Validators.compose([]))
    });

  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._services.setHeight();
    this.lenderBasic = true;
    this.subNavigation = true;
     this.isDelateIconEnabled = false;
    this.actionButtonSubmitEdit = true;
    this.getLenderDetails();
    this.disableFormFields();
    this.getAllAffiliatedLenderList();
  }

  disableFormFields() {
    this.isDisable = true;
    this.basicDetailsEditInfoForm.disable();
    this.affiliatedLenderForm.disable();
  }

  enableFormFields() {
    this.basicDetailsEditInfoForm.enable();
    // Affiliate lenders
    this.affiliatedLenderForm.enable();
    this.affiliatedLenderForm.controls['currency'].disable();
    this.affiliatedLenderForm.controls['time_zone'].disable();
    if(this.basicDetailsEditInfoForm.controls.automatic_emails.value=='E'){
      this.basicDetailsEditInfoForm.controls['message_to_user'].disable();
    }
    this.isDisable = false;
    // document.getElementById('main_contents').scrollTop = 0;
    this.basicDetailsEditInfoForm.controls['time_zone'].disable();
    this.basicDetailsEditInfoForm.controls['currency'].disable();
    this.basicDetailsEditInfoForm.controls['no_of_days_to_delete'].disable();
    this.setAccessLimitationsTime();
    // Changes for CYNCUXT-3540 begin
    this.toggleFooterLink();
    // Changes for CYNCUXT-3540 ends
  }

  addAffiliateLender() {
    // Temlate Section enabel and disabled 
    this.lenderBasic = false;
    this.affilited_lender = true;
    this.subNavigation = false;
    // Button page enable and disabled
    this.isEditIconEnabled = false;
    this.isDisable = false;
    this.isDelateIconEnabled = false;

    this.enableAffiliateLender();
    this.clearAffiliateLender();
    this.imgLogoPathAffiliteLender = "";
    this.affiliatedElement = '';
    this.stateListInfo = [];
  }

  enableAffiliateLender() {
    this.affiliatedLenderForm.controls['name'].enable();
    this.affiliatedLenderForm.controls['email'].enable();
    this.affiliatedLenderForm.controls['phone_no'].enable();
    this.affiliatedLenderForm.controls['address_1'].enable();
    this.affiliatedLenderForm.controls['address_2'].enable();
    this.affiliatedLenderForm.controls['currency'].disable();
    this.affiliatedLenderForm.controls['affiliate_lender_code'].enable();
    this.affiliatedLenderForm.controls['country'].enable();
    this.affiliatedLenderForm.controls['city'].enable();
    this.affiliatedLenderForm.controls['state_province_id'].enable();
    this.affiliatedLenderForm.controls['zip_code'].enable();
    this.affiliatedLenderForm.controls['time_zone'].disable();
    this.affiliatedLenderForm.controls['fax_no'].enable();
    this.affiliatedLenderForm.controls['logo_path'].enable();
  }

  clearAffiliateLender() {
    this.affiliatedLender['name'] = '';
    this.affiliatedLenderForm.controls['name'].setValue('');

    this.affiliatedLender['email'] = '';
    this.affiliatedLenderForm.controls['email'].setValue('');

    this.affiliatedLender['affiliate_lender_code'] = '';
    this.affiliatedLenderForm.controls['affiliate_lender_code'].setValue('');

    this.affiliatedLender['phone_no'] = '';
    this.affiliatedLenderForm.controls['phone_no'].setValue('');

    this.affiliatedLender['address_1'] = '';
    this.affiliatedLenderForm.controls['address_1'].setValue('');

    this.affiliatedLender['address_2'] = '';
    this.affiliatedLenderForm.controls['address_2'].setValue('');

    this.affiliatedLender['country_id'] = 'null';
    this.affiliatedLenderForm.controls['country'].setValue('null');

    this.affiliatedLender['city'] = '';
    this.affiliatedLenderForm.controls['city'].setValue('');

    this.affiliatedLender['state_province_id'] = 'null';
    this.affiliatedLenderForm.controls['state_province_id'].setValue('null');

    this.affiliatedLender['zip_code'] = '';
    this.affiliatedLenderForm.controls['zip_code'].setValue('');

    this.affiliatedLender['fax_no'] = '';
    this.affiliatedLenderForm.controls['fax_no'].setValue('');

    this.affiliatedLender['logo_path'] = '';
    this.affiliatedLenderForm.controls['logo_path'].setValue('');

  }

  delatedAffiliateLender() {
    let vl = this.affiliatedElement;
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._cyncHttpService.delete('affiliate_lenders/' + vl).subscribe(popUpResponse => {
          this._helper.openAlertPoup('affiliated lender deleted', 'Affiliated deleted successfully');
          this.getLenderDetails();
          this.AffiliatLenderToHome('delete');
          this.affiliatedLenderForm.disable();
        });
      }
    });

  }

  submitAffiliatedLender() {
    if (!this.isEditIconEnabled) {
      if (this.affiliatedLenderForm.valid) {
        let formData: FormData = new FormData();
        formData.append('affiliate_lender[name]', this.replaceNullvaue(this.affiliatedLenderForm.controls.name.value));
        formData.append('affiliate_lender[email]', this.replaceNullvaue(this.affiliatedLenderForm.controls.email.value));
        formData.append('affiliate_lender[affiliate_lender_code]', this.replaceNullvaue(this.affiliatedLenderForm.controls.affiliate_lender_code.value));
        formData.append('affiliate_lender[phone_no]', this.replaceNullvaue(this.affiliatedLenderForm.controls.phone_no.value));
        formData.append('affiliate_lender[address_1]', this.replaceNullvaue(this.affiliatedLenderForm.controls.address_1.value));
        formData.append('affiliate_lender[address_2]', this.replaceNullvaue(this.affiliatedLenderForm.controls.address_2.value));
        formData.append('affiliate_lender[city]', this.replaceNullvaue(this.affiliatedLenderForm.controls.city.value));
        formData.append('affiliate_lender[state_province_id]', this.replaceNullvaue(this.affiliatedLenderForm.controls.state_province_id.value));
        formData.append('affiliate_lender[zip_code]', this.replaceNullvaue(this.affiliatedLenderForm.controls.zip_code.value));
        formData.append('affiliate_lender[fax_no]', this.replaceNullvaue(this.affiliatedLenderForm.controls.fax_no.value));

        if (this.imgLogoPathAffiliteLender != null && this.imgLogoPathAffiliteLender != '' && this.imgLogoPathAffiliteLender.name != undefined) {
          formData.append('affiliate_lender[logo_path]', this.imgLogoPathAffiliteLender, this.imgLogoPathAffiliteLender.name);
        } else {
          this._helper.openAlertPoup('affiliated lender logo', 'Logo Path Can Not Be Null');
          return;
        }

        this._cyncHttpService.uploadFile('affiliate_lenders', formData).catch(errorResponse => {
          if (errorResponse !== undefined && errorResponse.error != undefined && errorResponse.error.error != undefined && errorResponse.error.error.message != undefined) {
            this._apiMsgService.add(new APIMessage('danger', errorResponse.error.error.message));
          }
          return Observable.throw(errorResponse);
        }).subscribe(response => {
          if (response instanceof HttpResponse) {
            this.AffiliatLenderToHome('save');
          }
        });
      }
    } else {
      this.editAffiliatedLender();
    }

  }

  editAffiliatedLender() {
    let vl = this.affiliatedElement;
    if (this.affiliatedLenderForm.valid) {
      let formData: FormData = new FormData();
      formData.append('affiliate_lender[name]', this.replaceNullvaue(this.affiliatedLenderForm.controls.name.value));
      formData.append('affiliate_lender[email]', this.replaceNullvaue(this.affiliatedLenderForm.controls.email.value));
      formData.append('affiliate_lender[affiliate_lender_code]', this.replaceNullvaue(this.affiliatedLenderForm.controls.affiliate_lender_code.value));
      formData.append('affiliate_lender[phone_no]', this.replaceNullvaue(this.affiliatedLenderForm.controls.phone_no.value));
      formData.append('affiliate_lender[address_1]', this.replaceNullvaue(this.affiliatedLenderForm.controls.address_1.value));
      formData.append('affiliate_lender[address_2]', this.replaceNullvaue(this.affiliatedLenderForm.controls.address_2.value));
      formData.append('affiliate_lender[city]', this.replaceNullvaue(this.affiliatedLenderForm.controls.city.value));
      formData.append('affiliate_lender[state_province_id]', this.replaceNullvaue(this.affiliatedLenderForm.controls.state_province_id.value));
      formData.append('affiliate_lender[zip_code]', this.replaceNullvaue(this.affiliatedLenderForm.controls.zip_code.value));
      formData.append('affiliate_lender[fax_no]', this.replaceNullvaue(this.affiliatedLenderForm.controls.fax_no.value));
      if (this.imgLogoPathAffiliteLender.name != undefined) {
        formData.append('affiliate_lender[logo_path]', this.imgLogoPathAffiliteLender, this.imgLogoPathAffiliteLender.name);
      }
      this._cyncHttpService.uploadFileUpdate(`affiliate_lenders/${vl}`, formData).subscribe(response => {
        if (response instanceof HttpResponse) {
          this.AfterUpdate_AffiliatLender_UIstate();
        }
      }, err=>{
        this._helper.showApiMessages(err.error.message, 'warning');

      });
    }
  }

  getAllAffiliatedLenderList() {
    this._services.getCall('affiliate_lenders').then(i => {
      this.affiliatedLenderList = this._services.bindData(i).affiliate_lenders;
      if (this.affiliatedLenderList != undefined && this.affiliatedLenderList.length > 0) {
        this.getAllAffiliatedLender(this.affiliatedLenderList[this.affiliatedLenderList.length - 1].id);
      }
    });
  }

  getUpdateListAffiliateLender() {
    this._services.getCall('affiliate_lenders').then(i => {
      this.affiliatedLenderList = this._services.bindData(i).affiliate_lenders;
    });
  }

  getAllAffiliatedLender(id: any) {
    if (id != '' && id != undefined) {
      this._services.getCall('affiliate_lenders/' + id).then(i => {
        this.affiliatedLender = this._services.bindData(i).affiliate_lender;
        if (this.affiliatedLender['country_id'] != null) {
          this.getCountryList(this.affiliatedLender.country_id);
        }
        if (this.affiliatedLender['logo_path'] != null) {
          this.imgLogoPathAffiliteLender = this.affiliatedLender.logo_path;
        }
      });
    } else { this.affiliatedLender = []; }
  }

  AffiliatLenderToHome(type: string) {
    
    this.disableFormFields();
    this.getUpdateListAffiliateLender();
    this.subNavigation = true;
    if(type === 'save'){
      //this._message.cync_notify(null, null, 0);
      this._message.addSingle("Record Saved successfully.", "success");
    }
    if (this.basicDetailsEditInfo.basic_information.current_logo != undefined) {
      this.imgLogoPath = this.basicDetailsEditInfo.basic_information.current_logo;
    } else {
      this.imgLogoPath = this.basicDetailsEditInfo.basic_information.logo_path;
    }
    // Enabling the some button and naviation
    this.lenderBasic = true;
    this.affilited_lender = false;
    this.navigationLender = false;
    if(this.updateEnabled === true){
      this.isEditIconEnabled = true;
    }
    
    this.affiliatedElement = '';
    this.isDelateIconEnabled = false;
  }

  AfterUpdate_AffiliatLender_UIstate() {
    //this._message.cync_notify(null, null, 0);
    this.disableFormFields();
    this.getUpdateListAffiliateLender();
    this._message.addSingle("Record Saved successfully.", "success");
    if (this.basicDetailsEditInfo.basic_information.current_logo != undefined) {
      this.imgLogoPath = this.basicDetailsEditInfo.basic_information.current_logo;
    } else {
      this.imgLogoPath = this.basicDetailsEditInfo.basic_information.logo_path;
    }
    // Enabling after update records;
    this.lenderBasic = false;
    this.affilited_lender = true;
    this.subNavigation = false;
    this.navigationLender = false;
    if(this.updateEnabled === true){
      this.isEditIconEnabled = true;
    }
    if(this.updateEnabled === true){
    this.isDelateIconEnabled = true;
    }
  }


  onChange_affileatedLender(selectedAffiliatedLender: any) {
    if (selectedAffiliatedLender.target.value != 'null' && selectedAffiliatedLender.target.value != "" && selectedAffiliatedLender.target.value != 'select') {
      let affilitedLender_id = selectedAffiliatedLender.target.value;
      this.getAllAffiliatedLender(affilitedLender_id);
      if(this.updateEnabled === true){
      this.isDelateIconEnabled = true;
      }
      this.lenderBasic = false;
      this.affilited_lender = true;
      this.subNavigation = false;
    } else {
      this.getLenderDetails();
      this.disableFormFields();
      // Button page enable and disabled
      this.isDelateIconEnabled = false;
      this.lenderBasic = true;
      this.affilited_lender = false;
      this.subNavigation = true;
      // Button page enable and disabled
      this.isDisable = true;
    }
    if(this.updateEnabled === true){
      this.isEditIconEnabled = true;
    }     
  }

  onClick(id: string) {
    let x = document.querySelector(id);
    if (x) {
      x.scrollIntoView();
    }
  }

  getLenderDetails() {
    this._services.getCall("lender").then(i => {
      this.basicDetailsEditInfo = this._services.bindData(i).lender_details;
      this.factoringIsAccrued = this.basicDetailsEditInfo.factoring_fee_setup.factoring_fees_rule_is_accrued;
      if (this.basicDetailsEditInfo.basic_information.current_logo != undefined) {
        this.imgLogoPath = this.basicDetailsEditInfo.basic_information.current_logo;
      } else {
        this.imgLogoPath = this.basicDetailsEditInfo.basic_information.logo_path;
      }

      this.displayDomain = {
        "securityLink": this.basicDetailsEditInfo.display_links.security_link,
        "privacyLink": this.basicDetailsEditInfo.display_links.privacy_link,
        "termsConditionsLink": this.basicDetailsEditInfo.display_links.termsandconditions_link,
        "disclaimersLink": this.basicDetailsEditInfo.display_links.disclaimers_link
      }

      this.displayLinkProtocols = {
        "securityProtocol": this.getSplitString(this.displayDomain.securityLink),
        "privacyProtocol": this.getSplitString(this.displayDomain.privacyLink),
        "termsConditionsProtocol": this.getSplitString(this.displayDomain.termsConditionsLink),
        "disclaimersProtocol": this.getSplitString(this.displayDomain.disclaimersLink)
      }

      if (this.basicDetailsEditInfo.password_details.disallow_repeated_letters == true) {
        this.basicDetailsEditInfoForm.controls['character_repitition_limit'].setValue(this.basicDetailsEditInfo.password_details.character_repitition_limit);
      } else {
        this.basicDetailsEditInfoForm.controls['character_repitition_limit'].setValue('');
      }
      if (this.basicDetailsEditInfo.password_details.is_deactivate_user == true) {
        this.basicDetailsEditInfoForm.controls['no_of_days_to_deactivate'].setValue(this.basicDetailsEditInfo.password_details.no_of_days_to_deactivate);
      } else {
        this.basicDetailsEditInfoForm.controls['no_of_days_to_deactivate'].setValue('');
      }
      if (this.basicDetailsEditInfo.password_details.is_delete_user == true) {
        this.basicDetailsEditInfoForm.controls['no_of_days_to_delete'].setValue(this.basicDetailsEditInfo.password_details.no_of_days_to_delete);
      } else {
        this.basicDetailsEditInfoForm.controls['no_of_days_to_delete'].setValue('');
      }
      this._message.showLoader(true);
      this.getCountryList(this.basicDetailsEditInfo.basic_information.country);
    });
    this._services.getCall("access_limitations").then(i => {
      this.accessLimitationsEdit = this._services.bindData(i).access_limitations;
      this.setAccessLimitationsTime();
    });
    this.affiliatedElement = '';
  }

  getCountryList(countryId: string | number) {
    this._services.getCall('general_codes/countries/all_countries').then(i => {
      this.countryListInfo = this._services.bindData(i);
      for (let i = 0; i < this.countryListInfo.length; i++) {
        if (this.countryListInfo[i].id == countryId) {
          this.getSateList(this.countryListInfo[i].id);
          this._message.showLoader(false);
          break;
        }
      }
    });
  }

  getSplitString(value: string) {
    let str = '';
    if (value != null && value != undefined) {
      str = value.split("//")[0] + "//";
    }
    return str;
  }

  setAccessLimitationsTime() {
    if (this.accessLimitationsEdit != undefined && this.accessLimitationsEdit.length > 0 && this.accessLimitationsEdit[0].limitation_status) {
      this.basicDetailsEditInfoForm.controls['limitation_status'].setValue(this.accessLimitationsEdit[0].limitation_status);
      this.basicDetailsEditInfoForm.controls['mon_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].mon_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['tue_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].tue_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['wed_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].wed_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['thur_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].thur_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['fri_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].fri_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['sat_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].sat_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['sun_access_start_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].sun_access_start_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['mon_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].mon_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['tue_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].tue_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['wed_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].wed_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['thur_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].thur_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['fri_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].fri_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['sat_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].sat_access_end_time).getUTCSeconds())).getMinutes()));
      this.basicDetailsEditInfoForm.controls['sun_access_end_time'].setValue(this.timeTo12HrFormat(new Date((new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCFullYear()),
        (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCMonth()),
        (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCDate()),
        (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCHours()),
        (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCMinutes()),
        (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCSeconds())).getHours() + ":" +
        new Date((new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCFullYear()),
          (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCMonth()),
          (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCDate()),
          (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCHours()),
          (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCMinutes()),
          (new Date(this.accessLimitationsEdit[0].sun_access_end_time).getUTCSeconds())).getMinutes()));
    } else {
      this.disableAccessLimitation();
    }
  }

  valueChange(event) {
    if (this.basicDetailsEditInfoForm.controls.no_of_days_to_deactivate.value >= 0) {
      this.basicDetailsEditInfoForm.controls['no_of_days_to_delete'].enable();
    } else {
      this.basicDetailsEditInfoForm.controls['no_of_days_to_delete'].disable();
    }
  }

  replaceNullvaue(str: string): string {
    if (str === null || str === undefined) {
      str = '';
    }
    return str;
  }

  updateLenderBasicDetails() {
    if (this.basicDetailsEditInfoForm.valid) {
      let formData: FormData = new FormData();
      formData.append('lender[display_name]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.display_name.value));
      formData.append('lender[email]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.email.value));
      formData.append('lender[email_sender_name]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.email_sender_name.value));
      formData.append('lender[lender_code]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.lender_code.value));
      formData.append('lender[phone_no]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.phone_no.value));
      formData.append('lender[street_address]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.street_address.value));
      formData.append('lender[other_address]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.other_address.value));
      formData.append('lender[city]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.city.value));

      if (this.basicDetailsEditInfoForm.controls.country.value == null) {
        formData.append('lender[country]', '');
        //formData.append('lender[state_province]', " ");
      } else {
        formData.append('lender[state_province]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.state_province.value));
        formData.append('lender[country]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.country.value));
      }
      formData.append('lender[zip_code]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.zip_code.value));
      formData.append('lender[fax_no]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.fax_no.value));
      if (this.imgLogoPath != undefined && this.imgLogoPath != '' && this.imgLogoPath != null) {
        if((typeof this.imgLogoPath) == 'string'){
          formData.append('lender[logo_path]', this.imgLogoPath);
        }else{
          formData.append('lender[logo_path]', this.imgLogoPath, this.imgLogoPath.name);
        }
      }
      
      if (this.basicDetailsEditInfoForm.controls.factoring_fees_rule_is_accrued['_pristine']) {
        formData.append('lender[factoring_fees_rule_is_accrued]', this.basicDetailsEditInfo.factoring_fee_setup.factoring_fees_rule_is_accrued);
      } else {
        formData.append('lender[factoring_fees_rule_is_accrued]', this.basicDetailsEditInfoForm.controls.factoring_fees_rule_is_accrued.value);
      }
      formData.append('lender[no_of_uppercase_in_passwrd]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_uppercase_in_passwrd.value));
      formData.append('lender[no_of_lowercase_in_passwrd]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_lowercase_in_passwrd.value));
      formData.append('lender[no_of_digit_in_passwrd]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_digit_in_passwrd.value));
      formData.append('lender[no_of_special_character_for_passwrd]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_special_character_for_passwrd.value));
      formData.append('lender[no_of_login_attempt]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_login_attempt.value));
      if (this.basicDetailsEditInfoForm.controls.character_repitition_limit.value > 0) {
        formData.append('lender[disallow_repeated_letters]', 'true');
        formData.append('lender[character_repitition_limit]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.character_repitition_limit.value));
      } else {
        formData.append('lender[disallow_repeated_letters]', 'false');
        formData.append('lender[character_repitition_limit]', '');
      }
      formData.append('lender[passwrd_minimum_length]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.passwrd_minimum_length.value));
      formData.append('lender[passwrd_maximum_length]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.passwrd_maximum_length.value));
      formData.append('lender[passwrd_expire_in]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.passwrd_expire_in.value));
      formData.append('lender[password_expire_notification_days]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.password_expire_notification_days.value));

      formData.append('lender[passwrd_reuse_count]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.passwrd_reuse_count.value));
      formData.append('lender[restricted_passwrd_words]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.restricted_passwrd_words.value));
      formData.append('lender[automatic_emails]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.automatic_emails.value));
      if(this.basicDetailsEditInfoForm.controls.automatic_emails.value=="D"){
        formData.append('lender[message_to_user]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.message_to_user.value));
      }else{
        formData.append('lender[message_to_user]', '');
      }
      if (this.basicDetailsEditInfoForm.controls.no_of_days_to_deactivate.value >= 0) {
        formData.append('lender[is_deactivate_user]', 'true');
        formData.append('lender[no_of_days_to_deactivate]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_days_to_deactivate.value));
      } else {
        formData.append('lender[is_deactivate_user]', 'false');
        formData.append('lender[no_of_days_to_deactivate]', '');
      }
      if (this.basicDetailsEditInfoForm.controls.no_of_days_to_delete.value >= 0) {
        formData.append('lender[is_delete_user]', 'true');
        formData.append('lender[no_of_days_to_delete]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.no_of_days_to_delete.value));
      } else {
        formData.append('lender[is_delete_user]', 'false');
        formData.append('lender[no_of_days_to_delete]', '');
      }
      formData.append('lender[security_link]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.security_link.value));
      formData.append('lender[privacy_link]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.privacy_link.value));
      formData.append('lender[termsandconditions_link]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.termsandconditions_link.value));
      formData.append('lender[disclaimers_link]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.disclaimers_link.value));
      formData.append('lender[enable_links_footer]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.enable_links_footer.value));
      formData.append('lender[multi_factor_auth]', this.replaceNullvaue(this.basicDetailsEditInfoForm.controls.multi_factor_auth.value));
      /*if(this.basicDetailsEditInfoForm.controls['multi_factor_auth'].dirty)*/
      let basicDetailsModelForAccessLimitations;

      if (this.basicDetailsEditInfoForm.controls.mon_access_start_time.value == "00:00") {
        this.monStartTime = '';
      } else {
        this.monStartTime = this.basicDetailsEditInfoForm.controls.mon_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.tue_access_start_time.value == "00:00") {
        this.tueStartTime = '';
      } else {
        this.tueStartTime = this.basicDetailsEditInfoForm.controls.tue_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.wed_access_start_time.value == "00:00") {
        this.wedStartTime = '';
      } else {
        this.wedStartTime = this.basicDetailsEditInfoForm.controls.wed_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.thur_access_start_time.value == "00:00") {
        this.thurStartTime = '';
      } else {
        this.thurStartTime = this.basicDetailsEditInfoForm.controls.thur_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.fri_access_start_time.value == "00:00") {
        this.friStartTime = '';
      } else {
        this.friStartTime = this.basicDetailsEditInfoForm.controls.fri_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.sat_access_start_time.value == "00:00") {
        this.satStartTime = '';
      } else {
        this.satStartTime = this.basicDetailsEditInfoForm.controls.sat_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.sun_access_start_time.value == "00:00") {
        this.sunStartTime = '';
      } else {
        this.sunStartTime = this.basicDetailsEditInfoForm.controls.sun_access_start_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.mon_access_end_time.value == "00:00") {
        this.monEndTime = '';
      } else {
        this.monEndTime = this.basicDetailsEditInfoForm.controls.mon_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.tue_access_end_time.value == "00:00") {
        this.tueEndTime = '';
      } else {
        this.tueEndTime = this.basicDetailsEditInfoForm.controls.tue_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.wed_access_end_time.value == "00:00") {
        this.wedEndTime = '';
      } else {
        this.wedEndTime = this.basicDetailsEditInfoForm.controls.wed_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.thur_access_end_time.value == "00:00") {
        this.thurEndTime = '';
      } else {
        this.thurEndTime = this.basicDetailsEditInfoForm.controls.thur_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.fri_access_end_time.value == "00:00") {
        this.friEndTime = '';
      } else {
        this.friEndTime = this.basicDetailsEditInfoForm.controls.fri_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.sat_access_end_time.value == "00:00") {
        this.satEndTime = '';
      } else {
        this.satEndTime = this.basicDetailsEditInfoForm.controls.sat_access_end_time.value;
      }
      if (this.basicDetailsEditInfoForm.controls.sun_access_end_time.value == "00:00") {
        this.sunEndTime = '';
      } else {
        this.sunEndTime = this.basicDetailsEditInfoForm.controls.sun_access_end_time.value;
      }


      if (this.accessLimitationsEdit != undefined && this.accessLimitationsEdit.length > 0 && this.accessLimitationsEdit[0].limitation_status == true) {
        basicDetailsModelForAccessLimitations = {
          "access_limitation":
          {
            "limitation_status": this.basicDetailsEditInfoForm.controls.limitation_status.value,
            "mon_access_start_time": this.monStartTime,
            "tue_access_start_time": this.tueStartTime,
            "wed_access_start_time": this.wedStartTime,
            "thur_access_start_time": this.thurStartTime,
            "fri_access_start_time": this.friStartTime,
            "sat_access_start_time": this.satStartTime,
            "sun_access_start_time": this.sunStartTime,
            "mon_access_end_time": this.monEndTime,
            "tue_access_end_time": this.tueEndTime,
            "wed_access_end_time": this.wedEndTime,
            "thur_access_end_time": this.thurEndTime,
            "fri_access_end_time": this.friEndTime,
            "sat_access_end_time": this.satEndTime,
            "sun_access_end_time": this.sunEndTime
          }
        }
      } else {
        basicDetailsModelForAccessLimitations = {
          "access_limitation":
          {
            "limitation_status": this.basicDetailsEditInfoForm.controls.limitation_status.value,
            "mon_access_start_time": '',
            "tue_access_start_time": '',
            "wed_access_start_time": '',
            "thur_access_start_time": '',
            "fri_access_start_time": '',
            "sat_access_start_time": '',
            "sun_access_start_time": '',
            "mon_access_end_time": '',
            "tue_access_end_time": '',
            "wed_access_end_time": '',
            "thur_access_end_time": '',
            "fri_access_end_time": '',
            "sat_access_end_time": '',
            "sun_access_end_time": ''
          }
        }
      }

      if (this.basicDetailsEditInfoForm.valid) {
        this._message.showLoader(true);
        this.requestModel = { url: 'lender', model: formData }
        this._services.patchCallForFileUpload(this.requestModel).then(i => {
          if (i != undefined && this.accessLimitationsEdit != undefined && this.accessLimitationsEdit.length > 0) {
            this.requestModel1 = { url: 'access_limitations/' + this.accessLimitationsEdit[0].id, model: basicDetailsModelForAccessLimitations };
            this._services.patchCallRor(this.requestModel1).then(i => this.navigateToHome());
          } else {
            this.navigateToHome();
          }
        }).catch(err => {
					this._message.showLoader(false);
        });
      }
    }
  }

  //Code Changes for CYNCUXT-3540 begin

  /**
   * Added this method to disbale the 'Display Footer Links' checkbox
   */
  toggleFooterLink() {
    let toggleFooterLinkValue = (this.isLinkKeyPresent("security_link") || this.isLinkKeyPresent("privacy_link") || this.isLinkKeyPresent("termsandconditions_link") || this.isLinkKeyPresent("disclaimers_link"));

    if (!toggleFooterLinkValue) {
      if (this.basicDetailsEditInfoForm != undefined && this.basicDetailsEditInfoForm.controls.enable_links_footer != undefined)
        this.basicDetailsEditInfoForm.controls.enable_links_footer.disable();
      if (this.basicDetailsEditInfo != undefined && this.basicDetailsEditInfo.display_links != undefined)
        this.basicDetailsEditInfo.display_links.enable_links_footer = toggleFooterLinkValue;
    } else {
      this.basicDetailsEditInfoForm.controls.enable_links_footer.enable();
    }
  }

  isLinkKeyPresent(key: string): boolean {
    let length = 0;
    let flag: boolean = false;
    if (this.basicDetailsEditInfoForm != undefined && this.basicDetailsEditInfoForm.controls[key] != undefined && this.basicDetailsEditInfoForm.controls[key].value != undefined && this.basicDetailsEditInfoForm.controls[key].value != null) {
      length = this.basicDetailsEditInfoForm.controls[key].value.length;
    }

    if (length > 0) {
      flag = true;
    }
    return flag;
  }

  //Code Changes for CYNCUXT-3540 ends

  checkedAccessLimitation(event) {
    if (event) {
      this.setAccessLimitationsTime();
      this.basicDetailsEditInfoForm.controls['mon_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['tue_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['wed_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['thur_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['fri_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['sat_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['sun_access_start_time'].enable();
      this.basicDetailsEditInfoForm.controls['mon_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['tue_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['wed_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['thur_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['fri_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['sat_access_end_time'].enable();
      this.basicDetailsEditInfoForm.controls['sun_access_end_time'].enable();
    } else {
      this.disableAccessLimitation();
    }
  }

  disableAccessLimitation() {
    this.basicDetailsEditInfoForm.controls['mon_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['tue_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['wed_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['thur_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['fri_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['sat_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['sun_access_start_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['mon_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['tue_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['wed_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['thur_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['fri_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['sat_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['sun_access_end_time'].setValue("00:00");
    this.basicDetailsEditInfoForm.controls['mon_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['tue_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['wed_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['thur_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['fri_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['sat_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['sun_access_start_time'].disable();
    this.basicDetailsEditInfoForm.controls['mon_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['tue_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['wed_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['thur_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['fri_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['sat_access_end_time'].disable();
    this.basicDetailsEditInfoForm.controls['sun_access_end_time'].disable();
  }

  navigateToHome() {
    this._message.showLoader(false);
    this.navbar.getLenderInfo();
    this._message.addSingle("Record Updated successfully.", "success");
    this.getLenderDetails();
    this.disableFormFields();
    this.getUpdateListAffiliateLender();
  }


  navigateToHomeCancel() {

    //this._message.cync_notify(null, null, 0);
    this.getLenderDetails();
    this.disableFormFields();
    this.getUpdateListAffiliateLender();
    this.subNavigation = true;

    // Enabling the some button and naviation
    this.lenderBasic = true;
    this.affilited_lender = false;
    this.navigationLender = false;
    if(this.updateEnabled === true){
      this.isEditIconEnabled = true;
    }
    
    this.affiliatedElement = '';
    this.isDelateIconEnabled = false;
  }

  uploadLogo(fileInputReq: any) {
    if (fileInputReq.target.files && fileInputReq.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        $('#preview').attr('src', e.target.result);
      }
      reader.readAsDataURL(fileInputReq.target.files[0]);
      this.reqFileAttachmentSize = fileInputReq.target.files[0].size;
      this.imgLogoPath = fileInputReq.target.files[0];
      this.imgLogoPathAffiliteLender = fileInputReq.target.files[0];
    }   

  }

  timeTo12HrFormat(time) {
    var time_part_array = time.split(":");
    /*var ampm = 'AM';
    if (time_part_array[0] > 12 && time_part_array[0] <24) {
        ampm = 'PM';
    }
    if(time_part_array[0] == 12){
        ampm = 'PM';
    }
    if(time_part_array[0] == 24){
        ampm = 'AM';
    }*/
    /*if(time_part_array[0] > 12 && time_part_array[0] <24) {
        time_part_array[0] = time_part_array[0] - 12;
    }
    if(time_part_array[0] == 12){
        time_part_array[0] = time_part_array[0];
    }
    if(time_part_array[0] == 24){
        time_part_array[0] = time_part_array[0] - 24;
    }*/
    if (time_part_array[0] >= 0 && time_part_array[0] <= 9) {
      time_part_array[0] = "0" + time_part_array[0];
    }
    if (time_part_array[1] >= 0 && time_part_array[1] <= 9) {
      time_part_array[1] = "0" + time_part_array[1];
    }
    this.formatted_time = time_part_array[0] + ':' + time_part_array[1];  //+ '' + ampm

    return this.formatted_time;
  }

  onChangeCountry(selected: any) {
    this.getSateList(selected);
    this.basicDetailsEditInfoForm.controls['state_province'].setValue(null);
  }

  getSateList(countryId: any) {
    this._message.showLoader(true);
    this._services.getCall("general_codes/state_provinces/state_provinces_list?country_id=" + countryId).then(i => {
      this.stateListInfo = this._services.bindData(i);
      /* if (this.stateListInfo.length > 0){
         this.basicDetailsEditInfoForm.get('state_province').enable();
       }
       else {
        this.basicDetailsEditInfoForm.get('state_province').disable();
        }*/
      if (this.stateListInfo.length > 0) {
        this._message.showLoader(false);
      }
    });
  }

  upload_logo() {
    document.getElementById("upload").click();
  }

  checkLenderName() {
    if (this.basicDetailsEditInfoForm.controls.display_name.value == '') {
      this.isLenderNameValid = false;
    } else if (this.affiliatedLenderForm.controls.name.value == '') {
      this.isLenderNameValid = false;
    }
    else {
      this.isLenderNameValid = true;
    }
  }

  onChangeAutomaticEmails(value:string){
    if(value=="D"){
      this.basicDetailsEditInfoForm.controls['message_to_user'].enable();
    }else{
      this.basicDetailsEditInfoForm.controls['message_to_user'].disable();
    }
  }
}