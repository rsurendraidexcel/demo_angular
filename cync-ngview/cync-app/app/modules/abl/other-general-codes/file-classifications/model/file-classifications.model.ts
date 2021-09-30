
/**
  * api model for file classification
  * 
  */
export class FileClassification {
    name: string;
    description: string;
    constructor() {
    };
}

/**
   *UpdateRequestBody
   * 
   */
export class UpdateRequestBody {
    file_classification: FileClassification;
}