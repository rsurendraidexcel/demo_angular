/**
 * Model class for ABL auto file upload module.
 * @see https://s3.amazonaws.com/cync-raml/raml/file-uploads-module.html#borrowers__id__auto_file_uploads_get
 */
export class ABLAutoFileUpload {
    id: number;
    file_name: string; // header for the File Name
    uploaded_type: string; // header for the Upload Type
    uploaded_amount: string; // header for Upload Amount
    parameter_type: string; // header for the Parameter Type
}

/**
 * check below for api response structure
 * @see https://s3.amazonaws.com/cync-raml/raml/file-uploads-module.html#borrowers__id__auto_file_uploads_get
 */
export class ABLAutoFileUploadsAPIResponse {
    monarch_uploaded_file: ABLAutoFileUpload[];
}