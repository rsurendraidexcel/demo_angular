import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { QbArAgingSummaryService } from '../qb-ar-aging-summary.service';
import * as moment from 'moment-timezone';
import { NgForm } from '@angular/forms';
import { CyncConstants } from '@cyncCommon/utils/constants';


@Component({
  selector: 'app-qb-ar-aging-summary',
  templateUrl: './qb-ar-aging-summary.component.html',
  styleUrls: ['./qb-ar-aging-summary.component.scss']
})
export class QbArAgingSummaryComponent implements OnInit {
  @ViewChild('myform') myform: NgForm;
  showDateRangeApp: boolean = false;
  date_macro: any;
  report_date: any;
  current_date: Date;
  gridApi: any;
  clientId: any;
  gridColumnApi: any;
  cyncRowData: any = [];
  cyncColumnDefs: any = [];
  validationParameters: any;
  enableGrid: boolean = false;
  aging_method: string = 'Current';
  cyncGridConfig = {
    checkboxSelection: true,
    filterType: 'agTextColumnFilter',
  }

  cyncGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  constructor(
    private _message: MessageServices,
    private _qbService: QbArAgingSummaryService,
    private _helper: Helper,
  ) {

    this.clientId = CyncConstants.getSelectedClient();
    this.current_date = new Date(this._helper.convertDateToString(new Date()));
  }


  ngOnInit() {

    this._helper.getClientID().subscribe((data) => {
      let cltid = data;
      if (cltid !== 'null') {
        this.clientId = data;
        this.enableGrid = false;
        this.afterBorrowChangeLoad();
      }
    });
    if (this.clientId !== undefined) {
      this.afterBorrowChangeLoad();
    }



  }

  afterBorrowChangeLoad() {

    this.cyncColumnDefs = [];
    this.cyncRowData = []

  }

  saveForm(myform) {
    this._message.showLoader(true);
    this.enableGrid = true
    // console.log(myform.value, myform.value.report_date);
    let url = "quickbooks/qb_ar_aging_summary";
    let report_date = moment(myform.value.report_date).format('YYYY-MM-DD');
    let params = `?borrower_id=${this.clientId}&date_macro=${myform.value.date_macro}&aging_method=${myform.value.aging_method}&report_date=${report_date}`
    this._qbService.quickBookPost(url + params, '').subscribe(response => {

      this._message.showLoader(false);

      let res = JSON.parse(response._body);
      // console.log(res);
      let colkeys = Object.keys(res.records[0])
      this.cyncColumnDefs = colkeys.map(elm => {
        return { 'field': elm }

      })

      this.cyncColumnDefs.forEach(element => {
        if (element.field !== "customer_name") {
          element.colType = 'currency';
        }
        if (element.field === "customer_id") {
          element.colType = 'number';
        }
      });

      console.log(this.cyncColumnDefs);

      this.cyncRowData = res.records;

      this.gridApi.sizeColumnsToFit();

    }, err => {
      this._message.showLoader(false);
    })

  }

}
