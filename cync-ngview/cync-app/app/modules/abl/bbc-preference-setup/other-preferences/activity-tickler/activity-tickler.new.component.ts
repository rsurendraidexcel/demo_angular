import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '@cyncCommon/services/http.service';
import { AppConfig } from '@app/app.config';
import  {GridModel, ColumnDefinition} from '@cyncCommon/component/grid/grid.model';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { Router} from '@angular/router';
import {MessageServices} from '@cyncCommon/component/message/message.component';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-activity-tickler-new',
  templateUrl: './activity-tickler.new.component.html'
})
export class ActivityTicklerNewComponent implements OnInit {

	coulmnDefinition : ColumnDefinition;
	lenderId: string;

  constructor(private config: AppConfig, private _service: CustomHttpService) { 
  	
  }

  ngOnInit() {
  	$("#cync_app_dashboard").removeClass("loading-modal-initial");
  	this._service.setHeight();
  }

}
