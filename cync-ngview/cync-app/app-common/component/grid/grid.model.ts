export interface GridModel {

	singleSelection: boolean;
	multiSelection: boolean;
	infiniteScroll: boolean;
	onDemandLoad: boolean;
	columnDef: Array<ColumnDefinition>;
	apiDef: ApiDef;
	type: string;


}

export interface ApiDef {

	getApi: string;
	deleteApi: string;
	updateApi: string;

}

export interface ColumnDefinition {
	sortable: boolean;
	header: string;
	field: string;
	isTemplate: boolean;
	templateHtml: string;
	hidden: boolean;
	filter: boolean;
}
