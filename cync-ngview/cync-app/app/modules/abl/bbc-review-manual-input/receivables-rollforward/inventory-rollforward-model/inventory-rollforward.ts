export class InventoryRollforwardLogDetailsModel {
    inventory_rollforward_log: AddRollforwardLogDetailsModel
}

export class AddRollforwardLogDetailsModel{
    activity_date: String;
    division_code_id: number;
    collateral_advance_rate_id: number;
    new_sale: number;
    new_credit: number;
    cash_collected: number;
    new_adjustment: number;
    bbc_adjustment: number;
    borrower_id: string;
    product_group_id:number;
    purchases: number;
    credits: number;
    removals: number;
}
export class EditInventoryRFLogDetailsModel{
    inventory_rollforward_log  : EditInventoryRollforwardLogDetailsModel
}
export class EditInventoryRollforwardLogDetailsModel{
    records: RollforwardLogDetailsListModel[];
}
export class RollforwardLogDetailsListModel{
    id:number;
    activity_date: String;
    division_code_id: number;
    collateral_advance_rate_id: number;
    new_sale: number;
    new_credit: number;
    cash_collected: number;
    new_adjustment: number;
    bbc_adjustment: number;
    user:string;
    collateralList?:any;
}
