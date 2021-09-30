import { Component, OnInit } from '@angular/core';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
//import  {navbarComponent} from '../../../app/navbar/navbar.component';

@Component({
  selector: 'app-dilution-analysis',
  templateUrl: './dilution-analysis.component.html'
})
export class DilutionAnalysisComponent{


dilutionAnalysisModel : GridModel;
   coulmnDefinition : ColumnDefinition;
   lenderId: string;
  // borrowerIdd: any;

  constructor(private config: AppConfig, private _service: CustomHttpService) {
   	this.lenderId = this.config.getConfig('lenderId');
   // sessionStorage.removeItem('borrowerId');
   // this.dilutionAnalysisData();
   this.dilutionAnalysisModel = {

	        infiniteScroll : true,
	        multiSelection : false,
	        onDemandLoad : true,
	        singleSelection : false,
	        apiDef : {getApi : '/borrowers/4/dilution_analysis',deleteApi: '', updateApi : '' },
	        type : 'Dilution Analysis',
	        columnDef : [

	                    {field: 'month_name', header: ' ', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.average_days_in_fiscal_month', header: 'Average Days In Fiscal Month', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.cash_dilution_pct', header: 'Cash Dilution %', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.sales_dilution_pct', header: 'Sales Dilution %', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.total_dilution', header: 'Total Dilution', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.turn_over_days', header: 'T/O Days', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.bom_balance', header: 'BOM Balance', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.gross_billings', header: 'Gross Bilings', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.net_cash', header: 'Net Cash', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.credit_memos', header: 'Credit Memos', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.adjustments', header: 'Adjustments', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
	                    {field: 'dilusion_analysis.average_eom_balance', header: 'Average EOM balance', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}
	                    ]
	    }
      } 

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
  }

 /* dilutionAnalysisData(){
  	this.borrowerIdd = sessionStorage.getItem('borrowerId');
  	console.log("dilutionAnalysisData...",sessionStorage.getItem('borrowerId'));
   	
  }*/

}
