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
  selector: 'app-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.css']
})
export class BankAccountDetailsComponent implements OnInit {
  bankAccoutdetails: any;
  bankAccoutdetailsForm: FormGroup;
  lenderId: number;
  isVisibleAddButton = false;
  isVisibleEditButton = true;
  recordUpdateID: number;
  tempBankAccountDetails: any[] = [];
  tempBankAccId: number;
  isBankNameValid: boolean = true;
  isBankAccountNameValid: boolean = true;
  isBankAccountNoValid: boolean = true;
  isBankRoutingValid: boolean = true;
  isBankAddressValid: boolean = true;
  bankDetailsPermArr: any[] = [];
  isEditIconEnabled: boolean = true;
  isDeleteIconEnabled: boolean = true;

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
      setTimeout(() => {
        this.bankDetailsPermArr = JSON.parse(localStorage.getItem("bankDetailsPermissionsArray"))
        this.isEditIconEnabled = this.rolesPermComp.checkPermissions(this.bankDetailsPermArr, "edit");
        this.isDeleteIconEnabled = this.rolesPermComp.checkPermissions(this.bankDetailsPermArr, "destroy");
      }, 600);

    }


    this.lenderId = config.getConfig('lenderId');
    this.bankAccoutdetailsForm = this.fb.group({
      'bankName': new FormControl('', Validators.compose([Validators.required])),
      'bankaccountName': new FormControl('', Validators.compose([Validators.required])),
      'bankaccountNo': new FormControl('', Validators.compose([Validators.required])),
      'bankRouting': new FormControl('', Validators.compose([Validators.required])),
      'bankAddress': new FormControl('', Validators.compose([Validators.required]))
    });

  }
  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._services.setHeight();
    this.getBankDetails();

  }

  getBankDetails(): void {
    this.messageservives.showLoader(true);

    this._services.getCall('/bank_details').then(i => {
      this.bankAccoutdetails = this._services.bindData(i).bank_details;
    }, (status) => {
      /*console.log("::---Error---::"+status);  */
    });
  }

  bankAccoutdetailsSubmit(): void {
    if (this.bankAccoutdetailsForm.valid) {
      const addAccoudDetailsbody = {
        'bank_detail': {
          'bank_name': this.bankAccoutdetailsForm.controls['bankName'].value,
          'bank_account_name': this.bankAccoutdetailsForm.controls['bankaccountName'].value,
          'bank_account_no': this.bankAccoutdetailsForm.controls['bankaccountNo'].value,
          'bank_routing': this.bankAccoutdetailsForm.controls['bankRouting'].value,
          'bank_address': this.bankAccoutdetailsForm.controls['bankAddress'].value
        }
      };

      const addAccountDetailsModel = { url: '/bank_details', model: addAccoudDetailsbody };
      this._services.postCallpatch(addAccountDetailsModel).then(i => {
        //this.messageservives.addSingle("Record has been created!", "success");
        this.getBankDetails();
        //this.bankAccoutdetailsForm.reset();


      });
    }


  }
  bankAccoutdetailsUpdate(): void {
    if (this.bankAccoutdetailsForm.valid) {
      /*console.log(">>>>>this.recordUpdateID---------------",this.recordUpdateID);*/
      if (this.recordUpdateID != undefined) {
        const editbankAccout = {
          'id': this.recordUpdateID,
          'bank_detail': {
            'bank_name': this.bankAccoutdetailsForm.controls['bankName'].value,
            'bank_account_name': this.bankAccoutdetailsForm.controls['bankaccountName'].value,
            'bank_account_no': this.bankAccoutdetailsForm.controls['bankaccountNo'].value,
            'bank_routing': this.bankAccoutdetailsForm.controls['bankRouting'].value,
            'bank_address': this.bankAccoutdetailsForm.controls['bankAddress'].value
          }
        };

        const addAccountDetailsModel = { url: '/bank_details', model: editbankAccout };
        this._services.patchCallRor(addAccountDetailsModel).then(i => {
          if (i != undefined) {
            //this.route.navigateByUrl('/lenderDetails/bank-account-details');
            this.bankAccoutdetailsForm.reset();
            this.messageservives.addSingle("Record Updated successfully.", "success");
            this.isVisibleEditButton = true;
            this.isVisibleAddButton = false;
            this.getBankDetails();
          }


        });
      } else {
        /*console.log(":::this.tempBankAccId---------",this.tempBankAccId);*/
        for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
          if (this.tempBankAccountDetails[i].id == this.tempBankAccId) {
            this.tempBankAccountDetails[i].bank_detail['bank_name'] = this.bankAccoutdetailsForm.controls['bankName'].value;
            this.tempBankAccountDetails[i].bank_detail['bank_account_name'] = this.bankAccoutdetailsForm.controls['bankaccountName'].value;
            this.tempBankAccountDetails[i].bank_detail['bank_account_no'] = this.bankAccoutdetailsForm.controls['bankaccountNo'].value;
            this.tempBankAccountDetails[i].bank_detail['bank_routing'] = this.bankAccoutdetailsForm.controls['bankRouting'].value;
            this.tempBankAccountDetails[i].bank_detail['bank_address'] = this.bankAccoutdetailsForm.controls['bankAddress'].value;
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
      this.checkIsBankAddressValid();
    }

  }

  delateBankAccout(selectID: string): void {
    this.bankAccoutdetailsForm.reset();
    this.isVisibleAddButton = false;
    this.isVisibleEditButton = true;
    this.gridComp.deleteFromView(selectID, '/bank_details?id=');
    document.getElementById('modal_action_yes').addEventListener('click', () => {
      setTimeout(() => {
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

  editBankAccout(selectID: number): void {
    document.getElementById('main_contents').scrollTop = 0;
    this.recordUpdateID = selectID;
    const editObject: any[] = this.getFilterArrayByID(this.bankAccoutdetails, selectID);

    this.bankAccoutdetailsForm.controls['bankName'].setValue(editObject['bank_name']);
    this.bankAccoutdetailsForm.controls['bankaccountName'].setValue(editObject['bank_account_name']);
    this.bankAccoutdetailsForm.controls['bankaccountNo'].setValue(editObject['bank_account_no']);
    this.bankAccoutdetailsForm.controls['bankRouting'].setValue(editObject['bank_routing']);
    this.bankAccoutdetailsForm.controls['bankAddress'].setValue(editObject['bank_address']);
    this.isVisibleAddButton = true;
    this.isVisibleEditButton = false;
  }

  concelAction(): void {
    this.bankAccoutdetailsForm.reset();
    this.isVisibleAddButton = false;
    this.isVisibleEditButton = true;
    this.isBankNameValid = true;
    this.isBankAccountNameValid = true;
    this.isBankAccountNoValid = true;
    this.isBankRoutingValid = true;
    this.isBankAddressValid = true;
  }

  getFilterArrayByID(arrayObj: any, id: number) {
    return arrayObj.find(x => x.id === id);
  }

  addTempBankDetails() {
    if (this.bankAccoutdetailsForm.valid) {
      let id = 1;
      if (this.tempBankAccountDetails.length > 0) {
        id = this.tempBankAccountDetails.length + 1;
      }
      const tempObj = {
        'bank_detail': {
          'bank_name': this.bankAccoutdetailsForm.controls['bankName'].value,
          'bank_account_name': this.bankAccoutdetailsForm.controls['bankaccountName'].value,
          'bank_account_no': this.bankAccoutdetailsForm.controls['bankaccountNo'].value,
          'bank_routing': this.bankAccoutdetailsForm.controls['bankRouting'].value,
          'bank_address': this.bankAccoutdetailsForm.controls['bankAddress'].value
        },
        'id': id
      };
      this.tempBankAccountDetails.push(tempObj);
      /*console.log(">>>this.tempBankAccountDetails----",this.tempBankAccountDetails);*/
      this.bankAccoutdetailsForm.reset();
    } else {
      this.checkIsBankNameValid();
      this.checkIsBankAccountNameValid();
      this.checkIsBankAccountNoValid();
      this.checkIsBankRoutingValid();
      this.checkIsBankAddressValid();
    }
  }

  findObjectFromArray(obj: any) {
    return this.tempBankAccountDetails.find(x => x === obj);
  }

  editTempBankDetails(bankDtsObj: any) {
    const editObject: any[] = this.findObjectFromArray(bankDtsObj);
    /*console.log(">>>editObject---------",editObject);*/
    this.tempBankAccId = editObject['id'];
    /*console.log(">>>this.tempBankAccId---------",this.tempBankAccId);*/
    this.bankAccoutdetailsForm.controls['bankName'].setValue(editObject['bank_detail'].bank_name);
    this.bankAccoutdetailsForm.controls['bankaccountName'].setValue(editObject['bank_detail'].bank_account_name);
    this.bankAccoutdetailsForm.controls['bankaccountNo'].setValue(editObject['bank_detail'].bank_account_no);
    this.bankAccoutdetailsForm.controls['bankRouting'].setValue(editObject['bank_detail'].bank_routing);
    this.bankAccoutdetailsForm.controls['bankAddress'].setValue(editObject['bank_detail'].bank_address);
    this.isVisibleAddButton = true;
    this.isVisibleEditButton = false;
  }

  deleteTempBankDetail(bankDtsObj: any) {
    /*console.log(">>>BEFORE this.tempBankAccountDetails----",this.tempBankAccountDetails);*/
    for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
      if (this.tempBankAccountDetails[i] === bankDtsObj) {
        this.tempBankAccountDetails.splice(i, 1);
        break;
      }
    }
    /*console.log(">>>AFTER this.tempBankAccountDetails----",this.tempBankAccountDetails);*/
  }

  saveAllBankDetails() {
    let count = 0; alert("saveAllBankDetails");
    if (this.tempBankAccountDetails.length > 0) {
      for (let i = 0; i < this.tempBankAccountDetails.length; i++) {
        count++;
        /*console.log(">>>>count------",count);*/
        const bankDetailsModel = {
          'bank_detail': this.tempBankAccountDetails[i].bank_detail
        };
        /*console.log(">>>>bankDetailsModel------",bankDetailsModel);*/
        const requestModel = { url: '/bank_details', model: bankDetailsModel };
        this._services.postCallpatch(requestModel);
        if (count == this.tempBankAccountDetails.length) {
          //console.log("aaaaaaaaaaaaaa",count,this.tempBankAccountDetails.length)
          //this.messageservives.addSingle("Record Added Successfully.", "success");
          setTimeout(() => {
            this.getBankDetails();
          }, 300);
          this.bankAccoutdetailsForm.reset();
          this.tempBankAccountDetails = [];
        }
      }
    }
  }

  checkIsBankNameValid() {
    const bankName = this.bankAccoutdetailsForm.controls['bankName'].value;
    if (bankName == null || bankName == undefined || bankName == '') {
      this.isBankNameValid = false;
    } else {
      this.isBankNameValid = true;
    }

  }

  checkIsBankAccountNameValid() {
    const bankaccountName = this.bankAccoutdetailsForm.controls['bankaccountName'].value;
    if (bankaccountName == null || bankaccountName == undefined || bankaccountName == '') {
      this.isBankAccountNameValid = false;
    } else {
      this.isBankAccountNameValid = true;
    }

  }

  checkIsBankAccountNoValid() {
    const bankaccountNo = this.bankAccoutdetailsForm.controls['bankaccountNo'].value;
    if (bankaccountNo == null || bankaccountNo == undefined || bankaccountNo == '') {
      this.isBankAccountNoValid = false;
    } else {
      this.isBankAccountNoValid = true;
    }

  }

  checkIsBankRoutingValid() {
    const bankRouting = this.bankAccoutdetailsForm.controls['bankRouting'].value;
    if (bankRouting == null || bankRouting == undefined || bankRouting == '') {
      this.isBankRoutingValid = false;
    } else {
      this.isBankRoutingValid = true;
    }

  }

  checkIsBankAddressValid() {
    const bankAddress = this.bankAccoutdetailsForm.controls['bankAddress'].value;
    if (bankAddress == null || bankAddress == undefined || bankAddress == '') {
      this.isBankAddressValid = false;
    } else {
      this.isBankAddressValid = true;
    }

  }


}
