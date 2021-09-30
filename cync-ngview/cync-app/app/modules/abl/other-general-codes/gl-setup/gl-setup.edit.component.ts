import { Component, OnInit } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { Router } from "@angular/router";
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'gl-setup-edit-comp',
  templateUrl: './gl-setup.edit.component.html'
})
export class AblGlSetupEditComponent {

  lenderId: string;
  setUpEditId: any;
  isDisable: boolean = false;
  setUpEditDtls: any;
  currentAction: string;
  EditAblSetup: FormGroup;
  requestModel: any;

  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.EditAblSetup = this.fb.group({
      charge_code: new FormControl('', Validators.compose([])),
      gl_account_no_debit: new FormControl('', Validators.compose([])),
      gl_account_name_debit: new FormControl('', Validators.compose([])),
      gl_account_no_credit: new FormControl('', Validators.compose([])),
      gl_account_name_credit: new FormControl('', Validators.compose([]))
    });
  }

  ngOnInit() {
    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.setUpEditId = params['id'];
      if (this.setUpEditId !== undefined) {
        this.isDisable = true;
        this.currentAction = 'Edit'
        this._service.getCall("gl_account_details/" + this.setUpEditId).then(i => {
          this.setUpEditDtls = this._service.bindData(i);
          this.EditAblSetup.controls['charge_code'].setValue(this.setUpEditDtls.charge_code);
          this.EditAblSetup.controls['gl_account_no_debit'].setValue(this.setUpEditDtls.gl_account_no_debit);
          this.EditAblSetup.controls['gl_account_name_debit'].setValue(this.setUpEditDtls.gl_account_name_debit);
          this.EditAblSetup.controls['gl_account_no_credit'].setValue(this.setUpEditDtls.gl_account_no_credit);
          this.EditAblSetup.controls['gl_account_name_credit'].setValue(this.setUpEditDtls.gl_account_name_credit);
        })
      }
      else {
        this._message.showLoader(false);
      }
    });
  }

  saveData() {
    if (this.EditAblSetup.valid) {
      this._message.showLoader(true);
      const setUpEditModel = {
        "gl_account_detail":
          {
            "charge_code": this.EditAblSetup.controls.charge_code.value,
            "gl_account_no_debit": this.EditAblSetup.controls.gl_account_no_debit.value,
            "gl_account_name_debit": this.EditAblSetup.controls.gl_account_name_debit.value,
            "gl_account_no_credit": this.EditAblSetup.controls.gl_account_no_credit.value,
            "gl_account_name_credit": this.EditAblSetup.controls.gl_account_name_credit.value
          }
      }
      if (this.isDisable) {
        this.requestModel = { url: 'gl_account_details/' + this.setUpEditId, model: setUpEditModel };
        this._service.patchCallRor(this.requestModel).then(i => this.navigateToHome());
      } /*else {
           this.requestModel = {url: 'gl_account_details/', model: setUpEditModel};
           this._service.postCallpatch(this.requestModel).then(i=>this.navigateToHome()); 
      }*/
    }
  }

  navigateToHome() {
    this._location.back();
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
  }

  navigateToHomeCancel() {
    this._location.back();
  }

}
