import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { Router } from "@angular/router";
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { Location } from '@angular/common';
import { CalendarModule } from 'primeng/primeng';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment';
import intlTelInput from 'intl-tel-input';

@Component({
	selector: 'app-create-user-new',
	templateUrl: './create-user.component.new.html',
	styleUrls: ['./create-user.component.new.css']
})
export class CreateUserNewComponent implements OnInit, AfterViewInit{

	userId: any;
	isDisable: boolean = false;
	userDetails: any;
	currentAction: string = 'Add';
	addEditUser: FormGroup;
	requestModel: any;
	headerText: any = "User";
	rolesList: any[];
	parentBorrowersList: any[];

	salesRegionSelectedList: SelectItem[];
	salesRegionsList: SelectItem[];

	loanParties: any[];
	executiveManager: any[];
	startTimeInMinutes: any;
	endTimeInMinutes: any;
	currentDate: Date = new Date();
	isUserLoginValid: boolean = true;
	isUserNameValid: boolean = true;
	isPhoneNoValid: boolean = true;
	isEmailValid: boolean = true;
	userType: string = "N";
	t_and_c_type: string = "Not Required";
	t_and_c_enabled: boolean = false;
	t_and_c_updated_at = "";
	startDate: string = " ";
	endDate: string = " ";
	saveAndNew: boolean = false;
	selected: string = "null";
	us: string = 'us';
	count: number = 0;
	isMultiFactorAuth = false;
	isFormSubmitted = false;
	isClientActivationCheckBoxHidden: boolean = true;
	termsAndConditionShowAndHideDate: boolean;
	/*fixed #CYNCS-7019:  MultiDropDown Style */
	dropDownScrollHeight = "92px";
	multidropDownStyle: any = {
		width: '290px',
		height: '32px',
		display: 'block'
	}
	hideAndShowTermsAndConditionDateStatus: boolean = true;
	hideAndShowTermsAndCondition: boolean = true;
	

	constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService) {

		this.addEditUser = this.fb.group({
			user_login: new FormControl('', Validators.compose([Validators.required])),
			user_name: new FormControl('', Validators.compose([Validators.required])),
			role: new FormControl('', Validators.compose([Validators.required])),
			parent_borrower: new FormControl(''),
			executive_manager: new FormControl(''),
			participation_party: new FormControl(''),
			phoneNo: new FormControl('', Validators.compose([])),
			phoneId: new FormControl(),
			email: new FormControl('', Validators.compose([Validators.required])),
			sales_region: new FormControl(''),
			user_type: new FormControl(''),
			t_and_c_type: new FormControl(''),
			t_and_c_updated_at: new FormControl(''),
     		extendLoginTimeChkBox: new FormControl(''),
			start_date: new FormControl(''),
			end_date: new FormControl(''),
			startTime: new FormControl(''),
			endTime: new FormControl(''),
			userStatusChkbox: new FormControl(''),
			resendActEmailChkbox: new FormControl(''),
			clientActivationEmail: new FormControl(false)
		});

		this._service.getCall('roles/data_for_user_creation?sort_by=ASC').then(i => {
			this.rolesList = this._service.bindData(i).roles;
			if (this.currentAction == 'Add') {
				this.addEditUser.controls['role'].setValue(this.rolesList[0]);
			}
		});

		this._service.getCall('/borrowers').then(i => {
			this.parentBorrowersList = this._service.bindData(i).borrowers;
		});

		this._service.getCall('/general_codes/sales_regions/data_for_user_creation').then(i => {

			/*fixed for #CYNCS-7019: Multiple dropwdown  object formate change */
			let tempSalesResions = this._service.bindData(i).sales_regions.map(elm => {
				return { value: elm.id, label: elm.name, region: elm.region };
			});
			this.salesRegionsList = tempSalesResions;

		});
		this.participationParty();
		this.executiveManagerList();
	}

	ngOnInit() {

		this.isMultiFactorAuth = CyncConstants.getMultiFactorAuth();
		if (this.isMultiFactorAuth) {
			this.addEditUser['controls'].phoneNo.setValidators([Validators.required]);
		} else {
			this.addEditUser['controls'].phoneNo.setValidators(null);
		}
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this._service.setHeight();
		this.route.params.subscribe(params => {
			this.userId = params['id'];
			if (this.userId !== undefined && this.userId !== 'add') {
				this.isDisable = true;
				this.currentAction = 'Edit';
				this.headerText = "User - Edit";
				this._service.getCall("admin/users/" + this.userId).then(i => {
					this.userDetails = this._service.bindData(i);
					// this.preselected = this.userDetails.sales_region_ids;

					if (this.userDetails.client_activation_deactivation_email != null) {
						this.isClientActivationCheckBoxHidden = false;
					}
					this.addEditUser.controls['t_and_c_type'].setValue(this.userDetails.t_and_c_type);
          this.t_and_c_enabled = this.userDetails.t_and_c_enabled == true;
					let roleIndex: any;
					this._service.getCall('roles/data_for_user_creation?sort_by=ASC').then(i => {
						this.rolesList = this._service.bindData(i).roles;
						for (let i = 0; i < this.rolesList.length; i++) {
							let tempRoleObj = this.rolesList[i];
							if (tempRoleObj.id == this.userDetails.role) {
								roleIndex = i;
								this.addEditUser.controls['role'].setValue(this.rolesList[roleIndex]);
								if (this.addEditUser.controls['role'].value.role_type == 'PP') {
									this.addEditUser.controls['participation_party'].setValue(this.userDetails.loan_party_id);
									this.selected = this.userDetails.loan_party_id;
								}
								if (this.addEditUser.controls['role'].value.role_type == 'P') {
									this.addEditUser.controls['executive_manager'].setValue(this.userDetails.parent_user_id);
									this.selected = this.userDetails.parent_user_id;
								}

								if(["PP","B"].includes(this.addEditUser.controls['role'].value.role_type) && this.userDetails.t_and_c_enabled == true ){
								  this.hideAndShowTermsAndCondition = false;
								  if(this.addEditUser.controls['t_and_c_type'].value == null || this.addEditUser.controls['t_and_c_type'].value == undefined || this.addEditUser.controls['t_and_c_type'].value == ""){
								   this.addEditUser.controls['t_and_c_type'].setValue("Not Required");
								  }
								 this.showAndHideUserDateOfStatus();
								}	
							}
						}
					});
					this.addEditUser.controls['user_login'].setValue(this.userDetails.login);
					this.addEditUser.controls['user_name'].setValue(this.userDetails.user_name);
					if (this.userDetails.borrower_id != null || this.userDetails.borrower_id != "null") {
						this.selected = this.userDetails.borrower_id;
					}
					//	this.salesRegionSelectedList = this.userDetails.sales_region_ids;
					this.addEditUser.controls['phoneNo'].setValue(this.userDetails.phone_no);
					this.addEditUser.controls['email'].setValue(this.userDetails.email);
					this.addEditUser.controls['sales_region'].setValue(this.userDetails.sales_region_ids);
					this.addEditUser.controls['user_type'].setValue(this.userDetails.user_type);
					// if(this.userDetails.t_and_c_enabled===true){
					// 	this.hideAndShowTermsAndCondition = 'show'
					// 	this.hideAndShowTermsAndConditionDateStatus = 'show';
					// 	this.showAndHideUserDateOfStatus();
					// }else{
					// 	this.hideAndShowTermsAndCondition = 'hide'
					// 	this.hideAndShowTermsAndConditionDateStatus = 'hide';
					// 	this.showAndHideUserDateOfStatus();
					// }
					let updateStatus="";
					if(this.userDetails.t_and_c_status==="Accepted" || this.userDetails.t_and_c_status==="Declined"){
						updateStatus=this.userDetails.t_and_c_status+" - "+ moment(this.userDetails.t_and_c_updated_at).format("MM/DD/YYYY")
					}else{
						updateStatus=this.userDetails.t_and_c_status
					}
					this.addEditUser.controls['t_and_c_updated_at'].setValue(updateStatus);
					this.addEditUser.controls['userStatusChkbox'].setValue(this.userDetails.active);
					this.addEditUser.controls['resendActEmailChkbox'].setValue(this.userDetails.resend_activation_email);
					this.addEditUser.controls['clientActivationEmail'].setValue(this.userDetails.client_activation_deactivation_email);
					if (this.userDetails.user_type == 'E') {

						//	this.addEditUser.controls['start_date'].setValue(this.formatDate(this.userDetails.start_date));
						//	this.addEditUser.controls['end_date'].setValue(this.formatDate(this.userDetails.end_date));

						this.addEditUser.controls['start_date'].setValue(moment(this.userDetails.start_date).format("MM/DD/YYYY"));
						this.addEditUser.controls['end_date'].setValue(moment(this.userDetails.end_date).format("MM/DD/YYYY"));
					}
					if (this.userDetails.extend_status == null || this.userDetails.extend_status == false) {
						this.addEditUser.controls['extendLoginTimeChkBox'].setValue(false);
						this.addEditUser.controls['startTime'].setValue('');
						this.addEditUser.controls['endTime'].setValue('');
					} else if (this.userDetails.extend_status != null) {
						this.addEditUser.controls['extendLoginTimeChkBox'].setValue(true);
						let startHr = Math.floor(this.userDetails.extended_time_before_start / 60);
						let startMin = this.userDetails.extended_time_before_start % 60;
						let endHr = Math.floor(this.userDetails.extended_time_after_end / 60);
						let endMin = this.userDetails.extended_time_after_end % 60;
						let startTimeTmp = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), startHr, startMin, this.currentDate.getSeconds());
						let endTimeTmp = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), endHr, endMin, this.currentDate.getSeconds());
						this.addEditUser.controls['startTime'].setValue(startTimeTmp);
						this.addEditUser.controls['endTime'].setValue(endTimeTmp);
					}
					this.initializeTelphone();
					this.showAndHideUserDateOfStatus();
				})
			} else {
				this.currentAction = 'Add';
				this.headerText = "User - Add";
				this._message.showLoader(false);
				try{
		      this._service.getCall('legal_texts?reference=GENERAL&text_type=t_and_c_USER').then(i  => {
		       this.t_and_c_enabled = (this._service.bindData(i).enabled == true ? true : false);
		      })
		    }catch (e){
		      console.log(e);
		    }
			}
		});

		this.initializeTelphone();
	
	}

	ngAfterViewInit(){
		
	}

	initializeTelphone(){
		const input = document.querySelector("#phoneNo");
		const intlput = new intlTelInput(input, {});
		if(this.userDetails){
			setTimeout( () => {
				let ph =this.userDetails.phone_no;
				if(ph.substr(0,2)==='+1'){
					intlput.setCountry("us");
					intlput.setNumber(this.userDetails.phone_no);
				}else if(ph.substr(0,3)==='+91'){
				   intlput.setCountry("in");
				   intlput.setNumber(this.userDetails.phone_no);
				}else if(ph.substr(0,3)==='+44'){
					intlput.setCountry("uk");
					intlput.setNumber(this.userDetails.phone_no);
				}else if(ph.substr(0,3)==='+61'){
					intlput.setCountry("au");
					intlput.setNumber(this.userDetails.phone_no);
				}else {
					intlput.setCountry("ca");
					intlput.setNumber(this.userDetails.phone_no);
				}
	
			}, 2000);
		}
	}
	
	formatDate(date) {
		let now = new Date(date);
		let offSet = -300;
		now.setTime(now.getTime() + offSet * 60 * 1000);
		let now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		let month = '' + (now_utc.getMonth() + 1);
		let day = '' + now_utc.getDate();
		const year = now_utc.getFullYear();
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		return [month, day, year].join('/');
	}

	onRoleChange() {
		this.hideAndShowTermsAndCondition = true;
		this.hideAndShowTermsAndConditionDateStatus = true;
		this.count = this.count + 1;
		// this.hideAndShowTermsAndCondition = 'hide';
		// this.hideAndShowTermsAndConditionDateStatus = 'hide';
		if (this.addEditUser.controls['role'].value.role_type == 'B') {
			if(this.t_and_c_enabled){
       	this.hideAndShowTermsAndCondition = false ;
         if(this.addEditUser.controls['t_and_c_type'].value == null || this.addEditUser.controls['t_and_c_type'].value == undefined || this.addEditUser.controls['t_and_c_type'].value == ""){
					   this.addEditUser.controls['t_and_c_type'].setValue("Not Required");
					}
					this.showAndHideUserDateOfStatus();
			}
			if (this.currentAction != 'Edit') {
				this.selected = this.userDetails != undefined ? this.userDetails.borrower_id : null;
			} else {
				if (this.count == 1 && (this.userDetails != undefined && this.userDetails.borrower_id != null || this.userDetails.borrower_id != "null")) {
					this.selected = this.userDetails.borrower_id;

				} else {
					this.addEditUser.controls['parent_borrower'].setValue(null);
				}
			}
		} else if (this.addEditUser.controls['role'].value.role_type == 'PP') {
			this.selected = this.userDetails != undefined ? this.userDetails.loan_party_id : null;
			if(this.t_and_c_enabled){
       	this.hideAndShowTermsAndCondition = false ;
       	 if(this.addEditUser.controls['t_and_c_type'].value == null || this.addEditUser.controls['t_and_c_type'].value == undefined || this.addEditUser.controls['t_and_c_type'].value == ""){
					   this.addEditUser.controls['t_and_c_type'].setValue("Not Required");
				 }
				 this.showAndHideUserDateOfStatus();
			}
		} else if (this.addEditUser.controls['role'].value.role_type == 'A') {
		}
		 else if (this.addEditUser.controls['role'].value.role_type == 'P') {
			this.selected = this.userDetails != undefined ? this.userDetails.parent_user_id : null;
			//  this.isClientActivationCheckBoxHidden = false;
		        this.addEditUser.controls['clientActivationEmail'].setValue(true);
		} else if (this.addEditUser.controls['role'].value.role_type == 'C') {
			    // this.isClientActivationCheckBoxHidden = false;
			     this.addEditUser.controls['clientActivationEmail'].setValue(true);
		} else {
			this.selected = "null";
			//  this.isClientActivationCheckBoxHidden = true;
		}

		if(this.addEditUser.controls['role'].value.role_type == 'P' || this.addEditUser.controls['role'].value.role_type == 'C')
	    {
		this.isClientActivationCheckBoxHidden = false;
	    } else {
			this.isClientActivationCheckBoxHidden = true;
		}
	}

	
	showAndHideUserDateOfStatus(){
	  if (this.addEditUser.controls['t_and_c_type'].value === 'Required'){
			this.hideAndShowTermsAndConditionDateStatus = false;	
	  } else{
			this.hideAndShowTermsAndConditionDateStatus = true;
	  }
	}

	getStartTime() {
		let startTimeHours = this.addEditUser.controls['startTime'].value.getHours();
		let startTimeMinutes = this.addEditUser.controls['startTime'].value.getMinutes();
		this.startTimeInMinutes = startTimeMinutes + (startTimeHours * 60);
	}

	getEndTime() {
		let endTimeHours = this.addEditUser.controls['endTime'].value.getHours();
		let endTimeMinutes = this.addEditUser.controls['endTime'].value.getMinutes();
		this.endTimeInMinutes = endTimeMinutes + (endTimeHours * 60);
	}

	saveNew() {
		this.saveAndNew = true;
		this.saveData();
	}

	saveData() {
		this.isFormSubmitted = true;
		if (this.addEditUser.valid) {
			//	let salesRegionId: any;
			let borrowerId: any;
			let loan_party_id: any;
			let parent_user_id: any;

			// if (this.addEditUser.controls['sales_region'].value != undefined && this.addEditUser.controls['sales_region'].value != '' && this.addEditUser.controls['sales_region'].value > 0) {
			// 	salesRegionId = this.addEditUser.controls['sales_region'].value;
			// } else {
			// 	salesRegionId = null;
			// }
			if (this.addEditUser.controls['parent_borrower'].value != undefined && this.addEditUser.controls['parent_borrower'].value != '' && this.addEditUser.controls['parent_borrower'].value > 0) {
				borrowerId = this.addEditUser.controls['parent_borrower'].value;
			} else {
				borrowerId = null;
			}
			if (this.addEditUser.controls['role'].value.role_type == 'PP') {
				loan_party_id = this.addEditUser.controls['participation_party'].value;
			} else {
				loan_party_id = null;
			}
			if (this.addEditUser.controls['role'].value.role_type == 'P') {
				parent_user_id = this.addEditUser.controls['executive_manager'].value;
			} else {
				parent_user_id = null;
			}

			if (this.addEditUser.controls['user_type'].value == 'E') {
				var sd = new Date(this.addEditUser.controls['start_date'].value);
				let monthsd = '' + (sd.getMonth() + 1);
				let daysd = '' + sd.getDate();
				let yearsd = sd.getFullYear();
				if (monthsd.length < 2) monthsd = '0' + monthsd;
				if (daysd.length < 2) daysd = '0' + daysd;
				this.startDate = [monthsd, daysd, yearsd].join('/');
				var ed = new Date(this.addEditUser.controls['end_date'].value);
				let monthed = '' + (ed.getMonth() + 1);
				let dayed = '' + ed.getDate();
				let yeared = ed.getFullYear();
				if (monthed.length < 2) monthed = '0' + monthed;
				if (dayed.length < 2) dayed = '0' + dayed;
				this.endDate = [monthed, dayed, yeared].join('/');
			} else {
				this.startDate = " ";
				this.endDate = " ";
			}

			if (this.isDisable) {
				const userModelWithExtendLogin = {
					"user": {
						"login": this.addEditUser.controls['user_login'].value,
						"user_name": this.addEditUser.controls['user_name'].value,
						"email": this.addEditUser.controls['email'].value,
						"selected_user_role_id": this.addEditUser.controls['role'].value.id,
						"sales_region_ids": this.salesRegionSelectedList,
						"borrower_id": borrowerId,
						"loan_party_id": loan_party_id,
						"parent_user_id": parent_user_id,
						"user_type": this.addEditUser.controls['user_type'].value,
						"t_and_c": this.addEditUser.controls['t_and_c_type'].value,
						"start_date": this.startDate,
						"end_date": this.endDate,
						"active": this.addEditUser.controls['userStatusChkbox'].value,
						"resend_activation_email": this.addEditUser.controls['resendActEmailChkbox'].value,
						"client_activation_deactivation_email": this.addEditUser.controls['clientActivationEmail'].value,
						"phone_no": this.addEditUser.controls['phoneNo'].value,
						"extended_login_attributes": {
							"id": this.userDetails.extend_id,
							"extend_status": true,
							"extended_time_before_start": this.startTimeInMinutes,
							"extended_time_after_end": this.endTimeInMinutes
						}
					}
				};

				const userModelWithOutExtendLogin = {
					"user": {
						"login": this.addEditUser.controls['user_login'].value,
						"user_name": this.addEditUser.controls['user_name'].value,
						"email": this.addEditUser.controls['email'].value,
						"selected_user_role_id": this.addEditUser.controls['role'].value.id,
						"sales_region_ids": this.salesRegionSelectedList,
						"borrower_id": borrowerId,
						"loan_party_id": loan_party_id,
						"parent_user_id": parent_user_id,
						"user_type": this.addEditUser.controls['user_type'].value,
						"t_and_c": this.addEditUser.controls['t_and_c_type'].value,
						"start_date": this.startDate,
						"end_date": this.endDate,
						"active": this.addEditUser.controls['userStatusChkbox'].value,
						"resend_activation_email": this.addEditUser.controls['resendActEmailChkbox'].value,
						"client_activation_deactivation_email": this.addEditUser.controls['clientActivationEmail'].value,
						"phone_no": this.addEditUser.controls['phoneNo'].value,
						"extended_login_attributes": {
							"id": this.userDetails.extend_id,
							"extend_status": false,
							"extended_time_before_start": null,
							"extended_time_after_end": null
						}
					}
				};
				const resendActivationEmailModel = {
					'user': {
						'selected_user_role_id': this.addEditUser.controls['role'].value.id,
						'resend_activation_email': this.addEditUser.controls['resendActEmailChkbox'].value,
						'phone_no':this.addEditUser.controls['phoneNo'].value
					}
				}

				if (this.userDetails.extend_id == null && this.addEditUser.controls['extendLoginTimeChkBox'].value && this.startTimeInMinutes != undefined && this.endTimeInMinutes != undefined) {
					/*Model to make a post call to extend login for first time */
					const extendLoginModel = {
						"extended_login": {
							"user_id": this.userId,
							"extend_status": "1",
							"extended_time_before_start": this.startTimeInMinutes,
							"extended_time_after_end": this.endTimeInMinutes
						}
					};
					/*console.log("****userModelWithOutExtendLogin-----",userModelWithOutExtendLogin);*/
					this.requestModel = { url: 'admin/users/' + this.userId, model: userModelWithOutExtendLogin }
					this._service.patchCallRor(this.requestModel).then(i => {
						if (this.addEditUser.controls['resendActEmailChkbox'].value == true) {
							let resendActEmailRequestModel = { url: 'admin/users/' + this.userId, model: resendActivationEmailModel };
							this._service.patchCallRor(resendActEmailRequestModel);
						}
						let requestModelTmp = { url: 'users/' + this.userId + '/extended_logins', model: extendLoginModel }
						this._service.postCallpatch(requestModelTmp).then(r => this.navigateToHome());

					});

				} else if (this.addEditUser.controls['extendLoginTimeChkBox'].value == false) {
					/*console.log(">>>>>userModelWithOutExtendLogin-----",userModelWithOutExtendLogin);*/
					this.requestModel = { url: 'admin/users/' + this.userId, model: userModelWithOutExtendLogin }
					this._service.patchCallRor(this.requestModel).then(i => {
						if (this.addEditUser.controls['resendActEmailChkbox'].value == true) {
							let resendActEmailRequestModel = { url: 'admin/users/' + this.userId, model: resendActivationEmailModel };
							this._service.patchCallRor(resendActEmailRequestModel);
						}
						this.navigateToHome();
					});
				}
				else {
					/*console.log("::::::userModelWithExtendLogin-----",userModelWithExtendLogin);*/
					this.requestModel = { url: 'admin/users/' + this.userId, model: userModelWithExtendLogin }
					this._service.patchCallRor(this.requestModel).then(i => {
						if (this.addEditUser.controls['resendActEmailChkbox'].value == true) {
							let resendActEmailRequestModel = { url: 'admin/users/' + this.userId, model: resendActivationEmailModel };
							this._service.patchCallRor(resendActEmailRequestModel);
						}
						this.navigateToHome();
					});
				}




			} else {
				/*Add User*/
				if (borrowerId > 0 || borrowerId == null) {
					const userModel = {
						"user": {
							"login": this.addEditUser.controls['user_login'].value,
							"user_name": this.addEditUser.controls['user_name'].value,
							"email": this.addEditUser.controls['email'].value,
							"selected_user_role_id": this.addEditUser.controls['role'].value.id,
							"user_type": this.addEditUser.controls['user_type'].value,
							"t_and_c": this.addEditUser.controls['t_and_c_type'].value,
							"start_date": this.startDate,
							"end_date": this.endDate,
							"sales_region_ids": this.salesRegionSelectedList,
							"borrower_id": borrowerId,
							"loan_party_id": loan_party_id,
							"parent_user_id": parent_user_id,
							"active": true,
							"resend_activation_email": false,
							"phone_no": this.addEditUser.controls['phoneNo'].value,
							"client_activation_deactivation_email": this.addEditUser.controls['clientActivationEmail'].value
						}
					};
					this.requestModel = { url: 'admin/users', model: userModel }
					this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
				}
			}

		} else {
			this.checkUserLogin();
			this.checkUserName();
			this.checkPhoneNo();
			this.checkEmail();
		}
	}

	// Its's Executive Manager list
	executiveManagerList() {
		this._service.getCall('/users/get_executive_manager').then(i => {
			this.executiveManager = this._service.bindData(i).executive_manager;
		});
	}


	// Its's Return the Participation Loaners list
	participationParty() {
		this._service.getCall('/loan_parties').then(i => {
			this.loanParties = this._service.bindData(i).loan_party_lists;
		});
	}

	checkUserLogin() {
		if (!this.addEditUser.controls['user_login'].valid) {
			this.isUserLoginValid = false;
		} else {
			this.isUserLoginValid = true;
		}
	}

	checkUserName() {
		if (!this.addEditUser.controls['user_name'].valid) {
			this.isUserNameValid = false;
		} else {
			this.isUserNameValid = true;
		}
	}

	checkPhoneNo() {
		if (!this.addEditUser.controls['phoneNo'].valid) {
			this.isPhoneNoValid = false;
		} else {
			this.isPhoneNoValid = true;
		}
	}

	checkEmail() {
		if (!this.addEditUser.controls['email'].valid) {
			this.isEmailValid = false;
		} else {
			this.isEmailValid = true;
		}
	}

	navigateToHome() {
		if (!this.saveAndNew) {
			//this._location.back();
			this._router.navigateByUrl("userMaintenance/create-user");
		} else {
			this.addEditUser.reset();
			this.addEditUser.controls['role'].setValue(this.rolesList[0]);
			this.addEditUser.controls['user_type'].setValue("N");
			this.saveAndNew = false;
		}

		this._message.showLoader(false);
		if (this.isDisable) {
			this._message.addSingle("Record updated successfully.", "success");
		} else {
			this._message.addSingle("Record saved successfully.", "success");
		}
	}

	navigateToHomeCancel() {
		//this._location.back();  
		this._router.navigateByUrl("userMaintenance/create-user");
	}

	/*Changes for CYNCUXT-2811 begin*/
	onStatusChange() {
		if (this.addEditUser.controls['userStatusChkbox'].value == 'false') {
			this.addEditUser.controls['resendActEmailChkbox'].setValue(false);
		}
	}
	/*Changes for CYNCUXT-2811 ends*/

	/**
	* Phone number validation 
	* @param field 
	*/
	displayCssField(field: string) {
		return this.getFieldCss(field, this.addEditUser);
	}

	/**
	* this method will return the css to highlight the input filed if validation
	* fails
	* @param field
	* @param form
	*/
	getFieldCss(field: string, form: FormGroup) {
		return {
			'edit-user-phone-error-custom input-group': this.isFieldValid(field, form)
		};
	}

	/**
	* this method will check if user has done focus on field but
	* has not entered anything
	* @param field
	* @param form
	*/
	isFieldValid(field: string, form: FormGroup): boolean {
		if (this.isFormSubmitted && !form.get(field).valid) {
			return true;
		} else {
			return !form.get(field).valid && form.get(field).touched;
		}
	}

}
