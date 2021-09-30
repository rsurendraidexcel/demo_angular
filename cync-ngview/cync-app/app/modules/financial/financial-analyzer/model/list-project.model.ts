
/**
 * Model class for all list project
 */
export class AllListProject {
  recordTotal: number;
  charge_code : Array<ListProject>;
}

/**
 * Model class for list project
 */
export class ListProject  {
  projectName: any;
  industry: any;
  //financialTimeline: any;
  financialPeriod: any;
  clientName: any;
  clientId: any;
  //balanceSheetYear: any;
  folder: any;
  id: number;
  projects: string;
  description: string;
  last_modified: string;
  fromPeriod:any;
  yearFrom: any;
  toPeriod: any;
  yearTo: any;
}

/**
 * Model class for add and edit scenarios
 */
export class AddEditListProject{
  folder: any;
  list_project : ListProject
}

/**
 * Model class for dropdown values
 */
export class Dropdown{
  value:number;
  display:string;
   show:boolean = true;
}

export class Dropdown1{
  id:number;
  folderName:string;
   show:boolean = true;
}

