import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { Location } from '@angular/common';


@Component({
  selector: 'system-parameters-edit-component',
  templateUrl: './system-parameters.edit.component.html'
})
export class SystemParameterEditComponent {
  sysParameterId: any;
  systemParametersDetails: any;
  currentAction = 'Edit';
  editSystemParameters: FormGroup;
  requestModel: any;

  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService) {
    this.editSystemParameters = this.fb.group({
      name: new FormControl(''),
      parameter_type: new FormControl(''),
      description: new FormControl(''),
      numericvalue: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit() {
    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.sysParameterId = params['id'];
      if (this.sysParameterId !== undefined) {
        this._service.getCall('system_parameters/' + this.sysParameterId).then(i => {
          this.systemParametersDetails = this._service.bindData(i);
          this.editSystemParameters.controls['name'].disable();
          this.editSystemParameters.controls['parameter_type'].disable();
          this.editSystemParameters.controls['description'].disable();
          this.editSystemParameters.controls['name'].setValue(this.systemParametersDetails.name);
          this.editSystemParameters.controls['parameter_type'].setValue(this.systemParametersDetails.parameter_type);
          this.editSystemParameters.controls['description'].setValue(this.systemParametersDetails.description);
          this.editSystemParameters.controls['numericvalue'].setValue(this.systemParametersDetails.value);
        });
      }
      else {
        this._message.showLoader(false);
      }
    });
  }

  saveData() {
    if (this.editSystemParameters.valid) {
      const sysParameterModel = {
        'system_parameter':
          {
            'value': this.editSystemParameters.controls.numericvalue.value
          }
      };
      this.requestModel = { url: '/system_parameters/' + this.sysParameterId, model: sysParameterModel };
      this._service.patchCallRor(this.requestModel).then(i => this.navigateToHome());
    }
  }

  navigateToHome() {
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
  }

  navigateToHomeCancel() {
    this._router.navigateByUrl("generalCodes/system-parameters");
  }
}