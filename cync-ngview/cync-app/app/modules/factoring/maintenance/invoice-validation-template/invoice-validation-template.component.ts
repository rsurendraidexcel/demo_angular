import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { nonWhiteSpace } from 'html2canvas/dist/types/css/syntax/parser';
import { Button } from 'primeng/primeng';
import { from } from 'rxjs';
import { EditAddInvoiceValidationComponent } from './edit-add-invoice-validation/edit-add-invoice-validation.component';
import { InvoiceService } from './service/invoice.service';
@Component({
  selector: 'app-invoice-validation-template',
  templateUrl: './invoice-validation-template.component.html',
  styleUrls: ['./invoice-validation-template.component.scss']
})


export class InvoiceValidationTemplateComponent implements OnInit {

  gridApi: any;
  gridColumnApi: any;
  cyncRowData: any = [];
  cyncColumnDefs: any = [];
  validationParameters: any;
  cyncGridConfig = {
    topPanel: true,
    addButton: true,
    addButtonFn: this.addButtonFunction.bind(this),
    editButton: false,
    editButtonFn: this.editButtonFunction.bind(this),
    viewButton: false,
    viewButtonFn: this.viewButtonFunction.bind(this),
    deleteButton: false,
    deleteButtonFn: this.deleteButtonFunction.bind(this),
    gridInitialDisable: true,
    singleClickEdit: true,
    checkboxSelection: true,
    filterType: 'agTextColumnFilter',
    colDefaultWidth: 150,
    exclusiveFilter: false
  }

  cyncGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }


  ongridRowSelected(event) {
    let rows = this.gridApi.getSelectedRows();
    // console.log(rows);
    if (rows.length) {
      if (rows[0].name === "default") {
        this.cyncGridConfig.editButton = false;
        this.cyncGridConfig.viewButton = true;
        this.cyncGridConfig.deleteButton = false;
      }
      else {
        this.cyncGridConfig.editButton = true;
        this.cyncGridConfig.viewButton = false;
        this.cyncGridConfig.deleteButton = true;

      }
    }
    else {
      this.cyncGridConfig.editButton = false;
      this.cyncGridConfig.viewButton = false;
      this.cyncGridConfig.deleteButton = false;
    }

  }

  constructor(private _message: MessageServices, private helper_messege: Helper, public dialog: MatDialog, public invoiceService: InvoiceService) {


  }

  ngOnInit() {
    this.cyncColumnDefs = [
      {
        headerName: 'Template Name',
        field: 'name',

      },
      {
        field: 'description',
      
      },

      {
        headerName: 'Created By',
        field: 'created_by',
      }
    ];
    this.getData();



  }

  //get method
  getData() {
    this.invoiceService.getInvoiceList("invoice_verification_templates").subscribe
      (data => {
        // console.log(data.invoice_verification_templates);
        this.cyncRowData = data.invoice_verification_templates
        let res = data.invoice_verification_templates.filter(data => {
          return data.name === "default";
        });

        this.validationParameters = res[0].parameters;
      })
  }

  addButtonFunction() {
    this.openAddEditDialog('Add invoice validation', '');
  }

  openAddEditDialog(mode, id) {
    let closeRes;
    const dialogRef = this.dialog.open(EditAddInvoiceValidationComponent, {
      disableClose: true,
      width: '970px',
      height: '560px',
      data: { mode: mode, id: id, validationParameters: this.validationParameters }
    });

    dialogRef.afterClosed().subscribe(result => {
      closeRes = result
      if (closeRes === 'edit') {
        this.getData();
      }
    });

  }

  editButtonFunction() {
    let id = this.gridApi.getSelectedRows();
    this.openAddEditDialog('Edit invoice validation', id);
  }

  viewButtonFunction() {
    let id = this.gridApi.getSelectedRows();
    this.openAddEditDialog('View invoice validation', id);
  }


  deleteButtonFunction() {
    const popupParam = {
      'title': 'Confirmation',
      message: 'Do you want to delete ?',
      'msgType': 'warning'
    };
    this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._message.showLoader(true);
        let idtoDeleted = []
        // console.log('clicked on delete button');
        let rows = this.gridApi.getSelectedRows();
        // console.log(rows);
        // idtoDeleted.push(rows[0].id);
        this.invoiceService.deleteInvoiceList("invoice_verification_templates/" + rows[0].id, idtoDeleted).subscribe(data => {
          this.helper_messege.showApiMessages("Deleted Successfully", 'success');
          this.getData();
          this.cyncGridConfig.deleteButton = false;
          this._message.showLoader(false);
        })
      }
      else {
        return false;
      }
    })
  }
}
