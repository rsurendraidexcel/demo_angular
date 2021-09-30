import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { CellRenderComponentComponent } from './cell-render-component/cell-render-component.component';
import { CyncGridService } from './cync-grid.service';
import * as _moment from 'moment';
import * as moment from 'moment-timezone';
import { CustomDatePickerComponent } from './custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'cync-grid',
  templateUrl: './cync-grid.component.html',
  styleUrls: ['./cync-grid.component.scss']
})
export class CyncGridComponent implements OnInit, OnChanges {
  @Input() cyncRowData: any;
  @Input() cyncColumnDefs: any;
  @Input() cyncGridConfig: any;
  @Input() cyncGridApiConfig: any;
  @Input() pagination: any;
  @Input() paginationPageSize: any;
  @Input() rowSelection: any;
  @Input() statusBar: any;
  @Input() excelStyles: any; 
  @Input() suppressRowClickSelection: any;
  @Input() floatingFilter: any;
  @Input() enableSorting: any;  
  @Input() multiSortKey: any; 
  @Input() enableFilter: any; 
  @Input() overlayNoRowsTemplate: any; 
  @Input() animateRows: any;   
  @Input() gridOptions: any;
  @Output() cyncOnGridReady = new EventEmitter<any>();
  @Output() cellKeyPress = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() focusout = new EventEmitter<any>();
  @Output() columnVisible = new EventEmitter<any>();
  @Output() dragStopped = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() modelUpdated = new EventEmitter<any>();
  @Output() cellDoubleClicked = new EventEmitter<any>();
  @Output() cellMouseOver = new EventEmitter<any>();

  private gridApi;
  private gridColumnApi;
  public tooltipShowDelay = 0;
  public frameworkComponents;
  public modules: any = AllCommunityModules;

  defaultColDef;
  defaultColGroupDef;
  columnTypes;
  columnDefs: [];
  rowData: [];
  constructor(private elRef: ElementRef, public cyncGridService: CyncGridService) {

  }

  ngOnInit() {

    // console.log(this.elRef.nativeElement.parentElement);

    let filterType;
    let editable;
    let colDefaultWidth;

    if (this.cyncGridConfig.colDefaultWidth) {
      colDefaultWidth = this.cyncGridConfig.colDefaultWidth;
    }

    if (this.cyncGridConfig.filterType) {
      filterType = this.cyncGridConfig.filterType;
    }
    if (this.cyncGridConfig.gridInitialDisable === true) {
      editable === false;
    }
    else {
      editable === true;
    }

    // setting default config
    this.defaultColDef = {
      width: colDefaultWidth,
      editable: editable,
      filter: filterType,
      resizable: true,
      sortable: true
    };

    // console.log("LLLLLLLL", this.cyncGridConfig.gridInitialDisable);

    // filtering the coloumnDefs

    this.coldefFilterFunction()


    //adding checkbox selection based on grid config condition

    this.checkBoxSelectionColumn()


    this.columnDefs = this.cyncColumnDefs;
    this.rowData = this.cyncRowData;

    this.frameworkComponents = { agDateInput: CustomDatePickerComponent };

  }

  // detect cyncRowData changes and apply new changes to rowData
  ngOnChanges(changes: SimpleChanges) {

    // console.log(changes.currentValue);


    if (changes.cyncGridConfig) {
      this.cyncGridConfig = changes.cyncGridConfig.currentValue;
    }

    if (changes.cyncRowData) {
      this.rowData = changes.cyncRowData.currentValue;
    }

    if (changes.cyncColumnDefs) {
      if (this.cyncGridConfig.checkboxSelection === true) {
        var found = false;
        for (var i = 0; i < changes.cyncColumnDefs.currentValue.length; i++) {
          if (changes.cyncColumnDefs.currentValue[i].field == 'checkbox_selection') {
            found = true;
            break;
          }
        }
        if(found === false){
          changes.cyncColumnDefs.currentValue.unshift({
            headerName: '',
            field: 'checkbox_selection',
            width: 40,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            filter: null
          });
        }
     
      }
      this.columnDefs = [];
      this.coldefFilterFunction();
      this.columnDefs = changes.cyncColumnDefs.currentValue;
    }

  }

 

  /**
   * Currency formating function
   * @param params 
   */
  currencyFormater(params) {
    var usdFormate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
    });
    let usdFormatedValue = usdFormate.format(params.value === undefined ? params : params.value);
    if (usdFormatedValue.indexOf('-') !== -1) {
      return "(" + usdFormatedValue.replace('-', '') + ")";
    } else {
      return usdFormatedValue;
    }
  }

    /**
   * date formating function
   * @param params 
   */
	dateValueFormatter(params) {
    if (params.value != null && params.value != undefined && params.value != '') {

			return moment(params.value).format('MM/DD/YYYY');
    } else {
             return params.value;
           }
	
  }

  /**
   * Date sorting
   * @param date1 
   * @param date2 
   * @returns 
   */

  dateComparator(date1, date2) {
    var date1Number:any = new Date(date1);
    var date2Number:any = new Date(date2);
    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }
    return date1Number - date2Number;
  }
  

  /**
   * first letter capitlize function
   */

  capitalize = (string) => {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  /**
   * Function for edit icon
   */
  editIconFunction() {
    this.cyncGridConfig.gridInitialDisable = false;
    this.gridColumnApi.getColumn().colDef.cellRendererParams = {
      initDisable: false
    }
  }

  /**
   * 
   * @param event Function for filtering coldef
   */

  coldefFilterFunction() {
    this.cyncColumnDefs.forEach(element => {
      if (element.headerName) {
      element.headerTooltip = element.headerName;
      }
      else{
        element.headerTooltip = element.field;
      }
      if (element.colType) {
        
        if (!element.cellRendererFramework) {

          if (element.colType === "currency") {
            element.valueFormatter = this.currencyFormater
            element.cellStyle = {'text-align' : 'right'}
            element.filter = 'agNumberColumnFilter'
          }
          else if (element.colType === "number") {
           
            element.cellStyle = {'text-align' : 'right'}
            element.filter = 'agNumberColumnFilter'
          }

          else if (element.colType === "string") {
           
            element.cellStyle = {'text-align' : 'left'}
            element.filter = 'agTextColumnFilter'
          }

          else if (element.colType === "date") {

            element.filter = 'agDateColumnFilter'
            element.valueFormatter = this.dateValueFormatter
            element.comparator = this.dateComparator
            element.filterParams = {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = moment(cellValue).format('DD/MM/YYYY');
                var dateParts = dateAsString.split("/");
                var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              }
            }
          }
       
          else {
            element.cellRendererFramework = CellRenderComponentComponent,
              element.cellRendererParams = {
                type: element.colType,
                options: element.colOption,
                dateFormat: element.dateFormat,
                editable: element.editable,
                name: element.field,
                inputBoxtype: element.inputBoxType,
                initDisable: this.cyncGridConfig.gridInitialDisable,
                buttonText: element.buttonText,
                buttonStyle: element.buttonStyle,
                buttonFunction: element.buttonFunction
              }
          }
        }
      }
    });
  }


  /**
   * 
   * @param event adding checkbox selection based on grid config condition
   */
  checkBoxSelectionColumn() {
    if (this.cyncGridConfig.checkboxSelection === true) {
      var found = false;
      for (var i = 0; i < this.cyncColumnDefs.length; i++) {
        if (this.cyncColumnDefs[i].field === 'checkbox_selection') {
          found = true;
          break;
        }
      }
      if(found === false){
      this.cyncColumnDefs.unshift({
        headerName: '',
        field: 'checkbox_selection',
        headerCheckboxSelection: true,
        width: 40,
        checkboxSelection: true,
        filter: null
      });
    }
    }
  }

  onFilterTextBoxChanged(event){
    // console.log(event.target.value)
     this.gridApi.setQuickFilter(event.target.value);
  }

  // add button clicked
  addButtonFn(params){
   return this.cyncGridConfig.addButtonFn()
  }

   // edit button clicked
   editButtonFn(params){
    return this.cyncGridConfig.editButtonFn()
   }

    // view button clicked
    viewButtonFn(params){
      return this.cyncGridConfig.viewButtonFn()
     }

    // reset button clicked
    resetButtonFn(params){
      return this.cyncGridConfig.resetButtonFn()
     }

     // delete button clicked
    deleteButtonFn(params){
      return this.cyncGridConfig.deleteButtonFn()
     }

  /**
   * 
   * @param event Emiting all default ag-grid events
   */

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.cyncOnGridReady.emit(params)
  }

  onCellKeyPress(event) {
    this.cellKeyPress.emit(event)
  }

  ongridRowSelected(event) {
    this.rowSelected.emit(event);
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }

  onGridColumnsChanged(event) {
    this.columnVisible.emit(event);
  }

  onGridDragStopped(event) {
    this.dragStopped.emit(event);
  }

  onSelectionChanged(event) {
    this.selectionChanged.emit(event);
  }

  onModelUpdated(event) {
    this.modelUpdated.emit(event);
  }

  onCellDoubleClicked(event) {
    this.cellDoubleClicked.emit(event);
  }
  onCellMouseOver(event) {
    this.cellMouseOver.emit(event);
  }
}
