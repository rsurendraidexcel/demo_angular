import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';

@Component({
    selector: 'comments-type-view-component',
    templateUrl: './comments-type.view.component.html'
})
export class CommentsTypeViewComponent {
	lenderId: string;
  constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
  }

  commentsTypeId: any;
  apiURL: any;
  viewDetails: any;

  ngOnInit() {
   this.apiURL = 'general_codes/comment_types/';
   this.route.params.subscribe(params => {
    this.commentsTypeId = params['id'];
    if (this.commentsTypeId !== undefined){
       this._service.getCall(this.apiURL + this.commentsTypeId).then(i => {
       this.viewDetails = this._service.bindData(i); });
    }
    });
   this._service.setHeight();
  }

  navigateToHome() {
      //this._location.back();
    this._router.navigateByUrl('/generalCodes/comments-type');
  }

  delete(){
    this._grid.deleteFromView(this.commentsTypeId, this.apiURL);
  }

  edit(){
    this._grid.goToEditFromView(this.commentsTypeId);
  }

}
