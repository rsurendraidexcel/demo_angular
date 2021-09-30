import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-inventory-parameters',
  templateUrl: './inventory-parameters.component.html',
  styleUrls: ['./inventory-parameters.component.scss']
})
export class InventoryParametersComponent implements OnInit {
  inventoryParameters: FormGroup;
  allDropDownData: any;
  allClientTemplateData: any;
  inventoryparamData: any;
  templateViewType: any;
  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) {
       // geting view type of template
       this.clientTemplateDetails.getTemplateViewType().subscribe(data => {
        if (data) {
          this.templateViewType = data;
        }
      });
      
   }

  ngOnInit() {
    this.dropdownPopulation();
    this.formFunction();
    this.getAllParameterData();
    this.formReady.emit(this.inventoryParameters);

    // this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].disable();
      
    // this.inventoryParameters.controls['min_liq_cost'].disable();
    // this.inventoryParameters.controls['percentage_of_var_liq_cost'].disable();
    // this.inventoryParameters.controls['liq_cost'].disable();
    // this.inventoryParameters.controls['percentage_of_nolv'].disable();
    // this.inventoryParameters.controls['percentage_of_cost'].disable();
    
    // reseting the form
    this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
      if (data == "reset") {
        this.patchValues(this.inventoryparamData);
      }
    });

  }

  //form initilize function
  formFunction() {

    this.inventoryParameters = this.fb.group({
      auto_calculate_nolv: null,
      lesser_of_pct_cost_or_nolv: null,
      min_liq_cost: null,
      percentage_of_var_liq_cost: null,
      liq_cost: null,
      percentage_of_nolv: null,
      percentage_of_cost: null,
      ar_reliance_pct: null,
      ar_reliance_based_on: null,
      ar_reliance_calcaulated_cap_by: null,
      ar_reliance_max_cap_pct:null,
      ar_or_inventory: null,
      inventory_with_sublimit: null,
      loan_amt_pct: null,
      reserve_before_sublimit: null
    });
  }

  //populate all dropdown

  dropdownPopulation() {
    this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {
    this.allDropDownData = data;
    });
  }

  // fetch all data from service
  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
      this.allClientTemplateData = data;
      this.inventoryparamData = this.allClientTemplateData.parameter.data.inventory_parameters;
      this.patchValues(this.inventoryparamData);
    });

  }

  // binding data to bbc others Form
  patchValues(data) {
    this.inventoryParameters.patchValue({
      auto_calculate_nolv: data.auto_calculate_nolv,
      lesser_of_pct_cost_or_nolv: data.lesser_of_pct_cost_or_nolv,
      min_liq_cost: data.min_liq_cost,
      percentage_of_var_liq_cost: data.percentage_of_var_liq_cost,
      liq_cost: data.liq_cost,
      percentage_of_nolv: data.percentage_of_nolv,
      percentage_of_cost: data.percentage_of_cost,
      // ar_reliance_pct: data.ar_reliance_pct,
      // ar_reliance_based_on: data.ar_reliance_based_on,
      // ar_reliance_calcaulated_cap_by: data.ar_reliance_calcaulated_cap_by,
      // ar_reliance_max_cap_pct:data.ar_reliance_max_cap_pct,
      ar_or_inventory: data.ar_or_inventory,
      inventory_with_sublimit: data.inventory_with_sublimit,
      loan_amt_pct: data.loan_amt_pct,
      reserve_before_sublimit: data.reserve_before_sublimit,
    })

    this.startingAutoNolv(data.auto_calculate_nolv)
  }

  // on load auto novl set function

  startingAutoNolv(val){
    
    if(val===true && this.templateViewType != "view"){
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].enable();   
      this.inventoryParameters.controls['min_liq_cost'].enable();
      this.inventoryParameters.controls['percentage_of_var_liq_cost'].enable();
      this.inventoryParameters.controls['liq_cost'].enable();
      this.inventoryParameters.controls['percentage_of_nolv'].enable();
      this.inventoryParameters.controls['percentage_of_cost'].enable();
    }
    else{
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].disable();    
      this.inventoryParameters.controls['min_liq_cost'].disable();
      this.inventoryParameters.controls['percentage_of_var_liq_cost'].disable();
      this.inventoryParameters.controls['liq_cost'].disable();
      this.inventoryParameters.controls['percentage_of_nolv'].disable();
      this.inventoryParameters.controls['percentage_of_cost'].disable();
    }

    if(val === true){
      this.inventoryParameters.controls['auto_calculate_nolv'].setValue(true); 
    }
    else{
      this.inventoryParameters.controls['auto_calculate_nolv'].setValue(false);
    }
  }

  // Auto novl change function

  onChangeAutoNolv(val){
  
    if(val=='true'){
    
      
      this.inventoryParameters.controls['auto_calculate_nolv'].setValue(true); 
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].enable();   
      this.inventoryParameters.controls['min_liq_cost'].enable();
      this.inventoryParameters.controls['percentage_of_var_liq_cost'].enable();
      this.inventoryParameters.controls['liq_cost'].enable();
      this.inventoryParameters.controls['percentage_of_nolv'].enable();
      this.inventoryParameters.controls['percentage_of_cost'].enable();
    }
    else{
      this.inventoryParameters.controls['auto_calculate_nolv'].setValue(false); 
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].disable();     
      this.inventoryParameters.controls['min_liq_cost'].disable();
      this.inventoryParameters.controls['percentage_of_var_liq_cost'].disable();
      this.inventoryParameters.controls['liq_cost'].disable();
      this.inventoryParameters.controls['percentage_of_nolv'].disable();
      this.inventoryParameters.controls['percentage_of_cost'].disable();

      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].setValue(false);     
      this.inventoryParameters.controls['min_liq_cost'].setValue('0.00');
      this.inventoryParameters.controls['percentage_of_var_liq_cost'].setValue('0.00');
      this.inventoryParameters.controls['liq_cost'].setValue('0.00');
      this.inventoryParameters.controls['percentage_of_nolv'].setValue('0.00');
      this.inventoryParameters.controls['percentage_of_cost'].setValue('0.00');
    }
  }

  lesserofPerCost(event){
    if(event.target.value == "true"){
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].setValue(true); 
    }
    else{
      this.inventoryParameters.controls['lesser_of_pct_cost_or_nolv'].setValue(false); 
    }
  }
  arvsinventory(event){
    if(event.target.value == "true"){
      this.inventoryParameters.controls['ar_or_inventory'].setValue(true); 
    }
    else{
      this.inventoryParameters.controls['ar_or_inventory'].setValue(false); 
    }
  }
  reversebfrcap(event){
    if(event.target.value == "true"){
      this.inventoryParameters.controls['inventory_with_sublimit'].setValue(true); 
    }
    else{
      this.inventoryParameters.controls['inventory_with_sublimit'].setValue(false); 
    }
  }

  onReserveBeforeSublimit(event){
    if(event.target.value == "true"){
      this.inventoryParameters.controls['reserve_before_sublimit'].setValue(true); 
    } else{
      this.inventoryParameters.controls['reserve_before_sublimit'].setValue(false); 
    }
  }

}
