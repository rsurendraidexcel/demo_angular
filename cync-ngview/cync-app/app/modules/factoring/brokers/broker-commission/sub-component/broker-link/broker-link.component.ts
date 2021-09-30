import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { BrokerCommissionDetailComponent } from '../broker-commission-detail/broker-commission-detail.component';
import *  as $ from 'jquery';
@Component({
  selector: 'app-broker-link',
  templateUrl: './broker-link.component.html',
  styleUrls: ['./broker-link.component.scss']
})
export class BrokerLinkComponent implements OnInit {
  id: number;
  name : string;
  dataParams: any;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.dataParams = params;
  }

  brokerDetailsPage(data: any): void{
    this.openDialogInvoice(data.id,data.name);

  }

  openDialogInvoice(id,name): void {
    const dialogRef = this.dialog.open(BrokerCommissionDetailComponent, {
      height:'auto',
      data: {brokerId: id,brokerName:name},
      panelClass: 'full-width-dialog-invoice'
    });
  }

refresh(params: any): boolean {
  return false;
}


}
