import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FactReportsService } from '../fact-reports.services';
import { ReportConfig } from '../model/report-config.model';
declare var tableau: any;
declare var $: any;

@Component({
  selector: 'app-fact-reports',
  templateUrl: './fact-reports.component.html',
  styleUrls: ['./fact-reports.component.scss']
})
export class FactReportsComponent implements OnInit {
  public reportsData: ReportConfig;
  public routeParams: any;
  public urlSegment: any;
  tabVizData: any;

  constructor(private factReportsService: FactReportsService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
    this.getRoutes();
  }
  ngOnInit() {
    this.loadReports();
  }

  getRoutes() {
    this.urlSegment = this.activeRoute.snapshot.url;
    this.routeParams = this.activeRoute.snapshot.queryParams;
    console.log("RouteParams::", this.routeParams);
  }

  async loadReports() {
    this.factReportsService.getReportConfig().subscribe(data => {
      this.reportsData = data;
      this.loadlambda();
      this.getTiketToken();
    });

  }

  initializeTableauViz(tiketToken: string) {
    let tempViewName = this.urlSegment[0].path;
    let viewName = tempViewName.replace(/-/g, "_");
    let reportName = tempViewName.split('-').map(function (elm) { return elm.charAt(0).toUpperCase() + elm.substr(1).toLowerCase() }).join('');
    console.info(`ViewName=${viewName}, ReportName=${reportName}`);
    const tableuViz = document.querySelector("#reportsViz");
    let url = `${this.factReportsService.getTableauHost()}/trusted/${tiketToken}/t/${this.factReportsService.getSiteName()}/views/${viewName}_report/${reportName}Report`;
    console.info("TableauViz url:", url);

    const options = {
      hideTabs: true,
      hideToolbar: true,
      width: "96vw", //tableuViz.offsetWidth,
      height: "65vh", //tableuViz.offsetHeight,
      onFirstInteractive: function () {
        console.log("Report has Generated");
      }
    };

    if (this.tabVizData) {
      this.tabVizData.dispose();
    }

    this.tabVizData = new tableau.Viz(tableuViz, url, options);
    this.refreshTabViz(this.tabVizData);
  }

  //Refresh tabViz
  refreshTabViz(tabVizData: any) {
    const data = tabVizData;
    setTimeout(() => {
      data.refreshDataAsync();
    }, 1000);
  }

  // GET  tikent token
  getTiketToken() {
    this.factReportsService.getLosTikets().subscribe((resposeData) => {
      console.log("Token", resposeData.ticket);
      this.initializeTableauViz(resposeData.ticket);
    });
  }

  loadlambda() {
    let temRoute = this.urlSegment[0].path;
    let url = this.reportsData[`fact_${temRoute.replace(/-/g, "_")}`];
    console.log("Lambda EndPoint", url);
    let payloadbody = this.paramsFilter(temRoute);
    console.log("lambda Payload:", payloadbody);
    this.factReportsService.getReportsLambdaCall(url, payloadbody).subscribe(data => console.log(data));
  }

  // Pramas Filter for Deferent Lamday API
  paramsFilter(routName: string): any {
    let payloadBody: any = {};
    switch (routName) {
      case 'open-invoice':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "as_of_date": this.routeParams.as_of_date
        }
        break;
      case 'portfolio-arbalance':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "as_of_date": this.routeParams.as_of_date
        }
        break;
      case 'processing-status':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "debtorID": this.routeParams.debtorID,
          "statusType": this.routeParams.statusType
        }
        break;
      case 'purchase-summary':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "from_date": this.routeParams.from_date,
          "to_date": this.routeParams.to_date,
          "batchNo": this.routeParams.batchNo
        }
        break;
      case 'reserve-activity':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "from_date": this.routeParams.from_date,
          "to_date": this.routeParams.to_date
        }
        break;
      case 'broker-outstanding':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "feeStatusID": this.routeParams.feeStatusID,
          "sessionID": this.routeParams.sessionID
        }
        break;
      case 'eom-client-analysis':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "start_date": this.routeParams.start_date,
          "end_date": this.routeParams.end_date,
        }
        break;
      case 'payment-history':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "start_date": this.routeParams.start_date,
          "end_date": this.routeParams.end_date
        }
        break;
      case 'broker-paid-commission':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "brokerID": this.routeParams.brokerID,
          "start_date": this.routeParams.from_date,
          "end_date": this.routeParams.to_date
        }
        break;
      case 'reserve-activity':
        payloadBody = {
          "lenderHost": this.factReportsService.getSiteName(),
          "clientID": this.routeParams.clientID,
          "from_date": this.routeParams.from_date,
          "to_date": this.routeParams.to_date
        }
        break;
      default:
        console.log("No Routes Founds");
        payloadBody = {};
        break;
    }
    return payloadBody;
  }

}
