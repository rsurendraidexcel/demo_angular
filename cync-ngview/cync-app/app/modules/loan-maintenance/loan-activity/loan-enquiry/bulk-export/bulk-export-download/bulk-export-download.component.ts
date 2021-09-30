import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LoanEnquiryService } from '../../loan-enquiry.service';



@Component({
  selector: 'app-bulk-export-download',
  templateUrl: './bulk-export-download.component.html',
  styleUrls: ['./bulk-export-download.component.scss']
})
export class BulkExportDownloadComponent implements OnInit {
  params: any;
  id:any;
  hideLink:boolean = true;
  constructor(
    private _loanEnquiryService: LoanEnquiryService
  ) { }

  ngOnInit() {
  }

  agInit(params: any): void {

    if(params.data.status === "InProgress" || params.data.status === "Error" ){
      this.hideLink = false;
    }
    this.params = params;
      this.id = this.params.data.id;
  }

  downloadExcel(){

    let url = `loan_inquery/download?id=${this.id}`;

    this._loanEnquiryService.getBulkExportDownloadApi(url, this.id).subscribe(data => {

      
      //window.open(data, '_blank');
      this.downloadURI(data._body, 'file.xlsx');
    })

  
    // this._loanEnquiryService.downloadBulkExport(url).subscribe(blob => saveAS(blob, 'archive.zip'));
    // window.open(url, '_blank');

  }

   downloadURI(uri, name) {
    // console.log(uri);
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
  }

}
