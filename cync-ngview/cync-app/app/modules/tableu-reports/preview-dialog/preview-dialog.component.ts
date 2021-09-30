import { Component,Inject, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableuReportsService } from '../tableu-reports.service';
import { Helper } from '@cyncCommon/utils/helper';
declare var tableau: any;

export interface DialogData {
  borrower_id: number;
}
@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit, AfterViewInit, OnDestroy  {
  previewElment:HTMLDivElement;
  previewTabVizData: any;
  borrower_id: number;
  isclosedbtn: boolean;
  constructor(
    private elRef: ElementRef,
    private helper: Helper,
    public tableuReportsService: TableuReportsService,
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isclosedbtn=false;
    this.borrower_id=this.data.borrower_id;
  }
  ngOnInit() {
    this.previewElment = document.querySelector("#preview-content");
  }

  ngAfterViewInit() {
      this.loadpreviewFuc();
  }
  ngOnDestroy() {
    console.log("Distroying Object");
    this.dialogRef.close();
  }
 
  // From Tableau Server Report generation Call 
  initializeViz(tiketToken: any) {
    const urlpreview = `${this.tableuReportsService.getTableauHost()}/trusted/${tiketToken}/t/${this.tableuReportsService.getSiteName()}/views/Client_Overview_Report/Client_Overview_Dashboard_Print?borrower_id=${this.data.borrower_id}&Flag=0`;
    let  intanceObject = this;
    const options = {
      hideTabs: true,
      hideToolbar: true,
      width: '88vw', //tableuViz.offsetWidth,
      height:'80vh', //tableuViz.offsetHeight,
      borrower_id: this.data.borrower_id,
      Flag:0,
      onFirstInteractive: function () {
        console.log("Report has Initialized");
        intanceObject.isclosedbtn = true; 
      },
    };

    if(this.previewTabVizData) {
      this.previewTabVizData.dispose();
    }
    this.previewTabVizData = new tableau.Viz( this.previewElment, urlpreview, options);
    this.refreshTabViz(this.previewTabVizData);
  }

  refreshTabViz(previewTabVizData: any) {
    const data = previewTabVizData;
    let  intanceObject = this;
    setTimeout(() => {
      var elmframe=intanceObject.previewElment.querySelector('iframe');
      elmframe.className ="preview-iframe";
      data.refreshDataAsync();
    }, 1000);
  }

 //Get Reporting Tiket call
  getTiketToken(): void{
    this.tableuReportsService.getLosTikets().subscribe((resposeData) => {
      this.initializeViz(resposeData.ticket);
    });
  }

  loadpreviewFuc() {
    this.getTiketToken();
  }
  //AWS LamdaCall
  lamdacall():void {
    this.tableuReportsService.getLamdaService(this.data.borrower_id).subscribe((resposeData) => {
      console.log("Response::", resposeData);
      this.loadpreviewFuc();
    }, (error) => {
      this.loadpreviewFuc();
    });
  }

 closedDialog():void {
   this.dialogRef.close();
  }
// View pdf exports
exportToPDF(): void {
  this.previewTabVizData.showExportPDFDialog();
}

}
