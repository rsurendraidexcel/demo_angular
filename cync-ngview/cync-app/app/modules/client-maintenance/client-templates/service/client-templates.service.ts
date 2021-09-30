import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ClientTemplatesService {

  dropDowndataDefault: any;

  dropDownDataForSharing = new Subject<any>();

  allTemplateData = new Subject<any>();

  templateViewType = new Subject<any>();

  templatePostId = new Subject<any>();

  bpResetValue = new Subject<any>();

  basicParameterId = new Subject<any>();

  tabChangeValue = new Subject<any>();

  tabChangeAnswer = new Subject<any>();

  retention = new Subject<any>();

  savedRetention = new Subject<any>();

  totalDenominator = new Subject<any>();

  multiAssignDropdownChangeData = new Subject<any>();

  confirmMultiAsignDataFetch = new Subject<any>();

  multiClientBasicParameterData = new Subject<any>();

  multiClientIneligibleCalculation = new Subject<any>();
  
  multiClientBucketAging =  new Subject<any>();

  labelName = new Subject<any>();

  labelNameValue = new Subject<any>();

  multiClientBasicParameterBlankDataPost =  new Subject<any>();

  multiClientBasicParameterBlankData = new Subject<any>();

  configUrl = "https://devrorapi.cyncsoftware.com/api/v1/client_templates";

  constructor(private cyncHttpService: CyncHttpService) { }

  // get template details (index)
  gettemplatedetails(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

  // function for add new template api function (add template)
  addNewTemplate(url, model): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }

  // get template view details api function (view template)
  gettemplateviewdetails(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

  // Selected template delete api function (delete template)
  deleteTemplate(url: string): Observable<any> {
    return this.cyncHttpService.delete(url);
  }

  // Selected template edit api function (edit template)
  editTemplate(url: string, model): Observable<any> {
    return this.cyncHttpService.patch(url, model);
  }

  // template clone api function (edit template)
  cloneTemplate(url: string, model): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }

  // basic parameter edit api function (edit basic parameter)
  editBasicPrameter(url: string, model): Observable<any> {
    return this.cyncHttpService.patchV2(url, model);
  }

  // get all basic parameter dropdown
  getAlldefaultdropDownValues(url: string): Observable<any> {
    this.dropDowndataDefault = this.cyncHttpService.get(url);
    return this.dropDowndataDefault;
  }

  // send all default dropdown from basic parameter
  sendAllDropDownData(data: any) {
    this.dropDownDataForSharing.next(data);
  }

  // share default dropdown with basic parameter child component
  shareDropDownDataFn(): Observable<any> {
    return this.dropDownDataForSharing.asObservable();
  }

  // share all template data
  sendAllTemplateData(): Observable<any> {
    return this.allTemplateData.asObservable();
  }

  // set all template data
  receiveTemplateData(data: any) {
    this.allTemplateData.next(data);
  }

  // set template view type

  setTemplateViewType(view: any) {
    this.templateViewType.next(view);
  }

  // share template view type
  getTemplateViewType(): Observable<any> {
    return this.templateViewType.asObservable();
  }

  // set template id from edit and clone page to child components

  setTemplateIdForPost(data: any) {
    this.templatePostId.next(data);
  }

  // share template id from edit and clone page to child components
  getTemplateIdForPost(): Observable<any> {
    return this.templatePostId.asObservable();
  }
  /**
    * Method to get Bucket Aging data
    * @param url
    */
  getBucketAgingService(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

	/**
	 * method to delete ar bucket aging data
	 */
  deleteArBucketAgingService(url: string) {
    return this.cyncHttpService.deleteV2(url);
  }

	/**
	 * method to delete ar bucket aging data
	 */
  deleteApBucketAgingService(url: string) {
    return this.cyncHttpService.deleteV2(url);
  }

  /**
* method for saving bucket aging data
* @param url 
* @param model 
*/
  saveBucketAgingService(url: string, model): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }
  /*
*to get system definded ineligible reasons
*/
  getIneligibleReasonList(url: string) {
    return this.cyncHttpService.get(url);
  }
  /*
  *to save system definded ineligible reasons
  */
  addIneligibleReasonService(url: string, model: any): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }

  gettemplatedetailsService(url: string) {
    return this.cyncHttpService.get(url);
  }

  // set reset button value for basic parameter form
  setResetButtonForBP(data: any) {
    this.bpResetValue.next(data);
  }

  // share reset form value from edit and clone page to child components
  getResetButtonForBP(): Observable<any> {
    return this.bpResetValue.asObservable();
  }

  // set basic parameter id value for basic parameter form
  setBasicParameterId(data: any) {
    this.basicParameterId.next(data);
  }

  // share basic parameter id for edit and clone page patch action
  getBasicParameterId(): Observable<any> {
    return this.basicParameterId.asObservable();
  }

  // set tab change value
  setTabChangeValue(data: any) {
    this.tabChangeValue.next(data);
  }

  // get tab change value
  getTabChangeValue(): Observable<any> {
    return this.tabChangeValue.asObservable();
  }

  // set tab change answer from child
  setreturnTabChangeAnswer(data: any) {
    this.tabChangeAnswer.next(data);
  }

  // get tab change answer from child
  getreturnTabChangeAnswer(): Observable<any> {
    return this.tabChangeAnswer.asObservable();
  }

  // get data for cross aging grid inside ineligible reason

  getcrossAgingData(url: string): Observable<any> {
    return this.cyncHttpService.getV2(url);
  }

  saveCrossAgingData(url: string, model): Observable<any> {
    return this.cyncHttpService.patchV2(url, model);
  }

  // set retention 
  setUnsavedIneligibleReason(data: any) {
    this.retention.next(data);
  }

  // share  retention name
  getUnsavedIneligibleReason(): Observable<any> {
    return this.retention.asObservable();
  }
   // set retention 
   setSavedIneligibleReason(data: any) {
    this.savedRetention.next(data);
  }

  // get  retention name 
  getSavedIneligibleReason(): Observable<any> {
    return this.savedRetention.asObservable();
  }

  // get roles and permissions
  getRolesandPermissions(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

  setTotalDenominator(data: any){
    this.totalDenominator.next(data);
  }

  getTotalDenominator(): Observable<any> {
    return this.totalDenominator.asObservable();
  }
  
  getBorrowers(url:string){
    return this.cyncHttpService.get(url);
  }
  assignMultipleClientTemplate(url,model){
    return this.cyncHttpService.patch(url, model);
  }

  assignMultipleClientBlankTemplate(url,model){
    return this.cyncHttpService.post(url, model);
  }

  // service to send dropdown change template data to bucket ageing and ineligible-calculation

  setDropdownChangeData(data: any){
    this.multiAssignDropdownChangeData.next(data);
  }

  getDropdownChangeData(): Observable<any> {
    return this.multiAssignDropdownChangeData.asObservable();
  }

  /**
   * geter and setter of multi-client assign to give fetch details to child 
   */
  setConfirmMultiAsignDataFetch(data: any){
    this.confirmMultiAsignDataFetch.next(data);
  }

  getConfirmMultiAsignDataFetch(): Observable<any> {
    return this.confirmMultiAsignDataFetch.asObservable();
  }

   /**
   * geter data of basic parameter
   */
  setMultiClientBasicParameterData(data: any){
    this.multiClientBasicParameterData.next(data);
  }

  getMultiClientBasicParameterData(): Observable<any> {
    return this.multiClientBasicParameterData.asObservable();
  }

   /**
   * geter data of ineligible calculation
   */
  setMultiClientIneligibleCalculation(data: any){
    this.multiClientIneligibleCalculation.next(data);
  }

  getMultiClienIneligibleCalculation(): Observable<any> {
    return this.multiClientIneligibleCalculation.asObservable();
  }
  
  /**
   * geter data of bucket aging
   */
  setMultiClientBucketAging(data: any){
    this.multiClientBucketAging.next(data);
  }

  getMultiClienBucketAging(): Observable<any> {
    return this.multiClientBucketAging.asObservable();
  }

  /**
   * setting label name
   */
  setLabelName(data: any){
    this.labelName.next(data);
  }
  
  /**
   * getting label name
   */
  getLabelName(): Observable<any> {
    return this.labelName.asObservable();
  }

   /**
   * setting label name
   */
  setLabelNameValue(data: any){
    this.labelNameValue.next(data);
  }
  
  /**
   * getting label name
   */
  getLabelNameValue(): Observable<any> {
    return this.labelNameValue.asObservable();
  }

    /**
   * geter msg in basic parameter when blank template
   */
  setMultiClientBasicParameterBlankData(data: any){
    this.multiClientBasicParameterBlankData.next(data);
  }

  getMultiClientBasicParameterBlankData(): Observable<any> {
    return this.multiClientBasicParameterBlankData.asObservable();
  }

    /**
   * geter data of basic parameter when blank template
   */

  setMultiClientBasicParameterBlankDataForPost(data: any){
    this.multiClientBasicParameterBlankDataPost.next(data);
  }

  getMultiClientBasicParameterBlankDataForPost(): Observable<any> {
    return this.multiClientBasicParameterBlankDataPost.asObservable();
  }


}

