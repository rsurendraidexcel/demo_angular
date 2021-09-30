import { Injectable } from '@angular/core';


@Injectable()
export class RadioButtonService {

  _projectID: string = '';
  enableFinanceStatementComplete:boolean =false;
  projectID: string = '';
  selectedRadioBtn:string ='';


  constructor() { }

  /**
   * This method will set the Popup Message parameters for Network Errors other than notifications
   * @param _projectID 
   * @param _active  
   */
  setRadioButton(_active,_projectID,_selectedRadio) {
    if(_projectID){
        this.projectID = _projectID;
        this.enableFinanceStatementComplete=_active;
        this.selectedRadioBtn= _selectedRadio;
    }
}



}
