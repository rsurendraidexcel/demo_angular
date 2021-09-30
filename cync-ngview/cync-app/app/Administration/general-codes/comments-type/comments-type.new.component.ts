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
  selector: 'comments-type',
  templateUrl: './comments-type.new.component.html'
})
export class CommentsTypeNewComponent {

  lenderId: string;
  commentsTypeId: any;
  isDisable = false;
  isDescValid = true;
  isNameValid = true;
  commentTypeDtls: any;
  currentAction: string = 'Add';
  commentsTypeForm: FormGroup;
  requestModel: any;
  isSaveAndNew: boolean = false;
  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.commentsTypeForm = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('')
    });
  }

  ngOnInit() {
    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.commentsTypeId = params['id'];
      if (this.commentsTypeId !== undefined && this.commentsTypeId !== 'add') {
        this.isDisable = true;
        this.currentAction = 'Edit';
        this._service.getCall("/general_codes/comment_types/" + this.commentsTypeId).then(i => {
          this.commentTypeDtls = this._service.bindData(i);
          this.commentsTypeForm.controls['name'].setValue(this.commentTypeDtls.name);
          this.commentsTypeForm.controls['description'].setValue(this.commentTypeDtls.description);
        });
      }
      else {
        this._message.showLoader(false);
        this.currentAction = "Add";

      }
    });
  }

  saveNew() {
    this.isSaveAndNew = true;
    this.saveData();
  }

  saveData() {
    if (this.commentsTypeForm.controls.description.value == '') {
      this.isDescValid = false;
    }
    if (this.commentsTypeForm.controls.name.value == '') {
      this.isNameValid = false;
    }
    if (this.commentsTypeForm.valid) {
      const commentTypesModel = {
        'comment_type':
          {
            'name': this.commentsTypeForm.controls.name.value,
            'description': this.commentsTypeForm.controls.description.value
          }
      }
      if (this.isDisable) {
        this.requestModel = { url: '/general_codes/comment_types/' + this.commentsTypeId, model: commentTypesModel }
        this._service.patchCallRor(this.requestModel).then(i => this.navigateToHomeEdit());
      } else {
        this.requestModel = { url: '/general_codes/comment_types/', model: commentTypesModel };
        this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
      }
    }
  }

  navigateToHome() {
    if (!this.isSaveAndNew) {
      this._router.navigateByUrl("generalCodes/comments-type");
    } else {
      this.commentsTypeForm.reset();
      this.isSaveAndNew = false;
    }
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
  }

  navigateToHomeEdit() {
    this._router.navigateByUrl("generalCodes/comments-type");
    this._message.showLoader(false);
    this._message.addSingle("Record Updated successfully.", "success");
  }

  navigateToHomeCancel() {
    this._router.navigateByUrl("generalCodes/comments-type");
  }
  checkName() {
    if (this.commentsTypeForm.controls.name.value == '') {
      this.isNameValid = false;
    }
    else {
      this.isNameValid = true;
    }
  }

  checkDesc() {
    if (this.commentsTypeForm.controls.description.value == '') {
      this.isDescValid = false;
    }
    else {
      this.isDescValid = true;
    }
  }



}
