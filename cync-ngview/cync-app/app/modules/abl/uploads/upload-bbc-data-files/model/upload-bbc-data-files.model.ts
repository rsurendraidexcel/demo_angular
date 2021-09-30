export class UIBinding {
    expendedRowData: DataReview[] = new Array(); // hidden field required to show data when row will get expended
    expendedId: number;
    selectedFile: File;
    labelForSelectFile = 'Choose File';
    isFileSelected: boolean;
    isProcessingStarted: boolean;
    headers: any[] = [];
}

/**
 * Model interface for ABL file upload module.
 * @see http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/file-uploads-module.html#abl_uploads_get
 */
export class ABLFileUpload {
    id: number;
    borrower_id: number;
    division_code_id: number; // if borrower division_code is present
    bbc_id: number;
    bbc_date: string;
    prev_bbc_dt: string;
    data_type: string; // header for the Data File Type
    data_file_type: string;
    detail_client: boolean;
    mapping_name: string; // header for the Collateral Name
    file_format: string; // header for the Format
    next_date: string; // header for the Current Period
    due_date: string; // header for the Due Date
    total_expected_value: string; // header for the Total Expected Value
    uploaded_value: string; // header for the Uploaded value
    file_loaded: number; // header for the File Uploaded
    borrower_receivable: string;
    mapping_id: number; // hidden field required in File process
    expected_value: number;
    image_flag: boolean;
    exchange_rates_flag: boolean;
    default_select_collateral: string;
    select_collateral_from_dropdown: SelectCollateralFrom[];
    select_collateral_from: string;
    file: File; // selected file will need this while sending post request
    uiBindings?: UIBinding = new UIBinding(); // below properties are only for ui, its not related to any api response.
    imageBindings?: UIBinding = new UIBinding();
    layouts: Layouts[];
    group_name: string;
    description: string;
    layoutID: number;
    layoutName: string;
    layoutFilePresent: boolean;
}

/**
 * Model interface for required source documents for ABL
 */
export class RequiredSourceDocuments {
    id: number;
    borrower_id: number;
    source_documents_name: string; // header for the Source File
    frequency: string;
    next_date: string; // header for the Current Period
    due_date: string;
    uiBindings?: UIBinding = new UIBinding(); // below properties are only for ui, its not related to any api response.
}

/**
 * check below for api response structure
 * @see http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/file-uploads-module.html#abl_uploads_get
 */
export interface ABLFileUploadsAPIResponse {
    uploaded_file: ABLFileUpload[];
    bbc_document: RequiredSourceDocuments[];
    exchange_rates: ExchangeRateData[];
    recordTotal: number;
    currentPage: number;
    totalPages: number;
}

/**
 * @see https://s3.amazonaws.com/cync-raml/raml/client-maintenance.html#borrowers__id__division_codes_get
 */
export interface UploadBBCDataFilesDivisions {
    id: number;
    name: string;
    description: string;
    borrower_id: number;
}

/**
 *
 */
export interface BorrowerDivisionCodeResponse {
    divisionscode: UploadBBCDataFilesDivisions[];
}

/**
 *
 */
export interface SelectCollateralFrom {
    key: string;
    value: string;
}

/**
 * @see https://s3.amazonaws.com/cync-raml/raml/file-uploads-module.html#borrowers__id__data_review_get
 */
export class DataReview {
    id: number;
    file_name: string;
    data_type: string;
    collateral_name: string;
    Future: number;
    Current: number;
    bucket_1: number;
    bucket_2: number;
    bucket_3: number;
    bucket_4: number;
    balance_amt: number;
    retention_amount: number;
    expected_value: number;
    actual_value: number;
    variance: number;
    new_accounts: number;
    duplicate_invoices: number;
    new_accounts_link: string;
    default_select_collateral: string;
    select_collateral_from: SelectCollateralFrom[];
}

/**
 *
 */
export class DataReviewAPIResponse {
    headers: string[];
    data_review: DataReview[] = new Array();
}

/**
 * 
 */
export class ExchangeRateData {
    currency_id: number;
    description: string;
    exchange_rate_value: string;
    decimal_precision: number;
}

export class ReExchangeRateData {
    currency_id: number;
    exchange_rate_value: string;
}

export class ReApplyExchangeRate {
    exchange_rates: ReExchangeRateData[];
    borrower_id: string;
}

export class ReprocessCollateralFrom {
    select_collateral_from: string;
}

/**
 *
 */
export interface Layouts {
    layout_id: string;
    layout_name: string;
    file_present: boolean;
}

