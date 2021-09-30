
export class MultipleClientAssignSaveModel {
  public static multipleClientAssignmodel(): any {
    let obj = {
      client_template:{
        borrower_ids: [],
        parameter: {},
        ineligible_calculation: [],
        retention_label: '',
        bucket_ageings: [],
        payable_bucket_ageings:[]
      }
    }
    return obj;
  }

  public static multipleClientAssignBlankmodel(): any {
    let obj = {
      client_template:{
        borrower_ids: [],
        parameter: {},
      }
    }
    return obj;
  }
}