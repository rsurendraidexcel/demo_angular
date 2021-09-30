export interface AdvanceSearch {
    field;
    data;
    op;

}


export class Column {

    column_value: string;
    column_display: string;
    data_type: string;
    search_type: string;

}

export class ColumnListApiResponseModel {

    columns: Column[];
}

export class Opearator {

    operator_value: string;
    operator_name: string;


}

export class OpearatorListApiResponseModel {

    operator: Opearator[];
}

export class DropdownListApiResponseModel {
    drop_down: Dropdown[];
}

export class Dropdown {
    value: string;
    display: string
}

export class FiltersModel {
    filters: Filters;
}
export class Filters {
    groupOp: string;
    rules: FilterRules[];
}

export class FilterRules {
    field: string;
    op: string;
    data: string;
}