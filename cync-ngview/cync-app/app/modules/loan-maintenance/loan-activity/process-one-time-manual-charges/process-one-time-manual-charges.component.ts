import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { forkJoin, Observable } from 'rxjs';
import { ProcessOneTimeService } from './process-one-time.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import * as moment from 'moment-timezone';
import { CheckboxComponent } from './checkbox/checkbox.component';

@Component({
  selector: 'app-process-one-time-manual-charges',
  templateUrl: './process-one-time-manual-charges.component.html',
  styleUrls: ['./process-one-time-manual-charges.component.scss']
})
export class ProcessOneTimeManualChargesComponent implements OnInit {

  gridApi: any;
  gridColumnApi: any;
  bbc_date: any;
  gridOptions: GridOptions;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridParams: any;
  gridResetOn: boolean = true;
  gridEditOn: boolean = false;
  gridEditOff: boolean = true;
  editMode: boolean = false;
  checboxEditMode: boolean = true;
  gridSaveOn: boolean = false;
  gridDeleteOn: boolean = false;
  gridSelectedRows: any;
  clientId: any;
  combainedDropdownVal: any = [];
  ablLoanData: any;
  isAbl: boolean;
  nonAblloanId: number;
  current_date: Date;
  activity_date: Date;
  statusBar: any;

  @ViewChild("loandID") loadID: ElementRef;

  constructor(
    private _processService: ProcessOneTimeService,
    private _helper: Helper,
    private _message: MessageServices,
    private renderer: Renderer2,

  ) {
    this.clientId = CyncConstants.getSelectedClient();

  }

  ngOnInit() {
    this.gridInit();
    this.getLoanIDdropDown();

    this._helper.getClientID().subscribe((data) => {
      let cltid = data;
      if (cltid !== 'null') {
        this.clientId = data;
        this.afterBorrowChangeLoad();
      }
    });
    if (this.clientId !== undefined) {
      this.afterBorrowChangeLoad();
    }
    this.setRolesandPermissions();
    this.current_date = new Date(this._helper.convertDateToString(new Date()));
    this.activity_date = new Date(this._helper.convertDateToString(new Date()));
  }

  afterBorrowChangeLoad() {
    this.getLoanIDdropDown();
  }

  /**
   * call loan id get method and fork-join
   */

  getLoanIDdropDown() {
    let url1 = `borrowers/${this.clientId}/loan_numbers`;
    let url2 = `loan_numbers/all_loan_number?borrower_id=${this.clientId}`
    let combin: Observable<any> = forkJoin([this._processService.getAblLoandetails(url1),
    this._processService.getNonAblLoandetails(url2).
      map(results => results)     //results.sort((x, y) => x.loan_name < y.loan_name ? -1 : 1))
    ]);

    combin.subscribe(data => {

      this.ablLoanData = { 'loan_id': data[0].loan_number[0].id, 'loan_type': data[0].loan_number[0].loan_type, 'loan_no': data[0].loan_number[0].loan_no };
      this.combainedDropdownVal = data[1].map(elm => {
        return { 'loan_id': elm.id, 'loan_type': elm.loan_type, 'loan_no': elm.loan_no }
      });  
      if (data[0].position === 'first'){
        this.combainedDropdownVal.unshift(this.ablLoanData);
      }
      if (data[0].position === 'last'){
        this.combainedDropdownVal.push(this.ablLoanData);
      }
      // this.combainedDropdownVal.unshift(this.ablLoanData);
      this.getGridDataAbl();
    });

  }

  /**
   * grid data get for ABL
   */

  getGridDataAbl() {
    this._message.showLoader(true);
    let onSelectActivityDate = moment(this.activity_date).format('MM/DD/YYYY');

    let url = `borrowers/${this.clientId}/loan_activity/collateral_loans/onetime_manual_process?activity_date=${onSelectActivityDate}`;
    this._processService.getAblGriddetails(url).subscribe(data => {
      this.rowData = data.client_charge_templates;
      this.isAbl = true;
      this._message.showLoader(false);
    })
  }

  /**
 * grid data get for non ABL
 */

  getGridDataNonAbl(id) {
    this._message.showLoader(true);
    let onSelectActivityDate = moment(this.activity_date).format('MM/DD/YYYY');
    let url = `/loan_numbers/${id}/collateral_loans/onetime_manual_process?activity_date=${onSelectActivityDate}`;
    this._processService.getNonAblGriddetails(url).subscribe(data => {
      this.rowData = data.client_charge_templates;
      this._message.showLoader(false);
    })
  }

  // loan id dropdown change function
  dropDownSelect(event) {
    let val = event.target.value;
    let val2 = val.split(',');
    if (val2[1] == 'ABL') {
      this.getGridDataAbl();
      this.isAbl = true;
    }
    else {
      this.getGridDataNonAbl(val2[0]);
      this.isAbl = false;
      this.nonAblloanId = val2[0];
    }
  }

  // OnSelect Selected dropdwon
  onSelectActivityDate() {
    let temSelectedVal=this.loadID.nativeElement.value;
    let splitVal = temSelectedVal.split(',');   
    let tempOnSelectActivityDate = moment(this.activity_date).format('MM/DD/YYYY');
    console.log("splitVal, tempOnSelectActivityDate::", tempOnSelectActivityDate, splitVal);
    if (splitVal[1] == 'ABL') {
      this.getGridDataAbl();
      this.isAbl = true;
    }
    else {
      this.getGridDataNonAbl(splitVal[0]);
      this.isAbl = false;
      this.nonAblloanId = splitVal[0];
    }
  }

  /**
   * Grid init function
   */

  gridInit() {
    this.columnDefs = [
      {
        headerName: 'Charge Code', field: 'charge_code', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Charge Type', field: 'charge_type', filter: 'agTextColumnFilter'
      },
      { headerName: 'Frequency', field: 'frequency', filter: 'agTextColumnFilter' },
      {
        headerName: 'Value Type', field: 'value_type', filter: 'agTextColumnFilter',
        cellStyle: (params) => {
          return { 'text-align': 'right' }
        }
      },
      {
        headerName: 'Process Amount', field: 'process_amount', filter: 'agTextColumnFilter',
        editable: (params) => {

          if (this.editMode) {
            if (params.data.process) {
              if (this.currencyStringtoNum(params.data.process_amount) > 0 && params.data.frequency == "One Time") {
                if (params.data.isEdited !== true) {
                  return false;
                }
                else {
                  return true;
                }

              }
              else {

                return true;
              }

            }
            else {

              return false;
            }
          }
          else {

            return false;
          }
        },
        onCellValueChanged: (params) => {
          params.data.isEdited = true;
        },

        cellStyle: (params) => {
          if (this.editMode) {
            if (params.data.process === true) {
              if (this.currencyStringtoNum(params.data.process_amount) > 0 && params.data.frequency == "One Time") {
                if (params.data.isEdited === true) {
                  return { background: 'white', color: 'black', border: '0.5px solid #858789', 'text-align': 'right' }

                }
                else {
                  return { background: '#f4f5f7', color: 'grey', 'text-align': 'right' }

                }

              }
              else {

                return { background: 'white', color: 'black', border: '0.5px solid #858789', 'text-align': 'right' }
              }
            }
            else {
              return { background: '#f4f5f7', color: 'grey', 'text-align': 'right' }
            }

          }
          else {
            return { 'text-align': 'right' };
          }
        }


      },
      {
        headerName: 'Process', field: 'check_selection', width: 75,
        cellRendererFramework: CheckboxComponent,
        cellRendererParams: {
          editable: true
        },
      },
      {
        field: 'process', hide: true
      },
      {
        field: 'checkbox', hide: true
      },
      {
        field: 'isEdited', hide: true
      }
    ];

    this.defaultColDef = {
      flex: 1,
      resizable: true,
    };

    this.gridOptions = {

    };

    this.statusBar = {
      statusPanels: [
        {
          statusPanel: "agTotalRowCountComponent",
          align: "right"
        },
        {
          statusPanel: "agFilteredRowCountComponent"
        },
        {
          statusPanel: "agSelectedRowCountComponent"
        }
      ]
    };

  }


  /**
   * grid ready function
   */

  onGridReady(params) {
    this.gridOptions.api.sizeColumnsToFit();
    this.gridParams = params;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  /**
   * grid row select function
   */

  ongridRowSelected(event: any) {

  }

  // function while click on edit button
  editClickFn() {
    this.gridEditOff = false;
    this.gridEditOn = true;
    this.editMode = true;
    this.checboxEditMode = false;
    this.gridColumnApi.getColumn('check_selection').colDef.cellRendererParams = {
      editable: false
    }

    this.gridOptions.api.redrawRows();

  }

  // function while click on edit button
  cancelClickFn() {
    const popupParam = {
      'title': 'Confirmation',
      message: 'Do you want to discard changes ?',
      'msgType': 'warning'
    };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this.gridEditOff = true;
        this.gridEditOn = false;
        this.editMode = false;
        this.checboxEditMode = false;
        this.gridColumnApi.getColumn('check_selection').colDef.cellRendererParams = {
          editable: true
        }
        this.gridOptions.api.refreshCells();
        this.getLoanIDdropDown();
      }
    })
  }

  // function while click on save button
  saveClickFn() {
    this.gridApi.clearFocusedCell();
    // this._message.showLoader(true);
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));

    let checkedRows = [];
    checkedRows = rowData.filter(elm => {
      return elm.checkbox === true;
    }).map(elm => {
      return { 'process_amount': this.currencyStringtoNum(elm.process_amount), 'id': elm.id }
    })

    if (checkedRows && checkedRows.length) {
      let passFlag: boolean = false;
      let post_date = moment(this.activity_date).format('MM/DD/YYYY');

      let model = {
        "activity_date": post_date,
        "charge_template_id": {}
      }
      checkedRows.forEach(elm => {
        if (elm.process_amount <= 0) {
          this._helper.showApiMessages("Process Amount should be greater than zero", 'warning')
          passFlag = false;
        }
        else {
          passFlag = true
        }
        model.charge_template_id[elm.id] = {
          "process_amount": elm.process_amount,
          "id": elm.id
        }
      })
      if (passFlag) {
        if (this.isAbl) {
          this._message.showLoader(true);
          let urlAbl = `/borrowers/${this.clientId}/loan_activity/collateral_loans/add_onetime_manual_fees`

          this._processService.postAblGriddetails(urlAbl, model).subscribe(res => {

            if (res.status == 200) {
              this._helper.showApiMessages(res._body, 'success');
            }
            this.getGridDataAbl()
            this._message.showLoader(false);
            this.gridEditOff = true;
            this.gridEditOn = false;
            this.editMode = false;
            this.checboxEditMode = false;
            this.activity_date = new Date(this._helper.convertDateToString(new Date()));

            this.gridColumnApi.getColumn('check_selection').colDef.cellRendererParams = {
              editable: true
            }
          })
        }
        else {
          this._message.showLoader(true);
          let urlNonAbl = `loan_numbers/${this.nonAblloanId}/collateral_loans/add_onetime_manual_fees`

          this._processService.postNonAblGriddetails(urlNonAbl, model).subscribe(res => {

            if (res.status == 200) {
              this._helper.showApiMessages(res._body, 'success');
              this.activity_date = new Date(this._helper.convertDateToString(new Date()));
            }
            this.getGridDataNonAbl(this.nonAblloanId);
            this._message.showLoader(false);

            this.gridEditOff = true;
            this.gridEditOn = false;
            this.editMode = false;
            this.checboxEditMode = false;
            this.gridColumnApi.getColumn('check_selection').colDef.cellRendererParams = {
              editable: true
            }
          }, err => {
            // console.log("mmmm", err);
          })
        }
      }

    }
    else {
      this._helper.showApiMessages("Please select atleast one checkbox", 'warning')

    }
  }


  setRolesandPermissions() {
    let roleId = localStorage.getItem('cyncUserRoleId');
    let url = `roles/${roleId}/role_permissions/menu_specific_permissions?menu_name=collateral_loan_onetime_and_manual_process`;
    this._processService.getRolesandPermissions(url).subscribe(response => {
      let permissions = JSON.parse(response._body);
      // console.log("permission", this.checkPermissionForMenu(permissions, 'Edit'))
      if (this.checkPermissionForMenu(permissions, 'Edit')) {
        $("#editPermission").css("display", "inline");
      } else {
        $("#editPermission").css("display", "none");
      }

    });

  }
  checkPermissionForMenu(permissions: any, actionType: string): boolean {
    if (permissions.length > 0) {
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].action_label == actionType) {
          return permissions[i].enabled;
        }
      }
    }
  }

  /**
   *  Function to change comma seperated currency to normal number for post body
   * @param val 
   */
  currencyStringtoNum(val) {
    return val.replace(/,/g, '');
  }

}
