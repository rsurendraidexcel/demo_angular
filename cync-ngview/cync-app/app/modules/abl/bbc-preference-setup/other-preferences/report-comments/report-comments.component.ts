import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid//custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { navbarComponent } from '@app/navbar/navbar.component';

@Component({
  selector: 'app-report-comments',
  templateUrl: './report-comments.component.html',
  styleUrls: ['./report-comments.component.css']
})
export class ReportCommentsComponent implements OnInit {

  reportCommentsModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;

  constructor(private _apiMapper: APIMapper,
    private helper: Helper,
    private _navbar: navbarComponent) {

    this.borrowerId = CyncConstants.getSelectedClient();

    this.reportCommentsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: this.getEndPoint(), deleteApi: '', updateApi: '' },
      type: 'Report Comments',
      columnDef: [
        { field: 'name', header: 'Comment Set Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'assigned_reports', header: 'Assigned Reports', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'created_at', header: 'Created Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
      ],
      responseKey: 'comment_sets',
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: true,
      isEditFunctionalityRequired: true,
      isDeleteFunctionalityRequired: true,
      isExportFunctionalityRequired: true,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: false,
      menuName: 'Report Comments'
    }
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this.helper.setHeight();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
  }

  getEndPoint() {
    let endPoint = this._apiMapper.endpoints[CyncConstants.GET_REPORT_COMMENT];
    endPoint = endPoint.replace("{borrowerId}", this.borrowerId);
    return endPoint;
  }
}
