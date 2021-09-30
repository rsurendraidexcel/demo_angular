export class BrokerCommission {
  public static exceldecimalPrecision = '00';
  // GridStyle for Export xls 
  public static setGridExportStyle(): any {
    let excelStyles = [
      {
        id: "exportColumnClass",
        alignment: { horizontal: "Left" },
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
      },
      {
        id: "clientId",
        alignment: { horizontal: "Left" },
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
        id: "exportDateFormat",
        dataType: "dateTime",
        numberFormat: { format: "mm/dd/yyyy" },
        alignment: { horizontal: "Left" },
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
    ];
    return excelStyles;
  }

}

export class BrokerCommissionDetails {

  id: number;
  broker_id: number;
  broker_name: string;
  client_name: string;
  account_name: string;
  original_amount: number;
  current_amount: number;
  advance_amount: number;
  receivable_no: string;
  funded_date: string;
  broker_fee_paid_dt: string;
  paid_amount: number;
  broker_fee_amount: number;
  fee_days: number;
  txn_type: string;
  broker_commission_pct: number;
  release_commission: boolean;
  fee_amount_on_accured: number;

}