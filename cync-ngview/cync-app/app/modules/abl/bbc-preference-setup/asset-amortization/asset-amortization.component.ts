import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { GridModel, ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
@Component({
  selector: 'app-asset-amortization',
  templateUrl: './asset-amortization.component.html',
  styleUrls: ['./asset-amortization.component.css']
})
export class AssetAmortizationComponent implements OnInit {

  assetamortizationModel: GridModel;
  coulmnDefinition: ColumnDefinition;
  lenderId: string;

  constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
    this.lenderId = this.config.getConfig('lenderId');
    this.assetamortizationModel = {

      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: '/exception_statistics_reportings', deleteApi: '', updateApi: '' },
      type: 'Asset Amortization',
      columnDef: [
        { field: '', header: 'Collateral Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: '', header: 'Asset Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: '', header: 'Amortized Amount', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: '', header: 'Amortized Frequency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: '', header: 'Amortized Percentage', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: '', header: 'Present Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
      ]
    }

  }

  ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
  }

}
