import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {

  model: GridModel;
  lenderId: string;
  coulmnDefinition: ColumnDefinition;

  constructor(private _service: CustomHttpService, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.model = {

      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '/audits?page=1&size=' + CyncConstants.getDefaultRowCount(), deleteApi: '', updateApi: '' },
      type: 'Audit Logs',
      columnDef: [
        { field: 'client_name', header: 'Client Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'date_time', header: 'Date Time', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'user', header: 'User', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'program', header: 'Program', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'action', header: 'Action', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'fields', header: 'Field', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'fields', header: 'Old Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'fields', header: 'New Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'info_one', header: 'Other Info', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
      ]
    };
  }

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
  }
}
