import { Component, OnInit } from '@angular/core';
import  {CustomHttpService} from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { AppConfig } from '../../../app.config';
import {MessageServices} from '../../../../app-common/component/message/message.component';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import  {Router} from '@angular/router';
import  {GridModel, ColumnDefinition} from '../../../../app-common/component/grid/grid.model';

@Component({
    selector: 'exchange-rates-viewall-comp',
    templateUrl: './exchange.rates.viewAll.component.html'
})
export class exchangeRatesViewAllComponent {
	isDisableEdit = false;
  isCloseIcon = false;
  isSearchIcon = true;
  checkCount = 0;
constructor(private _router: Router, private _grid: GridComponent, private _message: MessageServices, private route: ActivatedRoute, private _service: CustomHttpService, private _location: Location, private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    this.historyModel = {
          infiniteScroll : true,
          multiSelection : false,
          onDemandLoad : true,
          singleSelection : false,
          apiDef : {getApi : '/v1/lenders/' + this.lenderId + '/exchangeratehistories', deleteApi: '', updateApi : '' },
          type : 'Exchange Rate History',
          columnDef : [
                      {field: 'createdAt', header: 'Date', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'currencyPair.currencyIdBase', header: 'Currency Pairs', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'rateTypeNames', header: 'Rate Type', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'midRate', header: 'Mid Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'buySpread', header: 'Buy Spread', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'sellSpread', header: 'Sell Spread', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'buyRate', header: 'Buy Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false},
                      {field: 'sellRate', header: 'Sell Rate', sortable : true , isTemplate : false , templateHtml : '', hidden: false, filter: false}
                      ]
    };
}

exchangeRateDetails: any;
rateTypeDtls: any;
lenderId: string;
searchKey: string;
exchangeRateId: any;
apiURL: any;
selectedExchangeRateId: any;
historyModel: GridModel;
coulmnDefinition: ColumnDefinition;
deleteCount: number;
loadTime = 0;

ngOnInit() {
    $('#cync_app_dashboard').removeClass('loading-modal-initial');
    this.apiURL = '/v1/lenders/' + this.lenderId + '/exchangerates/';
    this._service.getCall(this.apiURL).then(i => {
    this.exchangeRateDetails = this._service.bindData(i);
    });
  this._service.setHeight();
  }

navigateToHome() {
    this._location.back();
}

  // delete(){
  //   if(this.selectedExchangeRateId !== undefined && this.selectedExchangeRateId.length > 0){
  //      this.cync_modal('warning', 'Are you sure you want to delete?',true, false);
  //   }
  // }

  // deleteData(){
  //     this.deleteCount = 0;
  //     this._message.showLoader(true);
  //     for (let id of this.selectedExchangeRateId) {
  //         var request = {model : {}, url : this.apiURL+"/"+ id}
  //         this._service.deleteCall(request).then(i=>this.deleteSuccess(i));
  //     }
  //     (<any>$('#cync_alerts')).modal('hide');
  // }

  // deleteSuccess(data: any){
  //     this.deleteCount++;
  //     if(this.deleteCount == 1){
  //       if(this.selectedExchangeRateId.length >= 1){
  //         this._message.addSingle('Record deleted successfully','success');
  //       }
  //        this._service.getCall(this.apiURL).then(i=> {
  //         this.exchangeRateDetails = this._service.bindData(i);
  //         });
  //       this.selectedExchangeRateId = [];
  //     }
  // }

  edit(){
    this._grid.goToEditFromView(this.exchangeRateId);
  }

  goToAdd(){
    this._router.navigateByUrl('/currency/exchange-rates/add');
  }

  goToEdit(){
    if (this.selectedExchangeRateId.length == 1){
      this._router.navigateByUrl('/currency/exchange-rates/' + this.selectedExchangeRateId);
    }
  }
  exportToCsv(){
     this._service.getExportCall('/v1/lenders/rorapi/exchangerates/export' , null).subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'ExchangeRates' + '.xlsx';
    link.click();
    this._message.showLoader(false);
  });
  }

  navigateToHistory(){
    document.getElementById('exchangeHistory').style.display = 'block';
    document.getElementById('uiOverlay').style.display = 'block';
  }

  hideHistory(){
    document.getElementById('exchangeHistory').style.display = 'none';
    document.getElementById('uiOverlay').style.display = 'none';
  }

  checked(event){
    if (event){
      this.checkCount++;
    }else{
      this.checkCount--;
    }
  }

  onKey(event: any){
  if (event.target.value == ''){
   this.isCloseIcon = false;
   this.isSearchIcon = true;
   }
   else{
   this.isCloseIcon = true;
   this.isSearchIcon = false;
   }
  }

 clearSearchBox(){
   this.searchKey = '';
   this.isCloseIcon = false;
   this.isSearchIcon = true;

 }
  // cync_modal(type, message, is_prompt, auto_hide) {
  //      $('#cync_alerts .modal-body').html('<p>' + message + '</p>');
  //      if (type == 'warning') { $('#cync_alerts .modal-header').css('background', '#ea5859').html('<i class="fa fa-5x fa-exclamation-triangle clr_white f_s_64"></i>'); }
  //      if (type == 'success') { $('#cync_alerts .modal-header').css('background', 'green').html('<i class="fa fa-5x fa-check clr_white f_s_64"></i>'); }
  //      if (type == 'info') { $('#cync_alerts .modal-header').css('background', '#4dbbf8').html('<i class="fa fa-5x fa-info-circle clr_white f_s_64"></i>'); }
  //      if (type == 'danger') { $('#cync_alerts .modal-header').css('background', '#eb595a').html('<i class="fa fa-5x fa-ban clr_white f_s_64"></i>'); }
  //      if (is_prompt == true) {
  //          $('#cync_alerts .modal-footer').html('<p><button id="modal_action_yes" type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" >Yes</button> <button  id="modal_action_no"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">No</button></p>');
  //      } else {
  //          $('#cync_alerts .modal-footer').html('<p><button  id="modal_action_close"  type="button" class="noradius btn btn-sm btn-primary p_r_20 p_l_20 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only options-btn" data-dismiss="modal">Close</button></p>');
  //      }
  //      (<any>$('#cync_alerts')).modal('show');
  //      if (auto_hide == true) {
  //          (<any>$('#cync_alerts')).modal('show');
  //          setTimeout(function() {
  //              (<any>$('#cync_alerts')).modal('hide');
  //          }, 2000)
  //      }

  //     document.getElementById('modal_action_yes').addEventListener('click',()=>this.deleteData());
  //     document.getElementById('modal_action_no').addEventListener('click',()=>this.unCheckAll());
  // }

  // unCheckAll(){
  //   this.selectedExchangeRateId = [];
  // }

}
