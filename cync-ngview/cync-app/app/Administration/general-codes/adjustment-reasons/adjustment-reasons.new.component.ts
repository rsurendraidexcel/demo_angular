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
  selector: 'app-adjustment-reasons',
  templateUrl: './adjustment-reasons.new.component.html'
})
export class AdjustmentReasonsNewComponent {

  lenderId: string;
  adjustmentId: any;
  isDisable = false;
  isDescValid = true;
  isNameValid = true;
  adjustmentDtls: any;
  currentAction: string = 'Add';
  addEditAdjustment: FormGroup;
  requestModel: any;
  saveAndNew = false;
  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.addEditAdjustment = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([])),
      dilution: new FormControl(false, Validators.compose([]))
    });
  }

  ngOnInit() {
    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.adjustmentId = params['id'];
      if (this.adjustmentId !== undefined && this.adjustmentId !== 'add') {
        this.isDisable = true;
        this.currentAction = 'Edit';
        this._service.getCall("general_codes/adjustment_reasons/" + this.adjustmentId).then(i => {
          this.adjustmentDtls = this._service.bindData(i);

          this.addEditAdjustment.controls['name'].setValue(this.adjustmentDtls.name);
          this.addEditAdjustment.controls['description'].setValue(this.adjustmentDtls.description);
          this.addEditAdjustment.controls['dilution'].setValue(this.adjustmentDtls.dilution);
        })
      }
      else {
        this.currentAction = 'Add';
        this._message.showLoader(false);
      }
    });
  }

  saveNew() {
    this.saveAndNew = true;
    this.saveData();
  }

  saveData() {
    if (this.addEditAdjustment.controls.name.value == '') {
      this.isNameValid = false;
    }
    if (this.addEditAdjustment.valid) {
      this._message.showLoader(true);
      const adjustmentModel = {
        'adjustment_reason':
          {
            "name": this.addEditAdjustment.controls.name.value,
            "description": this.addEditAdjustment.controls.description.value,
            "dilution": this.addEditAdjustment.controls.dilution.value
          }
      }
      if (this.isDisable) {
        this.requestModel = { url: 'general_codes/adjustment_reasons/' + this.adjustmentId, model: adjustmentModel }
        this._service.patchCallRor(this.requestModel).then(i => this.navigateToHomeEdit());
      } else {
        this.requestModel = { url: 'general_codes/adjustment_reasons/', model: adjustmentModel };
        this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
      }
    }
  }

  navigateToHome() {
    if (!this.saveAndNew) {
      this._router.navigateByUrl("generalCodes/adjustment");
    } else {
      this.addEditAdjustment.reset();
      this.saveAndNew = false;
    }

    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
  }

  navigateToHomeEdit() {
    this._router.navigateByUrl("generalCodes/adjustment");
    this._message.showLoader(false);
    this._message.addSingle("Record Updated successfully.", "success");
  }

  navigateToHomeCancel() {
    this._router.navigateByUrl("generalCodes/adjustment");
  }

  checkName() {
    //debugger
    if (this.addEditAdjustment.controls.name.value == '') {
      this.isNameValid = false;
    }
    else {
      this.isNameValid = true;
    }
  }

  checkDesc() {
    if (this.addEditAdjustment.controls.description.value == '') {
      this.isDescValid = false;
    }
    else {
      this.isDescValid = true;
    }
  }

}
