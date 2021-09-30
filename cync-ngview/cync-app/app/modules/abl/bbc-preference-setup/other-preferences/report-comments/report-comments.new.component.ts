import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { OtherPreferencesComponent } from '../other-preferences.component';

@Component({
  selector: 'app-report-comments-new',
  templateUrl: './report-comments.new.component.html'
})
export class ReportCommentsNewComponent implements OnInit {

	coulmnDefinition : ColumnDefinition;
	lenderId: string;

  constructor(private _parent : OtherPreferencesComponent, private config: AppConfig, private _service: CustomHttpService) { 
  	
  }

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	this._service.setHeight();
  }

}
