import { Component, OnInit } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';
import { NgForm, AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'common-radio-header',
  templateUrl: './common-radio-header.component.html',
  styleUrls: ['./common-radio-header.component.scss']
})

export class CommonRadioComponent implements OnInit {
  myForm: FormGroup;
  constructor(public radioService: RadioButtonService, private fb: FormBuilder,private _router: Router,) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      financial_data_files: new FormControl(this.radioService.selectedRadioBtn),
    })

  }

  fnRedirectSummary(){
    this._router.navigateByUrl('/financial/financial-statements/summary/'+this.radioService.projectID);
  }
}
