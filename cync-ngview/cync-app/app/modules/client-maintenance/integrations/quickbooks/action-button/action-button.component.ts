import { Component, OnInit } from '@angular/core';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IntegrationsService } from '../../integrations.service';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit, ICellRendererAngularComp {
params: any;
buttonText: string;
clientIdforAction: any;
  constructor(
    private _helper: Helper,
    private _message: MessageServices,

		private intergraionsService: IntegrationsService
  ) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
    
    this.clientIdforAction = this.params.data.client_id
    if(this.params.data.connection_status == "Not connected"){
      this.buttonText = "Connect";
    }
    else{
      this.buttonText = "Disconnect";
    }
   
  }

  buttonClickFn(){
   if(this.buttonText === "Disconnect"){
    
    const popupParam = {
			'title': 'Confirmation',
			message: 'Do you want to disconnect ?',
			'msgType': 'warning'
		};
		this._helper.openConfirmPopup(popupParam).subscribe(result => {
     
			if (result) {
				this._message.showLoader(true);
     this.intergraionsService.disconnectQuickBookBorrower("quickbooks/disconnect?borrower_id="+ this.clientIdforAction, '').subscribe(elm => {
       
       this._message.showLoader(false);
       let res1 = JSON.parse(elm._body);
       this._helper.showApiMessages(res1.msg, 'success');
       this.params.context.componentCheck.basedOnValueChanged('changed');
     }, err =>{
      let res1 = JSON.parse(err._body);
      this._helper.showApiMessages(res1.msg, 'warning');
     })
      }
      else{
        return false;
      }
   }
    )}
    else {
      this.intergraionsService.connectQuickBookBorrower(`/quickbooks/authenticate?borrower_id=${this.clientIdforAction}`).subscribe(res => {
        if(res){
          
          // this.router.navigate(['client-maintenance/integration/quickbooks-user' ],  { queryParams: { 'iframeurl': res._body }, skipLocationChange: true } )
          window.location.href = res._body;
        }
      })
    }
}

  refresh(): boolean {
    return false;
  }
}
