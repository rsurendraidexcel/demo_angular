import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '../../../app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';



@Component({
  selector: 'app-bank-account-details-new',
  templateUrl: './bank-account-details-new.component.html',
  styleUrls: ['./bank-account-details-new.component.css']
})
export class BankAccountDetailsNewComponent implements OnInit {

  bankAccoutdetails: any;
  bankAccoutdetailsForm: FormGroup;
  lenderId: number;
  countryListInfo: any;
  stateListInfo: any;
  isVisibleAddButton: boolean = false;
  isVisibleEditButton: boolean = true;
  recordUpdateID: number;
  tempBankAccountDetails: any[] = [];
  tempBankAccId: number;
  isBankNameValid: boolean = true;
  isBankAccountNameValid: boolean = true;
  isBankAccountNoValid: boolean = true;
  isBankRoutingValid: boolean = true;
  isBankAddressLine1Valid: boolean = true;
  //isBankAddressLine2Valid: boolean = true;
  /*isBankCountryValid: boolean = true;
  isStateValid: boolean = true;
  isCityValid: boolean = true;*/
  bankDetailsPermArr: any[] = [];
  isEditIconEnabled: boolean = true;
  isDeleteIconEnabled: boolean = true;
  selectCountry: string = "";
  selectState: string = "";
  bankDetailsHearder: string = "";
  hideBankDetails: string = "";
  cancelButtonHeader: string = "";
  disableNumber: number;
  assetsPath = CyncConstants.getAssetsPath();

  constructor(private rolesPermComp: CheckPermissionsService,
    private _services: CustomHttpService,
    private gridComp: GridComponent,
    private messageservives: MessageServices,
    private activatedroute: ActivatedRoute,
    private config: AppConfig,
    private location: Location,
    private route: Router,
    private fb: FormBuilder) {
    /*Based on the User Role Permissions Enable or Disable the EditIcon */
    let userRole = localStorage.getItem('cyncUserRole');
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      // setTimeout(() => {
        this.bankDetailsPermArr = JSON.parse(localStorage.getItem("bankDetailsPermissionsArray"))
        this.isEditIconEnabled = this.rolesPermComp.checkPermissions(this.bankDetailsPermArr, "update");
        this.isDeleteIconEnabled = this.rolesPermComp.checkPermissions(this.bankDetailsPermArr, "destroy");
        // console.log(this.bankDetailsPermArr, this.isEditIconEnabled, this.isDeleteIconEnabled)
      // }, 600);
    }
    this.lenderId = config.getConfig('lenderId');
    this.bankAccoutdetailsForm = this.fb.group({
      'bankName': new FormControl('', Validators.compose([Validators.required])),
      'bankaccountName': new FormControl('', Validators.compose([Validators.required])),
      'bankaccountNo': new FormControl('', Validators.compose([Validators.required])),
      'bankRouting': new FormControl('', Validators.compose([Validators.required])),
      'bankAddressLine1': new FormControl('', Validators.compose([Validators.required])),
      'bankAddressLine2': new FormControl(''),
      'bankCountry': new FormControl(''),
      'bankState': new FormControl(''),
      'bankCity': new FormControl(''),
      'bank_zip_code': new FormControl(''),
      'bank_fax_no': new FormControl('')
    });
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._services.setHeight();
    this.getCountry();
    this.getBankDetails();
  }

  getCountry() {
    this._services.getCall("general_codes/countries/all_countries").then(i => {
      this.countryListInfo = this._services.bindData(i);
    });
  }

  getBankDetails(): void {
    this.cancelButtonHeader = "Reset";
    this.messageservives.showLoader(true);
    this.bankAccoutdetailsForm.controls['bankState'].disable();
    this.bankDetailsHearder = "Bank Details";
    this._services.getCall("/bank_details").then(i => {
      this.bankAccoutdetails = this._services.bindData(i).bank_details;

      this.selectState = "";
      this.selectCountry = "";
      if (this.bankAccoutdetails.length > 0) {
        this.hideBankDetails = "hide";
      } else {
        this.hideBankDetails = "";
      }
    }, (status) => {
      /*console.log("::---Error---::"+status);  */
    });
  }

  search(nameKey: string, myArray: any) {
    //console.log(">>>>>>>>>",myArray.country_id);
    this.getStateList(myArray.country_id);
  }

  bankAccoutdetailsSubmit(): void {
    if (this.bankAccoutdetailsForm.valid) {
      const addAccoudDetailsbody = {
        "bank_detail": {
          "bank_name": this.bankAccoutdetailsForm.controls["bankName"].value,
          "bank_account_name": this.bankAccoutdetailsForm.controls["bankaccountName"].value,
          "bank_account_no": this.bankAccoutdetailsForm.controls["bankaccountNo"].value,
          "bank_routing": this.bankAccoutdetailsForm.controls["bankRouting"].value,
          "bank_address": this.bankAccoutdetailsForm.controls["bankAddressLine1"].value,
          "address_line_1": this.bankAccoutdetailsForm.controls["bankAddressLine2"].value,
          "country_id": this.bankAccoutdetailsForm.controls["bankCountry"].value,
          "city": this.bankAccoutdetailsForm.controls["bankCity"].value,
          "state_province_id": this.bankAccoutdetailsForm.controls["bankState"].value,
          "zip_code": this.bankAccoutdetailsForm.controls["bank_zip_code"].value,
          "fax_no": this.bankAccoutdetailsForm.controls["bank_fax_no"].value
        }
      }
      const addAccountDetailsModel = { url: '/bank_details', model: addAccoudDetailsbody };
      this._services.postCallpatch(addAccountDetailsModel).then(i => {
        // this.messageservives.addSingle("Record has been created!", "success");
        this.getBankDetails();
        //this.bankAccoutdetailsForm.reset();
      });
    }
  }

  addTempBankDetails() {
    if (this.bankAccoutdetailsForm.valid) {

      let id = 1;
      if (this.tempBankAccountDetails.length > 0) {
        id = this.tempBankAccountDetails.length + 1;
      }
      if (this.bankAccoutdetailsForm.controls["bankAddressLine2"].value == '') {
        this.bankAccoutdetailsForm.controls["bankAddressLine2"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bank_zip_code"].value == '') {
        this.bankAccoutdetailsForm.controls["bank_zip_code"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bankCity"].value == '') {
        this.bankAccoutdetailsForm.controls["bankCity"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bank_fax_no"].value == '') {
        this.bankAccoutdetailsForm.controls["bank_fax_no"].setValue(null);
      }
      let tempObj = {
        "bank_detail": {
          "bank_name": this.bankAccoutdetailsForm.controls["bankName"].value,
          "bank_account_name": this.bankAccoutdetailsForm.controls["bankaccountName"].value,
          "bank_account_no": this.bankAccoutdetailsForm.controls["bankaccountNo"].value,
          "bank_routing": this.bankAccoutdetailsForm.controls["bankRouting"].value,
          "bank_address": this.bankAccoutdetailsForm.controls["bankAddressLine1"].value,
          "address_line_1": this.bankAccoutdetailsForm.controls["bankAddressLine2"].value,
          "country_id": this.bankAccoutdetailsForm.controls["bankCountry"].value,
          "city": this.bankAccoutdetailsForm.controls["bankCity"].value,
          "state_province_id": this.bankAccoutdetailsForm.controls["bankState"].value,
          "zip_code": this.bankAccoutdetailsForm.controls["bank_zip_code"].value,
          "fax_no": this.bankAccoutdetailsForm.controls["bank_fax_no"].value
        },
        "id": id
      };
      this.tempBankAccountDetails.push(tempObj);
      /*console.log(">>>this.tempBankAccountDetails----",this.tempBankAccountDetails);*/
      this.bankAccoutdetailsForm.reset();
    } else {
      this.checkIsBankNameValid();
      this.checkIsBankAccountNameValid();
      this.checkIsBankAccountNoValid();
      this.checkIsBankRoutingValid();
      this.checkIsAddressLine1Valid();
      // this.checkIsAddressLine2Valid();
      /* this.checkIsCountryValid();
       this.checkIsStateValid();
       this.checkIsCityValid();*/
    }
  }

  saveAllBankDetails() {
    let count = 0;
    if (this.tempBankAccountDetails.length > 0) {
      for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
        count++;
        /*console.log(">>>>count------",count);*/
        const bankDetailsModel = {
          "bank_detail": this.tempBankAccountDetails[i].bank_detail
        }
        /*console.log(">>>>bankDetailsModel------",bankDetailsModel);*/
        let requestModel = { url: '/bank_details', model: bankDetailsModel };
        this._services.postCallpatch(requestModel);
        if (count == this.tempBankAccountDetails.length) {
          //console.log("aaaaaaaaaaaaaa",count,this.tempBankAccountDetails.length)
          this.messageservives.addSingle("Record Added Successfully.", "success");
          setTimeout(() => {
            this.getBankDetails();
          }, 300);
          this.bankAccoutdetailsForm.reset();
          this.tempBankAccountDetails = [];
        }
      }
    }
  }

  editBankAccout(selectID: number, i: number): void {
    this.isBankNameValid = true;
    this.isBankAccountNameValid = true;
    this.isBankAccountNoValid = true;
    this.isBankRoutingValid = true;
    this.isBankAddressLine1Valid = true;
    //this.isBankAddressLine2Valid = true;
    //console.log(i);
    this.disableNumber = i;
    this.cancelButtonHeader = "Cancel";
    this.bankDetailsHearder = "Bank Details - Edit";
    document.getElementById('main_contents').scrollTop = 0;
    this.recordUpdateID = selectID;
    let editObject: any = this.getFilterArrayByID(this.bankAccoutdetails, selectID);
    // console.log(editObject['state_province_id']);
    this.bankAccoutdetailsForm.controls['bankName'].setValue(editObject['bank_name']);
    this.bankAccoutdetailsForm.controls['bankaccountName'].setValue(editObject['bank_account_name']);
    this.bankAccoutdetailsForm.controls['bankaccountNo'].setValue(editObject['bank_account_no']);
    this.bankAccoutdetailsForm.controls['bankRouting'].setValue(editObject['bank_routing']);
    this.bankAccoutdetailsForm.controls['bankAddressLine1'].setValue(editObject['bank_address']);
    this.bankAccoutdetailsForm.controls['bankAddressLine2'].setValue(editObject['address_line_1']);
    if (editObject.country_id == null) {
      this.bankAccoutdetailsForm.controls['bankCountry'].setValue(this.selectCountry);
    } else {
      this.bankAccoutdetailsForm.controls['bankCountry'].setValue(editObject['country_id']);
    }
    if (editObject.country_id == null) {
      this.bankAccoutdetailsForm.controls['bankState'].setValue(this.selectState);
    } else {
      this.bankAccoutdetailsForm.controls['bankState'].setValue(editObject['state_province_id']);
    }
    if (editObject.state_province_id == null) {
      this.bankAccoutdetailsForm.controls['bankState'].setValue("");
    }
    else {
      this.bankAccoutdetailsForm.controls['bankState'].setValue(editObject['state_province_id']);
    }
    this.bankAccoutdetailsForm.controls['bankCity'].setValue(editObject['city']);
    this.bankAccoutdetailsForm.controls['bank_zip_code'].setValue(editObject['zip_code']);
    this.bankAccoutdetailsForm.controls['bank_fax_no'].setValue(editObject['fax_no']);
    this.isVisibleAddButton = true;
    this.isVisibleEditButton = false;
  }

  getFilterArrayByID(arrayObj: any, id: number) {
    return arrayObj.find(x => x.id === id);
  }

  maskRoutingNumber(routNumber: string) {
    var mainStr = routNumber,
      vis = mainStr.slice(-4),
      countNum = '';
    for (var i = (mainStr.length) - 4; i > 0; i--) {
      countNum += '*';
    }
    return (countNum + vis);
  }

delateBankAccout(id:string,bankName:string):void{
    /*this.isVisibleAddButton=false;
    this.isVisibleEditButton=true;*/
     this.gridComp.deleteBank(id, bankName, "/bank_details?id=");
     document.getElementById('modal_action_yes').addEventListener('click',()=>{
      setTimeout (() => {
        this.bankAccoutdetailsForm.reset();
        this.disableNumber = null;
        this.getBankDetails();
      }, 300);
    });

    //this.route.navigateByUrl('/lenderDetails/bank-account-details');

    /*
    const delatedurl= {url: '/bank_details?id='+selectID };
    this._services.deleteCall(delatedurl).then(i => {
                     this._services.bindData(i);
                     this.messageservives.addSingle("Record has been Delated", "success");
                     this.route.navigateByUrl('/lenderDetails/bank-account-details');
                     this.getBankDetails();
                   },(status)=> { 
                     console.log("::----Error---::"+status);  
                   });
    console.info("Selected ID",selectID);
    */

  }

  bankAccoutdetailsUpdate(): void {
    if (this.bankAccoutdetailsForm.valid) {
      if (this.bankAccoutdetailsForm.controls["bankAddressLine2"].value == '') {
        this.bankAccoutdetailsForm.controls["bankAddressLine2"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bank_zip_code"].value == '') {
        this.bankAccoutdetailsForm.controls["bank_zip_code"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bankCity"].value == '') {
        this.bankAccoutdetailsForm.controls["bankCity"].setValue(null);
      }
      if (this.bankAccoutdetailsForm.controls["bank_fax_no"].value == '') {
        this.bankAccoutdetailsForm.controls["bank_fax_no"].setValue(null);
      }
      /*console.log(">>>>>this.recordUpdateID---------------",this.recordUpdateID);*/
      if (this.recordUpdateID != undefined) {
        //debugger

        const editbankAccout = {
          "id": this.recordUpdateID,
          "bank_detail": {
            "bank_name": this.bankAccoutdetailsForm.controls["bankName"].value,
            "bank_account_name": this.bankAccoutdetailsForm.controls["bankaccountName"].value,
            "bank_account_no": this.bankAccoutdetailsForm.controls["bankaccountNo"].value,
            "bank_routing": this.bankAccoutdetailsForm.controls["bankRouting"].value,
            "bank_address": this.bankAccoutdetailsForm.controls["bankAddressLine1"].value,
            "address_line_1": this.bankAccoutdetailsForm.controls["bankAddressLine2"].value,
            "country_id": this.bankAccoutdetailsForm.controls["bankCountry"].value,
            "city": this.bankAccoutdetailsForm.controls["bankCity"].value,
            "state_province_id": this.bankAccoutdetailsForm.controls["bankState"].value,
            "zip_code": this.bankAccoutdetailsForm.controls["bank_zip_code"].value,
            "fax_no": this.bankAccoutdetailsForm.controls["bank_fax_no"].value
          }
        }
        const addAccountDetailsModel = { url: '/bank_details', model: editbankAccout };
        this._services.patchCallRor(addAccountDetailsModel).then(i => {
          if (i != undefined) {
            //this.route.navigateByUrl('/lenderDetails/bank-account-details');
            this.bankAccoutdetailsForm.reset();
            this.messageservives.addSingle("Record Updated successfully.", "success");
            this.isVisibleEditButton = true;
            this.isVisibleAddButton = false;
            this.disableNumber = null;
            /*this.selectState = "";
            this.selectCountry = "";*/
            this.getBankDetails();
          }
        });
      } else {
        /*console.log(":::this.tempBankAccId---------",this.tempBankAccId);*/
        for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
          if (this.tempBankAccountDetails[i].id == this.tempBankAccId) {
            this.tempBankAccountDetails[i].bank_detail["bank_name"] = this.bankAccoutdetailsForm.controls["bankName"].value;
            this.tempBankAccountDetails[i].bank_detail["bank_account_name"] = this.bankAccoutdetailsForm.controls["bankaccountName"].value;
            this.tempBankAccountDetails[i].bank_detail["bank_account_no"] = this.bankAccoutdetailsForm.controls["bankaccountNo"].value;
            this.tempBankAccountDetails[i].bank_detail["bank_routing"] = this.bankAccoutdetailsForm.controls["bankRouting"].value;
            this.tempBankAccountDetails[i].bank_detail["bank_address"] = this.bankAccoutdetailsForm.controls["bankAddressLine1"].value;
            this.tempBankAccountDetails[i].bank_detail["address_line_1"] = this.bankAccoutdetailsForm.controls["bankAddressLine2"].value;
            this.tempBankAccountDetails[i].bank_detail["country_id"] = this.bankAccoutdetailsForm.controls["bankCountry"].value;
            this.tempBankAccountDetails[i].bank_detail["city"] = this.bankAccoutdetailsForm.controls["bankCity"].value;
            this.tempBankAccountDetails[i].bank_detail["state_province_id"] = this.bankAccoutdetailsForm.controls["bankState"].value;
            this.tempBankAccountDetails[i].bank_detail["zip_code"] = this.bankAccoutdetailsForm.controls["bank_zip_code"].value;
            this.tempBankAccountDetails[i].bank_detail["fax_no"] = this.bankAccoutdetailsForm.controls["bank_fax_no"].value;
          }
        }
        this.bankAccoutdetailsForm.reset();
        this.isVisibleEditButton = true;
        this.isVisibleAddButton = false;

      }
    } else {
      this.checkIsBankNameValid();
      this.checkIsBankAccountNameValid();
      this.checkIsBankAccountNoValid();
      this.checkIsBankRoutingValid();
      this.checkIsAddressLine1Valid();
      // this.checkIsAddressLine2Valid();
      /*this.checkIsCountryValid();
      this.checkIsStateValid();
      this.checkIsCityValid();*/
    }
  }

  concelAction(): void {
    this.disableNumber = null;
    this.bankAccoutdetailsForm.reset();
    this.isVisibleAddButton = false;
    this.isVisibleEditButton = true;
    this.isBankNameValid = true;
    this.isBankAccountNameValid = true;
    this.isBankAccountNoValid = true;
    this.isBankRoutingValid = true;
    this.isBankAddressLine1Valid = true;
    //this.isBankAddressLine2Valid = true;
    /*this.selectCountry = "";
    this.selectState = "";*/
    // this.bankDetailsHearder = "Bank Details";
    this.getBankDetails();
    /* this.isBankCountryValid = true;
     this.isStateValid = true;
     this.isCityValid = true;*/
  }

  deleteTempBankDetail(bankDtsObj: any) {
    //console.log(">>>BEFORE this.tempBankAccountDetails----",this.tempBankAccountDetails);
    for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
      if (this.tempBankAccountDetails[i] === bankDtsObj) {
        this.tempBankAccountDetails.splice(i, 1);
        break;
      }
    }
    /*console.log(">>>AFTER this.tempBankAccountDetails----",this.tempBankAccountDetails);*/
  }

  findObjectFromArray(obj: any) {
    return this.tempBankAccountDetails.find(x => x === obj);
  }

  editTempBankDetails(bankDtsObj: any) {
    let editObject: any[] = this.findObjectFromArray(bankDtsObj);
    this.tempBankAccId = editObject['id'];
    this.bankAccoutdetailsForm.controls['bankName'].setValue(editObject['bank_detail'].bank_name);
    this.bankAccoutdetailsForm.controls['bankaccountName'].setValue(editObject['bank_detail'].bank_account_name);
    this.bankAccoutdetailsForm.controls['bankaccountNo'].setValue(editObject['bank_detail'].bank_account_no);
    this.bankAccoutdetailsForm.controls['bankRouting'].setValue(editObject['bank_detail'].bank_routing);
    this.bankAccoutdetailsForm.controls['bankAddress'].setValue(editObject['bank_detail'].bank_address);
    this.isVisibleAddButton = true;
    this.isVisibleEditButton = false;
  }

  onChangeCountry(selected: any) {
    this.stateListInfo = [];

    this.bankAccoutdetailsForm.controls["bankState"].setValue("");
    //this.bankAccoutdetailsForm.controls['bankState'].setValue('');
    this.getStateList(selected);


  }

  getStateList(countryId: any) {
    this.messageservives.showLoader(true);
    this._services.getCall("general_codes/state_provinces/state_provinces_list?country_id=" + countryId).then(i => {
      this.stateListInfo = this._services.bindData(i);
      if (this.stateListInfo.length > 0) {
        this.bankAccoutdetailsForm.get('bankState').enable();
      }
      else {
        this.bankAccoutdetailsForm.get('bankState').disable();
        this.bankAccoutdetailsForm.controls["bankState"].setValue("");
      }
      if (this.stateListInfo.length > 0) {
        this.messageservives.showLoader(false);
      }
    });
  }

  checkIsBankNameValid() {
    let bankName = this.bankAccoutdetailsForm.controls['bankName'].value;
    if (bankName == null || bankName == undefined || bankName == '') {
      this.isBankNameValid = false;
    } else {
      this.isBankNameValid = true;
    }

  }

  checkIsBankAccountNameValid() {
    let bankaccountName = this.bankAccoutdetailsForm.controls['bankaccountName'].value;
    if (bankaccountName == null || bankaccountName == undefined || bankaccountName == '') {
      this.isBankAccountNameValid = false;
    } else {
      this.isBankAccountNameValid = true;
    }

  }

  checkIsBankAccountNoValid() {
    let bankaccountNo = this.bankAccoutdetailsForm.controls['bankaccountNo'].value;
    if (bankaccountNo == null || bankaccountNo == undefined || bankaccountNo == '') {
      this.isBankAccountNoValid = false;
    } else {
      this.isBankAccountNoValid = true;
    }

  }

  checkIsBankRoutingValid() {
    let bankRouting = this.bankAccoutdetailsForm.controls['bankRouting'].value;
    if (bankRouting == null || bankRouting == undefined || bankRouting == '') {
      this.isBankRoutingValid = false;
    } else {
      this.isBankRoutingValid = true;
    }

  }

  checkIsAddressLine1Valid() {
    let bankAddress = this.bankAccoutdetailsForm.controls['bankAddressLine1'].value;
    if (bankAddress == null || bankAddress == undefined || bankAddress == '') {
      this.isBankAddressLine1Valid = false;
    } else {
      this.isBankAddressLine1Valid = true;
    }

  }

  /*checkIsAddressLine2Valid(){
      let bankAddress = this.bankAccoutdetailsForm.controls['bankAddressLine2'].value;
      if( bankAddress == null || bankAddress == undefined || bankAddress ==''){
        this.isBankAddressLine2Valid = false;
      }else{
        this.isBankAddressLine2Valid = true;
      }
  
    }*/

  /*checkIsCountryValid(){
    let bankAddress = this.bankAccoutdetailsForm.controls['bankCountry'].value;
    if( bankAddress == null || bankAddress == undefined || bankAddress ==''){
      this.isBankCountryValid = false;
    }else{
      this.isBankCountryValid = true;
    }

  }*/

  /*checkIsStateValid(){
    let bankAddress = this.bankAccoutdetailsForm.controls['bankState'].value;
    if( bankAddress == null || bankAddress == undefined || bankAddress ==''){
      this.isStateValid = false;
    }else{
      this.isStateValid = true;
    }

  }*/

  /*checkIsCityValid(){
    let bankAddress = this.bankAccoutdetailsForm.controls['bankCity'].value;
    if( bankAddress == null || bankAddress == undefined || bankAddress ==''){
      this.isCityValid = false;
    }else{
      this.isCityValid = true;
    }

  }*/
}
