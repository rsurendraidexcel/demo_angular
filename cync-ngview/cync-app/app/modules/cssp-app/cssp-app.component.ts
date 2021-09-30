import { Component, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, enableProdMode } from '@angular/core';
import { FormValidationService } from './service/form-validation.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GlobalVariable } from './global';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { SelectItem} from 'primeng/primeng';
import { CookieService } from 'ngx-cookie-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { JiraServiceDeskapiService } from './service/jira-service-deskapi.service';

// enableProdMode();
@Component({
  selector: 'cssp-app',
  templateUrl: './cssp-app.component.html',
  styleUrls: ['./cssp-app.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppcsspComponent implements OnInit {
	@ViewChild('input') input: ElementRef;    
	private cyncLoggedInUser = 'CYNC';
	private cyncLoggedInUserEmail = '';
	public selectedStatus: String = "1: 1001";
	public selectedCreateUser: String = "1: 1011";
	public browserVal: String = "13102";
	public operatingSystemVal: String = "12710";
	public severityVal: String = "12702";
	public summaryVal: String = "";
	public descriptionVal: String = "";
	public attachmentVal: String = "";
	csspForm: FormGroup;
	csspStatusForm: FormGroup;
	csspCreateCommentForm: FormGroup;
	commonreqResults: any;
	allResults: any;
	beforeSearchResults: any;
	allOpenRequests: any;
	anyRequestByme: any;
	allClosedRequests: any;
	requestsCreatedByme: any;
	iteratedIndex: number;		
	selectedSts: any;
	requestComments: any;
	requestCommentsAll: any;
	customerRequest: any;
	createReqFileAttachmentSize: any;
	createReqFileAttachment: any;
	createCommentFileAttachmentSize: any;
	createCommentFileAttachment: any;
	requestsComment: any;
	encryptKey: any;	
	userParicipantRequests: any;
	buttonClicked: Boolean = false;
	maxSize: any;
	searchTerm: any;
	createdComment: any;
	process: Boolean = false;
	createdRequest: any;
	start: number = 0;
	limit: number = 250;
	lastPage: Boolean = false;
	assetsPath = CyncConstants.getAssetsPath();
	isFiltered: Boolean = false;
	requestStatus: any;
	requestOwner: any;	
	environment: String;
	openGeneralQustionPermissionArray: any;
	openBillablePermissionArray: any;
	openMappingPermissionArray: any;
	viewGeneralQustionPermissionArray: any;
	viewBillablePermissionArray: any;
	viewMappingPermissionArray: any;
	generalQustionCommentPermissionArray: any;
	billableCommentPermissionArray: any;
	mappingCommentPermissionArray: any;
	userRole: any;
	viewIssue: String = 'View Issue';
	ticketRolesandPerms: boolean = true;
	commonArrayLength: number = 0;
	createButtonPermission: boolean = true;
	reqStatus:Array<Object> = [
      {key: 1000, value: "All"},
      {key: 1001, value: "Open requests"},
      {key: 1002, value: "Closed requests"}
  	];
  	reqCreatedStatus:Array<Object> = [
      {key: 1010, value: "Created by anyone"},
      {key: 1011, value: "Created by me"}
  	];  
  	sortAscending: Boolean =false;	
  	imagefileTypes: string[] = GlobalVariable.ATTACHMENT_IMAGE_TYPES;
		otherfileTypes: string[] = GlobalVariable.ATTACHMENT_FILE_TYPES;
	
	totalPullRecords: number=0;

	constructor( private cookieService: CookieService, private _helper: Helper , private formValidationService: FormValidationService, private fb: FormBuilder, private apiservice: JiraServiceDeskapiService, private _message: MessageServices){		

		this.maxSize = 10000000;
		this.csspForm = this.fb.group({
			frmCtrl_summary: new FormControl('', Validators.compose([Validators.required])),
			frmCtrl_description: new FormControl('', Validators.compose([Validators.required])),
			frmCtrl_browser: new FormControl('', Validators.compose([Validators.required])),
			frmCtrl_severity: new FormControl('', Validators.compose([Validators.required])),
			frmCtrl_operatingsystem: new FormControl(),
			frmCtrl_attachment: new FormControl()
		})

		this.csspStatusForm = new FormGroup({       		
       		frmCtrl_reqStatus: new FormControl(),
       		frmCtrl_reqCreated: new FormControl(),
       		frmCtrl_search: new FormControl()
    	})

    	this.csspCreateCommentForm = this.fb.group({
    		frmCtrl_commentTxtArea: new FormControl('',Validators.compose([Validators.required])),
    		frmCtrl_commentAttachment: new FormControl()
			}) 
			
		//Call secreatekey key While create components
			this.apiservice.getSecretKey().subscribe((resData) => {		
						let redata= resData;
						redata=JSON.parse(redata._body);
						this.encryptKey = redata.secret_key;
						this.cyncLoggedInUserEmail = redata.email;
						this.apiservice.getUserInfo().subscribe(resdata => {
							let temdata=JSON.parse(resdata._body);
							this.cyncLoggedInUser = temdata.user_name;
							this.loandRequests();
						});
			});

		this.userRole = JSON.parse(localStorage.getItem('supportPortalPermissionsArray'));

		let generalQustionArray = this.userRole.find(elm => {
			return elm.menu_identifier == "general_questions";
		})

		// permission filter for general question view and comment
		if(generalQustionArray){
			
			this.viewGeneralQustionPermissionArray = generalQustionArray.permissions.find(elm => {
				return elm.action === "index";
			})

			this.openGeneralQustionPermissionArray = generalQustionArray.permissions.find(elm => {
				return elm.action === "index";
		})

			this.generalQustionCommentPermissionArray = generalQustionArray.permissions.find(elm => {
				return elm.action === "add_comment";
			})

		}

		// permission filter for billable service view and comment
		let billableRequestArray = this.userRole.find(elm => {
			return elm.menu_identifier == "request_billable_service";
		})

		if(billableRequestArray){
			
			this.viewBillablePermissionArray = billableRequestArray.permissions.find(elm => {
				return elm.action === "index";
			})

			this.openBillablePermissionArray = billableRequestArray.permissions.find(elm => {
				return elm.action === "index";
		})


			this.billableCommentPermissionArray = billableRequestArray.permissions.find(elm => {
				return elm.action_label === "add_comment";
			})
		}

		// permission filter for mapping help view and comment
		let mappingRequestArray = this.userRole.find(elm => {
			return elm.menu_identifier == "request_mapping_help";
		})

		if(mappingRequestArray){
			
			this.viewMappingPermissionArray = mappingRequestArray.permissions.find(elm => {
				return elm.action === "index";
			})

			this.openMappingPermissionArray = mappingRequestArray.permissions.find(elm => {
				return elm.action === "index";
		})


			this.mappingCommentPermissionArray = mappingRequestArray.permissions.find(elm => {
				return elm.action === "add_comment";
			})
		}

	}

	ngOnInit(){		
	
		  let eventObservable = Observable.fromEvent(this.input.nativeElement, 'keyup')						  
	     eventObservable.subscribe();	        
					this.lastPage = true;

		}	

		// create ticket permmision check
		rolesAndPermissionsCheck(){
			let createPermissionArray;
			let generalQustionArray = this.userRole.find(elm => {
				return elm.menu_identifier == "general_questions";
			})

			if(generalQustionArray){
				createPermissionArray = generalQustionArray.permissions.find(elm => {
					return elm.action_label === "Create";
				})
			}
			
			if(createPermissionArray.enabled){
				this.createButtonPermission = true; 
			}
			else{
				this.createButtonPermission = false; 
			}		
		}

		// comment permmision check function
		commentPermissionFunction(type){
			let requestBalancePermission = false;
			let requestMapingPermission = false;
			let generalRequest = false;

			if(this.billableCommentPermissionArray){
				requestBalancePermission = this.billableCommentPermissionArray.enabled
			}
			if(this.mappingCommentPermissionArray){
				requestMapingPermission = this.mappingCommentPermissionArray.enabled
			}
			if(this.generalQustionCommentPermissionArray){
				generalRequest = this.generalQustionCommentPermissionArray.enabled
			}

			if(type === undefined){
				if(!generalRequest){
					return false;
				}
				else{
					return true;
				}
			}
			if(type === 'RBS'){
				if(!requestBalancePermission){
					return false;
				}
				else{
					return true;
				}
			}

			if(type === 'RMH'){
				if(!requestMapingPermission){
					return false;
				}
				else{
					return true;
				}
			}
			
		}
		//format description based on billable and maping request

		descriptionFormatFn(value, type){
			if(type == "RBS" || type == "RMH"){
			// 	console.log(value)
			// 	let splitVal = value.split(',');

			// 	let modifier = splitVal.map(element => {
			// 		let innerSplit = element.split(':');
			// 		return "<b>" + innerSplit[0] + "</b>:" + innerSplit[1] 
			// 	});
			// 	let formatedStr = modifier.join("<br>");

			//let formatedStr = 'Lender Name : staging.cyncsoftware.com \n\n\t\t\t\t\t\tClient Name :  0001VWGVFT \n\n\t\t\t\t\t\tData File Name : Toyota_COMM_INDIA.xlsx \n\n\t\t\t\t\t\tMapping Group : Test MAP GRP 001 \n\n\t\t\t\t\t\tMapping Name : Test MAP GRP 001 \n\n\t\t\t\t\t\tMapping Description:  \n\n\t\t\t\t\t\tMapping URL:  https://staging.cyncsoftware.com/borrowers/10623/mappings/35658/edit?menu_id=327&step=S1 \n\n\t\t\t\t\t\tSeverity : Medium \n\n\t\t\t\t\t\tCollateral Name:Receivables \n\n\t\t\t\t\t\tSheet No: 1 [In case of XLS, XLSX] \n'

			var newStr = value.replace(/(?:\r\n|\r|\n)/g, '<br>')

			 var modifiedNewStr = newStr.replace(/(<br>)+/g, '<br>');

			// var modifiedNewStr1 = modifiedNewStr.replace(/(https:)+/, 'https-');

			let splitVal = modifiedNewStr.split('<br>');
							 
			splitVal.pop();
			let modifier1 = splitVal.filter(element => {
				return element.includes("Client Name") || element.includes("Mapping Group") || element.includes("Mapping Name") || element.includes("Mapping Description") || element.includes("Sheet No")
			});


				let modifier = modifier1.map(element => {
					let innerSplit = element.split(':');
					return "<b>" + innerSplit[0] + "</b>:" + innerSplit[1] 
				});
				let finalStr = modifier.join("<br>");

			//	finalStr = finalStr.replace(/(https-)+/, 'https:');

				return finalStr;
	
			}

		}
		// view permmision check function for billable, mapping, general qustion
		rolesPermsticketFn(result, type){
			let requestBalancePermission = false
			let requestMapingPermission = false
			let generalRequest = false;

			if(this.viewBillablePermissionArray){
				requestBalancePermission = this.viewBillablePermissionArray.enabled

			}

			if(this.viewMappingPermissionArray){
				requestMapingPermission = this.viewMappingPermissionArray.enabled

			}
			if(this.viewGeneralQustionPermissionArray){
				generalRequest = this.viewGeneralQustionPermissionArray.enabled

			}

			if(result != undefined){

				if(type === undefined){
					if(!generalRequest){
						return false;
					}
					else{
						return true;
					}
				}
				if(type === 'RBS'){
					if(!requestBalancePermission){
						return false;
					}
					else{
						return true;
					}
				}
	
				if(type === 'RMH'){
					if(!requestMapingPermission){
						return false;
					}
					else{
						return true;
					}
				}
			
	
			}
			else{
				return false
			}
		
		}
		
  loandRequests(){
		this._message.showLoader(true);
		this.apiservice.getAllRequests(this.encryptKey, this.start, this.limit).then((result) => {	
			window.scrollTo(0, 0);									
			this._message.showLoader(false);
			this.commonreqResults = result.json();
			this.totalPullRecords=this.commonreqResults.values.length; 	
			this.allResults = [];
			this.allOpenRequests = [];				
			this.iteratedIndex = 0;
			for (let iterator  = 0; iterator < result.json().values.length; iterator++) {
					if ((this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress') && this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
													this.allOpenRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
													this.iteratedIndex++;                            
											}    	
											if(iterator == result.json().values.length-1) {
												this.lastPage = result.json().isLastPage;		                        	
											}           
							}                
							this.allResults = this.allOpenRequests;
						    this.totalPullRecords=this.allResults.length;		                	               
								if(this.allResults == '') {		            	
								this.apiservice.showloader('noResults');
								this.lastPage = true;
							} else {
								this.apiservice.hideLoader('noResults');
							}   			                			
			}, (error) => {
				console.log(error);

			});

			this.rolesAndPermissionsCheck();

	}		

	getRequestsByStatus(selectedStatus, selectCreatedBy){
					
		if(this.commonreqResults != undefined) {	//Checking if results are null								
			this.allOpenRequests = [];
			this.allClosedRequests = [];
			this.requestComments = [];
			this.requestCommentsAll = [];			
			if(this.commonreqResults.values == undefined){
				this.commonreqResults = this.commonreqResults.json();
			}			
			if(selectedStatus == '2: 1002'){  // Closed requests
				if(selectCreatedBy == '0: 1010'){  // Closed requests created by anyone					
				this.iteratedIndex = 0;				
				for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                    if ((this.commonreqResults.values[iterator].currentStatus.status == 'Closed')) {
	                        this.allClosedRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
	                    }
	                }
	            this.allResults = this.allClosedRequests; 
				this.totalPullRecords=this.allClosedRequests.length;
	            	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }               
	        	} else if(selectCreatedBy == '1: 1011') {  // Closed requests created by me            		
	        	this.iteratedIndex = 0;
				for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                    if ((this.commonreqResults.values[iterator].currentStatus.status == 'Closed') && this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
	                        this.allClosedRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
	                    }
	                }
	            this.allResults = this.allClosedRequests;
				this.totalPullRecords=this.allClosedRequests.length;	            
		            if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            //	this.lastPage = false;
		            }
	        	} else { // Closed requests where I am participant
	        		this.iteratedIndex = 0;
					this.userParicipantRequests = [];
	            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Closed') {
	                            this.userParicipantRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
	                            this.iteratedIndex++;
	                        }
	                    }
	                this.allResults = this.userParicipantRequests;
					this.totalPullRecords=this.userParicipantRequests.length;
	                	if(this.allResults == '') {		            	
			            	this.apiservice.showloader('noResults');
			            	this.lastPage = true;
			            } else {
			            	this.apiservice.hideLoader('noResults');
			            }
	        	}
	        } else if (selectedStatus == '1: 1001') {  // Open Requests
	        	if(selectCreatedBy == '0: 1010'){  // Open requests created by anyone            		
	        	this.iteratedIndex = 0;
	        	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                    if (this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved') {
	                        this.allOpenRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
	                        this.iteratedIndex++;
	                    }
	                }
	            this.allResults = this.allOpenRequests;
				this.totalPullRecords=this.allOpenRequests.length;
	            	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }

	        } else if(selectCreatedBy == '1: 1011'){  // Open requests created by me            	
	        	this.iteratedIndex = 0;
	        	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                    if ((this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved') && this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
	                        this.allOpenRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
	                    }
	                }
	            this.allResults = this.allOpenRequests;
				this.totalPullRecords=this.allOpenRequests.length;
	            	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
		        } else {
		        	this.iteratedIndex = 0;
					this.userParicipantRequests = [];
	            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved') {
	                            this.userParicipantRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
								this.iteratedIndex++;
	                        }
	                    }
	                this.allResults = this.userParicipantRequests;
					this.totalPullRecords=this.userParicipantRequests.length;
	                	if(this.allResults == '') {		            	
			            	this.apiservice.showloader('noResults');
			            	this.lastPage = true;
			            } else {
			            	this.apiservice.hideLoader('noResults');
			            	//this.lastPage = false;
			            }
		        }
	        } else {  // Any status
	        	if(selectCreatedBy == '1: 1011'){ // Any status created by me            		
	        	this.iteratedIndex = 0;
	        	this.anyRequestByme = [];
	        	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
	                    if (this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
	                        this.anyRequestByme[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
	                    }
	                }
	            this.allResults = this.anyRequestByme;
				this.totalPullRecords=this.anyRequestByme.length;
	            	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            }
	        	} else if(selectCreatedBy == '0: 1010') {  // Any status created by anyone
	        	this.allResults = this.commonreqResults.values;
	        		if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
	        } else {
	        	this.allResults = this.commonreqResults.values;
					if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
	        }
	       }   
	   } else {
	   		this.apiservice.displayMessage('showMessage','No results found.');
	   }
	}

	getRequestsByCreated(createdBy, reqStatus){
		if(this.commonreqResults != undefined) {  //Checking if results are null
		this.requestsCreatedByme = [];
		if(createdBy == '1: 1011'){ // Created By me
			if(reqStatus == '1: 1001'){  // Open Requests created by me					
				this.iteratedIndex = 0;
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser && (this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved')) {
                            this.requestsCreatedByme[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                   this.allResults = this.requestsCreatedByme;
				   this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			} else if(reqStatus == '2: 1002') {  // Closed Requests created by me					
				this.iteratedIndex = 0;
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser && (this.commonreqResults.values[iterator].currentStatus.status == 'Closed')) {
                            this.requestsCreatedByme[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                this.allResults = this.requestsCreatedByme;
				this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			} else {  // Any status created by me					
				this.iteratedIndex = 0;
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
                            this.requestsCreatedByme[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
					}

					this.allResults = this.requestsCreatedByme;
					this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			}
			
		} else if(createdBy == '0: 1010') {  // Created by anyone				
			if(reqStatus == '1: 1001'){  // Open Requests created by anyone					
				this.iteratedIndex = 0;
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved') {
                            this.allOpenRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                this.allResults = this.allOpenRequests;
				this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			} else if(reqStatus == '2: 1002') {  // Closed Requests created by anyone					
				this.iteratedIndex = 0;
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Closed') {
                            this.allOpenRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                this.allResults = this.allOpenRequests;
				this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			} else {  // Any status Requests created by anyone					
				this.allResults = this.commonreqResults.values;
					if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			}
		} else {
			if(reqStatus == '1: 1001'){  // Open Requests where I am participant					
				this.iteratedIndex = 0;
				this.userParicipantRequests = [];
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Open' || this.commonreqResults.values[iterator].currentStatus.status == 'In Progress' || this.commonreqResults.values[iterator].currentStatus.status == 'Reopened' || this.commonreqResults.values[iterator].currentStatus.status == 'Resolved') {
                            this.userParicipantRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                this.allResults = this.userParicipantRequests;
				this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			} else if(reqStatus == '2: 1002') {  // Closed Requests where I am participant				
				this.iteratedIndex = 0;
				this.userParicipantRequests = [];
            	for (let iterator = 0; iterator < this.commonreqResults.values.length; iterator++) {
                        if (this.commonreqResults.values[iterator].currentStatus.status == 'Closed') {
                            this.userParicipantRequests[this.iteratedIndex] = this.commonreqResults.values[iterator];
							this.iteratedIndex++;
                        }
                    }
                this.allResults = this.userParicipantRequests;
				this.totalPullRecords=this.allResults.length;
                	if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			}
			else {  // Any status Requests where I am a participant					
				this.allResults = this.commonreqResults.values;
					if(this.allResults == '') {		            	
		            	this.apiservice.showloader('noResults');
		            	this.lastPage = true;
		            } else {
		            	this.apiservice.hideLoader('noResults');
		            	//this.lastPage = false;
		            }
			}
		}
		} else {
   		this.apiservice.displayMessage('showMessage','No results found.');
      }
	}

	
	//Updated Get all comments code
	getComments(issueID, index, csspCreateCommentfrm, type) { 
		
		let requestBalancePermission = false;
		let requestMapingPermission = false;
		let generalRequest = false;

		if(this.openBillablePermissionArray){
			requestBalancePermission = this.openBillablePermissionArray.enabled
		}
		if(this.openMappingPermissionArray){
			requestMapingPermission = this.openMappingPermissionArray.enabled
		}
		if(this.openGeneralQustionPermissionArray){
			generalRequest = this.openGeneralQustionPermissionArray.enabled
		}

		if(type === undefined){
			if(!generalRequest){
				return;
			}
		}
		if(type === 'RBS'){
			if(!requestBalancePermission){
				return;
			}
		}

		if(type === 'RMH'){
			if(!requestMapingPermission){
				return;
			}
		}
		// console.log(issueID);
		// console.log(index);
		// console.log(csspCreateCommentfrm);
		if ( index != undefined ){
			// console.log("Step-1");
			this.requestComments = [];                       
			this.buttonClicked = true;
			this.viewIssue = 'Close Issue';
			
			if(csspCreateCommentfrm != undefined)
				csspCreateCommentfrm['_submitted'] = false;

			this.apiservice.hideLoader('noCommentsTxt'+index);
			this.csspCreateCommentForm.reset();
			if(document.getElementById('issueSts'+index) != undefined)   
				document.getElementById('issueSts'+index).innerHTML = 'Close Issue';

			var selectedDivId = document.getElementsByClassName("accordian-body cp_paneltable hiddenRow collapse show")[0]; 
			// console.log(selectedDivId);
			this.apiservice.hideLoader('noCommentsTxt'+index);    //ms
			this.csspCreateCommentForm.controls.frmCtrl_commentTxtArea.setValue(''); //ms
			this.csspCreateCommentForm.controls.frmCtrl_commentAttachment.setValue('');        //ms
			this.apiservice.showloader('loaderImageComment' + index);     //ms - reordered as in prod keyCode

			var apiFunction = function(issueID, index, csspCreateCommentfrm, apiSrvcObj){
				apiSrvcObj.apiservice.getRequestComments(issueID)
				.then((reqComments) => {
					// console.log(reqComments);
					if(document.getElementById('errorValidationField') != undefined && document.getElementById('errorValidationField') != null){
						apiSrvcObj.apiservice.hideLoader('errorValidationField');
					}                                 
					apiSrvcObj.apiservice.hideLoader('loaderImageComment'+index);
					apiSrvcObj.buttonClicked = false;                                                                                                                                          
					apiSrvcObj.requestComments = reqComments.json().values;  

					for(let i=0;i<apiSrvcObj.requestComments.length;i++) {
						if(apiSrvcObj.requestComments[i].attachments.values[0] != undefined){ 
							var attachmentTemp = apiSrvcObj.requestComments[i].attachments.values[0]._links.jiraRest;
							var attachmentID = attachmentTemp.substring(attachmentTemp.indexOf("attachment/")+11);                                      
							apiSrvcObj.apiservice.getImageUrl(apiSrvcObj.requestComments[i].attachments.values[0].filename,attachmentID)
							.then((ImageUrl) => {                                     
								apiSrvcObj.requestComments[i].attachments.values[0]._links.content = ImageUrl["_body"];
							})
						}
					}
					if(apiSrvcObj.requestComments == ''){
						apiSrvcObj.apiservice.showloader('noCommentsTxt'+index);
					} else {
						apiSrvcObj.apiservice.hideLoader('noCommentsTxt'+index);
					}                 
				})  
			};

			if (selectedDivId != undefined && selectedDivId.id == 'demo' + index) {  //ms //condition to check selected row is valid
				if(document.getElementById(selectedDivId.id).style.display == 'none'){  //condition to check selected row is not in display mode                                                   
					// console.log("Step-2");
					// console.log(selectedDivId.id);
					this.apiservice.showloader(selectedDivId.id);
					apiFunction(issueID, index, csspCreateCommentfrm, this);                                  
				}
				else if(this.process == true) {  //ms - to check a comment is newly created and page not refreshed
					// console.log("Step-3");
					// console.log(this.process);
					this.process = false;
					apiFunction(issueID, index, csspCreateCommentfrm, this);
				} else {
					// console.log("Step-4");
					// console.log(selectedDivId.id);
					document.getElementById(selectedDivId.id).className = 'accordian-body collapse cp_paneltable hiddenRow';                           
					document.getElementById('issueSts'+index).innerHTML = 'View Issue';
					this.apiservice.hideLoader(selectedDivId.id);
					this.buttonClicked = false;
				}
			}
			else if (selectedDivId != undefined && selectedDivId.id != 'demo' + index) {  //ms - to display newly created comment on clicking a row and page not refreshed after crating new comment           
				// console.log("Step-5");
				// console.log(selectedDivId.id);
				if(document.getElementById('issueSts'+(selectedDivId.id[4])) != undefined)     //ms                          
					document.getElementById('issueSts'+(selectedDivId.id[4])).innerHTML = 'View Issue'; //ms
				document.getElementById(selectedDivId.id).className = 'accordian-body collapse cp_paneltable hiddenRow'; 
				document.getElementById('demo'+index).className = 'accordian-body cp_paneltable hiddenRow collapse show';           
				this.apiservice.hideLoader(selectedDivId.id);     //ms
				this.apiservice.showloader('demo'+index);                         //ms
				apiFunction(issueID, index, csspCreateCommentfrm, this);

			} else {  //ms - on clicking particular row after page reload or after inital load     
				// console.log("Step-6");
				// console.log(index);
			 	document.getElementById('demo'+index).className = 'accordian-body cp_paneltable hiddenRow collapse show';           
				this.apiservice.showloader('demo'+index);
				apiFunction(issueID, index, csspCreateCommentfrm, this);
			}
		}
	}

	createReqAttachment(fileInputCreateReq: any) {      	    
        this.createReqFileAttachmentSize = fileInputCreateReq.target.files[0].size;
        this.createReqFileAttachment = fileInputCreateReq.target.files[0];  
        if(this.createReqFileAttachmentSize <= 0){
        	this.apiservice.displayMessage('showMessage', 'Attachment with 0 size not allowed.');
        } else if(this.createReqFileAttachmentSize > this.maxSize) {
        	this.apiservice.displayMessage('showMessage', 'Attachment with size more than 10MB is not allowed.');
        	this.createReqFileAttachment = '';        	
        }    
  	}

	createRequest(csspfrm: NgForm) {	
	
	 if(csspfrm.valid) {			  	
		this.buttonClicked = true;
		this._message.showLoader(true);		
		this.customerRequest = [];		
			this.apiservice.createCustomerRequests(this.csspForm.controls.frmCtrl_summary.value,this.csspForm.controls.frmCtrl_description.value,this.csspForm.controls.frmCtrl_severity.value,this.csspForm.controls.frmCtrl_browser.value,this.csspForm.controls.frmCtrl_operatingsystem.value,this.createReqFileAttachment,this.cyncLoggedInUserEmail)
			.then((createRequest) => {	
				this.buttonClicked = false;		
				this._message.showLoader(false);	
				this.apiservice.hideLoader('noResults');					
				this.createdRequest = createRequest.json();
				this.allResults.unshift(this.createdRequest);
			//	this.apiservice.displayMessage('showMessageSuccess','Issue created successfully.');
				this._helper.showApiMessages("Issue created successfully.", 'success');
				var cancelBtn = document.getElementById('cp_btndelete');
	  			cancelBtn.click();	
			})
		
	 	}	
	}

	clearForm(csspfrm: NgForm){					
		this.csspForm.reset();		
		this.csspForm.controls.frmCtrl_browser.setValue('13102');
		this.csspForm.controls.frmCtrl_operatingsystem.setValue('12710');
		this.csspForm.controls.frmCtrl_severity.setValue('12702');	
		csspfrm['_submitted'] = false;			
	}

	createCommentAttachment(fileInputCreateComment: any) {      	    
        this.createCommentFileAttachmentSize = fileInputCreateComment.target.files[0].size;
        this.createCommentFileAttachment = fileInputCreateComment.target.files[0];  
        if(this.createCommentFileAttachmentSize <= 0){
        	this.apiservice.displayMessage('showMessage', 'Attachment with 0 size not allowed.');
        } else if(this.createCommentFileAttachmentSize > this.maxSize) {
        	this.apiservice.displayMessage('showMessage', 'Attachment with size more than 10MB is not allowed.');
        	this.createCommentFileAttachment = '';        	
        }           
  	}

	createComment(issueId, index, csspcreatecommentfrm: NgForm) {				
	  if(csspcreatecommentfrm.valid) {	
		this.apiservice.hideLoader('noCommentsTxt'+index);
		this._message.showLoader(true);
		this.buttonClicked = true;		
			this.apiservice.createrequestsComments(this.csspCreateCommentForm.controls.frmCtrl_commentTxtArea.value, this.createCommentFileAttachment,issueId)			
			.then((createComments) => {
				this._message.showLoader(false);
				this.buttonClicked = false;
				this.process = true;
				this.csspCreateCommentForm.reset();
				this.createCommentFileAttachment = '';
				this.createdComment = createComments.json();	

				if(this.createdComment.attachments != undefined){
					var attachmentTemp = this.createdComment.attachments.values[0]._links.jiraRest;
	    	   		var attachmentID = attachmentTemp.substring(attachmentTemp.indexOf("attachment/")+11);
    	   			this.apiservice.getImageUrl(this.createdComment.attachments.values[0].filename,attachmentID)
		    	   .then((ImageUrl) => {
		    	   	this.createdComment.attachments.values[0]._links.content = ImageUrl["_body"];
		    	   })	    	
		    	}   
		    	
				this.requestComments.push(this.createdComment);															
			})
		}
	}

	createCommentcancel(index) {
		this.apiservice.hideLoader('demo'+index);
		this.csspCreateCommentForm.reset();		
		document.getElementById('demo'+index).className = 'accordian-body collapse  cp_paneltable hiddenRow';
	}

	createTicketcancel() {
		this.csspForm.reset();		
		document.getElementById("createIssueFields").className = 'accordian-body collapse  cp_paneltable hiddenRow';
	}

	searchRequest(event){	  		
	  this.beforeSearchResults = this.allResults;			  
	  if(event.keyCode == 13 || event.button == 0) {
		this.searchTerm = this.csspStatusForm.controls.frmCtrl_search.value;		
		if(this.searchTerm != undefined && this.searchTerm != '') {
			this.csspStatusForm.controls.frmCtrl_search.setValue('');					
			this.allResults = [];
			this._message.showLoader(true);			
			this.apiservice.searchTickets(this.searchTerm)
			.then((result) => {
				this._message.showLoader(false);
				this.isFiltered = true;
				this.csspStatusForm.controls.frmCtrl_reqStatus.setValue('0: 1000');
				this.csspStatusForm.controls.frmCtrl_reqCreated.setValue('0: 1010');
				this.commonreqResults = result;
				this.allResults = result.json().values;
				this.totalPullRecords=this.allResults.length;		
				if(this.allResults == '') {		            	
	            	this.apiservice.showloader('noResults');
	            	this.lastPage = true;
	            } else {
	            	this.apiservice.hideLoader('noResults');	            	
	            }	
			})
		}	
	  } else if(event.keyCode == 8 && (this.csspStatusForm.controls.frmCtrl_search.value).length <= 1){
	  	this.isFiltered = false;
	  }
	  else {	  	
	  	this.isFiltered = true;
	  }				
	}	

	filterRequest() {	
		this.allResults = [];
		this.csspStatusForm.controls.frmCtrl_search.setValue('');			    
		this.allResults = this.beforeSearchResults; 	
		if(this.allResults != []){
			this.apiservice.hideLoader('noResults');
		}
		this.isFiltered = false;	
	}

	onScrollDown () {
		
		var startVal = this.start;
		if (this.allResults != undefined)
        	this.commonArrayLength = this.commonreqResults.values.length;
        this.start += this.limit;
	 	if(!this.lastPage && (startVal != this.start) && (this.commonreqResults.values.length) >= 100){		
	 		this.requestStatus = this.csspStatusForm.controls.frmCtrl_reqStatus.value;
	 		this.requestOwner = this.csspStatusForm.controls.frmCtrl_reqCreated.value 			  		
			 this._message.showLoader(true);															
			this.apiservice.getAllRequests(this.encryptKey, this.start, this.limit)
			.then((result) => {					
				this._message.showLoader(false);						
				this.iteratedIndex = this.allResults.length;									
				this.lastPage = result.json().isLastPage;	
				for (let iterator = 0; iterator < result.json().values.length; iterator++) {		                      								
					if(this.requestStatus == '1000' && this.requestOwner == '1010') {
						this.allResults[this.iteratedIndex] = result.json().values[iterator];
						this.iteratedIndex++;
					} else if(this.requestStatus == '1000' && this.requestOwner == '1011') {
						if (result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1000' && this.requestOwner == '1012') {
						this.allResults[this.iteratedIndex] = result.json().values[iterator];
					} else if(this.requestStatus == '1001' && this.requestOwner == '1010'){
						if (result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1001' && this.requestOwner == '1011'){
						if ((result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') && result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1001' && this.requestOwner == '1012'){
						if (result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1002' && this.requestOwner == '1010'){
						if ((result.json().values[iterator].currentStatus.status == 'Closed' || result.json().values[iterator].currentStatus.status == 'Resolved')) {						
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1002' && this.requestOwner == '1011'){
						if ((result.json().values[iterator].currentStatus.status == 'Closed' || result.json().values[iterator].currentStatus.status == 'Resolved') && result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1002' && this.requestOwner == '1012'){
						if (result.json().values[iterator].currentStatus.status == 'Closed' || result.json().values[iterator].currentStatus.status == 'Resolved') {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1002' && this.requestOwner == '1: 1011'){
						if ((result.json().values[iterator].currentStatus.status == 'Closed' || result.json().values[iterator].currentStatus.status == 'Resolved') && result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1000' && this.requestOwner == '1: 1011'){
						if (result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} else if(this.requestStatus == '1: 1001' && this.requestOwner == '1010'){
						if (result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					}  else if(this.requestStatus == '1: 1001' && this.requestOwner == '1012'){
						if (result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					} 
					else if(this.requestStatus == '1: 1001' && this.requestOwner == '1: 1011'){
						if ((result.json().values[iterator].currentStatus.status == 'Open' || result.json().values[iterator].currentStatus.status == 'In Progress' || result.json().values[iterator].currentStatus.status == 'Reopened') && result.json().values[iterator].requestFieldValues[6].value == this.cyncLoggedInUser) {
							this.allResults[this.iteratedIndex] = result.json().values[iterator];
							this.iteratedIndex++;
						}
					}			               
	                this.commonreqResults.values[this.commonArrayLength] = result.json().values[iterator];
                    this.commonArrayLength++;               
	            }               
	            if(this.allResults == '') {		            	
	            	this.apiservice.showloader('noResults');
	            	this.lastPage = true;
	            } else {                                      	            	          		            	            	              	 	
	            	this.apiservice.hideLoader('noResults');            	
	            }                  				                		
			})		
		} else {
			this.lastPage = true;
		}
	}

	sortTable(columnName) {		
		if(columnName == 'summary') {
		  if(this.sortAscending == false){
			this.allResults.sort((a, b) => {
		      if ((a.requestFieldValues[0].value).toLowerCase() < (b.requestFieldValues[0].value).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[0].value).toLowerCase() > (b.requestFieldValues[0].value).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = true;
		  } else {
		  	this.allResults.sort((a, b) => {
		      if ((a.requestFieldValues[0].value).toLowerCase() > (b.requestFieldValues[0].value).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[0].value).toLowerCase() < (b.requestFieldValues[0].value).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = false;
		  }
		} else if(columnName == 'reference') {			
		  if(this.sortAscending == false){			
			this.allResults.sort((a, b) => {	
			  var issueKey1 = a.issueKey.replace( /^\D+/g, '');
			  var issueKey2 = b.issueKey.replace( /^\D+/g, ''); 					
		      if (Number(issueKey1) < Number(issueKey2)) return -1;
		      else if (Number(issueKey1) > Number(issueKey2)) return 1;
		      else return 0;
		    });
		    this.sortAscending = true;
		  } else {
		  	this.allResults.sort((a, b) => {
		  	  var issueKey1 = a.issueKey.replace( /^\D+/g, '');
			  var issueKey2 = b.issueKey.replace( /^\D+/g, ''); 	
		      if (Number(issueKey1) > Number(issueKey2)) return -1;
		      else if (Number(issueKey1) < Number(issueKey2)) return 1;
		      else return 0;
		    });
		    this.sortAscending = false;
		  }
		} else if(columnName == 'severity'){
			if(this.sortAscending == false){
			this.allResults.sort((a, b) => {				
		      if ((a.requestFieldValues[2].value.value[(a.requestFieldValues[2].value.value).length-1]).toLowerCase() < (b.requestFieldValues[2].value.value[(b.requestFieldValues[2].value.value).length-1]).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[2].value.value[(a.requestFieldValues[2].value.value).length-1]).toLowerCase() > (b.requestFieldValues[2].value.value[(b.requestFieldValues[2].value.value).length-1]).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = true;
		  } else {
		  	this.allResults.sort((a, b) => {		  		
		      if ((a.requestFieldValues[2].value.value[(a.requestFieldValues[2].value.value).length-1]).toLowerCase() > (b.requestFieldValues[2].value.value[(b.requestFieldValues[2].value.value).length-1]).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[2].value.value[(a.requestFieldValues[2].value.value).length-1]).toLowerCase() < (b.requestFieldValues[2].value.value[(b.requestFieldValues[2].value.value).length-1]).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = false;
		  }
		} else if(columnName == 'status'){


			if(this.sortAscending == false){
				var ordering = {"Open":1, "In Progress":2, "Resolved":3, "Reopened":4, "Closed":5};
				this.allResults.sort(function(a,b) { return ordering[a.currentStatus.status] - ordering[b.currentStatus.status]; })			
		    	this.sortAscending = true;
		  } else {
			  	var ordering = {"Open":5, "In Progress":4, "Resolved":3, "Reopened":2, "Closed":1};
				this.allResults.sort(function(a,b) { return ordering[a.currentStatus.status] - ordering[b.currentStatus.status]; })		  	
		    	this.sortAscending = false;
		  }
		} else if(columnName == 'requestor') {			
			if(this.sortAscending == false){
			this.allResults.sort((a, b) => {
		      if ((a.requestFieldValues[6].value).toLowerCase() < (b.requestFieldValues[6].value).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[6].value).toLowerCase() > (b.requestFieldValues[6].value).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = true;
		  } else {
		  	this.allResults.sort((a, b) => {
		      if ((a.requestFieldValues[6].value).toLowerCase() > (b.requestFieldValues[6].value).toLowerCase()) return -1;
		      else if ((a.requestFieldValues[6].value).toLowerCase() < (b.requestFieldValues[6].value).toLowerCase()) return 1;
		      else return 0;
		    });
		    this.sortAscending = false;
		  }
		} else if(columnName == 'updated') {	
		var dateA;
		var dateB;		
			if(this.sortAscending == false){				
			this.allResults.sort((a, b) => {				  				
  				if(a.comments.values[a.comments.size-1] != undefined) {
  					dateA = a.comments.values[a.comments.size-1].created.iso8601;
  				} else {
  					dateA = a.createdDate.iso8601;
  				}

  				if(b.comments.values[b.comments.size-1] != undefined) {
  					dateB = b.comments.values[b.comments.size-1].created.iso8601;
  				} else {
  					dateB = b.createdDate.iso8601;
  				}
  				if (dateA < dateB ) {
				    return -1;
				  }
				  if (dateA > dateB ) {
				    return 1;
				  }
				  return 0;						
		    });    
				this.sortAscending = true;
			} else {				
			this.allResults.sort((a, b) => {					
  				if(a.comments.values[a.comments.size-1] != undefined) {
  					dateA = a.comments.values[a.comments.size-1].created.iso8601;
  				} else {
  					dateA = a.createdDate.iso8601;
  				}

  				if(b.comments.values[b.comments.size-1] != undefined) {
  					dateB = b.comments.values[b.comments.size-1].created.iso8601;
  				} else {
  					dateB = b.createdDate.iso8601;
  				}

  				if (dateA > dateB ) {
				    return -1;
				  }
				  if (dateA < dateB ) {
				    return 1;
				  }
				  return 0;
		    }); 
				this.sortAscending = false;
			}
		}
	}
	//Date format for IE Browser Issue
	formatDate(epochTS){
		  	var dt = new Date(0); // The 0 there is the key, which sets the date to the epoch
		 	dt.setUTCMilliseconds(Number(epochTS));
			
			var dtFormat = "<<mon>>/<<d>>/<<year>> <<hr>>:<<min>> <<AMPM>>";
			var returnDate = "";			
			var dd = dt.getDate();
			var mm = dt.getMonth() + 1; //because January is 0! 
			var yyyy = dt.getFullYear();
			var hours = dt.getHours();
			var ampm = hours >= 12 ? 'PM' : 'AM'; 
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			var minutes = dt.getMinutes();
			returnDate = dtFormat.replace("<<mon>>", ( (mm < 10) ? '0' + mm.toString() :  mm.toString()) )
								.replace("<<d>>", ( (dd < 10) ? '0' + dd.toString() :  dd.toString()) )
								.replace( "<<year>>", yyyy.toString())
								.replace( "<<hr>>", hours.toString())
								.replace( "<<min>>", (minutes < 10 ? '0' + minutes.toString() : minutes.toString()))
								.replace( "<<AMPM>>", ampm.toString());

			return returnDate;		   
	  }
}
