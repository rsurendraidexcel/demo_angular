import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';

@Injectable({
  providedIn: 'root'
})
export class ClientParameterService {

  mappingId = new Subject<any>();

  mappingBasedData = new Subject<any>();
  
  
  constructor(private cyncHttpService: CyncHttpService) { }

   /**
 * Method to get a broker commission Data
 * @param url
 */
getBbcFileRequiredService(url: string): Observable<any> {
  return this.cyncHttpService.get(url);
}

  // function for add new template api function (add template)
  addNewRecordService(url, model): Observable<any> {
    return this.cyncHttpService.post(url, model);
  }

  deleteBbcService(url:string){
    return this.cyncHttpService.delete(url);
  }

  setMappingBasedData(data: any) {
    this.mappingBasedData.next(data);
  }
  
  getMappingBasedData(): Observable<any> {
    return this.mappingBasedData.asObservable();
  } 


 updateBBCData(url:string, model:any):Observable<any>{
    return this.cyncHttpService.put(url, model);
  }
}
