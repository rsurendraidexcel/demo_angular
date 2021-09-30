import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ClientTemplatesService } from '../service/client-templates.service';
import { IneligibleCalulationSaveModel } from '../ineligible-calulation-model/ineligible-calculation.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ineligible-calculations',
  templateUrl: './ineligible-calculations.component.html',
  styleUrls: ['./ineligible-calculations.component.scss']
})
export class IneligibleCalculationsComponent implements OnInit {
  source = [];
  confirmed = [];
  targetData = [];
  templateId: any;
  mode: any;
  disableComponent: boolean;
  change: boolean = false;

  constructor(
    private apiMapper: APIMapper,
    private clienttTemplateService: ClientTemplatesService,
    private helper: Helper,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.clienttTemplateService.getTemplateViewType().subscribe(response => {
      this.mode = response;
      if (this.mode === 'view') {
        this.disableComponent = true;
      } else {
        this.disableComponent = false;
      }
    }
    )
    // geting active client template id
    this.route.params.subscribe(params => this.templateId = params.id);

  }
  format = { add: 'Add', remove: 'Remove', all: 'All', none: 'None', direction: 'left-to-right', draggable: true, sort: true, locale: undefined };

  ngOnInit() {
    this.getTemplateData();
    this.getListOfSystemDefinedIneligibleReasons();
    this.tabChangeFunction();
    this.clienttTemplateService.getUnsavedIneligibleReason().subscribe(response =>{
      this.source = response;
    });
    this.clienttTemplateService.getSavedIneligibleReason().subscribe(res =>{
      this.confirmed = res;
    });
  }

  /*
  * methods to identify any changes in picker list 
  */
  onMoveToTarget(event: any) {
    this.change = true;
  }
  onMoveToSource(event: any) {
    this.change = true;
  }
  onSourceReorder(event: any) {
    this.change = true;
  }
  onTargetReorder(event: any) {
    this.change = true;
  }

  /*
  *to get system definded ineligible reasons
  */
  getListOfSystemDefinedIneligibleReasons() {
    const url = this.apiMapper.endpoints[CyncConstants.GET_SYSTEM_DEFINED_INELIGIBILITY_REASONS].replace("{client_template_id}", this.templateId);
    this.clienttTemplateService.getIneligibleReasonList(url).subscribe(response => {
      let unSavedIneligibleReasons = <any>JSON.parse(response._body).ineligible_reasons
      unSavedIneligibleReasons.forEach(element => {
        this.source.push(element)
      });
    });

  }

  /*
   *to get saved ineligible reason data
   */
  getTemplateData() {
    this.clienttTemplateService.sendAllTemplateData().subscribe(response => {
      let savedIneligibleReasons = response.ineligible_calculations.data;
      if (typeof savedIneligibleReasons === "object") {
        savedIneligibleReasons = response.ineligible_calculations.data
        this.confirmed = savedIneligibleReasons;
      } else {
        this.confirmed = [];
      }
    })
  }

  /*
   *save ineligible reason data
   */
  saveIneligibleReasonData() {
    let requestBody = IneligibleCalulationSaveModel.ineligibleCalulationSaveModel();
    requestBody.client_template_id = this.templateId;
    for (let i = 0; i < this.confirmed.length; i++) {
      requestBody.ineligible_calculation.push(IneligibleCalulationSaveModel.ineligibleCalulationArray());
      requestBody.ineligible_calculation[i].ineligibility_reason_id = this.confirmed[i].ineligibility_reason_id;
      requestBody.ineligible_calculation[i].sequence = i + 1;
      requestBody.ineligible_calculation[i].borrower_id = -100;
      requestBody.ineligible_calculation[i].client_template_id = this.templateId;
    }
    let url = this.apiMapper.endpoints[CyncConstants.APPLY_INELIGIBLE_CALCULATIONS];
    this.clienttTemplateService.addIneligibleReasonService(url, requestBody).subscribe(res => {
      let message = 'Ineligible Calculations saved successfully';
      this.helper.showApiMessages(message, 'success')
      this.change = false;
      this.clienttTemplateService.setTotalDenominator("update");
    })

  }

  // reset the changes
  cancelButtonClick() {
    const popupParams = { title: 'Confirmation', message: 'Please save changes, or do you want to reset it ?', msgType: 'warning' }
    this.helper.openConfirmPopup(popupParams).subscribe(result => {
      if (result === true) {
        this.clienttTemplateService.setreturnTabChangeAnswer("proceed");
        this.source = [];
        this.confirmed = [];
        this.getTemplateDataAfterCancel();
        this.getListOfSystemDefinedIneligibleReasons();
        this.change = false;
        this.clienttTemplateService.setResetButtonForBP("reset");

      } else {
        return false;
      }
    });
  }


  // main level tab change condition check
  tabChangeFunction() {
    // geting tab change value
    this.clienttTemplateService.getTabChangeValue().subscribe(data => {
      if (data) {
        if (data == "ineligible_calc") {
          if (this.change) {
            this.clienttTemplateService.setreturnTabChangeAnswer("stop");
            this.cancelButtonClick();
          }
          else {
            this.clienttTemplateService.setreturnTabChangeAnswer("proceed");
          }
        }
      }
    })
  }
    /*
   *to get saved ineligible reason data
   */
  getTemplateDataAfterCancel() {
    let url = this.apiMapper.endpoints[CyncConstants.GET_TEMPLATE_DATA].replace('{id}', this.templateId);
    this.clienttTemplateService.gettemplatedetailsService(url).subscribe(response => {
      let savedIneligibleReasons = JSON.parse(response._body).data.ineligible_calculations.data;
      if (typeof savedIneligibleReasons === "object") {
        savedIneligibleReasons = JSON.parse(response._body).data.ineligible_calculations.data
        this.confirmed = savedIneligibleReasons;
      } else {
        this.confirmed = [];
      }
    })
  }
}
