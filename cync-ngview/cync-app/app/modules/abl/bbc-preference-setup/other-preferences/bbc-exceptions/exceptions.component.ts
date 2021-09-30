import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { OtherPreferencesComponent } from '../other-preferences.component';
import { navbarComponent } from '@app/navbar/navbar.component';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css']
})
export class ExceptionsComponent implements OnInit {

  exceptionsModel : GridModel;
  coulmnDefinition : ColumnDefinition;
  lenderId: string;
  borrowerIdSelected : string;

    constructor(private _navbar : navbarComponent, private _parent : OtherPreferencesComponent, private config: AppConfig, private _service: CustomHttpService) { 
      this.lenderId = this.config.getConfig('lenderId');
      _parent.subMenu = 'exceptions';

      this.borrowerIdSelected = sessionStorage.getItem('borrowerId');

        this.exceptionsModel = {

            infiniteScroll : true,
            multiSelection : false,
            onDemandLoad : true,
            singleSelection : false,
            apiDef : {getApi : 'borrowers/'+this.borrowerIdSelected+'/borrower_exceptions',deleteApi: '', updateApi : '' },
            type : 'Borrower Exceptions',
            columnDef : [
                     
                {field: 'display_label', header: 'Exception Description', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                {field: 'description', header: 'Exception Notes', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                {field: 'operator', header: 'Exception Sign', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                {field: 'value_type', header: 'Value Type', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                {field: 'exception_value', header: 'Exception Value', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false},
                {field: 'system_defined', header: 'System', sortable : true, isTemplate : false , templateHtml : '', hidden: false, filter: false}
            ]
        }
    }

    ngOnInit() {
      $("#cync_app_dashboard").removeClass("loading-modal-initial");
      this._service.setHeight();
      this._navbar.getUpdatedAngularMenuAndBreadCrumb();
    }

}
