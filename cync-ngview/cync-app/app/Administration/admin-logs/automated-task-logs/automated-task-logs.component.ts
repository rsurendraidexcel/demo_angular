import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-automated-task-logs',
  templateUrl: './automated-task-logs.component.html'
})
export class AutomatedTaskLogsComponent implements OnInit {

  model: GridModel;
  lenderId: string;
  coulmnDefinition: ColumnDefinition;

  constructor(private _service: CustomHttpService) {
    this.model = {

      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '/rake_logs?page=1&size=' + CyncConstants.getDefaultRowCount(), deleteApi: '/v1/lenders/' + this.lenderId + '/currencies', updateApi: '/v1/lenders/' + this.lenderId + '/currencies' },
      type: 'Automated Task Logs',
      columnDef: [
        { field: 'task_name', header: 'Task Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'start_time', header: 'Start Time', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'end_time', header: 'End Time', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'status', header: 'Status', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
      ]
    };
  }


  ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this._service.setHeight();
  }

}
