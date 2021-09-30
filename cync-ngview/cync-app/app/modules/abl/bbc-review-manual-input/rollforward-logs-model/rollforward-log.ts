export class RollforwardLogDetailsModel {
    rollforward_log: AddRollforwardLogDetailsModel
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
}
export class EditRFLogDetailsModel{
    rollforward_log : EditRollforwardLogDetailsModel
}
export class EditRollforwardLogDetailsModel{
    rollforward_log_lists: RollforwardLogDetailsListModel[];
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

export class RollforwardLogExportStyle {

	public static exceldecimalPrecision = '00';

	// GridStyle for Export xls 
	public static setGridExportStyle(): any {
		
		const styleObject = [
			{
				id: "exportColumnClass",
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 10,
					bold: false
				}
			},
			{
				id: "header",
				interior: {
					color: "#D9E5F6",
					pattern: "Solid"
				},
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: true
				}
			},
			{
				id: "exportValueTwoDecimalPlaces",
				numberFormat: { format: "#,##0." + this.exceldecimalPrecision },
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 10,
					bold: false
				}
			},
			{
				id: "dateFormat",
				dataType: "dateTime",
				numberFormat: { format: "mm/dd/yyyy;@" },
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 10,
					bold: false
				},
				alignment: {
					horizontal: "Left"
				}
			
			},
			{
				id: "excelHeader",
				interior: {
					color: "#AECCF8",
					pattern: "Solid"
				},
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: true
				}
			}
		];

		return styleObject;
	}

}