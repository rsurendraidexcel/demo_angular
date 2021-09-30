export class FundsEmployedExportStyle {
 
    public static exceldecimalPrecision = '00';

	// GridStyle for Export xls 
	public static setGridExportStyle(): any {
		const styleObject = [
			{
				id: "exportColumnClass",
				numberFormat: { format: "#,##0." + this.exceldecimalPrecision },

				alignment: {
					horizontal: "Right",
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
					size: 10,
					bold: false
				}
			},
			{
				id:"exportColumnClassLeft",
				alignment: {
					horizontal: "Left",
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
				
				alignment: {
					horizontal: "Right",
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
					size: 10,
					bold: false
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

export class FundsEmployedModel {
	id: number;
	activity_date: number;
	transaction_no: any;
	tag_type:any;
	charge_name:any;
	sign:any;
	charge_amount:any;
	adjusted_amount:any;
	net_fund_emp_amount:any;
		
}

