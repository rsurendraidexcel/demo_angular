import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { Location } from '@angular/common';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { GridComponent } from '../.././../../app-common/component/grid/grid.component';
import { CyncTextEditorComponent } from '../../../../app-common/component/cync-text-editor/cync-text-editor.component';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from 'app-common/utils/constants';


/*Commenting the particle JS code since its not using currently*/
// declare var particlesJS: any;

@Component({
	selector: 'app-templates',
	templateUrl: './templates.component.html'
})
export class TemplatesComponent implements OnInit {

	lenderId: string;
	requestModel: any;
	editTemplates: FormGroup;
	emailTemplatesList: any;
	textTemplatesList: any;
	isDisable = true;
	emailTemplatesValue: any;
	isEditShowIcon = 'hide';
	isEditShowField = 'hide';
	isEditShowCc = '';
	emailTemplatesListValue: any;
	textTemplatesListValue: any;
	emailTemplates: any;
	textTemplates: any;
	emailId: string;
	textId: string;
	idData: any;
	placeholders: any;
	emailplaceHolderKey: any;
	emailplaceHolderValue: any;
	textplaceHolderKey: any;
	textplaceHolderValue: any;
	isEditShow = 'hide';
	isEditShowTextField = 'hide';
	isEmailTemplateShow = '';
	isTextTemplateShow = 'hide';
	isReportTemplateShow = 'hide';
	enableSave: string;
	isEmailRadioClicked = false;
	isTextRadioClicked = false;
	selectedValue: string;
	productType: any;
	reportTemplatesList: any;
	reportTemplatesId: any;
	editAction = 'none';
	content: any;
	selectedListValue: any;
	showEmailCloseIcon: boolean = false;
	showTextCloseIcon: boolean = false;
	body: any;
	editEmailTemplates: any;
	templatesPermArr: any[] = [];
	hideEdit: string = "hide";
	isEditIconEnabled: boolean = false;
	isDisableTextArea: boolean = true;
	isDisableCancel: boolean = true;
	radioButtonEvent: string = "Email Template";
	isReadOnly: boolean = true;
	assetsPath = CyncConstants.getAssetsPath();

	constructor(private rolesPermComp: CheckPermissionsService, private route: ActivatedRoute, private _router: Router, private _location: Location, private _message: MessageServices, private _service: CustomHttpService, private config: AppConfig, private textEditor: CyncTextEditorComponent) {

		/*Based on the User Role Permissions Enable or Disable the Edit Icon*/
		let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
		if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
			/*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
			setTimeout(() => {
				this.templatesPermArr = JSON.parse(localStorage.getItem("templatesPermissionsArray"));
				this.isEditIconEnabled = this.rolesPermComp.checkPermissions(this.templatesPermArr, "update");

			}, 600);
		} else {
			this.isEditIconEnabled = true;
		}

		this.editTemplates = new FormGroup({
			selectedValue: new FormControl('', Validators.compose([Validators.required])),
			purpose: new FormControl('', Validators.compose([Validators.required])),
			body: new FormControl('', Validators.compose([])),
			search_emailpurpose: new FormControl('', Validators.compose([])),
			search_textpurpose: new FormControl('', Validators.compose([])),
			name_from: new FormControl('', Validators.compose([])),
			subject_from: new FormControl('', Validators.compose([])),
			cc: new FormControl('', Validators.compose([Validators.required])),
			text_from: new FormControl('', Validators.compose([Validators.required])),
			text_body: new FormControl('', Validators.compose([Validators.required])),
			content: new FormControl('', Validators.compose([Validators.required])),
			selectedValuePayoff: new FormControl('', Validators.compose([Validators.required])),
			productTypeForEmailTemplate: new FormControl('general', Validators.compose([Validators.required])),
			productTypeForTextTemplate: new FormControl('general', Validators.compose([Validators.required]))

		});
		this.lenderId = this.config.getConfig('lenderId');

		this._service.getCall('email_templates?email_type=general').then(i => {
			this.emailTemplatesList = this._service.bindData(i);
		});
		this.isEditShowIcon = "";
		this.selectedValue = "email_template";
		this.isDisableCancel = true;
	}

	onChangeProductEmailTemplate(selected: string) {
		this.isDisableCancel = true;
		this.hideEdit = "hide";
		this.isDisable = true;
		this.isEditShowIcon = "";
		this.isEditShowField = "hide";
		this.isEditShowCc = ""
		if (selected == "abl") {
			this.editTemplates.controls['productTypeForEmailTemplate'].setValue('abl');
		} else if (selected == 'factoring') {
			this.editTemplates.controls['productTypeForEmailTemplate'].setValue('factoring');
		} 
	 	else if (selected == 'termloan') {
		this.editTemplates.controls['productTypeForEmailTemplate'].setValue('termloan');
		}
		else {
			this.editTemplates.controls['productTypeForEmailTemplate'].setValue('general');
		}
		this.callEmailTemplate(this.editTemplates.controls['productTypeForEmailTemplate'].value);

		this.clearSearchBox();

	}

	callEmailTemplate(selected: string) {
		this._service.getCall('email_templates?email_type=' + this.editTemplates.controls['productTypeForEmailTemplate'].value).then(i => {
			this.emailTemplatesList = this._service.bindData(i);
		});
		this.isEmailTemplateShow = '';
		this.isTextTemplateShow = 'hide';
		this.isReportTemplateShow = 'hide';

		if (this.isEmailRadioClicked == false) {
			this.isEditShowIcon = '';
		}
		this.isEditShow = "";
		this.isDisableCancel = false;
		this.isEditShowTextField = "hide";
		this.selectedValue = 'email_template';
		this.enableSave = 'disable';
		this.isDisable = true;
		this.editTemplates.controls['search_textpurpose'].setValue('');
		this.selectedListValue = '';
	}


	onClickRadioButtonEmailTemplates(event: string) {
		this.radioButtonEvent = event;
		this.isDisableCancel = true;
		this.hideEdit = "hide";
		this.showEmailCloseIcon = false;
		this._service.getCall('email_templates?email_type=general').then(i => {
			this.emailTemplatesList = this._service.bindData(i);
		});
		this.isEmailTemplateShow = "";
		this.isTextTemplateShow = "hide";
		this.isReportTemplateShow = "hide";
		if (this.isEmailRadioClicked == false) {

			this.isEditShowIcon = "";

		}

		this.isEditShow = "";
		this.isEditShowTextField = "hide";
		this.selectedValue = 'email_template';
		this.enableSave = 'disable';
		this.isDisable = true;
		this.editTemplates.controls['search_textpurpose'].setValue('');
		this.selectedListValue = '';
		this.editTemplates.controls['productTypeForEmailTemplate'].setValue('general');


	}


	onChangeProductTextTemplate(selected: string) {
		this.isDisableCancel = true;
		this.hideEdit = "hide";
		this.isEditShowTextField = "hide";
		this.isDisable = true;
		this.isEditShow = "";
		if (selected == "abl") {
			this.editTemplates.controls['productTypeForTextTemplate'].setValue('abl');
		} else if (selected == 'factoring') {
			this.editTemplates.controls['productTypeForTextTemplate'].setValue('factoring');
		}
		else if (selected == 'termloan') {
			this.editTemplates.controls['productTypeForTextTemplate'].setValue('termloan');
		} else {
			this.editTemplates.controls['productTypeForTextTemplate'].setValue('general');
		}
		this.callTextTemplate(this.editTemplates.controls['productTypeForTextTemplate'].value);

		this.clearSearchBox();

	}
	callTextTemplate(selected: string) {
		this.textTemplatesList = [];
		this._service.getCall('text_message_templates?text_type=' + this.editTemplates.controls['productTypeForTextTemplate'].value).then(i => {
			this.textTemplatesList = this._service.bindData(i);
		});
		this.isReportTemplateShow = 'hide';
		this.isEmailTemplateShow = 'hide';
		this.isTextTemplateShow = '';

		if (this.isTextRadioClicked == false) {
			this.isEditShow = '';
		}
		this.isEditShowField = "hide";
		this.isDisableCancel = false;
		this.isEditShowIcon = "";
		this.selectedValue = 'text_template';
		this.enableSave = 'disable';
		this.isDisable = true;
		this.editTemplates.controls['search_emailpurpose'].setValue('');
		this.selectedListValue = '';
	}

	onClickRadioButtonTextTemplates(event: string) {
		this.radioButtonEvent = event;
		this.isDisableCancel = true;
		this.isDisableTextArea = true;
		this.hideEdit = "hide";
		this.showTextCloseIcon = false;
		this.textTemplatesList = [];
		this._service.getCall('text_message_templates?text_type=general').then(i => {
			this.textTemplatesList = this._service.bindData(i);
		});
		this.isReportTemplateShow = "hide";
		this.isEmailTemplateShow = "hide";
		this.isTextTemplateShow = "";

		if (this.isTextRadioClicked == false) {
			this.isEditShow = '';
		}
		this.isEditShowField = 'hide';
		this.isEditShowIcon = '';
		this.selectedValue = 'text_template';
		this.enableSave = 'disable';
		this.isDisable = true;
		this.editTemplates.controls['search_emailpurpose'].setValue('');
		this.selectedListValue = '';
		this.editTemplates.controls['productTypeForTextTemplate'].setValue('general');
	}

	emaildata(data: string) {
		this.emailId = data;
		this.onClickElementEmail();
		this.clearSearchBox();
	}

	onClickElementEmail() {
		if (this.emailplaceHolderKey != undefined) {
			this.emailplaceHolderKey.splice(0, this.emailplaceHolderKey.length);
			this.emailplaceHolderValue.splice(0, this.emailplaceHolderValue.length);
		}
		this.isEditShowField = '';
		this.isEditShowIcon = 'hide';
		this._service.getCall('email_templates/' + this.emailId).then(i => {
			this.emailTemplates = this._service.bindData(i);
			this.editTemplates.controls['name_from'].setValue(this.emailTemplates.name);
			this.selectedListValue = this.emailTemplates.id;
			this.editTemplates.controls['subject_from'].setValue(this.emailTemplates.subject);
			this.editTemplates.controls['cc'].setValue(this.emailTemplates.cc);
			this.editTemplates.controls['body'].setValue(this.emailTemplates.body);
			this.textEditor.setEditorContent(this.emailTemplates.body);
			this.emailplaceHolderKey = (<any>Object).keys(this.emailTemplates.place_holders);
			this.emailplaceHolderValue = (<any>Object).values(this.emailTemplates.place_holders);
		});
		this.isEmailRadioClicked = true;
		this.enableSave = "emailtrue";
		this.isDisable = true;
		this.hideEdit = "";
		this.isDisableCancel = false;

	}

	data(data: string) {
		this.textId = data;
		this.onClickElementText();
		this.clearSearchBox();
	}

	onClickElementText() {
		this.isDisableTextArea = true;
		if (this.textplaceHolderKey != undefined) {
			this.textplaceHolderKey.splice(0, this.textplaceHolderKey.length);
			this.textplaceHolderValue.splice(0, this.textplaceHolderValue.length);
		}
		this.isEditShowTextField = "";
		this.isEditShow = "hide";
		this.isDisableCancel = false;
		this._service.getCall('text_message_templates/' + this.textId).then(i => {
			this.textTemplates = this._service.bindData(i);
			this.selectedListValue = this.textTemplates.id;
			this.editTemplates.controls['text_from'].setValue(this.textTemplates.from);
			this.editTemplates.controls['text_body'].setValue(this.textTemplates.body);
			this.textplaceHolderKey = (<any>Object).keys(this.textTemplates.place_holders);
			this.textplaceHolderValue = (<any>Object).values(this.textTemplates.place_holders);
		});
		this.isTextRadioClicked = true;
		this.enableSave = "texttrue";
		this.isDisable = true;
		this.hideEdit = "";


	}

	saveEmailTemplates(editTemplates) {
		if (this.enableSave == "emailtrue") {
			this._message.showLoader(true);
			const emailTemplatesModel = {
				'email_template':
					{
						'body': this.textEditor.getEditorContent(),
						'subject': this.editTemplates.controls.subject_from.value,
						'name': this.editTemplates.controls.name_from.value,
						'cc': this.editTemplates.controls.cc.value
					}
			}
			this.requestModel = { url: 'email_templates/' + this.emailId, model: emailTemplatesModel }
			this._service.patchCallRor(this.requestModel).then(i => {
				if (i != undefined) {
					this.navigateToHome();
				}

			});
		}
		else if (this.enableSave == "texttrue") {
			this._message.showLoader(true);
			const textTemplatesModel = {
				'text_message_template':
					{
						'body': this.editTemplates.controls.text_body.value,
					}
			}
			this.requestModel = { url: 'text_message_templates/' + this.textId, model: textTemplatesModel }
			this._service.patchCallRor(this.requestModel).then(i => {
				if (i != undefined) {
					this.navigateToHome();
				}
			});
		}

		else {

		}
	}

	searchEmailPurpose(event) {
		const filteredEmail: any[] = [];
		for (let i = 0; i < this.emailTemplatesList.email_template.length; i++) {
			const tempEmail = this.emailTemplatesList.email_template[i];
			if (tempEmail.purpose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				filteredEmail.push(tempEmail);
			}
		}
		this.emailTemplatesListValue = filteredEmail;
	}

	searchEmailTemplatesByPurpose() {
		this.idData = this.editTemplates.controls['search_emailpurpose'].value;
		this.isDisable = true;
		this.isEditShowField = "";
		this.hideEdit = "";
		this.isEditShowIcon = "hide";
		this.isDisableCancel = false;
		this.enableSave = "emailtrue";
		this.emailId = this.idData.id;
		this._service.getCall('email_templates/' + this.emailId).then(i => {
			this.emailTemplates = this._service.bindData(i);
			this.editTemplates.controls['name_from'].setValue(this.emailTemplates.name);
			this.editTemplates.controls['subject_from'].setValue(this.emailTemplates.subject);
			this.editTemplates.controls['cc'].setValue(this.emailTemplates.cc);
			this.editTemplates.controls['body'].setValue(this.emailTemplates.body);
			this.textEditor.setEditorContent(this.emailTemplates.body);
			this.emailplaceHolderKey = (<any>Object).keys(this.emailTemplates.place_holders);
			this.emailplaceHolderValue = (<any>Object).values(this.emailTemplates.place_holders);
		});
		this.selectedListValue = this.emailId;
		let offset = $('#emailTemplateListCollection li').first().position().top;
		$('#emailTemplateListCollection').scrollTop($("#" + this.selectedListValue).position().top - offset);
	}

	onClickCc() {
		this.isEditShowCc = '';
	}


	searchTextPurpose(event) {
		const filteredEmail: any[] = [];
		for (let i = 0; i < this.textTemplatesList.text_message_templates.length; i++) {
			const tempEmail = this.textTemplatesList.text_message_templates[i];
			if (tempEmail.purpose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				filteredEmail.push(tempEmail);
			}
		}

		this.textTemplatesListValue = filteredEmail;
	}

	searchTextTemplatesByPurpose() {
		this.idData = this.editTemplates.controls['search_textpurpose'].value;
		this.isEditShowTextField = "";
		this.isEditShow = "hide";
		this.hideEdit = "";
		this.isDisable = true;
		this.isDisableCancel = false;
		this.isDisableTextArea = true;
		this.enableSave = "texttrue";
		this.textId = this.idData.id;
		this._service.getCall('text_message_templates/' + this.textId).then(i => {
			this.textTemplates = this._service.bindData(i);
			this.editTemplates.controls['text_from'].setValue(this.textTemplates.from);
			this.editTemplates.controls['text_body'].setValue(this.textTemplates.body);
			this.textplaceHolderKey = (<any>Object).keys(this.textTemplates.place_holders);
			this.textplaceHolderValue = (<any>Object).values(this.textTemplates.place_holders);

		});

		this.selectedListValue = this.textId;
		let offset = $('#textTemplateListCollection li').first().position().top;
		$('#textTemplateListCollection').scrollTop($("#" + this.selectedListValue).position().top - offset);
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		$("#routerLinkId").removeClass("active");
		/*Commenting the particle JS code since its not using currently*/
		//	    particlesJS.load('particles-js', '../assets/particles.json', null);
		this._service.setHeight();

	}

	navigateToHome() {
		
		this.isDisable = true;
		this._message.showLoader(false);
		this._message.addSingle("Record Updated successfully.", "success");
		$(".list-group-item").removeClass("active-list-item");
		
		if (this.radioButtonEvent == "Email Template" || this.radioButtonEvent == "email_template") {
			
			// this.onClickRadioButtonEmailTemplates(this.radioButtonEvent);
			this.isEditShowField = "hide";
			this.isEditShowIcon = "";
			this.enableSave = "emailtrue";
		} else {
			// this.onClickRadioButtonTextTemplates(this.radioButtonEvent);
			this.isEditShowTextField = "hide";
			this.isEditShow = "";
			this.enableSave = "texttrue";
		}



		this.editTemplates.controls['search_emailpurpose'].setValue("");
		this.editTemplates.controls['search_textpurpose'].setValue("");
		this.isDisableCancel = true;
		this.hideEdit = "";
		 this.textEditor.getDisableEditing();
		this.isReadOnly = true;
	}

	navigateToHomeCancel() {
		if (this.radioButtonEvent == "Email Template" || this.radioButtonEvent == "email_template") {
			this.onClickRadioButtonEmailTemplates(this.radioButtonEvent);
		} else {
			this.onClickRadioButtonTextTemplates(this.radioButtonEvent);
		}
		this.isEditShowField = "hide";
		this.isEditShowIcon = "";
		this.editTemplates.controls['search_emailpurpose'].setValue("");
		this.editTemplates.controls['search_textpurpose'].setValue("");
		this.isDisable = true;
		this.isEditShowTextField = "hide";
		this.isEditShow = "";
		this.isDisableCancel = true;

	}

	clearSearchBox() {
		this.editTemplates.controls['search_emailpurpose'].setValue('');
		this.editTemplates.controls['search_textpurpose'].setValue('');
		this.showEmailCloseIcon = false;
		this.showTextCloseIcon = false;
	}

	setTextCloseIcon() {
		if (this.editTemplates.controls['search_textpurpose'].value == "") {
			this.showTextCloseIcon = false;
		}
		else {
			this.showTextCloseIcon = true;
		}
	}

	setEmailCloseIcon() {
		if (this.editTemplates.controls['search_emailpurpose'].value == "") {
			this.showEmailCloseIcon = false;
		}
		else {
			this.showEmailCloseIcon = true;
		}
	}

	onClickEdit() {
		this.textEditor.getEnableEditing();
		this.isDisable = false;
		this.isDisableTextArea = false;
		this.isDisableCancel = false;
		this.isReadOnly = false;
	}

	onClickReset() {
		this.isEditShowIcon = "";
		this.isEditShowField = "hide";
		this.isEditShowCc = "hide"
		this.selectedValue = "email_template";
		if (this.radioButtonEvent == "Email Template" || this.radioButtonEvent == "email_template") {
			this.onChangeProductEmailTemplate('general');
		} else {
			this.onChangeProductTextTemplate('general');
		}
		//this.onChangeProductEmailTemplate('general');
		this.isDisable = true;
		this.isDisableCancel = true;

	}
}