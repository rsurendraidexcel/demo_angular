import {Component} from "@angular/core";
import { LoanEnquiryService } from './loan-enquiry.service';

@Component({
    selector: 'custom-status-bar-component',
    template: `
        <div class="ag-name-value">
            <span class="component">Total Rows: {{ totalDispayRecords }}/{{ totalRecords }}</span>
        </div>
    `
})
export class CustomStatusBarComponent {
    private params: any;
    totalRecords: any = 0;
    totalDispayRecords: any = 0;

    constructor(
		private _loanEnquiryService: LoanEnquiryService
	) {  }
    
    agInit(params: any): void {
        this.params = params;
        console.log("Inside params: ", this.params);
        
    }

    ngOnInit() {
        this._loanEnquiryService.getTotalRowCount.subscribe(data => {
            this.totalRecords = (data ? (data.totalRowCount ? data.totalRowCount : 0 ) : 0 );
            this.totalDispayRecords = (data ? (data.displayRowCount ? data.displayRowCount : 0 ) : 0 );
            console.log("Get Enquiry data: ", data);           
            console.log("totalRecords: ", this.totalRecords + " : totalDispayRecords : " + this.totalDispayRecords);
        })
    }

}