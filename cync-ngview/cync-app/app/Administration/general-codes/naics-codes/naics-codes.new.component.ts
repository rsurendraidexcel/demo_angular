import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-naics-codes',
  templateUrl: './naics-codes.new.component.html'
})
export class NaicsCodesNewComponent {

  lenderId: string;
  naicscodesId: any;
  isDisable = false;
  isCodeValid = true;
  isDescValid = true;
  naicscodesDtls: any;
  currentAction: string = 'Add';
  addEditNaicsCodes: FormGroup;
  requestModel: any;
  isSaveAndNew: boolean = false;
  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.addEditNaicsCodes = this.fb.group({
      code: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit() {
    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.naicscodesId = params['id'];
      if (this.naicscodesId !== undefined && this.naicscodesId !== 'add') {
        this.isDisable = true;
        this.currentAction = 'Edit'
        this._service.getCall("/general_codes/naics_codes/" + this.naicscodesId).then(i => {
          this.naicscodesDtls = this._service.bindData(i);
          this.addEditNaicsCodes.controls['code'].setValue(this.naicscodesDtls.code);
          this.addEditNaicsCodes.controls['description'].setValue(this.naicscodesDtls.description);
        });
      }
      else {
        this.currentAction = "Add";
        this._message.showLoader(false);
      }
    });
  }

  saveNew() {
    this.isSaveAndNew = true;
    this.saveData();
  }

  saveData() {
    if (this.addEditNaicsCodes.controls.code.value == '') {
      this.isCodeValid = false;
    }
    if (this.addEditNaicsCodes.controls.description.value == '') {
      this.isDescValid = false;
    }
    if (this.addEditNaicsCodes.valid) {
      this._message.showLoader(true);
      const naicsModel = {
        'naics_code':
          {
            'code': this.addEditNaicsCodes.controls.code.value,
            'description': this.addEditNaicsCodes.controls.description.value
          }
      }
      if (this.isDisable) {
        this.requestModel = { url: '/general_codes/naics_codes/' + this.naicscodesId, model: naicsModel }
        this._service.patchCallRor(this.requestModel).then(i => this.navigateToHomeEdit());
      } else {
        this.requestModel = { url: '/general_codes/naics_codes/', model: naicsModel };
        this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
      }
    }
  }

  navigateToHome() {
    if (!this.isSaveAndNew) {
      this._router.navigateByUrl("generalCodes/naics-codes");
    } else {
      this.addEditNaicsCodes.reset();
      this.isSaveAndNew = false;
    }
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");

  }

  navigateToHomeEdit() {
    this._router.navigateByUrl("generalCodes/naics-codes");
    this._message.showLoader(false);
    this._message.addSingle("Record Updated successfully.", "success");
  }

  navigateToHomeCancel() {
    this._router.navigateByUrl("generalCodes/naics-codes");
  }

  checkCode() {
    if (this.addEditNaicsCodes.controls.code.value == '') {
      this.isCodeValid = false;
    }
    else {
      this.isCodeValid = true;
    }
  }

  checkDesc() {
    if (this.addEditNaicsCodes.controls.description.value == '') {
      this.isDescValid = false;
    }
    else {
      this.isDescValid = true;
    }
  }

}
