import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';

@Component({
  selector: 'app-rollforwards',
  templateUrl: './rollforwards.component.html',
  styleUrls: ['./rollforwards.component.scss']
})
export class RollforwardsComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>(); 
  rollForwardsForm: FormGroup;
  allClientTemplateData: any;
  allDropDownData: any;
  rollforwardsData:any
  constructor(private fb: FormBuilder, private clientTemplateDetails: ClientTemplatesService) { }

  ngOnInit() {
    this.formFunction();
    this.dropdownPopulation()
    this.formReady.emit(this.rollForwardsForm);
    this.getAllParameterData()
        // reseting the form
        this.clientTemplateDetails.getResetButtonForBP().subscribe(data => {
          if (data == "reset") {
            this.patchValues(this.rollforwardsData)
          }
        })
  }

       //form initilize function
       formFunction(){
        this.rollForwardsForm = this.fb.group({
          // PostNewSalesCreditsToRF: null,
          division_or_all_in_rollforward : null,
          post_to_rollforward:null,
          rollforward_to_adjust_collateral:null,
          inventory_post_to_rollforward:null,
          inventory_rollforward_collateral_value:null
          // Rollforward_Adjust_Collateral_Inventory:null,
          // Rollforward_Adjust_Collateral_Other:null
    
        });
       }

    //populate all dropdown

    dropdownPopulation(){
      this.clientTemplateDetails.shareDropDownDataFn().subscribe(data => {this.allDropDownData = data
   
      }) 
    }

     // fetch all data from service
  getAllParameterData() {
    this.clientTemplateDetails.sendAllTemplateData().subscribe(data => {
    this.allClientTemplateData = data
      this.rollforwardsData = this.allClientTemplateData.parameter.data;
      this.patchValues(this.rollforwardsData)
     
    })

  }

  // binding data to bbc others Form
  patchValues(data) {
  
    this.rollForwardsForm.patchValue({
      division_or_all_in_rollforward: data.roll_forward.division_or_all_in_rollforward,
      post_to_rollforward:data.roll_forward.post_to_rollforward,
      rollforward_to_adjust_collateral: data.roll_forward.rollforward_to_adjust_collateral ,
      inventory_post_to_rollforward: data.inventory_rollforward.inventory_post_to_rollforward,
      inventory_rollforward_collateral_value: data.inventory_rollforward.inventory_rollforward_collateral_value
    })
  }

}
