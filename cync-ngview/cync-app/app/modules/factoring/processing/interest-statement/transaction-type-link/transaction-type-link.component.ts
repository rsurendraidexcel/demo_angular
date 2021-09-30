import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InterestStatementDetailsComponent } from '../interest-statement-details/interest-statement-details.component';

@Component({
  selector: 'app-transaction-type-link',
  templateUrl: './transaction-type-link.component.html',
  styleUrls: ['./transaction-type-link.component.scss']
})
export class TransactionTypeLinkComponent implements OnInit {
  dataParams: any;
  clientId: number;
  transationType: string;
  interest_frequency:any;
  constructor(public dialog: MatDialog) { }
  ngOnInit() {

  }
  agInit(params: any): void {
    this.dataParams = params;
    this.interest_frequency = params.context.componentInterestStatment.interestFrequency;
    // console.log("===>", params.context.componentInterestStatment);
    this.clientId = params.context.componentInterestStatment.clientId;
  }
  openDialogInvoice(transationType: string, transationDate: any): void {
    const dialogRef = this.dialog.open(InterestStatementDetailsComponent, {
      height: "390px",
      maxHeight:"400px",
      width: "75vw",
      data: { client_id: this.clientId, transaction_type: transationType, transation_date: transationDate },
    });

  }


  showInterestStatementDetails(){
  if(this.dataParams.data.transactionType ==='No Transaction'){
    return false;
  } else if(this.interest_frequency === 0 && this.dataParams.data.transactionType === 'Interest Charge'){
    return false;
  } else if (this.interest_frequency === 2 && this.dataParams.data.transactionType === 'Interest Holiday'){
    return false;
  } else if(this.interest_frequency === 0 && this.dataParams.data.transactionType === 'Reserve Posting')
  return false;
  else {
    return true;
  }
     
}
}
