import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Location } from '@angular/common';
import { AppConfig } from '../../../../app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { CyncTextEditorComponent } from '@cyncCommon/component/cync-text-editor/cync-text-editor.component';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';
import { TreeModule } from 'primeng/primeng';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMessage } from '@cyncCommon/component/api-messages/api-messages.model';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { Observable } from 'rxjs';
import { error } from 'util';

import { MatDialog } from '@angular/material/dialog';
import { ResetUserStatusComponent } from './reset-user-status/reset-user-status.component';
import { CyncCustomHttpService } from '@cyncCommon/services/cync-custom-http-service';

@Component({
  selector: 'app-letter-templates',
  templateUrl: './letter-templates.component.html',
  styleUrls: ['./letter-templates.component.scss']
})
export class LetterTemplatesComponent implements OnInit {

  savingLetterName = false;
  selectedId: any;
  tempLetterContentList: any;
  tempLegalContentList: any;
  public static IMAGE_MAX_SIZE = 1000000; //1MB
  public static IMAGE_TYPE_ARRAY: any[] = ['image/jpeg', 'image/bmp'];
  imgLogoPath: any;
  content: any;
  lenderId: string;
  letterContentId: any;
  legalContentId: any;
  isDisable = true;
  show = 'hide';
  toogleEditIcon = 'hide';
  requestModel: any;
  reqFileAttachmentSize: any;
  editLetterContent: FormGroup;
  isLetterContentShow = '';
  isLegalContentShow = 'hide';
  selectedValue = 'letterContent';
  count: number;
  hideTopBottom: string = "";
  productTypeLetter: string = "";
  productTypeLegal: string = "";
  productLetterTypeList: any;
  productLetterTypeListorig: any;
  product_Type: String;
  contentPermArr: any[] = [];
  contentPerm: any[] = [];
  isEditIconEnabled: boolean = false;
  rolePermission: any[] = [];
  legalPrint: string = null;
  affiliatedLenderContentList: any;
  affiliatedLenderSelection: any = 'select';
  affiliatedLenderID: any;
  affiliateLenderInfo: any;
  isRadioEnable: boolean = false;
  resStatus: any;
  openPopup = false;
  letterNameList: any;
  letterNameId: string = "";
  newLetterName: string = "";
  selectedLetterName: string = "";
  selectedLetterDesc: string = "";
  disableAddPopupIcon = true;
  selectedLetterType: string = "";
  assetsPath = CyncConstants.getAssetsPath();
  hideTopBottomReset: string;
  public termsAndConditionRadioButton: Boolean = true;
  printShow : String = "";
  infoTooltip: boolean = false;
  infoHeaderTooltip: boolean = false;
  tcEnableStatus: boolean = false;
  headertextbox: boolean;
 

  constructor(private rolesPermComp: CheckPermissionsService, private _apiMsgService: APIMessagesService, private _cyncHttpService: CyncHttpService, private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig,
    private textEditor: CyncTextEditorComponent,private service: CyncCustomHttpService,
    public dialog: MatDialog,
    ) {
    this.lenderId = this.config.getConfig('lenderId');
    this.editLetterContent = this.fb.group({
      selectedValue: new FormControl('', Validators.compose([Validators.required])),
      letter_types: new FormControl('', Validators.compose([Validators.required])),
      content: new FormControl('', Validators.compose([Validators.required])),
      legal_types: new FormControl('', Validators.compose([Validators.required])),
      contentlegal: new FormControl('', Validators.compose([Validators.required])),
      radiotop: new FormControl('', Validators.compose([Validators.required])),
      radiobottom: new FormControl('', Validators.compose([Validators.required])),
      productTypeForLetterContent: new FormControl('', Validators.compose([Validators.required])),
      letter_names: new FormControl('', Validators.compose([Validators.required])),
      header: new FormControl('', Validators.compose([Validators.required])),
      group1: new FormControl('', Validators.compose([Validators.required])),
      new_letter_name: new FormControl('')
    });
    this._service.getCall('/lender/subscriptions').then(i => {
      this.productLetterTypeListorig = this._service.bindData(i).subscriptions;
      this.setProductList();
    });
    this.show = "hide";
    this.isDisable = true;
  }


  ngOnInit() {
    this._service.setHeight();
    this._message.showLoader(false);
    this.getPermission();
    this.getAllAffiliatedLenderContentList();
    this.enableDisabledControl(true);
    this.tcEnableStatus = false;
  }


  setProductList(){
    let list
    if(this.isLetterContentShow == "" || this.affiliatedLenderID != ""){
     list = this.productLetterTypeListorig.filter(x => x.module_name != "GENERAL")
     this.productLetterTypeList = list 
    }else{
      this.productLetterTypeList = JSON.parse(JSON.stringify(this.productLetterTypeListorig))
    }
  }

  getPermission() {
    this._message.showLoader(true);
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID); /* Logged In User*/
    const userRoleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
    if (userRoleType !== CyncConstants.ADMIN_ROLE_TYPE) {
      this._service.getCall('roles/' + userRoleId + '/role_permissions/menu_specific_permissions?menu_name=content').then(data => {
        this.rolePermission = this._service.bindData(data);
        
        let indexRole = this.rolePermission.filter(x => x.action === 'index')[0]
         
        if (indexRole != undefined && indexRole.enabled === true) {
          this._router.navigateByUrl("generalCodes/content");
          // this.shouldWeLoadPage = true;
        } else {
          this._message.addSingle("You are not authorized to perform this action.", 'danger');
          this._message.showLoader(false);
          setTimeout(() => {
            this._router.navigateByUrl('/');
          }, 600);
        }
        let editRole = this.rolePermission.filter(x => x.action === 'update')[0]
        if (editRole != undefined && editRole.enabled === true) {
          this.isEditIconEnabled = true;
        } else {
          this.isEditIconEnabled = false;
        }
      });
    } else {
      //this.shouldWeLoadPage = true;
      this.isEditIconEnabled = true;
    }

  }

  /**
   * 
   */
  ngAfterViewInit() {
    this.textEditor.setEditorContent(false);
  }

  /**
   * This method to get list of affiliated lender
   */
  getAllAffiliatedLenderContentList() {
    this._service.getCall('affiliate_lenders').then(i => {
      this.affiliatedLenderContentList = this._service.bindData(i).affiliate_lenders;
    });
  }

  /**
   * to disabled and enabled
   * @param ch boolean value true and false
   */
  enableDisabledControl(ch: boolean) {
    if (ch) {
      this.editLetterContent.disable();
      this.isRadioEnable = true;
      this.toogleEditIcon = 'hide';
      this.editLetterContent.controls['legal_types'].setValue('');
      this.editLetterContent.controls['radiotop'].setValue('null');
      this.imgLogoPath = "";
    } else {
      this.editLetterContent.enable();
      this.isRadioEnable = false;
      this.isDisable = false;
    }
  }

  /**
   * to get the Affiliate lender
   * @param selectedAffiliatedLender  affiliate lender id requied
   */

  affiliatedLenderContent(selectedAffiliatedLender: any) {
    if (selectedAffiliatedLender.target.value != 'select' && selectedAffiliatedLender.target.value != 'null' && selectedAffiliatedLender.target.value != "" && selectedAffiliatedLender.target.value != 'undefined') {
      this.affiliatedLenderID = selectedAffiliatedLender.target.value;
      this.editLetterContent.controls['legal_types'].setValue('');
      this.editLetterContent.controls['radiotop'].setValue('null');
      this.textEditor.setEditorContent(false);
      this.imgLogoPath = "";
      this.show = "hide";
      this.enableDisabledControl(false);
      this.toogleEditIcon = 'hide';
      this.onGeneralproductLegalType();
    }
    if (selectedAffiliatedLender.target.value == 'select') {
      this.enableDisabledControl(true);
    }
    if (selectedAffiliatedLender.target.value == '') {
      this.enableDisabledControl(false);
      this.affiliatedLenderID = selectedAffiliatedLender.target.value;
      this.show = "hide";
      this.textEditor.setEditorContent(false);
      this.imgLogoPath = "";
    }
    this.isDisable = true;
    this.editLetterContent.controls['letter_types'].setValue('');
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
    this.editLetterContent.controls['letter_names'].setValue('');
    this.disableAddPopupIcon = true;
    this.setProductList();
  }

  onClickLetterType(letterType: string) {
    this.selectedLetterType = letterType;
    let endPointLetterName = 'letter_names/get_letter_names?affiliate_lender_id=' + this.affiliatedLenderID + '&reference=' + this.editLetterContent.controls['productTypeForLetterContent'].value + '&letter_type=' + letterType;
    this._service.getCall(endPointLetterName).then(i => {
      let result = this._service.bindData(i);
      this.letterNameList = result.letter_names;
      if (this.savingLetterName) {
        this.letterNameList.filter(v => {
          if (v.letter_name === this.newLetterName) {
            this.selectedId = v.id;
            this.letterNameId = v.id;
          }
        });
        this.savingLetterName = false;
      } else {
        this.newLetterName = "Default"
        this.letterNameList.filter(v => {
          if (v.letter_name === this.newLetterName) {
            this.selectedId = v.id;
            this.letterNameId = v.id;
          }
        });
        this.savingLetterName = false;
      }
      this.disableAddPopupIcon = false;
      this.onChangeLetterName(this.selectedId);
    })
  }

  onChangeLetterName(letterNameId: string) {
    if (letterNameId !== null) {
      let endPointAffiliate = 'letter_names/' + letterNameId;
      if (this.affiliatedLenderID != '' && this.affiliatedLenderID != undefined && this.affiliatedLenderID != null) {
        this._cyncHttpService.get(endPointAffiliate).subscribe(res => {
          this.gettempLetterContentList(endPointAffiliate);
        }, error => {
          this.gettempLetterContentList(endPointAffiliate);
        }, () => { });
      } else {
        this.gettempLetterContentList(endPointAffiliate);
      }
    }
  }


  gettempLetterContentList(endPoint: any) {
    this._service.getCall(endPoint).then(i => {
      this.tempLetterContentList = this._service.bindData(i);
      this.letterContentId = this.tempLetterContentList.id;
      this.selectedLetterName = this.tempLetterContentList.letter_name;
      this.selectedLetterDesc = this.tempLetterContentList.description;
      this.imgLogoPath = this.tempLetterContentList.logo_path.logo_path.url;
      this.toogleEditIcon = 'show';
      if (this.tempLetterContentList.content == null) {
        this.editLetterContent.controls['content'].setValue(" ");
        this.textEditor.setEditorContent("");
      } else {
        this.editLetterContent.controls['content'].setValue(this.tempLetterContentList.content);
        this.textEditor.setEditorContent(this.tempLetterContentList.content);
      }
      this.show = "hide";
      this.isDisable = true;
      this.textEditor.getDisableEditing();
    });
  }

  onClickRadioButtonLetterContent(event) {
    if (this.affiliatedLenderID != "" && this.affiliatedLenderID != 'null') {
      this.legalContentId = this.affiliatedLenderID;
    }
    this.textEditor.setEditorContent(false);
    this.show = "hide";
    this.toogleEditIcon = 'hide';
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
    this.editLetterContent.controls['letter_types'].setValue('');
    this.isLetterContentShow = "";
    this.isLegalContentShow = "hide";
    this.selectedValue = 'letterContent';
    this.isDisable = true;
    this.imgLogoPath = "";
    this.editLetterContent.controls['letter_names'].setValue('');
    this.disableAddPopupIcon = true;
    this.letterNameList = [];
    this.setProductList();
  }

  onClickRadioButtonLegalContent(event) {
    if (this.affiliatedLenderID != "" && this.affiliatedLenderID != 'null') {
      this.legalContentId = this.affiliatedLenderID;
    }
    this.toogleEditIcon = 'hide';
    this.textEditor.setEditorContent(false);
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
    this.editLetterContent.controls['legal_types'].setValue('');
    this.isLetterContentShow = "hide";
    this.isLegalContentShow = "";
    this.selectedValue = 'legalContent';
    this.isDisable = true;
    this.hideTopBottomReset="hide"
    this.onGeneralproductLegalType();
    this.setProductList();
  }
  
  termsAndConditionRadioButtonFns(booleanValue){
    this.termsAndConditionRadioButton = booleanValue; 
    this.tcEnableStatus = booleanValue;
   }

  onClickEdit() {
    this.show = "";
    this.textEditor.getEnableEditing();
    this.editLetterContent.enable();
    this.isDisable = false;
    this.isRadioEnable = false;
    this.disableAddPopupIcon = true;
    // this.header = true;
    // this.header = "show";

  }

  cancelLetterContent() {
    this.isDisable = true;
    this.show = "hide";
    this.toogleEditIcon = 'hide';
    this.editLetterContent.controls['letter_types'].setValue('');
    this.textEditor.setEditorContent(false);
    this.imgLogoPath = "";
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
    this.affiliatedLenderSelection = '';
    this.letterNameList = [];
    this.editLetterContent.controls['letter_names'].setValue('');
  }

  editedLetterContent() {
    this._message.showLoader(true);
    let formData = new FormData();
    formData.append('letter_names[content]', this.textEditor.getEditorContent());
    if (this.imgLogoPath != undefined && this.imgLogoPath != '' && this.imgLogoPath != null) {
      let vpath = new Blob([this.imgLogoPath],{type: 'text/plain'});
      formData.append('letter_names[logo_path]', vpath, this.imgLogoPath.name);
    }
    formData.append('letter_names[reference]', this.editLetterContent.controls['productTypeForLetterContent'].value);
    formData.append('letter_names[letter_type]', this.editLetterContent.controls['letter_types'].value);
    formData.append('letter_names[letter_name]', this.selectedLetterName);
    formData.append('letter_names[description]', this.selectedLetterDesc);
    formData.append('letter_names[affiliate_lender_id]', this.affiliatedLenderID);
    this.requestModel = { url: 'letter_names/' + this.letterNameId, model: formData }
    this._service.patchCallForFileUpload(this.requestModel).then(i => this.navigateToHomeLetter(i));
  }

  navigateToHome() {
    this.defaultPage();
    this._message.addSingle("Record Updated successfully.", "success");
    this._message.showLoader(false);
    this.enableDisabledControl(true);
  }

  defaultPage() {
    this.isDisable = true;
    this.show = "hide";
    this.toogleEditIcon = 'hide';
    this.editLetterContent.controls['letter_types'].setValue('');
    this.textEditor.setEditorContent(false);
    this.imgLogoPath = "";
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
    this.affiliatedLenderSelection = 'select';
    this.editLetterContent.controls['letter_names'].setValue('');
    this.disableAddPopupIcon = true;
  }

  navigateToHomeLetter(i) {
    this.defaultPage();
    //Changes for CYNCUXT-2980 begin
    if (i != undefined)
      this._message.addSingle("Record saved successfully.", "success");
    this._message.showLoader(false);
    // Changes for CYNCUXT-2980 ends
    this.enableDisabledControl(true);
  }

  uploadLogo(fileInputReq: any) {
    if ((fileInputReq.target.files != undefined && fileInputReq.target.files.length != 0) &&
      this.isUploadloadedLogoValid(fileInputReq)) {
      this.isDisable = false;
      var reader = new FileReader();
      reader.readAsDataURL(fileInputReq.target.files[0]);
      reader.onload = function (e: any) {
        $('#preview').attr('src', e.target.result);
      }
    }
  }

  /**
   *
   * @param event
   */
  onCallPrint(event: string) {
    this.legalPrint = event;
  }

  /**
   *
   * @param fileInputReq
   */
  isUploadloadedLogoValid(fileInputReq: any): boolean {
    this.reqFileAttachmentSize = fileInputReq.target.files[0].size;
    if (this.reqFileAttachmentSize <= 0) {
      this._message.addSingle("Attachment with 0 size not allowed.", "error");
      return false;
    } else if (this.reqFileAttachmentSize > LetterTemplatesComponent.IMAGE_MAX_SIZE) {
      this._message.addSingle("Attachment with size more than 1MB is not allowed.", "error");
      return false;
    } else if (!this.isLogoValid(fileInputReq.target.files)) {
      this._message.addSingle("File format should be in JPG and BMP.", "error");
      return false;
    }
    this.imgLogoPath = fileInputReq.target.files[0];
    return true;
  }

  /**
   * to check file format
   * @param files
   */
  isLogoValid(files: any): boolean {
    for (let i = 0; i < files.length; i++) {
      if (LetterTemplatesComponent.IMAGE_TYPE_ARRAY.includes(files[i].type)) {
        return true;
      }
    }
    return false;
  }


  onChangeProductLetterType(productTypeLetter: string) {
    this.letterNameList = [];
    this.editLetterContent.controls['letter_names'].setValue('');
    this.editLetterContent.controls['letter_types'].setValue('');
    this.toogleEditIcon = 'hide';
    if (this.editLetterContent.controls['letter_types'].value == '') {
      this.textEditor.setEditorContent(false);
      this.imgLogoPath = "";
    }
    this.disableAddPopupIcon = true;
  }

  onChangeProductLegalType(productTypeLegal: string) {
    this.legalPrint = "null";
    this.toogleEditIcon = 'hide';
    if (this.editLetterContent.controls['letter_types'].value == '') {
      this.textEditor.setEditorContent(false);
      this.imgLogoPath = "";
    }
    this.onGeneralproductLegalType();
    this.tcEnableStatus = false;
    this.editLetterContent.get('header').enable();
    this.headertextbox = true;
  }

onGeneralproductLegalType() {
   if (this.productTypeLegal == 'GENERAL'){
      this.editLetterContent.controls['legal_types'].setValue("t_and_c_USER");
      this.printShow = "hide"
      this.hideTopBottomReset = "show";
      this.onClickLegalType("t_and_c_USER");
      this.termsAndConditionRadioButton = false;
    }else{
      this.editLetterContent.controls['legal_types'].setValue('');
      this.printShow = ""
      this.hideTopBottomReset = "hide";
      this.termsAndConditionRadioButton = true;
    }
  }

  onClickLegalType(legalType: string) {
    if (this.editLetterContent.controls['productTypeForLetterContent'].value != undefined && this.editLetterContent.controls['productTypeForLetterContent'].value != null && this.editLetterContent.controls['productTypeForLetterContent'].value != '' && legalType != '') {
      let endPoint = 'legal_texts?reference=' + this.editLetterContent.controls['productTypeForLetterContent'].value + '&text_type=' + legalType + '&header =' + this.editLetterContent.controls['header'].value  + '&enabled =' + this.tcEnableStatus.toString();
      if (legalType != "t_and_c_USER"){
      if (this.affiliatedLenderID != '' && this.affiliatedLenderID != undefined && this.affiliatedLenderID != null) {
        let endPointAffiliate = 'legal_texts?reference=' + this.editLetterContent.controls['productTypeForLetterContent'].value + '&text_type=' + legalType + '&affiliate_lender_id=' + this.affiliatedLenderID;
        this._cyncHttpService.getWithOpt(endPointAffiliate,{"headers": [['ignore_404',"enabled"]]}).subscribe(res => {
          this.getLegalContentList(endPointAffiliate);
        }, error => {
          this.getLegalContentList(endPoint);
        }, () => { });
      } else {
        this.getLegalContentList(endPoint);
      }
    }else{
      this.getLegalContentList(endPoint);
    }
      this.hideTopBottom = "";
    }
    if (this.editLetterContent.controls['legal_types'].value == "E-signature") {
      this.hideTopBottom = "hide";
    }
    if (this.editLetterContent.controls['legal_types'].value == '') {
      this.imgLogoPath = "";
      this.legalPrint = "null";
      this.toogleEditIcon = 'hide';
      this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
      this.textEditor.setEditorContent(false);
    }
  }

  getLegalContentList(url: string) {
    this._service.getCall(url).then(i => {
      this.tempLegalContentList = this._service.bindData(i);
      this.legalContentId = this.tempLegalContentList.id;
      this.legalPrint = this.tempLegalContentList.position;
      this.toogleEditIcon = 'show';
      this.editLetterContent.controls['contentlegal'].setValue(this.tempLegalContentList.content);
      this.textEditor.setEditorContent(false);
      this.textEditor.setEditorContent(this.tempLegalContentList.content);
      this.isDisable = true;
      let that = this;
      if (this.editLetterContent.controls['legal_types'].value == "t_and_c_USER") {
       this.editLetterContent.controls['header'].setValue(that.tempLegalContentList.header)
       if(that.tempLegalContentList.enabled == true){
        that.tcEnableStatus = true
       }else{
         that.tcEnableStatus = false
       }
      }
    });
  }

  editLegalContent() {
    this._message.showLoader(true);
    let formData: FormData = new FormData();
    formData.append('legal_text[content]', this.textEditor.getEditorContent());
    formData.append('legal_text[position]', this.legalPrint);
    if(this.editLetterContent.controls['legal_types'].value == "t_and_c_USER"){
      formData.append('legal_text[header]', this.editLetterContent.controls['header'].value);
      formData.append('legal_text[enabled]', this.tcEnableStatus.toString());
    }
    if (this.affiliatedLenderID != '' && this.affiliatedLenderID != 'null' && this.affiliatedLenderID != undefined) {
      this.affiliatedLenderID = this.affiliatedLenderID;
      formData.append('legal_text[reference]', this.editLetterContent.controls['productTypeForLetterContent'].value);
      formData.append('legal_text[text_type]', this.editLetterContent.controls['legal_types'].value);
      formData.append('legal_text[affiliate_lender_id]', this.affiliatedLenderID);
          this._cyncHttpService.uploadFile('legal_texts', formData).catch(errorResponse => {
            if (errorResponse !== undefined && errorResponse.error != undefined && errorResponse.error.error != undefined && errorResponse.error.error.message != undefined) {
              this._apiMsgService.add(new APIMessage('danger', errorResponse.error.error.message));
            }
            return Observable.throw(errorResponse);
          }).subscribe(response => {
            if (response instanceof HttpResponse) {
              this.navigateToHome();
            }
          });
        
    } else {
          this.requestModel = { url: 'legal_texts/' + this.legalContentId, model: formData }
          this._service.patchCallForFileUpload(this.requestModel).then(i => this.postContentSave(i));
      
    }
    this.printShow = ""
    this.hideTopBottomReset = "hide";
    this.termsAndConditionRadioButton = true;
    this.toogleEditIcon = 'show';
    // if(this.tcEnableStatus === true){
    //   formData.append('legal_text[header]', this.editLetterContent.controls['header'].value);
    //   formData.append('legal_text[enabled]', this.tcEnableStatus.toString());
    // }
  }

  async postContentSave(i){
    if(this.editLetterContent.controls['legal_types'].value == "t_and_c_USER"){
      if(this.tcEnableStatus == true){
       await this.resetTnC(false,'save_button');
      }
    }
    this.navigateToHomeLegal(i)
  }

  navigateToHomeLegal(i) {
    this.show = "hide";
    this.defaultLegalPage();
    //Changes for CYNCUXT-2980 begin
    if (i != undefined)
      this._message.addSingle("Record saved successfully.", "success");
    this._message.showLoader(false);
    //Changes for CYNCUXT-2980 ends
  }

  cancelLegalContent() {
    this.defaultLegalPage();
    // this.enable_actionControle(null);
    this.affiliatedLenderSelection = '';
    this.printShow = ""
    this.hideTopBottomReset = "hide";
    this.termsAndConditionRadioButton = true;
    this.toogleEditIcon = 'show';
  }

  defaultLegalPage() {
    this.isDisable = true;
    this.editLetterContent.controls['legal_types'].setValue('');
    this.textEditor.setEditorContent(false);
    this.imgLogoPath = "";
    this.legalPrint = "null";
    this.toogleEditIcon = 'hide';
    this.editLetterContent.controls['productTypeForLetterContent'].setValue('');
  }

  onClickReset() {
    this.imgLogoPath = '';
    this.legalPrint = "null";
    this.toogleEditIcon = 'hide';
    if (this.selectedValue != "letterContent") {
      this.onClickRadioButtonLegalContent('legalContent');
    } else {
      this.onClickRadioButtonLetterContent('letterContent');
    }
    this.isDisable = true;
    this.textEditor.setEditorContent(false);
  }

  addLetterName() {
    this.newLetterName = "";
    this.openPopup = true;
  }

  saveLetterName() {
    if (this.newLetterName) {
      const letterModel = {
        'letter_names':
          {
            "affiliate_lender_id": this.affiliatedLenderID,
            "reference": this.editLetterContent.controls['productTypeForLetterContent'].value,
            "letter_type": this.editLetterContent.controls['letter_types'].value,
            "letter_name": this.newLetterName,
            "description": "test"
          }
      }
      this.requestModel = { url: '/letter_names', model: letterModel };
      this._service.postCallpatch(this.requestModel).then(i => this.closePopUp());
    } else {
      this._message.addSingle("Please Enter Letter Name", "danger");
    }

  }

  closePopUp() {
    // this.afterSaveLetterName(this.selectedLetterType);
    this.savingLetterName = true;
    this.onClickLetterType(this.selectedLetterType);

    this._message.addSingle("Record Saved successfully.", "success");
    this.openPopup = false;
    this._message.showLoader(false);
  }
  requestHeaders(): HttpHeaders {
    const httpHeader: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
      'payloadBody': 'reset : true',  
    });
    return httpHeader;
  }

  resetTnC(flash=false,source='save_button'){
    const httpOptions = { headers: this.requestHeaders() };
    let url = "admin/users/reset_terms?reset=true&source="+source;
    this.service.put(url,httpOptions).subscribe(data => {
    const message = data.message;
    if(flash){
      this._message.addSingle("Record Updated successfully.", "success");
    }
    }); 
  }

  // Call this in when you click Button
  resetUserStatusDialog(mode='reset'){

    if(this.tcEnableStatus == true || mode == 'reset'){
      const dialogRef = this.dialog.open(ResetUserStatusComponent ,{
      data :{'path':mode} });
      
      dialogRef.afterClosed().subscribe((param) => {  
      if(param==='Proceed'){
        if(mode == 'reset'){ 
           this.resetTnC(true,'reset_button');     
        }else{
           this.editLegalContent();  
        }
        }
      });
    }else{
      this.editLegalContent();
    }  
  }
}