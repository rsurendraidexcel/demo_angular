/**
 * Cash Control api response model
 */
export class CashControlApiResponseModel {
	recordTotal: number;
	currentPage: number;
	pagesTotal: number;
	data: CashControlData[];
}

/**
 * Model for Cash control
 */
export class CashControlData {
	id: number;
	cash_cotrol: string;
	description: string;
}

/**
 * Model for Cash Control Post Request
 */
export class CashControlRequestBody {
	cash_control: CashControlData;
}

export class EditCashData {
	id: number;
	code: string;
	description: string;
}



/**
 * for export styling
 */
export class CashControlExportStyle {

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