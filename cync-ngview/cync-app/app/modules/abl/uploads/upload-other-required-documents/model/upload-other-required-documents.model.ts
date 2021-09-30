/**
 * Model class for ABL other required file upload module.
 * @see https://s3.amazonaws.com/cync-raml/raml/file-uploads-module.html#document_uploads_get
 */
export class ABLOtherRequiredDoc {
    id: number;
    borrower_id: number;
    received_date: string; // header for the Received Date
    source_documents_name: string; // header for Description
    file_classification_id: number;
    classification: string; // header for the Classification
    frequency: string;
    frequency_name: string; // header for the Frequency
    next_date: string; // header for the Current Period
    due_date: string; // header for the Due Date
    notified: string; // header for the Notified
    uploaded_folder: string; // header for the Upload File
    uiBindings?: UIBinding; // below properties are only for ui, its not related to any api response.
}

export class UIBinding {
    selectedFile: string;
    labelForSelectFile = 'Choose File';
    isFileSelected: boolean;
    isProcessingStarted: boolean;
}

/**
 * check below for api response structure
 * @see https://s3.amazonaws.com/cync-raml/raml/file-uploads-module.html#document_uploads_get
 */
export class ABLOtherRequiredDocAPIResponse {
    reporting_documents: ABLOtherRequiredDoc[];
}