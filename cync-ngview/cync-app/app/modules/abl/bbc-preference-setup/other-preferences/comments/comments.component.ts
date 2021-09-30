import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid//custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { navbarComponent } from '@app/navbar/navbar.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  commentsModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;
  borrowerId: string;

  constructor(private _apiMapper: APIMapper,
    private helper: Helper,
    private _navbar: navbarComponent) {

    this.borrowerId = CyncConstants.getSelectedClient();

    this.commentsModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: this.getEndPoint(), deleteApi: '', updateApi: '' },
      type: 'Comments',
      columnDef: [

        { field: 'user', header: 'User', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'comment_type', header: 'Comment Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'visibility', header: 'Visibility', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'comment', header: 'Comment', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'date', header: 'Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
      ],
      responseKey: 'comments',
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
      menuName: 'Comments'
    }
  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this.helper.setHeight();
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();

  }

  getEndPoint() {
    let endPoint = this._apiMapper.endpoints[CyncConstants.GET_COMMENT];
    endPoint = endPoint.replace("{commentId}", this.borrowerId);
    return endPoint;
  }
}
