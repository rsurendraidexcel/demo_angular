import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import  {Router} from '@angular/router';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@Component({
  selector: 'app-create-user-view',
  templateUrl: './create-user.component.view.html'
})
export class CreateUserViewComponent implements OnInit {

  constructor(private _grid: GridComponent, private route: ActivatedRoute, private _service: CustomHttpService, private _router: Router) {


  }
    userId: any;
    apiURL: any;
    viewDetails: any;
    rolesList: any[];
    roleName: any = '';
    startHr: any;
    startMin: any;
    endHr: any;
    endMin: any;
    userType: string;

  ngOnInit() {
     this.apiURL = 'admin/users/';
      this.route.params.subscribe(params => {
     this.userId = params['id'];
     if (this.userId !== undefined){
       this._service.getCall(this.apiURL + this.userId).then(i => {
       this.viewDetails = this._service.bindData(i);
       if (this.viewDetails.extended_time_before_start != null){
         this.startHr = Math.floor(this.viewDetails.extended_time_before_start / 60);
         this.startMin = this.viewDetails.extended_time_before_start % 60;
       }
       if (this.viewDetails.extended_time_after_end != null){
         this.endHr = Math.floor(this.viewDetails.extended_time_after_end / 60);
         this.endMin = this.viewDetails.extended_time_after_end % 60;
       }
       if (this.viewDetails.user_type == 'N' || this.viewDetails.user_type == 'normal'){
         this.userType = 'Normal';
       }else{
           this.userType = 'Emergency';
       }


           this._service.getCall('/roles').then(i => {
          this.rolesList = this._service.bindData(i).roles;
          /*console.log(":::this.rolesList----",this.rolesList);*/
             for (let i = 0; i < this.rolesList.length; i++){
              const tempRoleObj = this.rolesList[i];
              if (tempRoleObj.id == this.viewDetails.role){
                this.roleName = tempRoleObj.name;
              }
            }
        });

     });


     }
     });
     $('#cync_app_dashboard').removeClass('loading-modal-initial');
   this._service.setHeight();
  }

  navigateToHome() {
      //this._location.back();
    this._router.navigateByUrl('/userMaintenance/create-user');
  }

  delete(){
    this._grid.deleteFromView(this.userId, 'admin/users/?ids=');
  }

  edit(){
    this._grid.goToEditFromView(this.userId);
  }

}
