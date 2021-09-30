import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';

@Component({
  selector: 'app-exceptions-new',
  templateUrl: './exceptions.new.component.html'
})
export class ExceptionsNewComponent implements OnInit {

	coulmnDefinition : ColumnDefinition;
	lenderId: string;

  constructor( private config: AppConfig, private _service: CustomHttpService) { 
  	
  }

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	this._service.setHeight();
  }

}
