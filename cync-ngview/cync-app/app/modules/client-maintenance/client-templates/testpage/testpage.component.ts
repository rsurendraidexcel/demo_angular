import { Component, OnInit } from '@angular/core';
import { CellrenderexampleComponent } from './cellrenderexample/cellrenderexample.component';

@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.scss']
})
export class TestpageComponent implements OnInit {

  gridApi:any;
  gridColumnApi: any;
  cyncRowData = [
    {name: 'Peter', desig: 'TE', age: 35, phone: 12345, available: true, dob: '11-11-2019', salary: 20000},
    {name: 'Rony', desig: 'GD', age: 32, phone: 12345, available: false, dob: '11-12-2019', salary: 30000},
    {name: 'Sachin', desig: 'SE', age: 22, phone: 12345, available: true, dob: '11-12-2019', salary: 400000},
    {name: 'akhil', desig: 'SE', age: 28, phone1: 123456767, available: false, dob: '11-08-2019', salary: 100000000}

];

cyncColumnDefs = [
  {
    headerName: 'Name',
    field: 'name',
    editable: true,
    tooltipField: 'name',
  },
  {
  
    field: 'desig',
    colType: 'dropdown',
    colOption: [{value:'SE', display: 'Solftware Engineer'}, {value: 'GD', display: 'Graphic Designer'}, {value: 'TE', display: 'Tech Engineer'}],
    
  },
  {
    field: 'age',
    width: 50
  },
  {
    headerName: 'Phone No',
    field: 'phone',
    width: 50,
    tooltipField: 'phone',
    editable: false
  },
  {
    headerName: 'Available',
    field: 'available',
    cellRendererFramework: CellrenderexampleComponent,
    colType: 'checkbox'
  },
  {
    headerName: 'DOB',
    field: 'dob',
    colType: 'date',
    dateFormat: 'DD/MM/YYYY'
  },
  {
    headerName: 'Salary',
    field: 'salary',
    colType: 'currency',
    width: 120,
  },
];

cyncGridConfig = {
  topPanel: true,
  addButton: true,
  addButtonFn: this.addButtonFunction.bind(this),
  editButton: true,
  editButtonFn: this.editButtonFunction.bind(this),
  deleteButton: true,
  deleteButtonFn: this.deleteButtonFunction.bind(this),
  resetButton: true,
  resetButtonFn: this.resetButtonFunction.bind(this),
  gridInitialDisable: true,
  singleClickEdit: true,
  checkboxSelection: true,
  filterType: 'agTextColumnFilter',
  colDefaultWidth: 150
}

cyncGridReady(params) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  params.api.sizeColumnsToFit(); 
  console.log(">>>>>>>>>>>>>>>>>>>>>");
}

onCellKeyPress(event){
  console.log("key pressed", event)
}

ongridRowSelected(event){
  console.log("row selected", event);
}

  constructor() { }

  ngOnInit() {
  }

  addButtonFunction(){
    console.log('clicked on add button');
    this.gridApi.updateRowData({ add: [{}] });
	}



  editButtonFunction(){
    console.log('clicked on edit button');
  }

  resetButtonFunction(){
    console.log('clicked on reset button');
  }

  deleteButtonFunction(){
    console.log('clicked on delete button');
  }

}
