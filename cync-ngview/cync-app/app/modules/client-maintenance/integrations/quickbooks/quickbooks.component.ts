import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import { IntegrationsService } from '../integrations.service';
import { ActionButtonComponent } from './action-button/action-button.component';
@Component({
  selector: 'app-quickbooks',
  templateUrl: './quickbooks.component.html',
  styleUrls: ['./quickbooks.component.scss']
})
export class QuickbooksComponent implements OnInit {

  gridApi: any;
  gridColumnApi: any;
  gridOptions: GridOptions;
  userRole: any;
  clientId: any;
  cyncRowData: any = [];
  cyncColumnDefs: any = [];
  quickbookConnection: any;
  // assetsPath = CyncConstants.getAssetsPath();

  constructor(private _helper: Helper,
    private router: Router,
    private route: ActivatedRoute,
		private _message: MessageServices,
		private intergraionsService: IntegrationsService) { 
      this.route.queryParams.subscribe(params => {
        if(params){
         
       let theTypeIs = Object.keys(params)[0];
       if(theTypeIs === 'error'){
        this._helper.showApiMessages(params.error, 'warning');
       }
       else if(theTypeIs === 'success'){
        this._helper.showApiMessages(params.success, 'success');
       }  
      }
        })
      // this.userRole = localStorage.getItem('cyncUserRole');
      this.clientId = CyncConstants.getSelectedClient();
      this.gridOptions = {
        context: {
          componentCheck: this
        },
      }
    }

  ngOnInit() {

    // console.log(this.userRole, this.clientId);

  this.getDataQb();
   
    this.cyncColumnDefs = [
      {field: 'client_id', hide: true},
      {field: 'client_name', headerName: 'Client Name', width:700,  filter: 'agTextColumnFilter',sortable: true 
    },
      {field: 'connection_status', headerName: 'Connection Status',  filter: 'agSetColumnFilter',
      cellRenderer: (params)=>{
        if(params.value === "Connected"){
          return "<i style='color:green' class='fa fa-check-circle' aria-hidden='true'></i> Connected"
        }
        else if(params.value === "Not connected"){
          return "Disconnected"
        }
      }, 
      width:250},
      {field: 'disconnect', 
      headerName: 'Actions',
      
      cellRendererFramework: ActionButtonComponent
    }
    ];
    // this.cyncRowData = [
    //   {'clientName': 'Client Name1', 'connectionStatus': "Connected",},
    //   {'clientName': 'Client Name1', 'connectionStatus': 'Connected',},
    //   {'clientName': 'Client Name1', 'connectionStatus': "Connected",},
    //   {'clientName': 'Client Name1', 'connectionStatus': "Connected",},
    //   {'clientName': 'Client Name1', 'connectionStatus': 'Connected',},
    //   {'clientName': 'Client Name1', 'connectionStatus': "Connected",}
    // ]
   
  }

  getDataQb(){
    this.intergraionsService.gettemplatedetails('quickbooks/borrower_qb_connection_status').subscribe(res =>{
      let resRaw = JSON.parse(res._body);
      this.quickbookConnection = resRaw.records;
      
      this.cyncRowData = this.quickbookConnection;
    })
  }

  basedOnValueChanged(data: any) {
		if(data === "changed"){
     
      this.getDataQb();
    }
	}

  cyncGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
     params.api.sizeColumnsToFit();

  }

  borrowerQbResult(){
    let url = `/quickbooks/authenticate?borrower_id=${this.clientId}`

    this.intergraionsService.getBorrowerQb(url).subscribe(res => {
    
      let result = JSON.parse(res._body)
      
    })
  }


}
