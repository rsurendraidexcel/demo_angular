import { Component, OnInit, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment-timezone';
import { AssetsInventoryService } from './assets-inventory.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { IneligibleReasonDropDownComponent } from './ineligible-reason-drop-down/ineligible-reason-drop-down.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-assets-inventory',
  templateUrl: './assets-inventory.component.html',
  styleUrls: ['./assets-inventory.component.scss']
})
export class AssetsInventoryComponent implements OnInit, AfterViewInit {

   gridApi;
   gridColumnApi;
   bbc_date: any;
   gridOptions: GridOptions;
   arBucketAgingSelectedRows = true;
   columnDefs: any;
   defaultColDef;
   statusBar;
   rowData: any;
   gridParams: any;
   gridResetOn: boolean = false;
   pinnedBottomRowData: any;
   getRowStyle: any;
   tdEdit:string = 'inline';
   tdOK:string = 'none';
   inv_turn_inputenable = true;
   gridApi1;
   gridColumnApi1;
   gridOptions1: GridOptions;
   columnDefs1: any;
   defaultColDef1;
   statusBar1;
   rowData1: any;
   gridParams1: any;
   colateralName:any = 'ALL';
   gridOptions2: GridOptions;
   columnDefs2: any;
   defaultColDef2;
   statusBar2;
   rowData2: any;
   gridParams2: any;
   pinnedBottomRowData1: any;
   getRowStyle1: any;
   gridSelectedRows: any = [];
   clientId:any;
   collateralDropDownVal: any = [];
   inventoryDetails: any;
   allDates: any;
   collateral_advance_rate_id: number;
   inventoryRemainingDetails:any;
   lastTableData:any;
   productGroupArray: any = [];
   inventoryDayBoxShow:boolean = true;
   productDropDownShow:boolean = false;
   client_balance_id: any;
   ineligibleSummaryDetails:any;
   gridApi2;
   gridColumnApi2;
   ineligiblityReasonDD: any;
   checkboxhide;
   hideWhileAll:boolean = true;
   gridAlreadyEdited:boolean = false
   grid2AlreadyEdited: boolean = false
   EOM_Totals: any;
   eligible_accounts_inventories: any;
   accounts_inventories_collateral: any;
   inventory_turn_days:any;
   unlockProductCollatrel:boolean = false;
   unlockProduct: boolean = false;
   gridResetOn1: boolean = false;
   ineligibledropdownVal: boolean = false;
   gridAddOn: boolean = true;
   gridSaveOn: boolean = false;
   gridDeleteOn: boolean = false
   gridAddOn1: boolean = true;
   gridSaveOn1: boolean = false;
   gridDeleteOn1: boolean = false
   gridSelectedRows2: any;

  constructor(
    private renderer: Renderer2,
    private assetsInventoryService: AssetsInventoryService,
    private apiMapper: APIMapper,
    private message: MessageServices,
    private helper: Helper,
   
    ) {
      this.clientId = CyncConstants.getSelectedClient();
      this.getIdFromDropdownName()
   }

  ngOnInit() {
    this.gridinit();
    this.gridinit1();
    this.gridinit2();
    this.getInventorySummaries();
    this.getInventoryDetails('all');
    this.getRemainingData('all');
    this.getAllIneligibleSummaries('all', '')
  }

  /**
   * Menthod to get inventories summaries Dropdown
   */
  getInventorySummaries(){
    this.message.showLoader(true);
    const url =  `/borrowers/${this.clientId}/inventory_summaries/collaterls`;
    this.assetsInventoryService.getInventorySummaries(url).subscribe(data=>{
      this.collateralDropDownVal = JSON.parse(data._body);
      this.message.showLoader(false);
    })
  }
  /**
   * Menthod to get inventories Details
   */
  getInventoryDetails(id: any){
    this.message.showLoader(true);
    if(id === 'all'){
      const url =  `/borrowers/${this.clientId}/inventory_summaries/inventories`;
      this.assetsInventoryService.getInventoryDetails(url).subscribe(data=>{
        this.inventoryDetails = JSON.parse(data._body);

        this.rowData = this.inventoryDetails.inventories;
        this.pinnedBottomRowData = this.createData(1, this.inventoryDetails.summary);
        this.message.showLoader(false);

      })
    }
    else{
      const url =  `/borrowers/${this.clientId}/inventory_summaries/inventories?collateral_advance_rate_id=${id}`;
      this.assetsInventoryService.getInventoryDetails(url).subscribe(data=>{
        this.inventoryDetails = JSON.parse(data._body);
        this.rowData = this.inventoryDetails.inventories;
        for(let i=0; i<this.inventoryDetails.inventories.length; i++){
          this.productGroupArray.push({id:this.inventoryDetails.inventories[i].id, description:this.inventoryDetails.inventories[i].description})
        }
    
        this.pinnedBottomRowData = this.createData(1, this.inventoryDetails.summary);
        this.message.showLoader(false);
  
      })
    }
    
  }

  gridinit() {
    this.columnDefs = [
      {
        headerName: '',
        field: 'check-selection',
        width: 50,
        checkboxSelection: true,
        cellStyle: (params) => {
          return '';
        }
    
      },
      {
        headerName: 'Description',
        field: 'description',
        width: 200,
        editable: (params)=>{
          if(this.productDropDownShow){
            return true
          }
          else{
            return false
          }
        }
   
      },
      {
        field: 'prior_balance',
        headerName: 'Prior Balance',
        width: 200,
        editable: false,
        valueFormatter:this.currencyValFormat
      },
      {
        field: 'actual_value',
        headerName: 'Actual Value',
        width: 150,
        valueFormatter:this.currencyValFormat,
        editable: (params)=>{
          if(this.productDropDownShow){
            return true
          }
          else{
            return false
          }
        }
      },
      {
        field: 'unreconciled',
        headerName: 'Unreconciled',
        valueFormatter:this.currencyValFormat ,
        width: 120,
        editable:false
      },
      {
        field: 'eop_total',
        headerName: 'EOP Total',
        width: 120,
        editable:false,
        valueFormatter: this.currencyValFormat,
        
      },
      {
        field: 'ineligible_value',
        headerName: 'Ineligible Value',
        width: 170,
        editable:false,
        valueFormatter: this.currencyValFormat,
      },
      {
        field: 'eligible_value',
        headerName: 'Eligible Value',
        width: 160,
        valueFormatter: this.currencyValFormat,        
        editable:false
      },
      {
        headerName: 'COGS',
        field: 'cogs',
        valueFormatter: this.currencyValFormat,
        width: 100,
        editable: (params)=>{
          if(this.productDropDownShow){
            return true
          }
          else{
            return false
          }
        }
      },
      {
        headerName: 'NOLV',
        valueFormatter:this.currencyValFormat ,
        field: 'nolv',
        width: 100,
        editable:false
      },
      {
        headerName: 'LTV',
        field: 'ltv',
        width: 100,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        field: 'adjusted_advance_rate',
        headerName: 'Adj/Adv Rate',
        width: 200,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        field: 'inventory_available',
        headerName: 'Inventory Available',
        width: 180,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        headerName: 'Sublimit',
        field: 'sub_limit',
        width: 150,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        field: 'borrowing_base',
        headerName: 'Borrowing Base',
        width: 120,
        valueFormatter:this.currencyValFormat,
        editable:false
      },
      {
        field: 'reserve',
        headerName: 'Reserve',
        width: 100,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        field: 'collateral',
        headerName: 'Colateral Value',
        width: 100,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
   
      {
        headerName: 'Avl For Advance',
        field: 'avl_for_advance',
        width: 180,
        valueFormatter:this.currencyValFormat ,
        editable:false
      },
      {
        field: 'isEdited',
        hide: true
      }

    ];
    this.defaultColDef = {
      flex: 1,
      resizable: true,
    
    };

    this.getRowStyle = function(params) {
      if (params.node.rowPinned) {
        return { 'font-weight': '600', 'background': '#E5EEEC' };
      }
    }

    this.getRowStyle1 = function(params) {
      if (params.node.rowPinned) {
        return { 'font-weight': '600', 'background': '#E5EEEC' };
      }
    }

  
    this.statusBar = {
      statusPanels: [{ statusPanel: 'agAggregationComponent' }],
    };

    this.gridOptions = {
      context: {
				componentCheck: this
			}
    };
   
  }

    	/**
 * grid1 row selected
 * @param event 
 */
	ongridRowSelected(event: any) {
    this.gridSelectedRows = this.gridOptions.api.getSelectedRows();
    var isId = this.gridSelectedRows.find(elm => {
      return !elm.id
    });

    if(this.gridSelectedRows.length>0 && isId === undefined){
      this.gridDeleteOn = true;
    } 
    else{
      this.gridDeleteOn = false;
    }

  }

  onCellClicked(event){
    if(!this.productDropDownShow){
      this.cync_modal('warning', 'Select a Collateral Name to edit the record.', false, false);
    }
  }
  onCellClicked2(event){
    if(!this.unlockProduct){
      this.cync_modal('warning', 'Select a Collateral Name and Product Group to edit the record.', false, false);
    }
  }
  
  onCellKeyPress(event){
    let selected = this.gridApi.getSelectedRows();
    if(!this.gridAlreadyEdited ){
      if(selected[0].id){
        selected[0].isEdited = true;
        this.gridAlreadyEdited = true;
      }
     
    }
    this.gridResetOn = true;
    this.gridSaveOn = true;
  
  }

  onFocusOut(){
    if(this.gridResetOn){

    }
  }

  /**
   * This method add new row 
   */
	addNewRow() {
		const newItem = this.newRowData();
    this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
    this.gridOptions.api.forEachNode(node => node.rowIndex ? 0 : node.setSelected(true));

    this.gridOptions.api.setFocusedCell(0, "description");
    this.gridOptions.api.startEditingCell({
      rowIndex: 0,
      colKey: 'description'
  });
    this.gridResetOn = true;
    this.gridSaveOn = true;
    this.gridAddOn = false;
  }

  	// New Row Data
	newRowData(): any {
		const newRow = {
			description: '',
			actual_value: '',		
			cgos: '',
		};
		return newRow;
  }

  deleteGrid(){
    const popupParam = { 'title': 'Confirmation', message: "Do you want to Delete ?", 'msgType': 'warning' };
    this.helper.openConfirmPopup(popupParam).subscribe(result => {
          if (result) {
            let idGroup = []
            let selected = this.gridApi.getSelectedRows();
            for(let i =0; i < selected.length; i++){
              idGroup.push(selected[i].id);
            }

            let params = new HttpParams();

            idGroup.forEach((actorName:string) => { 
              params = params.append(`ids[]`,actorName);
            });

            let url = `borrowers/${this.clientId}/inventory_summaries/multi_delete?${params}`;
            this.assetsInventoryService.DeleteInventory(url).subscribe(data=>{
              this.helper.showApiMessages("Successfully Deleted", 'success');
              this.getInventoryDetails(this.collateral_advance_rate_id);
              this.gridOptions.api.redrawRows();
              this.gridDeleteOn = false;
            });

          } else {
                return false;
              }
     });


  }

  
  saveGrid(){
    this.gridApi.clearFocusedCell();
    this.message.showLoader(true);
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    var toSaveRow = rowData.filter(elm=>{
     return elm.isEdited == true;
    })

    var toAddRow = rowData.filter(elm => {
      return !elm.id
    })

   // let selected = this.gridApi.getSelectedRows();
    if(toAddRow && toAddRow.length){
      this.allDates = moment(this.allDates).format('MM/DD/YYYY');
      let modelToAdd = {
        "inventory_summary": {
        "description": toAddRow[0].description,
        // "effective_date": this.allDates,
        "balance_amount": toAddRow[0].actual_value,
        "cogs_value": toAddRow[0].cogs
        }
       }
      const urlToAdd =  `/borrowers/${this.clientId}/inventory_summaries/?collateral_advance_rate_id=${this.collateral_advance_rate_id}`;
      this.assetsInventoryService.postCreateInventory(urlToAdd, modelToAdd).subscribe(data=>{
        this.message.showLoader(false);
        this.helper.showApiMessages("Saved Successfully", 'success');
       })
        
    }
    if(toSaveRow && toSaveRow.length){
      let id = toSaveRow[0].id;
      this.allDates = moment(this.allDates).format('MM/DD/YYYY');
      let modelToSave = {
        "inventory_summary": {
        "description": toSaveRow[0].description,
        // "effective_date": this.allDates,
        "balance_amount": toSaveRow[0].actual_value,
        "cogs_value": toSaveRow[0].cogs
        }
       }
      const urlToSave =  `/borrowers/${this.clientId}/inventory_summaries/${id}?collateral_advance_rate_id=${this.collateral_advance_rate_id}`;
      this.assetsInventoryService.putCreateInventory(urlToSave, modelToSave).subscribe(data=>{
        this.message.showLoader(false);
        this.helper.showApiMessages("Saved Successfully", 'success');
        this.getInventoryDetails(this.collateral_advance_rate_id);
      })

    }
    this.gridResetOn = false;
    this.gridAddOn = true;
    this.gridSaveOn = false;
  }


  cancelData(){
    const popupParam = { 'title': 'Confirmation', message: "Do you want to Discard Changes ?", 'msgType': 'warning' };
    this.helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this.getInventoryDetails(this.collateral_advance_rate_id);
        this.gridResetOn = false;
        this.gridSaveOn = false;
        this.gridAddOn = true;
      }
      else{
        return false;
      }});
    
  }

    	/**
     * This method add new row 
     */
	addNewRow1() {
		const newItem = this.newRowData1();
    this.gridApi2.updateRowData({ add: [newItem], addIndex: 0 });
    this.gridOptions2.api.forEachNode(node => node.rowIndex ? 0 : node.setSelected(true));
    this.gridOptions2.api.setFocusedCell(0, "ineligibility_reason");
    this.gridResetOn1 = true;
  }

  	// New Row Data
	newRowData1(): any {
	
		const newRow = {
			ineligibility_reason: '',
      ineligible_amount: '',
      manual: true
		};
		return newRow;
  }

  onCellKeyPress1(event){
    
    
    let selected = this.gridApi2.getSelectedRows();
    if(!this.grid2AlreadyEdited ){
      if(selected[0].id){
        selected[0].isEdited = true;
        this.grid2AlreadyEdited = true;
      }
     
    }

    this.gridResetOn1 = true;
    this.gridSaveOn1 = true;

  }
  
  saveGrid1(){
    this.gridApi2.clearFocusedCell();
    this.message.showLoader(true);
    let rowData = [];
    this.gridApi2.forEachNode(node => rowData.push(node.data));
    
    var toSaveRow = rowData.filter(elm=>{
     return elm.isEdited == true;
    })

    var toAddRow = rowData.filter(elm => {
      return !elm.id
    })
    let selected = this.gridApi2.getSelectedRows();
   
   
    if(toAddRow && toAddRow.length){
    
      let modeltoAdd = {
        "inventory_ineligible_summary": {

          "ineligibility_reason_id": this.ineligibledropdownVal,
          
          "ineligible_amount": toAddRow[0].ineligible_amount
          
          }
       }
      const urltoAdd =  `borrowers/${this.clientId}/inventory_summaries/ineligible_create?collateral_advance_rate_id=${this.collateral_advance_rate_id}&client_balance_id=${this.client_balance_id}`;
      this.assetsInventoryService.postCreateIneligible(urltoAdd, modeltoAdd).subscribe(data=>{
        this.helper.showApiMessages("Saved Successfully", 'success');
        this.getAllIneligibleSummaries(this.collateral_advance_rate_id, this.client_balance_id)
        this.grid2AlreadyEdited = false;
        this.gridResetOn1 = false;
        this.gridSaveOn1 = false;
     });
        this.message.showLoader(false);
    }
    if(toSaveRow && toSaveRow.length){
      var dropdownid:any;
      let dropdownval = toSaveRow[0].ineligibility_reason;
      if(!this.ineligibledropdownVal){
      
        this.ineligibledropdownVal = dropdownval;
        var some = this.ineligiblityReasonDD.filter(elm =>{
          return elm.value == dropdownval
        })
        if(some && some.length){
          dropdownid =  some[0].id;
        } 
        
      }
      else{
        dropdownid = this.ineligibledropdownVal;
      }
      let modeltoSave = {
        "inventory_ineligible_summary": {
          "ineligibility_reason_id": dropdownid,
          "ineligible_amount": toSaveRow[0].ineligible_amount
          
          }
       }
      const urltoSave =  `borrowers/${this.clientId}/inventory_summaries/ineligible_update?id=${selected[0].id}collateral_advance_rate_id=${this.collateral_advance_rate_id}&client_balance_id=${this.client_balance_id}`;
      this.assetsInventoryService.postIneligible(urltoSave, modeltoSave).subscribe(data=>{
        this.helper.showApiMessages("Saved Successfully", 'success');
        this.getAllIneligibleSummaries(this.collateral_advance_rate_id, this.client_balance_id)
        this.grid2AlreadyEdited = false;
        this.gridResetOn1 = false;
        this.gridSaveOn1 = false;
        this.message.showLoader(false);
       },
       err=>{
        // this.helper.showApiMessages("error", 'warning');
        this.message.showLoader(false);
       });
        
    }
  }

  ongridRowSelected2(event: any) {
    this.gridSelectedRows2 = this.gridOptions2.api.getSelectedRows();
    
    var isId = this.gridSelectedRows2.find(elm => {
      return !elm.id
    });

    if(this.gridSelectedRows2.length>0 && isId === undefined){
      this.gridDeleteOn1 = true;
    } 
    else{
      this.gridDeleteOn1 = false;
    }
  }

  deleteGrid1(){
    const popupParam = { 'title': 'Confirmation', message: "Do you want to Delete ?", 'msgType': 'warning' };
    this.helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
    let idGroup = []
    let selected = this.gridApi2.getSelectedRows();
    for(let i =0; i < selected.length; i++){
      idGroup.push(selected[i].id);
    }

    let params = new HttpParams();
    idGroup.forEach((actorName:string) =>{
 params = params.append(`ids[]`,actorName);
 })

    let url = `borrowers/${this.clientId}/inventory_summaries/ineligible_multi_delete?${params}&collateral_advance_rate_id=${this.collateral_advance_rate_id}&client_balance_id=${this.client_balance_id}`;
    this.assetsInventoryService.DeleteIneligible(url).subscribe(data=>{
      this.helper.showApiMessages("Successfully Deleted", 'success');
      this.getAllIneligibleSummaries(this.collateral_advance_rate_id, this.client_balance_id)
      this.gridOptions2.api.redrawRows();
      this.gridDeleteOn1 = false;
    })   
  }
  else {
    return false
  }
})
  }


  cancelData1(){

    const popupParam = { 'title': 'Confirmation', message: "Do you want to Discard Changes ?", 'msgType': 'warning' };
    this.helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this.getAllIneligibleSummaries(this.collateral_advance_rate_id, this.client_balance_id)
        this.gridResetOn1 = false;
        this.gridSaveOn1 = false;
        this.gridAddOn1 = true;
      }
      else{
        return false;
      }});
  }




  onGridReady(params) {
    this.gridParams = params;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onGridReady2(params) {
    this.gridParams2 = params;

    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }
  

  createData(count, data) {
    var result = [];
    for (var i = 0; i < count; i++) {
      result.push({
      
        as_of_date: data.effective_date,
        actual_value: data.balance_amount,
        ineligible_value: data.ineligible_amount,
        eligible_value: data.eligible_value,
        cgos: data.cogs_value,
        nolv: data.nolv_value,

        adjusted_advance_rate:data.calculated_advance_rate,
        collateral: data.collateral_value,
        sub_limit: data.sub_limit,
       

      });
    }
    return result;
  }


  gridinit1() {
    this.columnDefs1 = [
      {
        headerName: 'Description',
        field: 'description',
       
      },
 
      {
        field: 'actual_value',
        headerName: 'Actual Value',
        
      },
  
      {
        field: 'eligible_value',
        headerName: 'Eligible %',
       
      },
      {
        field: 'collateral_value',
        headerName: 'Colateral Value',
        
      }
    ];
    this.defaultColDef1 = {
      flex: 1,
      resizable: true,
    };
    this.statusBar1 = {
      statusPanels: [{ statusPanel: 'agAggregationComponent' }],
    };

    this.gridOptions1 = {
      onGridReady: () => {
        this.gridOptions1.api.sizeColumnsToFit();
      }
    };
    this.gridOptions1.getRowStyle = function (params) {
    }
  }

  getRemainingData(id:any){
    this.message.showLoader(true);
    if(id === 'all'){
      let url = `borrowers/${this.clientId}/inventory_summaries/summary`
      this.assetsInventoryService.getRemaningData(url).subscribe(data=>{
        this.inventoryRemainingDetails = JSON.parse(data._body);
            // this.rowData.push({ description: "Total", as_of_date: '', actual_val: 12000.00, ineligible_val: '', eligible_val: '0.00', cgos: '0.00', nolv: '0.00', ltv: '80.00', adjusted_advance_rate: '80.00', colateral_val: 12345, sublimit: 34567, advance_rate: 20 },);
        let resultData = [];
       // let totalSummary = this.inventoryDetails
        this.bbc_date = this.inventoryRemainingDetails.bbc_date
        this.rowData1 = this.inventoryRemainingDetails.summaries;
        this.lastTableData = this.inventoryRemainingDetails.ineligible_summary
        this.EOM_Totals = this.lastTableData[0].eom_totals;
        this.eligible_accounts_inventories = this.lastTableData[1].eligible_accounts_inventories;
        this.accounts_inventories_collateral = this.lastTableData[2].accounts_inventories_collateral;
        //this.pinnedBottomRowData = this.createData(1, this.inventoryDetails.summary);
        this.inventory_turn_days = this.inventoryRemainingDetails.inventory_turn_days
        this.message.showLoader(false);
      })
    }
    else{
      const url =  `borrowers/${this.clientId}//inventory_summaries/summary?collateral_advance_rate_id=${id}`;
      this.assetsInventoryService.getInventoryDetails(url).subscribe(data=>{
        this.inventoryRemainingDetails = JSON.parse(data._body);
        this.rowData1 = this.inventoryRemainingDetails.summaries;

        // this.pinnedBottomRowData = this.createData(1, this.inventoryDetails.summary);
        this.message.showLoader(false);
  
      })
    }
  }

  gridinit2() {
    this.columnDefs2 = [
      {
        headerName: '',
        field: 'check-selection',
        width: 50,
        checkboxSelection: (params) => {
          if (params.data.manual) {
            return true
          }
          else {
            return false
          }
        }
      },
      {
        headerName: 'Ineligible Reason',
        field: 'ineligibility_reason',
        cellRendererFramework: IneligibleReasonDropDownComponent,
          cellRendererParams: {
            editable: false,
            dropdown: this.ineligiblityReasonDD
        },   
      },
      {
        field: 'ineligible_amount',
        headerName: 'Ineligible Amount',
        editable: (param)=>{
          if(this.unlockProduct && param.data.manual){
            return true;
          }
          else{
            return false;
          }
        }
       
      },
      {
        field: 'isEdited',
        hide: true
      }
      
    ];
    this.defaultColDef2 = {
      flex: 1,
      resizable: true,
      
    };
    this.statusBar = {
      statusPanels: [{ statusPanel: 'agAggregationComponent' }],
    };

    this.gridOptions2 = {
      onGridReady: () => {
        this.gridOptions2.api.sizeColumnsToFit();
      },

      context: {
				componentCheck: this
			}
    };

  }

  getAllIneligibleSummaries(CAR_id:any, CB_id: any){
    this.message.showLoader(true);
    if(CAR_id === 'all'){
      const url =  `/borrowers/${this.clientId}/inventory_summaries/ineligible_summaries`;
      this.assetsInventoryService.getAllIneligibleSummaries(url).subscribe(data=>{
        this.ineligibleSummaryDetails = JSON.parse(data._body); 
        let resultData = [];
  
        this.rowData2 = this.ineligibleSummaryDetails.inventories;
        this.pinnedBottomRowData1 = this.createData1(1, this.ineligibleSummaryDetails.summary);
        this.message.showLoader(false);

      })
    }
    else{
      const url =  `/borrowers/${this.clientId}/inventory_summaries/ineligible_summaries?collateral_advance_rate_id=${CAR_id}?client_balance_id=${CB_id}`;
      this.assetsInventoryService.getAllIneligibleSummaries(url).subscribe(data=>{
        this.ineligibleSummaryDetails = JSON.parse(data._body);
        this.rowData2 = this.ineligibleSummaryDetails.inventories;
      
        this.pinnedBottomRowData1 = this.createData1(1, this.ineligibleSummaryDetails.summary);
        this.message.showLoader(false);
  
      })
    }
  }

  createData1(count, data) {
    var result = [];
    for (var i = 0; i < count; i++) {
      result.push({     
        ineligibility_reason: data.ineligibility_reason_id,
        ineligible_amount: data.ineligible_amount,
      });
    }
    return result;
  }

  ngAfterViewInit() {
    const scrollElment = document.querySelector(".app-body-container");
    let h = $(self).height() - 270;
    scrollElment.addEventListener('scroll', ev => {
      h = $(self).height() - 270;
      this.renderer.setStyle(scrollElment, 'height', `${h}px`);
      this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
    });
    this.renderer.setStyle(scrollElment, 'height', `${h}px`);
    this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
  }

  turnEdit(){
    this.tdEdit = 'none';
    this.tdOK = 'inline';    
    this.inv_turn_inputenable = false;
  }
  turnCancel(){
    this.tdOK = 'none';
    this.tdEdit = 'inline';
    this.inv_turn_inputenable = true;
  }

  basedOnValueChanged(data: any) {
		this.allDates = data;
  }

  basedOnValueChanged1(data: any) {
    this.ineligibledropdownVal = data;
    let selected = this.gridApi2.getSelectedRows();
    if(!this.grid2AlreadyEdited ){
      if(selected[0].id){
        selected[0].isEdited = true;
        this.grid2AlreadyEdited = true;
      }
     
    }

    this.gridResetOn1 = true;
    this.gridSaveOn1 = true;

  }
  
  collateralDropDownSelect(event: any){
    let selectElementText = event.target['options']
      [event.target['options'].selectedIndex].text;
      this.colateralName = selectElementText;
    this.collateral_advance_rate_id = event.target.value;
    this.getInventoryDetails(event.target.value);
    this.getRemainingData(event.target.value);
    if(event.target.value === 'all'){
     
      this.inventoryDayBoxShow = true;
      this.productDropDownShow = false;
      this.hideWhileAll = true;
      this.unlockProductCollatrel = false;
      this.unlockProduct = false;
      this.gridColumnApi2.getColumn('ineligibility_reason').colDef.cellRendererParams = {
        editable: false
    }
    this.getAllIneligibleSummaries('all', '')
  
    }
    else{
      this.hideWhileAll = false;
      this.inventoryDayBoxShow = false;
      this.productDropDownShow = true;
      this.unlockProductCollatrel = true;
      this.getAllIneligibleSummaries(this.collateral_advance_rate_id, '')

    }
  }

  productDropDownSelect(event: any){
    this.client_balance_id = event.target.value
    this.getAllIneligibleSummaries(this.collateral_advance_rate_id, this.client_balance_id);
    if(event.target.value === ''){
      this.unlockProduct = false;
        
    this.gridColumnApi2.getColumn('ineligibility_reason').colDef.cellRendererParams = {
      editable: false
  }
     
    }
    else{
      this.unlockProduct = true;
        
    this.gridColumnApi2.getColumn('ineligibility_reason').colDef.cellRendererParams = {
      editable: true
  }
      
    }
  }

  getIdFromDropdownName(){
    let url = `borrowers/${this.clientId}/inventory_summaries/ineligibility_reasons`
    this.assetsInventoryService.getIneligibleReasonDropDown(url).subscribe(data =>{
      let result = JSON.parse(data._body);
      this.ineligiblityReasonDD = result.reasons;
      this.assetsInventoryService.setineligibleDropdown(this.ineligiblityReasonDD);
      localStorage.setItem("aseetInventoryDD", JSON.stringify(this.ineligiblityReasonDD));
    })
  }


  cync_modal(type, message, is_prompt, auto_hide) {
        $('#cync_alerts .modal-body').html('<p>' + message + '</p>');
        if (type == 'warning') { $('#cync_alerts .modal-header').css('background', '#ea5859').html('<i class="fa fa-5x fa-exclamation-triangle clr_white f_s_64"></i>'); }
        if (type == 'success') { $('#cync_alerts .modal-header').css('background', 'green').html('<i class="fa fa-5x fa-check clr_white f_s_64"></i>'); }
        if (type == 'info') { $('#cync_alerts .modal-header').css('background', '#4dbbf8').html('<i class="fa fa-5x fa-info-circle clr_white f_s_64"></i>'); }
        if (type == 'danger') { $('#cync_alerts .modal-header').css('background', '#eb595a').html('<i class="fa fa-5x fa-ban clr_white f_s_64"></i>'); }
        if (is_prompt == true) {
          $('#cync_alerts .modal-footer').html('<p><button id="modal_action_yes" type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" >Yes</button> <button  id="modal_action_no"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">No</button></p>');
        } else {
          $('#cync_alerts .modal-footer').html('<p><button  id="modal_action_close"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">Close</button></p>');
        }
        (<any>$('#cync_alerts')).modal('show');
        if (auto_hide == true) {
          (<any>$('#cync_alerts')).modal('show');
          setTimeout(function () {
            (<any>$('#cync_alerts')).modal('hide');
          }, 2000);
        }
  }

  currencyValFormat = (params => {
    if(params.data.as_of_date != "Totals"){
          var usdFormate = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        });
        let usdFormatedValue = usdFormate.format(params.value === undefined ? params : params.value);
        if (usdFormatedValue.indexOf('-') !== -1) {
            return "(" + usdFormatedValue.replace('-', '') + ")";
        } else {
            return usdFormatedValue;
        }        
    }
  });

}
