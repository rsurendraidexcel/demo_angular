import { Component, OnInit } from '@angular/core'
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '@app/app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from "@angular/router";
import { GridComponent } from '@cyncCommon/component/grid/grid.component';

@Component({
    selector: 'gl-setup-view-comp',
    templateUrl: './gl-setup.view.component.html'
})
export class AblGlSetupViewComponent {
    lenderId: string;
    constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
        this.lenderId = this.config.getConfig('lenderId');
    }

    setUpDetails: any;
    setUpId: any;
    apiURL: any;

    ngOnInit() {
        this.apiURL = "gl_account_details/";
        this.route.params.subscribe(params => {
            this.setUpId = params['id'];
            if (this.setUpId !== undefined) {
                this._service.getCall(this.apiURL + this.setUpId).then(i => {
                    this.setUpDetails = this._service.bindData(i)
                });
            }
        });
        this._service.setHeight();
    }

    navigateToHome() {
        this._router.navigateByUrl('/otherGeneralCodes/gl-setup');
    }

    delete() {
        this._grid.deleteFromView(this.setUpId, this.apiURL);
    }

    edit() {
        this._grid.goToEditFromView(this.setUpId);
    }

}
