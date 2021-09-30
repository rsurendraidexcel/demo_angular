import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientTemplatesService } from '../../service/client-templates.service';
import { ClientAssignIneligibleCalulationSaveModel } from '../client-assign-ineligible-calculation-model/client-assign-ineligible-calculation.model';

@Component({
  selector: 'app-client-assign-ineligible-calculation',
  templateUrl: './client-assign-ineligible-calculation.component.html',
  styleUrls: ['./client-assign-ineligible-calculation.component.scss']
})
export class ClientAssignIneligibleCalculationComponent implements OnInit {
  source = [];
  confirmed = [];
  targetData = [];
  templateId: any;
  mode: any;

  constructor(
    private apiMapper: APIMapper,
    private clienttTemplateService: ClientTemplatesService,
    private helper: Helper,
    private route: ActivatedRoute,
    private router: Router

  ) {
    // geting active client template id
    this.route.params.subscribe(params => this.templateId = params.id);
  }
  format = { add: 'Add', remove: 'Remove', all: 'All', none: 'None', direction: 'left-to-right', draggable: true, sort: true, locale: undefined };

  ngOnInit() {
    if (this.templateId != "assigned") {
   this.getTemplateData(this.templateId);
   this.getListOfSystemDefinedIneligibleReasons(this.templateId);
    }
    this.clienttTemplateService.getDropdownChangeData().subscribe(changedTemplateId => {
      if (changedTemplateId) {
        this.source = [];
        this.confirmed = [];
        this.getTemplateData(changedTemplateId);
        this.getListOfSystemDefinedIneligibleReasons(changedTemplateId);
      }
    })
    this.clienttTemplateService.getUnsavedIneligibleReason().subscribe(response => {
      this.source = response;
    });
    this.clienttTemplateService.getSavedIneligibleReason().subscribe(res => {
      this.confirmed = res;
    });

    // get confirm msg from parent to send data
    this.clienttTemplateService.getConfirmMultiAsignDataFetch().subscribe(data => {
      if (data === "fetch") {
      let sendData = this.saveIneligibleReasonData(this.confirmed);
      this.clienttTemplateService.setMultiClientIneligibleCalculation(sendData);
      }
    })

  }

  /*
  *to get system definded ineligible reasons
  */
  getListOfSystemDefinedIneligibleReasons(templateId: any) {
    const url = this.apiMapper.endpoints[CyncConstants.GET_SYSTEM_DEFINED_INELIGIBILITY_REASONS].replace("{client_template_id}", templateId);
    this.clienttTemplateService.getIneligibleReasonList(url).subscribe(response => {
      let unSavedIneligibleReasons = <any>JSON.parse(response._body).ineligible_reasons
      unSavedIneligibleReasons.forEach(element => {
        this.source.push(element)
      });
    });

  }
  /*
   *save ineligible reason data
   */
  saveIneligibleReasonData(ineligibleReasonsPostData: any): any {
      let requestBody = ClientAssignIneligibleCalulationSaveModel.ineligibleCalulationSaveModel();
      for (let i = 0; i < ineligibleReasonsPostData.length; i++) {
        requestBody.ineligible_calculation.push(ClientAssignIneligibleCalulationSaveModel.ineligibleCalulationArray());
        requestBody.ineligible_calculation[i].ineligibility_reason_id = ineligibleReasonsPostData[i].ineligibility_reason_id;
        requestBody.ineligible_calculation[i].sequence = i + 1;
        requestBody.ineligible_calculation[i].borrower_id = -100;
        requestBody.ineligible_calculation[i].client_template_id = this.templateId;
      }
   
      return requestBody;
  }

  /*
 *to get saved ineligible reason data
 */
  getTemplateData(templateId: any) {
    let url = this.apiMapper.endpoints[CyncConstants.GET_TEMPLATE_DATA].replace('{id}', templateId);
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
