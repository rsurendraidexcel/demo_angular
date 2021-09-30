import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AssetsInventoryService } from '../assets-inventory.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-ineligible-reason-drop-down',
  templateUrl: './ineligible-reason-drop-down.component.html',
  styleUrls: ['./ineligible-reason-drop-down.component.scss']
})
export class IneligibleReasonDropDownComponent implements OnInit, ICellRendererAngularComp {

  params:any;
  clientId:any;
  ineligiblityReasonDD:any;
  hideDropdown:boolean = true;
  hideNone:boolean = false;
  hideBlank:boolean = false;
  dropdownBindVal: any;
  editable: boolean = false;
  isManual: boolean = false;

  constructor(
    private assetsInventoryService: AssetsInventoryService,

  ) {
    this.clientId = CyncConstants.getSelectedClient();
    // this.getIneligibleReasonDropDown();

   }

  ngOnInit() {
    
  }

  getIneligibleReasonDropDown(){
  
        this.ineligiblityReasonDD = JSON.parse(localStorage.getItem("aseetInventoryDD"));

        var some = this.ineligiblityReasonDD.filter(elm =>{
                return elm.value == this.params.value
              })
            
              if(some && some.length){
                this.dropdownBindVal =  some[0].id;
              } 
      
  }

  attrDisable(){
    if(this.editable){
      if(this.isManual){
        return false;
      }
      else{
        return true
      }
    }
    else{
      return true
    }
  }

  agInit(params: any): void {
   
    this.editable = params.editable;
    this.ineligiblityReasonDD = params.dropdown;
      this.isManual = params.data.manual;

    if(params.value==="Totals"){
      this.hideDropdown = false;
      this.hideNone = true;
    }

    this.params = params;
    this.getIneligibleReasonDropDown()
  }

  onAdjustmentReasonChange(event: any) {
    this.params.data.edited = true;
    this.params.data = event.target.value
    this.params.context.componentCheck.basedOnValueChanged1(this.params.data);
	}

  refresh(): boolean {
    return false;
  }

}
