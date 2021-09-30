import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LetterNamesService } from '@app/Administration/general-codes/content/letter-names/service/letter-names.service';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-letter-names',
  templateUrl: './manage-letter-names.component.html',
  styleUrls: ['./manage-letter-names.component.scss']
})
export class ManageLetterNamesComponent implements OnInit {

  letterNamesForm: FormGroup;
  affiliatedLenderContentList: any;
  productTypeList: any;
  currentAction = "Add";
  letterNameId: any;

  constructor(
    private fb: FormBuilder,
    private _letterNamesService: LetterNamesService,
    private _service: CustomHttpService,
    private _message: MessageServices,
    private _router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._message.showLoader(true);
    this.intializeForm();
    this.getAllAffiliatedLenderContentList();
    this.getProductType();
    this.renderForm();
  }

  renderForm() {
    this.route.params.subscribe(params => {
      this.letterNameId = params['id'];
      if (this.letterNameId !== undefined && this.letterNameId !== 'add') {
        this.currentAction = 'Edit';
        this.getLetterNameRecordById();
        this.disableControls();
      } else {
        this.currentAction = "Add";
        this._message.showLoader(false);
      }
    });
  }

  intializeForm() {
    this.letterNamesForm = this.fb.group({
      letter_name: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl(''),
      reference: new FormControl('', Validators.compose([Validators.required])),
      letter_type: new FormControl('', Validators.compose([Validators.required])),
      affiliate_lender_id: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  getAllAffiliatedLenderContentList() {
    this._letterNamesService.getDetails("/affiliate_lenders").subscribe(res => {
      this.affiliatedLenderContentList = res.affiliate_lenders;
    })
  }

  getProductType() {
    this._letterNamesService.getDetails('/lender/subscriptions').subscribe(res => {
      this.productTypeList = res.subscriptions;
    })
  }

  getLetterNameRecordById() {
    this._message.showLoader(true);
    this._letterNamesService.getDetails("/letter_names/" + this.letterNameId).subscribe(res => {
      this.letterNamesForm.patchValue(res, { onlySelf: true });
      this._message.showLoader(false);
    });
  }

  disableControls() {
    this.letterNamesForm.controls['affiliate_lender_id'].disable();
    this.letterNamesForm.controls['reference'].disable();
    this.letterNamesForm.controls['letter_type'].disable();
  }

  onClickSaveButton() {
    if (this.currentAction === 'Edit') {
      this.updateLetterName();
    } else {
      this.saveLetterName(false);
    }
  }

  onClickSaveNewButton() {
    this.saveLetterName(true);
  }

  saveLetterName(isSaveAndNew: boolean) {
    if (this.letterNamesForm.controls['letter_name'].value == '' ||
      this.letterNamesForm.controls['reference'].value == '' ||
      this.letterNamesForm.controls['letter_type'].value == '') {
      this._message.addSingle("Please Enter Values", "danger");
    } else {
      this._message.showLoader(true);
      const letterModel = {
        'letter_names':
          {
            "affiliate_lender_id": this.letterNamesForm.controls['affiliate_lender_id'].value,
            "reference": this.letterNamesForm.controls['reference'].value,
            "letter_type": this.letterNamesForm.controls['letter_type'].value,
            "letter_name": this.letterNamesForm.controls['letter_name'].value,
            "description": this.letterNamesForm.controls['description'].value
          }
      }
      this._letterNamesService.saveDetails('/letter_names', letterModel).subscribe(res => {
        this._message.addSingle("Record Saved successfully.", "success");
        if (!isSaveAndNew) {
          this.navigateToListPage();
        } else {
          this.letterNamesForm.reset();
          this.resetForm();
          this._message.showLoader(false);
        }
      })
    }
  }

  updateLetterName() {
    if (this.letterNamesForm.controls['letter_name'].value == '') {
      this._message.addSingle("Please Enter Values", "danger");
    } else {
      const letterModel = {
        'letter_names':
          {
            "id": this.letterNameId,
            "affiliate_lender_id": this.letterNamesForm.controls['affiliate_lender_id'].value,
            "reference": this.letterNamesForm.controls['reference'].value,
            "letter_type": this.letterNamesForm.controls['letter_type'].value,
            "letter_name": this.letterNamesForm.controls['letter_name'].value,
            "description": this.letterNamesForm.controls['description'].value
          }
      }
      this._message.showLoader(true);
      this._letterNamesService.updateDetails("letter_names/" + this.letterNameId, letterModel).subscribe(res => {
        this._message.addSingle("Record Updated successfully.", "success");
        this.navigateToListPage();
      });
    }
  }

  resetForm() {
    this.letterNamesForm.controls['letter_name'].setValue('');
    this.letterNamesForm.controls['affiliate_lender_id'].setValue('');
    this.letterNamesForm.controls['reference'].setValue('');
    this.letterNamesForm.controls['letter_type'].setValue('');
    this.letterNamesForm.controls['description'].setValue('');
  }

  navigateToListPage() {
    this._message.showLoader(false);
    this._router.navigateByUrl("generalCodes/content/letter-names");
  }

}
