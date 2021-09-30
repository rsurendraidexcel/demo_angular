import { AfterContentInit, AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { InvoiceService } from '../service/invoice.service';

@Component({
    selector: 'app-edit-add-invoice-validation',
    templateUrl: './edit-add-invoice-validation.component.html',
    styleUrls: ['./edit-add-invoice-validation.component.scss']
})
export class EditAddInvoiceValidationComponent implements OnInit, AfterViewInit {
    @ViewChild('myform') myform: NgForm;
    constructor(private _message: MessageServices, private helper_messege: Helper, public invoiceService: InvoiceService, public dialogRef: MatDialogRef<EditAddInvoiceValidationComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
            for(let key in this.data.validationParameters){
                this.validationParams.push({
                    'name': key,
                    'default_value_type': this.data.validationParameters[key].data_type,
                    'max': this.data.validationParameters[key].max
                })
            }
         }
        validationParams: any = [];
        viewMode: string = 'edit';
    ngOnInit() {
        for (let i = 0; i < this.validationParams.length; i++) {
            this.allowOverrideDisable.push(true)
        }
        for (let i = 0; i < this.validationParams.length; i++) {
            this.allowTextboxDisable.push(true)
        }
        if(this.data.mode === "Edit invoice validation" || this.data.mode === "View invoice validation"){
            this.getData(this.data.id[0].id)
        }

        if(this.data.mode === "View invoice validation"){
            this.viewMode = 'view';
        }
       
     
        // console.log(this.validationParams)
    }
    ngAfterViewInit() {
    //   console.log(this.myform);
    }
    patchValue(data){
        for(let key in data.parameters){
            Object.assign(data.parameters[key], {checkbox: true});
            $('#input_' + key).attr('disabled', null);
            $('#override_' + key).attr('disabled', null);
            }
        Promise.resolve().then(() => {
            this.myform.control.patchValue(
                {
                    "name": data.name,
                    "description": data.description
                }

            );
            this.myform.control.patchValue(
                data.parameters

            );
          });
          
    }

    getData(id) {
        // console.log(id);
        this.invoiceService.getInvoiceList("invoice_verification_templates/" + id).subscribe
            (data => {
                // console.log(data);
                this.patchValue(data)
                
            })
    }
    patchData: any;
    selectAll: any;
    checkBoxSelection: any = [];
    allowOverride: any = [];
    allowOverrideDisable: any = [];
    allowTextboxDisable: any = [];
    parameters = [{
        "name": "client_rec_over_90_days",
        "default_value_type": "textbox",
        "text_value_in": "percentage",
        "override_allowed": "true"
    },
    {
        "name": "inv_amt_x_pct_fact_portfo",
        "default_value_type": "textbox",
        "text_value_in": "amount",
        "override_allowed": "true"
    },
    {
        "name": "no_noa_req_before_fund",
        "default_value_type": "dropdown",
        "override_allowed": "true"
    },
    {
        "name": "audit_letter_req",
        "default_value_type": "dropdown",
        "override_allowed": "true"
    },
    {
        "name": "no_offset_letter_req",
        "default_value_type": "textbox",
        "text_value_in": "days",

        "override_allowed": "true"
    },
    {
        "name": "customer_is_ineligible",
        "default_value_type": "textbox",
        "text_value_in": "amount",
        "override_allowed": "true"
    },
    ]

    CloseClick() {
        this.dialogRef.close();
    }

    selectAllCheckBox(event) {
        if (event.target.checked === true) {
            $(".checkBoxClass").prop('checked', true);
            this.allowOverrideDisable = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowOverrideDisable.push(null);
            }
            this.allowTextboxDisable = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowTextboxDisable.push(null);
            }
            this.checkBoxSelection = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.checkBoxSelection.push(true);
            }
            this.allowOverride = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowOverride.push(true);
            }
        }
        else if (event.target.checked === false) {
            $(".checkBoxClass").prop('checked', false);
            this.allowOverrideDisable = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowOverrideDisable.push(true);
            }
            this.allowTextboxDisable = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowTextboxDisable.push(true);
            }
            this.checkBoxSelection = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.checkBoxSelection.push(false);
            }
            this.allowOverride = []
            for (let i = 0; i < this.validationParams.length; i++) {

                this.allowOverride.push(false);
            }

        }

    }
    checkBoxSelectionFn(event, i) {
        // console.log("changed");
        if (event.target.checked === true) {
            this.allowOverride[i] = true;
            this.allowOverrideDisable[i] = null;
            this.allowTextboxDisable[i] = null;
        }
        else {
            this.allowOverride[i] = false;
            this.allowOverrideDisable[i] = true;
            this.allowTextboxDisable[i] = true;
        }
    }

    onClickSaveAs(form){
        // console.log(form);
        this._message.showLoader(true);
        let res = {};
        let post_body;
        Object.keys(form.value).forEach(v => {
            if (typeof form.value[v] === 'object') {
                if (form.value[v].checkbox === true) {
                    res[v] = {
                        'default_value': form.value[v].default_value,
                        'override_allowed': form.value[v].override_allowed
                    }


                }
            }

        })
        
            post_body = {
                'id': this.data.id[0].id,
                'name': form.value.name,
                'description': form.value.description,
                'parameters': res
            }
            this.invoiceService.postInvoiceList('invoice_verification_templates', post_body).subscribe(res=>{
                // console.log(res);
                this._message.showLoader(false);
                this.helper_messege.showApiMessages("Created successfully", 'success')
                this.dialogRef.close('edit');
           })
        
    }
    

    saveForm(form) {
        this._message.showLoader(true);
        let res = {};
        let post_body;
        Object.keys(form.value).forEach(v => {
            if (typeof form.value[v] === 'object') {
                if (form.value[v].checkbox === true) {
                    res[v] = {
                        'default_value': form.value[v].default_value,
                        'override_allowed': form.value[v].override_allowed
                    }


                }
            }

        })
        if(this.data.mode === "Add invoice validation"){
            post_body = {
                'name': form.value.name,
                'description': form.value.description,
                'parameters': res
            }
            this.invoiceService.postInvoiceList('invoice_verification_templates', post_body).subscribe(res=>{
                // console.log(res);
                this._message.showLoader(false);
                this.helper_messege.showApiMessages("Created successfully", 'success')
                this.dialogRef.close('edit');
           })
        }
        else if(this.data.mode === "Edit invoice validation"){
            post_body = {
                'id': this.data.id[0].id,
                'name': form.value.name,
                'description': form.value.description,
                'parameters': res
            }
            this.invoiceService.putInvoiceList('invoice_verification_templates/' + this.data.id[0].id, post_body).subscribe(res=>{
                // console.log(res);
                this._message.showLoader(false);
                this.helper_messege.showApiMessages("Edited successfully", 'success')
                this.dialogRef.close('edit');
           })
        }
      

      
        //  console.log(post_body);
    }

   


}
