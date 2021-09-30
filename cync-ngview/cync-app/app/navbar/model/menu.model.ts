/**
 * Model Class for saving breadcrumb and path data for each menu
 */
export class MenuBreadCrumbModel {
    menuName:string;
    path:string;
    breadCrumb:string[];
    isClientIdReqd:boolean;
    constructor(){};
}

/**
 * Model to store the selected client and manager ids from Ror
 */
export class CurrentSessionStateModel {
    borrower_id:string;
    manager_id:string;
    borrower_status: string;
    constructor(){};
}

export class SelectedMenuModel {
    menuName : string;
    adjacentMenus : Map<string, MenuBreadCrumbModel>;
}

