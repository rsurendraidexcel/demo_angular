export class ClientAssignIneligibleCalulationSaveModel {
  public static ineligibleCalulationArray(): any {
    let obj = {
      ineligibility_reason_id: 0,
      sequence: 0,
      client_template_id: 0,
      borrower_id: -100
    }
    return obj;
  }

  public static ineligibleCalulationSaveModel(): any {
    let requestBody = {
      ineligible_calculation: []
    }
    return requestBody;
  }
}