import { stringify } from "@angular/core/src/util";

export class MapLoansModel{

    public static MappedLoansArray():any{
        let obj = {
            id: Number,
            loan_name: String,
            loan_type: String,
            loan_no: String,
        }
        return obj;
    }

    public static mapLoansSaveModel(): any {
        let requestBody = {
            category_id:String,
            mapped_loan_list: [],
        }
        return requestBody;
      }
}