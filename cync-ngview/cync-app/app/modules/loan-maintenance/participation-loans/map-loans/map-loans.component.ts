import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MapLoansModel } from '../model/map-loans.model';
import { ParticipationLoanService } from '../service/participation-loan.service';

@Component({
  selector: 'app-map-loans',
  templateUrl: './map-loans.component.html',
  styleUrls: ['./map-loans.component.scss']
})
export class MapLoansComponent implements OnInit {
  loanCategories: any;
  clientId = CyncConstants.getSelectedClient();
  source = [];
  confirmed = [];
  selectedLoanCategory = "Collateral Loan / BBC";
  selectedLoanCategoryId = 1;
  change: boolean;

  constructor(private apiMapper: APIMapper,
    private helper: Helper,
    private route: ActivatedRoute,
    private participationLoanService: ParticipationLoanService) { }

  ngOnInit() {
    this.helper.getClientID().subscribe((data) => {
      let cltid = data;
      if (cltid !== 'null') {
        this.clientId = data;
        this.afterBorrowChangeLoad();
      }
    });
    if (this.clientId !== undefined) {
      this.afterBorrowChangeLoad();
    }

  }
  afterBorrowChangeLoad() {
    this.getLoanCategories();
    this.source = [];
    this.confirmed = [];
    // this.getMappedAndUnmappedLoan();
  }
  /**
 * This method to get loan category 
 */
  getLoanCategories() {
    const url = this.apiMapper.endpoints[CyncConstants.GET_LOAN_MAPPING_CATEGORIES];
    this.participationLoanService.getLoanCategoriesList(url).subscribe(res => {
      this.loanCategories = res.categories;
    })
  }

  /**
   * This method to get mapped and unmapped loans
   */
  getMappedAndUnmappedLoan() {
    const url = this.apiMapper.endpoints[CyncConstants.GET_MAPPED_UNMAPPED_LOANS].replace('{borrower_id}', this.clientId).replace('{category_id}', this.selectedLoanCategoryId);
    this.participationLoanService.getMappedAndUnmappedLoanList(url).subscribe(res => {
      console.log(res);
      let mappedLoans = res.data.mapped;
      let unMappedLoans = res.data.unmapped;

      if (unMappedLoans.length > 0) {
        unMappedLoans.forEach(element => {
          this.source.push(element);
        });
      }
      if (mappedLoans.length > 0) {
        mappedLoans.forEach(element => {
          this.confirmed.push(element);

        });
      }
    })
  }

  onChangeLoanCategory(event: any) {
    this.selectedLoanCategoryId = event.target.value;
    // let selectElm = <HTMLSelectElement>event.target;
    // this.selectedLoanCategory = selectElm.options[selectElm.selectedIndex].text;
    this.source = [];
    this.confirmed = [];
    this.getMappedAndUnmappedLoan();
  }

  mapLoanswithCategory() {
    const url = this.apiMapper.endpoints[CyncConstants.MAP_LOAN_WITH_CATEGORY].replace('{borrower_id}', this.clientId);
    let requestBody = MapLoansModel.mapLoansSaveModel();
    requestBody.category_id = Number(this.selectedLoanCategoryId);
    requestBody.mapped_loan_list = this.confirmed;
    this.participationLoanService.mapLoanService(url, requestBody).subscribe(res => {
      this.helper.showApiMessages('Mapping Information Saved', 'success')
      this.change = false;
    })
  }

  onParticipationLoanDetailsClick() {
    if (this.change) {
      const popupParams = { 'title': 'Confirmation', message: 'Changes made have not been saved. Are you sure you want to leave the page?' }
      this.helper.saveFacoringFeeSetupPop(popupParams).subscribe(result => {
        if (result === true) {
          window.location.href = `${window.origin}/borrowers/${this.clientId}/participation_loan_details`;
        }
      });
    } else {
      window.location.href = `${window.origin}/borrowers/${this.clientId}/participation_loan_details`;
    }
  }

  onMoveToTarget(event: any) {
    this.change = true;
  }

  onMoveToSource(event: any) {
    this.change = true;
  }
}
