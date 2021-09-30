import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-notification-logs',
  templateUrl: './notification-logs.component.html'
})
export class NotificationLogsComponent implements OnInit {
  model: GridModel;
  lenderId: string;
  coulmnDefinition: ColumnDefinition;
  constructor(private _service: CustomHttpService) {
    this.model = {

      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '/notification_logs?page=1&size=' + CyncConstants.getDefaultRowCount(), deleteApi: '/v1/lenders/' + this.lenderId + '/currencies', updateApi: '/v1/lenders/' + this.lenderId + '/currencies' },
      type: 'Notification Logs',
      columnDef: [
        { field: 'manager', header: 'Manager', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'client', header: 'Client Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'recipient', header: 'Recipient', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'subject', header: 'Subject', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'msg', header: 'Message', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'log_type', header: 'Log Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'start_at', header: 'Created Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'status', header: 'Status', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
      ]
    };
  }

  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
  }

}
