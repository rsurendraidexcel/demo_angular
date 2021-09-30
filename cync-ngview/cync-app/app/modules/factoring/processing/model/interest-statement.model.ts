export class InterestStatementExportStyle {
 
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
				id: "exportRightAllign",
				numberFormat: { format: "#,##0." + this.exceldecimalPrecision },
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: false
				},
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
			
			},
			{
				id: "exportLeftAllign",
				numberFormat: { format: "#,##0." + this.exceldecimalPrecision },
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: false
				},
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
			
			},
			{
				id: "excelHeader",
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 18,
					bold:true
				},
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
				
			},
			{
				id: "excelClient",
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 12,
					bold:true
				},
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
				
			},
			{
				id: "excelTitleHeader",
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 14,
					rowHeight: 20,
					headerRowHeight: 20,
					bold:true
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
				
			},
			{
				id: "excelFromToDateHeader",
				font: {
					fontName: "Calibri Light",
					color: "#ffffff",
					size: 12,
					bold:true
				},
				interior: {
					color: "#0E367B",
					pattern: "Solid",
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
				
			},
	
				{
				  id: 'darkGreyBackground',
				  interior: {
					color: '#888888',
					pattern: 'Solid',
				  },
				  font: {
					fontName: 'Calibri Light',
					color: '#ffffff',
				  },
				},
				
				{
				  id: 'header',
				  interior: {
					color: '#CCCCCC',
					pattern: 'Solid',
				  },
				  borders: {
					borderBottom: {
					  color: '#5687f5',
					  lineStyle: 'Continuous',
					  weight: 1,
					},
					borderLeft: {
					  color: '#5687f5',
					  lineStyle: 'Continuous',
					  weight: 1,
					},
					borderRight: {
					  color: '#5687f5',
					  lineStyle: 'Continuous',
					  weight: 1,
					},
					borderTop: {
					  color: '#5687f5',
					  lineStyle: 'Continuous',
					  weight: 1,
					},
				  },
				},
				{
				  id: 'dateFormat',
				  dataType: 'dateTime',
				  numberFormat: { format: 'mm/dd/yyyy;@' },
				},
				{
				  id: 'twoDecimalPlaces',
				  numberFormat: { format: '#,##0.00' },
				},
				{
				  id: 'textFormat',
				  dataType: 'string',
				},
				{
				  id: 'bigHeader',
				  font: { size: 12 },
				},
			  
		];

		return styleObject;
	}

}
