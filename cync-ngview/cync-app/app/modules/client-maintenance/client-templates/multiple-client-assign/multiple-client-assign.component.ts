import { Component, OnInit, AfterViewInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ClientTemplatesService } from '../service/client-templates.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MatDialog } from '@angular/material';
import { AssignClientPopupComponent } from './assign-client-popup/assign-client-popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EMLINK } from 'constants';
import { MultipleClientAssignSaveModel } from './multiple-client-assign-model/multiple-client-assign.model';

@Component({
	selector: 'app-multiple-client-assign',
	templateUrl: './multiple-client-assign.component.html',
	styleUrls: ['./multiple-client-assign.component.scss']
})

export class MultipleClientAssignComponent implements OnInit, AfterViewInit {
	source = [];
	confirmed = [];
	borrowers: any = [];
	ablBorrowers: any = [];
	clientTemplateBasicData: any;
	partialData: any;
	templateArrayForDropdown: any;
	selectedTemplatedropdown: string;
	descValue: any;
	btnStyle1: string;
	btnStyle2: string;
	btnStyle3: string;
	flag1: string;
	flag2: string;
	flag3: string;
	templateId: any;
	labelName: any;
	borrowerIds = [];
	clientTemplateViewData: any;
	partialViewData: any;
	basicparameter: any;
	bucketageing: any;
	ineligiblecalculation: any;
	basicParameterDataFromChild: any;
	ineligibleDataFromChild: any;
	bucketDataFromChild: any;
	assignType: any;
	combainedData = [];
	bucketAgingData: any = [];
	basicparameterId: any;
	enableAssignbtn: boolean;
	previousDropdownVal: any = "";
	initialDropdownVal: any = "";

	constructor(private apiMapper: APIMapper,
		private helper: Helper,
		private clientTemplateService: ClientTemplatesService,
		private message: MessageServices,
		public dialog: MatDialog,
		private router: Router,
		private clientTemplateDetails: ClientTemplatesService,
		private route: ActivatedRoute) {
		this.selectedTemplatedropdown = '';
		this.route.params.subscribe(params => this.templateId = params.id);

	}

	ngOnInit() {
		this.enableAssignbtn = true;
		if (this.templateId != "assigned") {
			this.getTemplateViewDetails(this.templateId);
			this.shareTemplateId();
		}

		this.getListOfClients();
		this.getTemplateDetails();
		this.combainedData = [];
		//tab button initial stage
		this.flag1 = "active";
		this.flag2 = "inactive";
		this.flag3 = "inactive";
		this.btnStyle1 = "linkBtnActive";

		if (this.templateId === "assigned") {
			$("#ineligiblePill").hide();
			$("#bucketAgePill").hide();
			$("#bpPill").hide();
			this.flag1 = "inactive";
			this.flag2 = "inactive";
			this.flag3 = "inactive";
			this.initialDropdownVal = "pleseSelect";
		}

		// geting basic parameter data from child componet
		this.clientTemplateDetails.getMultiClientBasicParameterData().subscribe(data => {
			this.basicParameterDataFromChild = {};
			this.basicParameterDataFromChild = data;
			this.dataForPost({ "basicParameter": this.basicParameterDataFromChild });
		})

		// geting ineligible calculation data from child componet
		this.clientTemplateDetails.getMultiClienIneligibleCalculation().subscribe(data => {
			this.ineligibleDataFromChild = {};
			this.ineligibleDataFromChild = data;
			this.dataForPost({ "ineligible": this.ineligibleDataFromChild });
		})
		this.clientTemplateDetails.getMultiClienBucketAging().subscribe(data => {
			this.bucketDataFromChild = {};
			this.bucketDataFromChild = data;
			this.dataForPost({ "bucket_aging": this.bucketDataFromChild });

		});

		// geting basic parameter blank template form data from child componet
		this.clientTemplateDetails.getMultiClientBasicParameterBlankDataForPost().subscribe(data => {
			this.dataForBlankPost({ "basicParameter": data });
		})

	}

	ngAfterViewInit() {
		let useHeight = (68 / 100) * window.screen.height;
		$("#app-body-container").height(useHeight);
	}

	//Get client template parameter details //

	getTemplateViewDetails(id: any) {
		this.clientTemplateViewData = this.clientTemplateDetails.gettemplateviewdetails('client_templates/' + id).subscribe(data => {
			this.partialViewData = <any>JSON.parse(data._body);
			this.clientTemplateViewData = this.partialViewData.data;
			console.log(this.clientTemplateViewData.parameter.data.id);
			this.basicparameterId = this.clientTemplateViewData.parameter.data.id
			// sharing all template data with child components
			this.clientTemplateDetails.receiveTemplateData(this.clientTemplateViewData);

			// sharing basic parameter id
			this.clientTemplateDetails.setBasicParameterId(this.basicparameterId);
		})
	}
	//Get list of abl clients //
	getListOfClients() {
		this.message.showLoader(true);
		let url = this.apiMapper.endpoints[CyncConstants.GET_BORROWERS];
		this.clientTemplateService.getBorrowers(url).subscribe(response => {
			this.borrowers = JSON.parse(response._body).borrowers;
			this.ablBorrowers = this.borrowers.filter(ele => {
				return (ele.processng_type === "ABL" && ele.active === true);
			});
			this.ablBorrowers.forEach(element => {
				this.source.push(element)
			});
			this.message.showLoader(false);
		})
	}

	//pick list method to get assigned clients //
	onMoveToTarget(event) {
		this.borrowerIds = [];
		this.confirmed.forEach(ele => {
			this.borrowerIds.push(ele.id);
		});
		if (this.labelName === 'Please Select' || this.borrowerIds.length < 1) {
			this.enableAssignbtn = true;
		}

		else if (this.labelName === 'Please Select' && this.borrowerIds.length < 1) {
			this.enableAssignbtn = true;
		}

		else if (this.labelName === 'Blank Template' && this.borrowerIds.length === 0) {
			this.enableAssignbtn = true;
		}

		else {
			this.enableAssignbtn = false;
		}
	}
	//pick list method to get not assigned clients //
	onMoveToSource(event: any) {

		if (this.labelName === 'Please Select' || this.confirmed.length === 0) {
			this.enableAssignbtn = true;
		}

		else if (this.labelName === 'Please Select' && this.confirmed.length === 0) {
			this.enableAssignbtn = true;
		}

		else if (this.labelName === 'Blank Template' && this.confirmed.length === 0) {
			this.enableAssignbtn = true;
		}

		else {
			this.enableAssignbtn = false;
		}
	}

	onMoveAllToTarget(event) {
		this.message.showLoader(true);
		if ((this.ablBorrowers).length === (this.confirmed).length) {
			this.message.showLoader(false);
		}
	}

	//method to open pop-up for assign template //
	openAssignClientDialog() {
		if (this.labelName === 'Blank Template') {
			this.clientTemplateService.setMultiClientBasicParameterBlankData("blank");
		} else {
			const dialogRef = this.dialog.open(AssignClientPopupComponent, {
				width: '40vw',
				height: "auto",
				disableClose: true
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result !== undefined) {
					let url = '';
					if (result.assign === 'update') {
						this.assignType = 'update';
						this.clientTemplateService.setConfirmMultiAsignDataFetch("fetch");
						url = this.apiMapper.endpoints[CyncConstants.UPDATE_TEMPLATE].replace('{templateId}', this.templateId);
						let message = "Parameters are successfully One-Time Assigned and Template is updated"
						this.assignTemplate(url, '', '', message);
					} else if (result.assign === 'notupdate') {
						this.assignType = 'notupdate';
						this.clientTemplateService.setConfirmMultiAsignDataFetch("fetch");
						url = this.apiMapper.endpoints[CyncConstants.DO_NOT_UPDATE_TEMPLATE].replace('{templateId}', this.templateId);
						let message = "Parameters are successfully One-Time Assigned"
						this.assignTemplate(url, '', '', message);
					} else if (result.assign === 'copy') {
						this.assignType = 'copy';
						this.clientTemplateService.setConfirmMultiAsignDataFetch("fetch");
						url = this.apiMapper.endpoints[CyncConstants.COPY_TEMPLATE].replace('{templateId}', this.templateId);
						let message = "Parameters are successfully One-Time Assigned and a new copy is created"
						this.assignTemplate(url, result.fname, result.fdesc, message);
					}
				}
			});

		}
	}
	//method to  get respective template data //

	getTemplateDetails() {
		this.clientTemplateBasicData = this.clientTemplateDetails.gettemplatedetails('client_templates').subscribe(data => {
			this.partialData = <any>JSON.parse(data._body);
			this.clientTemplateBasicData = this.partialData.data;
			this.partialData.data.unshift(
				{
					id: '-1',
					name: "Please Select",
					description: "",
					status: true,
					default: false
				},
				{
					id: '',
					name: "Blank Template",
					description: "",
					status: true,
					default: false
				});
			let filteredTemplateArray = (this.clientTemplateBasicData).filter(function (obj) {
				return obj.status == true;
			});
			this.selectedTemplatedropdown = this.templateId
			this.templateArrayForDropdown = Array.of(filteredTemplateArray);
			this.templateArrayForDropdown = this.templateArrayForDropdown[0];
			this.templateArrayForDropdown = this.templateArrayForDropdown.map(elm => {
				return { 'value': elm.id, 'label': elm.name, 'dsc': elm.description };
			});

			if (this.templateId != 'assigned') {
				const tempFilterObject = this.templateArrayForDropdown.filter(elm => elm.value == this.templateId);
				this.descValue = tempFilterObject['0'].dsc;
				this.labelName = tempFilterObject['0'].label;
			}

			if (this.templateId === 'assigned') {
				const tempFilterObject = this.templateArrayForDropdown.filter(elm => elm.value === this.templateArrayForDropdown[0].value);
				this.labelName = tempFilterObject['0'].label;
			}

		});
	}

	onChangeTemplateDropDown() {
		const tempFilterObject = this.templateArrayForDropdown.filter(elm => elm.value === this.selectedTemplatedropdown);
		this.descValue = tempFilterObject['0'].dsc;
		this.labelName = tempFilterObject['0'].label;
		this.clientTemplateService.setLabelNameValue(this.labelName);

		if (this.labelName === 'Please Select' || this.borrowerIds.length < 1) {
			this.enableAssignbtn = true;

		} else if (this.labelName === 'Please Select' && this.borrowerIds.length < 1) {
			this.enableAssignbtn = true;
		}

		// else if(this.labelName === 'Blank Template' && this.borrowerIds.length === 0) {
		// 	console.log("you am in and")
		// 	this.enableAssignbtn = true;
		// }

		// else if(this.labelName === 'Blank Template' && this.confirmed.length === 0) {
		// 	console.log("you am in and")
		// 	this.enableAssignbtn = true;
		// }

		else if (this.labelName !== 'Please Select' && this.confirmed.length === 0) {
			this.enableAssignbtn = true;
		}
		else {
			this.enableAssignbtn = false;
		}

		if (this.initialDropdownVal === "pleseSelect") {
			$("#ineligiblePill").show();
			$("#bucketAgePill").show();
			$("#bpPill").show();
			this.flag1 = "active";
			this.flag2 = "inactive";
			this.flag3 = "inactive";
			this.btnStyle1 = "linkBtnActive";
			this.initialDropdownVal = "";
		}
		if (this.selectedTemplatedropdown === '-1') {
			this.router.navigate(['/client-maintenance/client-templates/multiple-client-assign/assigned'])
			this.previousDropdownVal = 'please_select';
			$("#bpPill").hide();
			$("#ineligiblePill").hide();
			$("#bucketAgePill").hide();
			this.flag1 = "inactive";
			this.flag2 = "inactive";
			this.flag3 = "inactive";
			this.clientTemplateService.setLabelName('Blank Template');

		}
		else if (this.labelName != 'Blank Template' && this.selectedTemplatedropdown != '-1') {
			if (this.previousDropdownVal === "please_select") {
				$("#ineligiblePill").show();
				$("#bucketAgePill").show();
				$("#bpPill").show();
				this.flag1 = "active";
				this.flag2 = "inactive";
				this.flag3 = "inactive";
				this.btnStyle1 = "linkBtnActive";
				this.btnStyle2 = "linkBtninActive";
				this.btnStyle3 = "linkBtninActive";
				this.previousDropdownVal = "";
			}
			else {
				$("#ineligiblePill").show();
				$("#bucketAgePill").show();
			}
			this.router.navigate(['/client-maintenance/client-templates/multiple-client-assign/', this.selectedTemplatedropdown])
			this.getTemplateViewDetails(this.selectedTemplatedropdown);
			this.clientTemplateService.setDropdownChangeData(this.selectedTemplatedropdown);

		}
		else if (this.labelName === 'Blank Template') {
			if (this.previousDropdownVal === "please_select") {
				$("#ineligiblePill").hide();
				$("#bucketAgePill").hide();
				$("#bpPill").show();
				this.flag1 = "active";
				this.flag2 = "inactive";
				this.flag3 = "inactive";
				this.btnStyle1 = "linkBtnActive";
				this.btnStyle2 = "linkBtninActive";
				this.btnStyle3 = "linkBtninActive";
				this.previousDropdownVal = "";
			}
			else {
				$("#ineligiblePill").hide();
				$("#bucketAgePill").hide();
				this.flag1 = "active";
				this.flag2 = "inactive";
				this.flag3 = "inactive";
				this.btnStyle1 = "linkBtnActive";
				this.btnStyle2 = "linkBtninActive";
				this.btnStyle3 = "linkBtninActive";
			}
			this.message.showLoader(true);
			this.router.navigate(['/client-maintenance/client-templates/multiple-client-assign/assigned'])
			this.clientTemplateService.setLabelName(this.labelName);
			this.message.showLoader(false);
		}

	}
	// sharing template id with child component

	shareTemplateId() {
		this.clientTemplateDetails.setTemplateIdForPost(this.templateId);
	}


	/**
	 *  Style change of navigation tab
	 * @param x 
	 */
	navigatePannel(i: number) {

		if (i === 1) {
			this.btnStyle1 = "linkBtnActive";
			this.btnStyle2 = "linkBtninActive";
			this.btnStyle3 = "linkBtninActive";

			this.flag1 = "active";
			this.flag2 = "inactive";
			this.flag3 = "inactive";
		}
		if (i === 2) {
			this.btnStyle1 = "linkBtninActive";
			this.btnStyle2 = "linkBtnActive";
			this.btnStyle3 = "linkBtninActive";

			this.flag1 = "inactive";
			this.flag2 = "active";
			this.flag3 = "inactive";
		}
		if (i === 3) {
			this.btnStyle1 = "linkBtninActive";
			this.btnStyle2 = "linkBtninActive";
			this.btnStyle3 = "linkBtnActive";

			this.flag1 = "inactive";
			this.flag2 = "inactive";
			this.flag3 = "active";
		}
	}

	// multi client cancel operation

	cancelOperationFn() {
		const popupParam = { 'title': 'Confirmation', message: "Do you want to cancel this operation ?", 'msgType': 'warning' };
		this.helper.openConfirmPopup(popupParam).subscribe(result => {
			if (result) {
				this.router.navigate(['/client-maintenance/client-templates'])
			} else {
				return false
			}
		})
	}

	//method to create request body for assign client//
	dataForPost(data: any) {
		this.combainedData.push(data);
	}

	dataForBlankPost(data: any) {
		let url = "client_templates/blank_template";
		let message = "Blank template successfully created and assigned to client(s)"
		let model = MultipleClientAssignSaveModel.multipleClientAssignBlankmodel()
		model.client_template.borrower_ids = this.borrowerIds,
			model.client_template.parameter = data.basicParameter
		this.clientTemplateService.assignMultipleClientBlankTemplate(url, model).subscribe(res => {
			this.helper.showApiMessages(message, 'success')
		})
	}

	//method to call api for assigning clients//
	assignTemplate(url: string, templateName: string, description: string, message: string) {
		// if(this.combainedData.length === 3){
		let i = this.combainedData.length
		let model = MultipleClientAssignSaveModel.multipleClientAssignmodel()
		model.client_template.borrower_ids = this.borrowerIds,
			model.client_template.parameter = this.combainedData[i - 3].basicParameter.parameter,
			model.client_template.ineligible_calculation = this.combainedData[i - 2].ineligible.ineligible_calculation;
		model.client_template.retention_label = this.combainedData[i - 1].bucket_aging.client_template.retention_label,
			model.client_template.bucket_ageings = this.combainedData[i - 1].bucket_aging.client_template.bucket_ageings,
			model.client_template.payable_bucket_ageings = this.combainedData[i - 1].bucket_aging.client_template.payable_bucket_ageings;
		if (this.assignType === "copy") {
			model.client_template["name"] = templateName;
			model.client_template["description"] = description
		}
		this.clientTemplateService.assignMultipleClientTemplate(url, model).subscribe(res => {
			this.helper.showApiMessages(message, 'success');
			this.getTemplateDetails();
		})

		//  }
		this.combainedData = [];
	}
}
