import { Component, OnInit } from '@angular/core';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import  {CustomHttpService} from '@cyncCommon/services/http.service';

@Component({
  selector: 'app-document-compliance-reporting',
  templateUrl: './document-compliance-reporting.component.html'
})
export class DocumentComplianceReporting implements OnInit {

	documentComplianceReporting : GridModel;
	lenderId: string;
	coulmnDefinition : ColumnDefinition;

  constructor(private config: AppConfig,private _service: CustomHttpService) { 
  		this.documentComplianceReporting = {

        infiniteScroll : true,
        multiSelection : false,
        onDemandLoad : true,
        singleSelection : false,
        apiDef : {getApi : '/addendum_tasks_reporting',deleteApi: '', updateApi : ''  },
        type : 'Document Compliance Reporting',
        columnDef : [
                    {field: 'client_name', header: 'Client Name', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'classification', header: 'Classification', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'source_documents_name', header: 'Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'frequency_display', header: 'Frequency', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'last_date_fmt', header: 'Last Period', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'current_date_fmt', header: 'Current Period', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'due_date_fmt', header: 'Due Date', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'notified_date_fmt', header: 'Notified Date', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'received_date_fmt', header: 'Received Date', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                    {field: 'compliance_text', header: 'Compliance Status', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}
                    ]
    }
  }
  

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  //  this._service.setHeight();
  }

}
