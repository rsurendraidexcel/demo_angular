import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientTransactionService } from '../service/client-transaction-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Observable } from 'rxjs/Observable';
import { AblClientTransactionDetail } from '../model/client-transaction.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'view-client-transaction',
    templateUrl: './view-client-transaction.component.html'
})

/**
 * @author Raushan
 */
export class ViewClientTransactionComponent implements OnInit {

    borrowerId: any;
    clientTransactionDetail: any;

    constructor(private _clientTransactionService: ClientTransactionService,
        private _message: MessageServices,
        private _helper: Helper,
        private _apiMapper: APIMapper,
        private _router: Router,
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
        this._helper.adjustUI();
        this.getClientTransactionDetail();
    }

    getClientTransactionDetail() {
        let apiEndPoint = this._apiMapper.endpoints[CyncConstants.VIEW_CLIENT_TRANSACTION];
        this._route.params.subscribe(params => {
            this.borrowerId = params['id'];
            if (this.borrowerId !== undefined) {
                this._clientTransactionService.getClientTransactionById(apiEndPoint + this.borrowerId).subscribe(apiResponse => {
                    console.log("::::apiResponse", apiResponse);
                    this.clientTransactionDetail = apiResponse['client_transaction_summary'];
                    console.log("::::this.clientTransactionDetail", this.clientTransactionDetail[0]);
                });
            }
        });
    }
}