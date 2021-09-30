import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import { GlobalVariable } from '../global';
import * as CryptoJS from 'crypto-js/crypto-js';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie-service';
import { Helper } from '@cyncCommon/utils/helper';
import { AppConfig } from '@app/app.config';
declare var $:any;
declare var window:any;
@Injectable()
export class JiraServiceDeskapiService {
  private apiUrl;  
  serviceDeskId: string;
  organizationId: any;
  loggedinUser: any;
  loggedinUserId: any;
  encryptKey: any;
  encryptedOrgId: any;
  encryptedUser: any;
  secreateKeyBody: any;
  environment: string;
  cyncToken: string;
  lenderHostInfo: string;
  lenderInfo: any;

  constructor(private http: Http ,  private config: AppConfig, private _helper: Helper, private cookieService: CookieService) {

          let tempLenderHost= GlobalVariable.LENDER_HOST();    
          let lenderID = tempLenderHost.split("//")[1].split('.')[0];
          let hostInfo = tempLenderHost.split("//")[1];
      
          if(lenderID=='devrorapi'){
            this.environment="development";
          }else if (lenderID=="staging"){
            this.environment="staging";
          }else if (lenderID=="uattest"){ 
            this.environment="uattest";
          }else{
            this.environment="production";
          }
          
          switch (this.environment) {
            case "development":
              this.apiUrl = GlobalVariable.BASE_API_URL_DEV;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_DEV; 
              break;
            case "staging":
              this.apiUrl = GlobalVariable.BASE_API_URL_STAGING;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_STAGING; 
              break;
            case "uattest":
              this.apiUrl = GlobalVariable.BASE_API_URL_UAT;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_UAT;
              break;
            case "prestaging":
              this.apiUrl = GlobalVariable.BASE_API_URL_PRESTAGING;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_PRESTAGING;
              break;
            case "demo":
              this.apiUrl = GlobalVariable.BASE_API_URL_DEMO;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_DEMO; 
              break;  
            case "production":
              this.apiUrl = GlobalVariable.BASE_API_URL_PROD;
              this.lenderHostInfo = GlobalVariable.LENDER_HOST();
              this.serviceDeskId = GlobalVariable.SERVICE_DESK_ID_PROD; 
              break;
          }

        // Cookies.set('cync_authorization', 'czVLbFo2UkJPNHJNK0ZNOU9TS1ZNbXRTYTU4c1VueTVaYVAwSU8wYldsckVKMHU0R2U2VEtvMXhmOEczYkxzT2tybVhIemhWbTBxdmR0S1ljL2YwY2c9PS0tZzhneWxSU21uTWszQ0wxeUlna2FXZz09--1eedde1e4017e3fec4eb06593d730c7fd39084ec');
        //  this.cookieService.set("cync_authorization", "N3dMZGxnUENLUUkreG5JeWRraHdqbUxOSGFNUGxiYURHRElqU0I5aTUvTkVnbVJKaXBka3h0NldMM1A5N3VEeFEvcDhHMTBwZk83Nkp5d3M0cWlzN3c9PS0tbXdyUGM3eVgxUzJvbDIrZ0VmMXNvUT09--b907060250f6f7dc4038d4886de33f60e94b7e33");
          this.cyncToken = this.cookieService.get("cync_authorization");

          if (!this.cyncToken) {
            if (this.config.MI_ON_LOCAL_SERVER()) {
                this.cyncToken = this._helper.getMyLocalToken();
            } 
        }

          // console.log("Cookies::", this.cyncToken);
          this.organizationId = hostInfo;	
          this.getUserInfo().subscribe( data => {
            this.lenderInfo=JSON.parse(data._body);
            this.loggedinUserId = this.lenderInfo.id;
            this.loggedinUser =this.lenderInfo.user_name;
          });

  }

  // getSecretKey() {
  //   const headerOption  = this.getHttpHeader();
  //   return this.http.get('https://'+this.organizationId+'/users/get_secret_key',headerOption).toPromise()
  // 	 .then(this.extractData)
  //    .catch(this.handleError);
  // }

  getUserInfo():Observable<any>{
    let headerOption  = this.getHttpHeader();
   // this.organizationId = 'devrorapi.cyncsoftware.com'
    let url= `https://${this.organizationId}/api/v1/users/get_user_info`;
    return this.http.get(url,headerOption);
  }

  getSecretKey(): Observable<any>{
    const headerOption  = this.getHttpHeader();
    let url =`https://${this.organizationId}/users/get_secret_key`;
    return this.http.get(url,headerOption);
  }

  getCyncToken(): string {
     return this.cyncToken;
  }

  getHttpHeader(): any {
    const headerinfo = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' +  this.getCyncToken() 
    };
    const headerResult = {                                                                                                                                                                                 
      headers: headerinfo
    };
    return headerResult;
  }

  getAllRequests(encryptKey, start, limit): Promise<any>{
          if(encryptKey){  
          this.encryptKey = encryptKey;		
          this.encryptedOrgId = CryptoJS.AES.encrypt(this.organizationId,this.encryptKey).toString(); 
          this.encryptedUser =  CryptoJS.AES.encrypt(this.loggedinUser,this.encryptKey).toString();

          return this.http.get(this.apiUrl+'tickets',{params:{"cyncUserID": this.loggedinUserId, 
            "orgID": encodeURIComponent(this.encryptedOrgId), 
            "loggedInUser": encodeURIComponent(this.encryptedUser),
            "start": start,
            "limit": limit
          }})
          .toPromise()
          .then(this.extractData)
          .catch(this.handleError); 
        } 	
   }

  private extractData(res: Response) {
  	let body = res;
    return body;
  } 

  handleError(error: any): Promise<any> {    
    //document.getElementById('loaderImage').style.display = 'none';
   document.getElementById('showMessage').style.display = 'block';   
  // (<HTMLInputElement>document.getElementById('createRequestId')).disabled = true;
    document.getElementById('showMessage').innerHTML = 'Error occured!!! try again.';
    $('#showMessage').hide().delay(10000).fadeOut(400);
     return Promise.reject(error.message || error);
  }

  getRequestComments(issueID) {
  	this.encryptedOrgId = CryptoJS.AES.encrypt(this.organizationId,this.encryptKey).toString(); 
  	return this.http.get(this.apiUrl+'tickets/'+issueID+'/comments',{params:{"cyncUserID": this.loggedinUserId,
  		"orgID": encodeURIComponent(this.encryptedOrgId)
  		//"issueID": encodeURIComponent(CryptoJS.AES.encrypt(issueID,this.encryptKey).toString())
    }})
  	.toPromise()
  	.then()
  	.catch(
     this.handleError
    )
  }

  createCustomerRequests(summary,description,severity,browser,operatingsystem,attachment,loggedInUserEmail){  	   

  	var createRequestFormData = new FormData();
  	createRequestFormData.append('file', attachment);
  	createRequestFormData.append('orgID', CryptoJS.AES.encrypt(this.organizationId,this.encryptKey).toString());
  	createRequestFormData.append('loggedInUser', CryptoJS.AES.encrypt(this.loggedinUser,this.encryptKey).toString());
  	createRequestFormData.append('cyncUserID', this.loggedinUserId);
  	createRequestFormData.append('serviceDeskID', CryptoJS.AES.encrypt(this.serviceDeskId, this.encryptKey).toString());
  	createRequestFormData.append('requestTypeId', CryptoJS.AES.encrypt('32', this.encryptKey).toString());
  	createRequestFormData.append('summary', CryptoJS.AES.encrypt(summary, this.encryptKey).toString());
  	createRequestFormData.append('description', CryptoJS.AES.encrypt(description, this.encryptKey).toString());
  	createRequestFormData.append('customfield_10800', CryptoJS.AES.encrypt(severity, this.encryptKey).toString());
  	createRequestFormData.append('customfield_10801', CryptoJS.AES.encrypt(browser, this.encryptKey).toString());
  	createRequestFormData.append('customfield_10802', CryptoJS.AES.encrypt(operatingsystem, this.encryptKey).toString());
  	createRequestFormData.append('customfield_10900', CryptoJS.AES.encrypt(this.loggedinUser, this.encryptKey).toString());
    createRequestFormData.append('customfield_11564', CryptoJS.AES.encrypt(loggedInUserEmail, this.encryptKey).toString() );
    return this.http.post(this.apiUrl+'tickets', createRequestFormData).toPromise()
    .then()
    .catch(this.errorRequestCreation)
  } 

  errorRequestCreation(error: any): Promise<any> {    
    // document.getElementById('loaderImage').style.display = 'none';
    document.getElementById('showMessage').style.display = 'block';      
    document.getElementById('showMessage').innerHTML = 'Request creation failed.';
    return Promise.reject(error.message || error);
  }

  createrequestsComments(commentBody,attachment,issueID) {   
  	var createCommentFormData = new FormData();           
    createCommentFormData.append('file', attachment);
    createCommentFormData.append('commentData', CryptoJS.AES.encrypt(this.loggedinUser+' (Cync user) added a comment - '+commentBody, this.encryptKey).toString());
    //createCommentFormData.append('issueID', CryptoJS.AES.encrypt(issueId, this.encryptKey).toString());
    createCommentFormData.append('serviceDeskID', CryptoJS.AES.encrypt(this.serviceDeskId, this.encryptKey).toString());
    createCommentFormData.append('orgID', CryptoJS.AES.encrypt(this.organizationId,this.encryptKey).toString());
    createCommentFormData.append('cyncUserID', this.loggedinUserId); 
    return this.http.post(this.apiUrl+'tickets/'+issueID+'/comments', createCommentFormData).toPromise()  	
  	.then()
  	.catch(this.errorCommentCreation)
  }

  errorCommentCreation(error: any): Promise<any> {    
    // document.getElementById('loaderImage').style.display = 'none';
    document.getElementById('showMessage').style.display = 'block';         
    document.getElementById('showMessage').innerHTML = 'Comment creation failed.';
    return Promise.reject(error.message || error);
  }

  searchTickets(searchTerm) {
    if(searchTerm != '' && searchTerm != undefined){
      return this.http.get(this.apiUrl+'tickets/search',{params:{"cyncUserID": this.loggedinUserId,
      "orgID": encodeURIComponent(this.encryptedOrgId),
      "searchTerm": encodeURIComponent(CryptoJS.AES.encrypt(searchTerm,this.encryptKey).toString())}}).toPromise()
      .then(this.extractData)
      .catch(this.handleError)
    } 
  }

  showloader(elementID){
  	document.getElementById(elementID).style.display = 'block';
  }

  hideLoader(elementID){
  	document.getElementById(elementID).style.display = 'none';
  }

  displayMessage(elementID, message) {
  	document.getElementById(elementID).style.display = 'block';
  	document.getElementById(elementID).innerHTML = message;
  	setTimeout(() => {
  		document.getElementById(elementID).style.display = 'none';
  	}, 5000)  	
  }

   // New Jira Poral Image API Calling
  getImageUrl(imageName,imageId){
     return this.http.get(this.apiUrl+'attachment/'+imageId+'/'+imageName).toPromise()
    .then()
    .catch(this.handleError) 
  }  

}
