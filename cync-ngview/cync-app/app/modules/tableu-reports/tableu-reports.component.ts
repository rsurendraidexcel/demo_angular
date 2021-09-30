import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from "@angular/core";

import { TableuReportsService } from "./tableu-reports.service";
import { Router } from "@angular/router";
import { Helper } from "@cyncCommon/utils/helper";
import { MatDialog } from "@angular/material";
import { PreviewDialogComponent } from "./preview-dialog/preview-dialog.component";
declare var tableau: any;
declare var $: any;
@Component({
  selector: "app-tableu-reports",
  templateUrl: "./tableu-reports.component.html",
  styleUrls: ["./tableu-reports.component.scss"],
})
export class TableuReportsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  borrowerId: number;
  tabVizData: any;
  winHight: number;
  boxTop: number;
  vizContainerHeight: number;
  boxHeight: number;
  @ViewChild("tableuViz") tableuViz: ElementRef;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private helper: Helper,
    public dialog: MatDialog,
    public tableuReportsService: TableuReportsService
  ) {
    this.helper.getClientID().subscribe((bid) => {
      if (bid != "null") {
        this.borrowerId = Number(bid);
      } else {
        this.borrowerId = null;
      }
    });
  }
  ngOnInit() {
    this.getLamdaCall();
  }
  ngAfterViewInit() {
    //Pass the Div ElementID
    this.getWorkSpaceHeight("factoring-tableau-dashboard");
    this.setheight();
    if (this.borrowerId) {
      this.loadfuc();
    }
  }
  loadfuc() {
    this.getWorkSpaceHeight("factoring-tableau-dashboard");
    this.setheight();
    this.getTiketToken();
  }
  ngOnDestroy() {
    console.log("Lose the componets data");
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    //Pass the Div ElementID
    this.getWorkSpaceHeight("factoring-tableau-dashboard");
    this.setheight();
  }

  setheight() {
    this.boxHeight = $("#factoring-tableau-dashboard").height();
    this.vizContainerHeight =this.boxHeight - ($(".tablist").height() + $(".title-text").height() + 20);
    $(".tableuViz").css({ height: this.vizContainerHeight + "px" });
  }

  //Pass the Div ElementID
  getWorkSpaceHeight(elm: string) {
    this.winHight = $(window).height();
    let ft = $("#" + elm).offset();
    this.boxTop = ft.top;
    let h = `${this.winHight - this.boxTop - 30}px`;
    $("#" + elm).css({ height: h });
  }

  // Initializing the tableau Data in view
  initializeViz(tiketToken: any) {
    const tableuViz = document.querySelector("#tableuViz");
    let url = `${this.tableuReportsService.getTableauHost()}/trusted/${tiketToken}/t/${this.tableuReportsService.getSiteName()}/views/Client_Overview_Report/Client_Overview_Dashboard?borrower_id=${
      this.borrowerId
    }&Flag=0`;
    const options = {
      hideTabs: true,
      hideToolbar: true,
      width: "96vw", //tableuViz.offsetWidth,
      height: "95vh", //tableuViz.offsetHeight,
      onFirstInteractive: function () {
        console.log("Report has Generated");
      },
    };

    if (this.tabVizData) {
      this.tabVizData.dispose();
    }
    this.tabVizData = new tableau.Viz(tableuViz, url, options);
    this.refreshTabViz(this.tabVizData);
  }

  refreshTabViz(tabVizData: any) {
    const data = tabVizData;
    setTimeout(() => {
      data.refreshDataAsync();
    }, 1000);
  }

  // GET Reporting Tikets Call and sending to the Report Initialization
  getTiketToken() {
    this.tableuReportsService.getLosTikets().subscribe((resposeData) => {
      this.initializeViz(resposeData.ticket);
    });
  }

  // Preview-Modal show Method
  openPreviewDialog(): void {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: "90vw",
      height: "90vh",
      maxWidth: "90vw",
      data: { borrower_id: this.borrowerId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  // AWS Lamda call method sending borrow_id
  getLamdaCall() {
    this.helper.getClientID().subscribe((bid) => {
      if (bid != "null") {
        this.borrowerId = Number(bid);
        this.tableuReportsService.getLamdaService(this.borrowerId).subscribe(
          (resposeData) => {
            console.log("Response::", resposeData);
            this.loadfuc();
          },
          (error) => {
            this.loadfuc();
          }
        );
      } else {
        this.borrowerId = null;
      }
    });
  }

  // Navigation to the Factoring Url dashboard
  gotoFactoringDashbord(partialRoute?: string) {
    if (partialRoute === undefined) {
      window.location.href = window.origin + "/factoring/dashboard";
    } else {
      window.location.href = `${window.origin}/factoring/dashboard?tab=${partialRoute}`;
    }
  }
}
