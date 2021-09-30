import { Component, OnInit, ElementRef, AfterViewInit, Renderer2, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { IneligibleAdvancesService } from './service/ineligible-advances.service';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { IneligibleAdvancesModel } from './model/ineligible-advances.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ineligible-advances',
  templateUrl: './ineligible-advances.component.html'
})

/**
 * @author Nagendra
 */
export class IneligibleAdvancesComponent implements OnInit, OnDestroy, AfterViewInit {
  ineligibleadvancesDetail: IneligibleAdvancesModel = new IneligibleAdvancesModel();
  cols: any[];
  load_more: boolean = false;
  loadCountarr: any = [];
  showCount = 1;
  rowcount = 10;
  ShowmoreData: any = [];
  ineligibleCustomerParameterData: any = [];
  borrowerId: string;
  clientSelectionSubscription: Subscription;


  @ViewChild('content_section') csectionref: ElementRef;
  @ViewChild(DataTable) dataTableComponent: DataTable;
  constructor(
    private _message: MessageServices,
    private _apiMapper: APIMapper,
    private _ineligibleAdvancesService: IneligibleAdvancesService,
    private helper: Helper,
    private _router: Router,
    private elementRef: ElementRef,
    private render: Renderer2,
    private _clientSelectionService: ClientSelectionService
  ) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  /**
  * Intializing the form control and setting the table headers
  */
  ngOnInit() {
    this.helper.adjustUI();
    this._message.showLoader(true);
    this.registerReloadGridOnClientSelection();
    this.getData();

    this.cols = [
      { field: 'account_no', header: 'Account No', sortable: true, filter: true },
      { field: 'account_name', header: 'Account Name', sortable: true, filter: true },
      { field: 'ineligible_days', header: 'Past due Days', sortable: true, filter: true },
      { field: 'concentration_pct', header: 'Concentration', sortable: true, filter: true },
      { field: 'cap_execlude', header: 'Cap/Exclude', sortable: true, filter: true },
      { field: 'cross_age_pct', header: 'Cross Age %', sortable: true, filter: true },
      { field: 'insurance_limit', header: 'Insurance Limit', sortable: true, filter: true },
      { field: 'ar_exclude_pct', header: 'AR Exclude %', sortable: true, filter: true },
      { field: 'ar_exclude_value', header: 'AR Exclude Value', sortable: true, filter: true },
      { field: 'ineligibility_reason', header: 'Ineligible Reason', sortable: true, filter: true },
    ];
  }

  getData(){
    this._ineligibleAdvancesService.getIneligibleAdvancesData(this._apiMapper.endpoints[CyncConstants.GET_INELIGIBLE_ADVANCES].replace("{clientId}", this.borrowerId)).subscribe(data => {
      this.ineligibleadvancesDetail = data;
      this._message.showLoader(false);
    });
  }

  /**
  * for scroll
  */
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.helper.isScollbarAtBottom('ineligible_content')) {  this.load_more = true; } else { this.load_more = false; }
    if (this.load_more == true) {
      this.showCount = this.showCount + 1;
      let endpoints = this._apiMapper.endpoints[CyncConstants.GET_SCROLL_INELIGIBLE_ADVANCES].replace("{clientId}", this.borrowerId);
      endpoints = endpoints.replace("{page_no}", this.showCount).replace("{rows}", this.rowcount);
      this._ineligibleAdvancesService.getIneligibleAdvancesData(endpoints).subscribe(data => {
        this.ShowmoreData = data;
        this.ineligibleadvancesDetail = this.ShowmoreData;
        for (var i = 0; i < this.ShowmoreData.length; i++) {
          this.ineligibleCustomerParameterData = this.ineligibleCustomerParameterData.concat(this.ShowmoreData[i]);
        }
      });
    }
  }

  /**
  * for scroll
  */
  ngAfterViewInit() {
    setTimeout( () => this.loadScrollPage(), 1000);
  }

  /**
  * for scroll
  */
  loadScrollPage() {
    var viewHeight = document.getElementById('app-body-container').offsetHeight - 90 + 'px';
    this.render.setStyle(this.csectionref.nativeElement, 'height', viewHeight);
  }

  /**
  * for scroll
  */
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

navigateToHome() {
  this._router.navigateByUrl("/client-maintenance/client-loan-terms/ineligible-advances");
}

ngOnDestroy(){
  this.clientSelectionSubscription.unsubscribe();
}
}