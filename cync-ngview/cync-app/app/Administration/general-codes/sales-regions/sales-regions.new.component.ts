import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-sales-regions',
  templateUrl: './sales-regions.new.component.html'
})
export class SalesRegionsNewComponent {
  salesRegionsId: any;
  isDisable = false;
  isRegionValid = true;
  isNameValid = true;
  salesRegionsDetails: any;
  currentAction = 'Add';
  addEditSalesRegions: FormGroup;
  requestModel: any;
  headerText: any = "Sales Region";
  isSaveAndNew: boolean = false;

  constructor(private _location: Location, private _message: MessageServices, private formvalidationService: FormvalidationService, private fb: FormBuilder, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService) {
    this.addEditSalesRegions = this.fb.group({
      region: new FormControl('', Validators.compose([Validators.required])),
      name: new FormControl('', Validators.compose([Validators.required]))
    });

  }

  ngOnInit() {

    this._service.setHeight();
    this.route.params.subscribe(params => {
      this.salesRegionsId = params['id'];
      if (this.salesRegionsId !== undefined && this.salesRegionsId !== 'add') {
        this.isDisable = true;
        this.currentAction = 'Edit';
        this.headerText = 'Sales Region - Edit';
        this._service.getCall('general_codes/sales_regions/' + this.salesRegionsId).then(i => {
          this.salesRegionsDetails = this._service.bindData(i);
          this.addEditSalesRegions.controls['region'].setValue(this.salesRegionsDetails.region);
          this.addEditSalesRegions.controls['name'].setValue(this.salesRegionsDetails.name);
        });
      }
      else {
        this.currentAction = 'Add';
        this.headerText = "Sales Region - Add";
        this._message.showLoader(false);
      }

    });

  }

  saveNew() {
    this.isSaveAndNew = true;
    this.saveData();
  }

  saveData() {
    if (this.addEditSalesRegions.controls.region.value == '') {
      this.isRegionValid = false;
    }
    if (this.addEditSalesRegions.controls.name.value == '') {
      this.isNameValid = false;
    }
    if (this.addEditSalesRegions.valid) {
      const salesRegionsModel = {
        'sales_region':
          {
            'code': this.addEditSalesRegions.controls.region.value,
            'name': this.addEditSalesRegions.controls.name.value
          }
      };

      if (this.isDisable) {
        this.requestModel = { url: '/general_codes/sales_regions/' + this.salesRegionsId, model: salesRegionsModel }
        this._service.patchCallRor(this.requestModel).then(i => this.navigateToHomeEdit());
      } else {
        this.requestModel = { url: '/general_codes/sales_regions', model: salesRegionsModel };
        this._service.postCallpatch(this.requestModel).then(i => this.navigateToHome());
      }
    }
  }

  navigateToHome() {
    if (!this.isSaveAndNew) {
      this._router.navigateByUrl("generalCodes/sales-regions");
      //this._location.back();
    } else {
      this.addEditSalesRegions.reset();
      this.isSaveAndNew = false;
    }
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
  }

  navigateToHomeEdit() {
    //this._location.back(); 
    this._router.navigateByUrl("generalCodes/sales-regions");
    this._message.showLoader(false);
    this._message.addSingle("Record Updated successfully.", "success");
  }

  navigateToHomeCancel() {
    //this._location.back();  
    this._router.navigateByUrl("generalCodes/sales-regions");
  }

  checkRegion() {
    //debugger
    if (this.addEditSalesRegions.controls.region.value == '') {
      this.isRegionValid = false;
    }
    else {
      this.isRegionValid = true;
    }
  }

  checkName() {
    //debugger
    if (this.addEditSalesRegions.controls.name.value == '') {
      this.isNameValid = false;
    }
    else {
      this.isNameValid = true;
    }
  }


}
