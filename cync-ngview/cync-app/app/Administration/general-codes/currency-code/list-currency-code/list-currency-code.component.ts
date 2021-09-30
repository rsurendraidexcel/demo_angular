import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-list-currency-code',
  templateUrl: './list-currency-code.component.html',
  styleUrls: ['./list-currency-code.component.scss']
})
export class ListCurrencyCodeComponent implements OnInit {
  currenyCodeGridModel: CustomGridModel;
  coulmnDefinition: ColumnDefinition;

  constructor(private _apiMapper: APIMapper) { }

  /**
   * Initializing currency code  list model
   */
  ngOnInit() {
    this.currenyCodeGridModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.LIST_CURRENCY_CODES], deleteApi: this._apiMapper.endpoints[CyncConstants.LIST_CURRENCY_CODES], updateApi: '' },
      type: 'Curreny Code',
      columnDef: [
        { field: 'currency_cd', header: 'Currency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'decimal_precision', header: 'Decimal Precision', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
      ],
      responseKey: 'currency',
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: true,
      isEditFunctionalityRequired: true,
      isDeleteFunctionalityRequired: true,
      isExportFunctionalityRequired: true,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: true,
      permissionRequired: true,
      isPaginationRequired: true,
      menuName: 'currency_code',
      deletePopupParameter: 'currency_cd',
      reloadGridDataOnClientSelection: false,
    };

  }

}
