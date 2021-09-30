export class CustomGridModel {
	singleSelection: boolean;
	multiSelection: boolean;
	infiniteScroll: boolean;
	onDemandLoad: boolean;
	columnDef: Array<ColumnDefinition>;
	apiDef: ApiDef;
	type: string;
	responseKey: string;
	isSearchAvailable: boolean;
	isAdvanceSearchAvailable: boolean;
	isAddFunctionalityRequired: boolean;
	isEditFunctionalityRequired: boolean;
	isDeleteFunctionalityRequired: boolean;
	isExportFunctionalityRequired: boolean;
	isReloadFunctionalityRequired: boolean;
	onlyListingComponent: boolean;
	showTotalRecords: boolean;
	searchViaAPI: boolean;
	menuName: string;
	permissionRequired?: boolean;
	isPaginationRequired?: boolean;
	reloadGridDataOnClientSelection?: boolean;
	isMoreIconsRequired ? : boolean;
	deletePopupParameter?: string;
}

export class ApiDef {
	getApi: string;
	deleteApi: string;
	updateApi: string;
	exportApi?: string;
}

export class ColumnDefinition {
	sortable: boolean;
	header: string;
	field: string;
	isTemplate: boolean;
	templateHtml: string;
	hidden: boolean;
	filter: boolean;
}
