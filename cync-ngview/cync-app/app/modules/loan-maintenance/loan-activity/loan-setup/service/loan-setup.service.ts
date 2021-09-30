import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Observable, forkJoin , Subject } from 'rxjs';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class LoanSetupService {
  createNewMclLoanId= new Subject<any>();
  constructor(private cyncHttpService: CyncHttpService,private apiMap: APIMapper) { }

   public getService(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

   /**
    * get loan setup data if id is abl type
    * @param url 
    */
  public getAblLoanSetup(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

   /**
    * get loan setup data if id is mcl type
    * @param url 
    */
   public getMclLoanSetup(url: string): Observable<any> {
    return this.cyncHttpService.getmcl(url);
  }

  /**
   * update abl loan
   * @param url
   */
  updateAblLoan(url: string, fd: FormData): Observable<any> {
    return this.cyncHttpService.putFileUpload(url, fd);
  }

  /**
   * update mcl loan
   * @param url
   */
  updateMclLoan(url: string,fd: FormData): Observable<any> {
    return this.cyncHttpService.putmclFileUpload(url, fd);
  }
   
 
  public getloanTypes(request1: string, request2:string,  request3:string ): Observable<any[]>{
    let res1 = this.cyncHttpService.get(request1).map(data => JSON.parse(data._body));
    let res2 = this.cyncHttpService.getmcl(request2).map(data => JSON.parse(data._body)); 
    let res3 = this.cyncHttpService.getmcl(request3).map(data => JSON.parse(data._body));
    return forkJoin([res1, res2, res3]);
  }

   /**
	 * method to delete mcl loan data
	 */
  deleteMclLoanDataService(url: string) {
    return this.cyncHttpService.deleteMcl(url);
  }

   /**
   * method to get all the values of loan type dropdown
   */
  public getLoanType(url: string): Observable<any> {
    return this.cyncHttpService.getmcl(url);
  }

  /**
   * method to get all the values of interest rate type dropdown 
   */
  public getInterestRateCode(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

  /**
   * Method for non abl create data
   * @param url
   */
  createNonAblData(url: string, fd: FormData): Observable<any> {
    return this.cyncHttpService.postmclformdata(url, fd);
  }

  /**  INTEREST DETAIL SERVICE */
  
   /**
   * method to get grid data for abl loan 
   */
  public getInterestDetailAblData(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

   /**
   * method to get table data for abl loan 
   */
  public getInterestDetailAblTableData(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }
  
   /**
   * method to get grid data for mcl loan 
   */
  public getInterestDetailMclData(url: string): Observable<any> {
    return this.cyncHttpService.getmcl(url);
  }
  // BBC Recalculation action
  public getbbcRecalculate(url: string): Observable<any> {
    return this.cyncHttpService.get(url);
  }

   /**
   * method to get table data for Mcl loan 
   */
  public getInterestDetailMclTableData(url: string): Observable<any> {
    return this.cyncHttpService.getmcl(url);
  }

  /**
	 * method to delete interest detail data
	 */
  deleteAblInterestDetailService(url: string) {
    return this.cyncHttpService.delete(url);
  }

  /**
	 * method to delete interest detail data
	 */
  deleteMclInterestDetailService(url: string) {
    return this.cyncHttpService.deleteMcl(url);
  }


   /**
    * post data if id is abl type
    * @param url 
    */
   updateInterestDetailAblService(url: string, model): Observable<any> {
    return this.cyncHttpService.put(url, model);
  }

  /**
    * post data if id is mcl type
    * @param url 
    */
   updateInterestDetailMclService(url: string, model): Observable<any> {
    return this.cyncHttpService.putmcl(url, model);
  }

  /**
    * post data if id is abl type
    * @param url 
    */
   saveInterestDetailAblService(url: string, model): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }

  /**
    * post data if id is mcl type
    * @param url 
    */
   saveInterestDetailMclService(url: string, model): Observable<any> {
    return this.cyncHttpService.postmcl(url, model);
  }

  // getter and setter method for create new 

  // set template view type
  setCreateNewMclLoanId(view: any) {
    this.createNewMclLoanId.next(view);
  }

  // share template view type
  getCreateNewMclLoanId(): Observable<any> {
    return this.createNewMclLoanId.asObservable();
  }
   

  /**
	 * method to delete abl file data
	 */
  deleteAblFileDocumentService(url: string) {
    return this.cyncHttpService.delete(url);
  }

   /**
	 * method to delete mcl file data
	 */
  deleteMclFileDocumentService(url: string) {
    return this.cyncHttpService.deleteMcl(url);
  }
}
