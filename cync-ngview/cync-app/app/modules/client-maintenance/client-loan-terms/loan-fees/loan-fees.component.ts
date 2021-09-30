import { Component, OnInit, ElementRef, AfterViewInit, Renderer2, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { window } from 'rxjs/operators';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { LoanFeeService } from './service/loan-fees.service';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { LoanFeeModel } from './model/loan-fees.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Subscription } from 'rxjs';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';

@Component({
  selector: 'app-loan-fees',
  templateUrl: './loan-fees.component.html'
})

/**
 * @author Nagendra
 */
export class LoanFeesComponent implements OnInit, OnDestroy, AfterViewInit {

  loanFeeDetails: LoanFeeModel = new LoanFeeModel();
  borrowerId: string;
  clientSelectionSubscription: Subscription;

  @ViewChild('content_section') csectionref: ElementRef;
  constructor(
    private _message: MessageServices,
    private config: AppConfig,
    private _apiMapper: APIMapper,
    private _router: Router,
    private _loanFeeService: LoanFeeService,
    private elementRef: ElementRef,
    private render: Renderer2,
    private helper: Helper,
    private _clientSelectionService: ClientSelectionService

  ) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    this.helper.adjustUI();
    this._message.showLoader(true);
    this.registerReloadGridOnClientSelection();
    this.getData();
  }

  getData(){
    this._loanFeeService.getLoanFeeData(this._apiMapper.endpoints[CyncConstants.GET_LOAN_FEES].replace("{clientId}", this.borrowerId)).subscribe(data => {
      this.loanFeeDetails = data;
      this._message.showLoader(false);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.loadScrollPage(), 1000);
  }

  loadScrollPage() {
    var viewHeight = document.getElementById('app-body-container').offsetHeight - 90 + 'px';
    this.render.setStyle(this.csectionref.nativeElement, 'height', viewHeight);
  }

  @HostListener('window:resize') onResize() {
    this.loadScrollPage();
  }


  /**
  * call when user will change the client
  * 
  */
 registerReloadGridOnClientSelection() {
  this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
    this._message.showLoader(true);
    this.borrowerId = clientId;
    this.getData();
  });
}

ngOnDestroy(){
  this.clientSelectionSubscription.unsubscribe();
}



}
