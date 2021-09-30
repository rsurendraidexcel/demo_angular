/**
 *
 */
export class CyncConstants {
    /**
     *These all Constant are to display in HTML based on action like Edit or Add
     */
    public static GET_ADD_ACTION = 'Add';
    public static GET_EDIT_ACTION = 'Edit';
    public static DEFAULT_PAGE_NUMBER = 1;
    public static P_DATA_TABLE_ELEMENT_ID = 'cync_main_contents';
    public static P_DATA_TABLE_NEW_ELEMENT_ID = 'cync_main_contents_wradio';
    public static P_DATA_TABLE_UDF_DEFINITION_ID = 'cync_main_contents_wradio-list';
    public static HEADER_TEXT = "Financial Statment"
    /**
     * These all are api level constant
     */
    public static ADMIN_ROLE_ID = '1';
    public static ADMIN_ROLE_TYPE = 'Administrator';
    public static GET_USER_DETAILS = 'get_user_details';
    public static USER_LIST = 'User List';
    public static GET_ROLES = "get_roles";
    public static GET_SALES_REGION = "sales_region";
    public static GET_BORROWERS = "get_borrowers";
    public static GET_ALL_USERS = "get_all_users";
    public static SEND_ACTIVIATION_EMAIL = "send_activiation_email";
    public static UPDATE_USER_DETAILS = "update_user_details";
    public static NEW_USER_EXTENDS_LOGIN = "new_user_extends_login";
    public static ADD_NEW_USER = "add_new_user";
    public static GET_AR_BUCKET_AGEING = "get_ar_bucket_ageing";
    public static GET_AP_BUCKET_AGEING = "get_ap_bucket_ageing";
    public static GET_INSURANCE_POLICIES = "get_client_loan_insuranec_policies";
    public static UPDATE_INSURANCE_POLICIES = "update_client_loan_insurance_policies";
    public static GET_THIRD_PARTY = "get_client_loan_third_party_guarantors";
    public static UPDATE_THIRD_PARTY = "update_client_loan_third_party_guarantors";
    public static GET_PERSONAL_GUARANTORS = "get_client_loan_personal_guarantors";
    public static UPDATE_PERSONAL_GUARANTORS = "update_client_loan_personal_guarantors";
    public static GET_FILE_CLASSIFICATION = "get_file_classifications_list";
    public static UPDATE_FILE_CLASSIFICATION = "update_file_classifications_list";
    public static GET_LOAN_TYPE = "get_loan_type_list";
    public static LOAN_TYPE_BY_ID = "loan_type_by_id";
    public static LOAN_TYPE_API = "loan_type_api";
    public static DELETE_LOAN_TYPE_API = "delete_loan_type_api";
    public static FACTORING_INTEREST_SETUP ='get_factoring_interest_setup';


    /**
     * Client Transaction API Endpoints starts
     */
    public static GET_CLIENT_TRANSACTION_FOR_ABL = 'get_client_transaction_for_abl';
    public static EXPORT_CLIENT_TRANSACTION = 'export_client_transaction';
    public static VIEW_CLIENT_TRANSACTION = 'view_client_transaction';
    public static GET_TOTAL_CLIENT_TRANSACTION_DETAIL = 'get_total_client_transaction_detail';

    /**
     * Client Transaction API Endpoints ends
     */
    public static GET_BBC_PREFERENCE_SETUP = "get_bbc_preference_setup";
    public static GET_COMMENT = "get_comment";
    public static GET_REPORT_COMMENT = "get_report_comment";
    public static GET_CLIENT_DETAILS = "get_client_details";
    public static GET_BORROWER_DETAILS = 'get_borrower_details';
    public static GET_CLIENT_BBC_OPTIONS = 'get_client_bbc_options';
    public static GET_BORROWER_BASIC_PARAMETERS = 'get_borrower_basic_parameters';
    public static UNASSIGNED_CLIENTS = 'unassigned_clients';
    public static MANAGERS = 'managers';
    public static MAP_CLIENTS_TO_MANAGERS = 'map_clients_to_managers';
    public static CURRENT_STATE = 'current_state';
    public static MENUS = 'menus';
    public static ANGULAR_PATH_SEPARATOR = '#';
    public static DATE_FORMAT = 'MM/DD/YYYY';
    public static DATE_FORMAT_Roll = 'DD/MM/YYYY';
    public static REPORT_FILE_DATE_FORMAT = 'MM-DD-YYYY';
    public static MIN_DATE_RANG_YEAR = '1990';
    public static MAX_DATE_RANG_YEAR = '2033';
    public static GET_RATE_ADJUSTMENTS = 'get_rate_adjustmenst';
    public static GET_INTEREST_DETAILS = 'get_interest_details';
    public static GET_INTEREST_RATE_CODE = 'get_interest_rate_code';
    public static UPDATE_BORROWER_BASIC_PARAMETER = 'update_borrower_basic_parameter';
    /**
     * Client Loan Terms API Endpoints starts
     */
    public static GET_INELIGIBLE_ADVANCES = 'get_ineligible_advances';
    public static GET_SCROLL_INELIGIBLE_ADVANCES = 'get_scroll_ineligible_advances';
    public static GET_LOAN_FEES = 'get_loan_fees';
    public static GET_CLIENT_LOAN_GUARANTORS = "get_client_loan_guarantors";
    public static UPDATE_CLIENT_LOAN_GUARANTORS = "update_client_loan_guarantors";
    public static GET_CLIENT_BORROWER_GUARANTORS = "get_client_borrower_guarantors";
    public static UPDATE_CLIENT_BORROWER_GUARANTORS = "update_client_borrower_guarantors";
    /**
     * Client Creation API Endpoints Starts
     */
    public static GET_COUNTRIES_LIST = 'get_countries_list';
    public static GET_STATES_LIST_BY_COUNTRY = 'get_states_list_by_country';
    public static GET_CURRENCIES_LIST = 'get_currencies_list';
    public static GET_SALES_REGION_LIST = 'get_sales_region_list';
    public static GET_NAICS_CODE_LIST = 'get_naics_code_list';
    /**
     * Client Creation API Endpoints Ends
     */

    //Api Query Parameters to replace
    public static SELECTED_COUNTRY_ID_PARAM = '{countryIdValue}';
    /**
     * Client Creation API Endpoints ends
     */
    public static GET_CORPORATE_LIST = 'get_corporate_list';

    /**
     * Exception List API Endpoints Starts
     */
    public static GET_EXCEPTIONS_LIST = 'get_exception_list';
    public static DELETE_LENDER_EXCEPTIONS = 'delete_lender_exceptions';
    public static ADD_LENDER_EXCEPTION = 'add_lender_exception';
    public static UPDATE_LENDER_EXCEPTION = 'update_lender_exception';
    public static GET_EXCEPTION_DETAILS = 'get_exception_details';
    public static GET_EXCEPTION_TYPE = 'exceptions';
    public static GETEXCEPTIONDROPDOWNORVALUETYPE = 'getExceptionDropDownOrvaluetype';
    /**
     * Exception List API Endpoints Ends
     */

    /**
     * Fund Request API Endpoints starts
     */
    public static GET_FUND_REQUEST = 'get_fund_request';
    public static GET_FUND_REQUEST_BY_BBC_AND_FUND_DATE = 'get_fund_request_by_bbc_and_fund_date';
    public static SAVE_FUND_REQUEST = 'save_fund_request';
    public static DELETE_FUND_REQUEST = 'delete_fund_request';
    //Below constants is used for changing the HOST while saving fund request
    public static SAVE = 'save';
    public static ABL = 'ABL';

    //Save Fund Request API Success Message
    public static SAVE_FUND_REQUEST_SUCCESS_MSG = 'Fund Request Saved Successfully';

    //Undo Fund Request Confirmation popup title and message
    public static FR_TITLE = 'Confirmation';
    public static FR_MSG = 'Are you sure, you want to Undo Fund Request ?';


    //Response status
    public static STATUS_204 = 204;
    public static STATUS_200 = 200;
    public static STATUS_201 = 201;

    //Api Query Parameters to replace
    public static SELECTED_CLIENT_ID_PARAM = '{selectedClientId}';
    public static BBC_ID_VALUE_PARAM = '{bbcIdValue}';
    public static FUND_REQUEST_DATE_PARAM = '{fundRequestedDateValue}';

    /**
     * Fund Request API Endpoints ends
     */

    //Css value that needs to be passed as a parameter for APIMessage
    public static SUCCESS_CSS = 'success';

    /**
     * Fund Request API Endpoints ends
     */

    // These constants are for getting type of grid model from here to respective component.ts file
    public static GET_CLIENT_TYPE_FOR_ABL = 'Client Transaction Summary';
    public static GET_CLIENT_TYPE_FOR_FACTORING = 'Client Transaction Factoring Summary';
    public static FACTORING_PROCESSING_TYPE = 'Factoring';

    /**
     * Constants for Response message
     */
    public static SAVE_MESSAGE = 'Record Saved Successfully';
    public static UPDATE_MESSAGE = 'Record Updated Successfully';
    public static DELETE_MESSAGE = 'Record Deleted Successfully';
    /**
     * Interest Rate Codes API Endpoints starts
     */
    public static GET_INTERESTRATECODE_LOANTYPES = 'get_interest_rate_loan_types_request';
    public static GET_INTERESTRATECODE_LIST = 'get_interest_rate_codes_request';
    public static ADD_INTERESTRATECODE_LIST = 'add_interest_rate_codes_request';
    public static DELETE_INTERESTRATECODE = 'delete_interest_rate_code_request';
    public static GET_INTEREST_RATE_CODE_DETAILS = 'get_interest_rate_code_details';
    public static GET_INTERESTRATES_LIST = 'get_interest_rates_request';
    public static GET_SINGLE_INTERESTRATE = 'get_single_interest_rate_request';
    public static ADD_INTERESTRATE = 'add_interest_rates_request';
    public static DELETE_INTERESTRATE = 'delete_interest_rates_request';
    public static UPDATE_INTERESTRATE = 'update_interest_rates_request';
    public static INTEREST_RATE_CODE_HOME_PAGE_REDIRECT_URL = 'interest_rate_home_page';
    public static SEARCH_INTEREST_RATE_CODES = 'interest_rate_codes';
    public static SEARCH_INTEREST_RATE = 'interest_rates';
    public static GET_CALENDAR_YEAR_RANGE = 'interest_rates_calendar_range';
    public static INTEREST_RATE_DEFAULT_ORDER_BY = 'rate_date';
    /**
     *  Interest Rate Codes API Endpoints ends
     */

    /**
     * Constants for Charge Codes APIs
     */
    public static CHARGE_CODES_API = 'charge_codes_api';
    public static CHARGE_CODES_GET_ALL = 'charge_codes_get_all';
    public static CHARGE_CODES_GRID_MODEL_TYPE = 'Charge Codes';
    public static CHARGE_CODES_BY_ID = 'charge_codes_by_id';
    public static NAT_SIGNS = 'nat_signs';
    public static FREQUENCY = 'frequency';
    public static CHARGE_TYPE = 'charge_type';
    public static POSTING_TYPE = 'posting_type';
    public static SOURCE_TYPE = 'source_type';

    /**
   * Constants for List Project APIs
   */


    public static LIST_PROJECT_LIST_API = 'list_project_list_api';
    public static GET_ALL_LIST_PROJECT_API = 'list_project_get_all';
    public static LIST_PROJECT_API = 'list_project_api';
    public static LIST_PROJECT_FOLDER_API = 'list_project_folder_api';
    //public static LIST_PROJECT_GET_ALL = 'list_project_get_all';
    public static LIST_PROJECT_GRID_MODEL_TYPE = 'List Project';
    public static LIST_PROJECT_BY_ID = 'list_project_by_id';
    public static GET_FOLDER_PROJECT_BY_ID = 'get_folders_list_project';

    public static DELETE_LIST_PROJECT_BY_ID = 'delete_list_project';

    public static FOLDER_LIST_PROJECT = 'folders_list_project';
    public static GET_BALANCESHEET_LIST = 'get_balanceSheet_list';
    public static GET_FINANCIAL_PERIOD = 'get_financial_periods';
    public static GET_FINANCIAL_TIME_LINES = 'get_financial_time_lines';
    public static GET_FINANCIAL_PERIOD_TYPES = 'get_financial_period_types';



    /**
     * Constants for Financial Ratio -> Get List APIs
     */

    public static LIST_RATIO_API = 'list_ratio_api';
    public static POST_RATIO_API = 'post_ratio_api';
    public static SAVE_AND_EDIT = 'save_and_edit';



    //Contant Created for Operations to be comapred in manage-component files
    public static ADD_OPERATION = 'Add';
    public static EDIT_OPERATION = 'Edit';

    /*Permission constants*/
    public static SUMMARY = 'index';
    public static TRANSFER = 'transfer';
    public static CREATE = 'create';
    public static EDIT = 'update';
    public static DELETE = 'destroy';
    public static ENABLED_KEY = 'enabled';
    public static EXPAND_ROW = 'expand_all';
    public static REPROCESS_COLLATERAL = 'reapply_collateral_name';
    public static UNDO_ACTION = 'undo_uploaded_file';
    public static ABL_VIEW = 'new_abl_file_uploads_documents';
    public static AUTO_FILE_UPLOAD_VIEW = 'monarch_uploads';
    public static OTHER_REQUIRED_DOC_VIEW = 'index';

    /**
     * Menu Specific Permission API EndPoint and Param
     */
    public static MENU_SPECIFIC_API = 'menu_specific_api';
    public static MENU_PARAM = '{menu_name}';
    public static ROLE_ID_PARAM = '{role_id}';


    // Finance Status end points
    public static GET_FINANCE_STATUS_API = 'get_finance_status_api';


    // Get multiple user login info
    public static GET_MULTIPLE_USER_LOGIN_INFO = 'get_multiple_user_login_info';

    /**
     * SELECTED_CLIENT value will be set when a
     * client is selected from the dropdown[Navbar]
     */
    public static SELECTED_CLIENT;
    public static CURRENT_USER_INFO;

    /**
     * this property is to hold lender time zone
     */
    public static lenderTimezone: string;
    public static CYNC_USER_ROLE_ID = 'cyncUserRoleId';
    public static CYNC_USER_ROLE = 'cyncUserRole';

    //Key to access assets_path
    public static ASSETS_PATH = 'assets_path';

    //credit queue factoring constant
    public static LIST_CREDIT_QUEUE_PAGINATION = 'list_credit_queue_with_pagination';
    public static CREDIT_QUEUE_LIST = 'list_credit_queue';
    public static ADD_EDIT_CREDIT_QUEUE = 'add_edit_queue';
    public static COMMENT_QUEUE_LIST = 'comment_queue_list';
    public static DEBTOR_POPUP_LIST = 'debtor_popup_details';
    public static CLIENT_POPUP_LIST = 'client_popup_details';
    public static STATUS_DROPDOWN_VALUES = 'status_dropdown_values';
    public static DEBTOR_DROPDOWN_VALUES = 'debtor_dropdown_values';
    public static CLIENT_DROPDOWN_VALUES = 'client_dropdown_values';
    public static COMMENT_HISTORY = 'comment_history';
    public static WITHDRAWAL_QUEUE = 'withdraw_queue';
    static creditQueueRowData: string;

    //ineligible calculations
    public static GET_SYSTEM_DEFINED_INELIGIBILITY_REASONS = 'get_system_defined_ineligibility_reasons';
    public static APPLY_INELIGIBLE_CALCULATIONS = 'apply_ineligible_calculations';
    public static GET_TEMPLATE_DATA = 'get_template_data';

    //multiple client assign
    public static DO_NOT_UPDATE_TEMPLATE = 'do_not_update_template';
    public static UPDATE_TEMPLATE = 'update_template';
    public static COPY_TEMPLATE = 'copy_template';
    public static BLANK_TEMPLATE = 'blank_template';
  
    //Client Parameter - BBC File Required
    public static GET_BBC_FILE_REQUIRED = 'get_bbc_file_required';
    public static GET_COLLATERAL_DATA_BBC = 'get_collateral_data_bbc';
    public static  GET_MAPPING_GROUP_DATA = 'get_mapping_group_data';
    public static  SAVE_BBC_FILE_REQUIRED_DATA = 'save_bbc_file_required_data';
    public static FILE_CLASSIFICATION_LIST = 'file_classification_list';
    public static  GET_FREQUENCY_DATA = 'get_frequency_data';
    public static GET_BBC_DDIVISION_DATA = 'get_bbc_division_data'
    public static LOAD_DIVISION_BASED_DATA = 'load_division_based_data';
    public static DELETE_BBC_FILE_DATA = 'delete_bbc_file_data';
    public static UPDATE_BBC_FILE_DATA = 'update_bbc_required_file_data';
    public static MAPPING_GROUP_BASED_DATA = 'mapping_group_based_data';

    /**
     * Set the selected client, this method
     * gets called in the navbar component setBorrower() method
     * @param clientId
     */
    public static setSelectedClient(clientId: string) {
        CyncConstants.SELECTED_CLIENT = clientId;
    }

    /**
     * Get the selected client
     */
    public static getSelectedClient(): string {
        return CyncConstants.SELECTED_CLIENT
    }

    public static setUserInfo(data:any): any {
        CyncConstants.CURRENT_USER_INFO = data;
     
    }
    public static getUserInfo(): any {
        return CyncConstants.CURRENT_USER_INFO;
    }

    /**
     * to check whether user has selected client or not
     */
    isClientSelected(): boolean {
        return !(CyncConstants.SELECTED_CLIENT == undefined || CyncConstants.SELECTED_CLIENT == null);
    }

    /**
     *
     * @param lenderTimezone
     */
    public static setLenderTimezone(lenderTimezone: string) {
        this.lenderTimezone = lenderTimezone;
    }

    /**
     *
     */
    public static getLenderTimezone(): string {
        return this.lenderTimezone;
    }

    public static ASSET_PATH_VALUE: string;
    /**
     * method to get assests path
     */
    public static getAssetsPath(): string {
        return this.ASSET_PATH_VALUE;
    }

    /**
     * Method to set assets path
     * @param assetsPath
     */
    public static setAssetsPath(assetsPath: string) {
        CyncConstants.ASSET_PATH_VALUE = assetsPath;
    }



    public static FOLDER_NAME: any;
    /**
     * method to get financial folder name 
     */
    public static getFolderName() {
        return this.FOLDER_NAME;
    }

    /**
     * Method to financial folder name 
     * @param folderName
     */
    public static setFolderName(folderName) {
        CyncConstants.FOLDER_NAME = folderName;
    }

    /**
     * method to get page display count
     */
    public static getDefaultRowCount() {
        return this.DEFAULT_ROW_COUNT;
    }

    /**
     * Method to set page display count
     * @param count
     */
    public static setDefaultRowCount(count) {
        CyncConstants.DEFAULT_ROW_COUNT = count;
    }

    /**
     * BLANK STRING
     */
    public static BLANK_STRING = '';

    public static PAGE_NUMBER = 0;

    /**
     * InEligibility Reasons API Endpoints starts
     */
    public static GET_INELIGIBILITY_REASONS_LIST = 'get_ineligibility_reasons_list';
    public static DELETE_MULTIPLE_INELIGIBILITY_REASONS_RECORDS = 'delete_multiple_ineligibility_reasons_records';
    public static SEARCH_INELIGIBILITY_REASONS = 'search_ineligibility_reasons';
    public static ADD_INELIGIBILITY_REASONS = 'add_ineligibility_reasons';
    public static GET_OR_UPDATE_INELIGIBILITY_REASONS = 'get_or_update_ineligibility_reasons';
    public static EXPORT_INELIGIBILITY_REASONS = 'export_ineligibility_reasons';
    /**
     * InEligibility Reasons API Endpoints ends
     */

    /**
     * InEligibility Reasons Grid Column Header Names
     */
    public static INELIGIBILITY_REASON_CODE = 'Ineligibility Reason Code';
    public static DESCRIPTION = 'Description';
    public static SYSTEM_DEFINED = 'System Defined';
    public static CALCULATE_ON_NEGATIVE_ELIGIBLE_BALANCE = 'Calculate on Negative Eligible Balance';
    public static CALCULATE_ON_NEGATIVE_DEBTOR_BALANCE = 'Calculate on Negative Debtor Balance';

    /**
     * InEligibility Reasons Menu Name
     * used in grid model type and grid model menu name
     */
    public static INELIGIBILITY_REASONS = 'Ineligibility Reasons';

    /**
     * Ineligibility Reason Response Keys
     */
    public static INELIGIBILITY_REASON_RESPONSE_KEY = 'ineligibility_reason';

    /**
     * Client Transaction Summary Response Keys
     */
    public static CLIENT_TRANSACTION_SUMMARY_RESPONSE_KEY = 'client_transaction_summary';

    /**
     * Query Params that are to be replaced in api endpoint
     */
    public static SELECTED_RECORD_NAMES = '{selectedRecordNames}';
    public static SELECTED_RECORD_IDS = '{selectedRecordIds}';
    public static SEARCH_PARAMETER_VALUE = '{searchParameterValue}';
    public static SELECTED_RECORD_ID = '{selectedRecordId}';
    public static SORT_BY_PARAM_VALUE = '{sortByValue}';
    public static ORDER_BY_PARAM_VALUE = '{orderByValue}';
    public static PAGE_PARAM_VALUE = '{pageNumValue}';
    public static ROWS_PARAM_VALUE = '{numOfRowsValue}';
    public static BORROWER_ID_VALUE = '{clientId}';

    /**
     * Sorting Query param values
     */
    public static ASC_ORDER = 'ASC';
    public static DESC_ORDER = 'DESC';

    /**
     *  Order By updated record API query param
     */
    public static ORDER_BY_UPDATED_AT = 'updated_at';

    /**
     * Default Row Count
     */
    public static DEFAULT_ROW_COUNT: number;

    /**
     *
     * this property is to hold Interest rate loan type
     */
    public static loanType: string = "CollateralLoan";

    /**
     * Interest rate code set selected loan type value
     */
    public static setLoanType(loanType: string) {
        this.loanType = loanType;
    }

    /** */
    public static getLoanType(): string {
        return this.loanType;
    }



    /**
     * Finance projetID set method
     */
    public static setprojetID(id: string) {
        localStorage.setItem("id", id);
    }

    /**
     * Finance projetID get method
    */
    public static getprojetID(): string {
        return localStorage.getItem("id");
    }

    /**
    * this property is to hold Previous url value for finance statements
    */
    public static previousURL: string;

    /**
    * Previous url set string for financial statements
    */
    public static setPreviousURL(url: string) {
        this.previousURL = url;
    }

    /**
    * Previous url get string for financial statements
    */
    public static getPreviousURL(): string {
        return this.previousURL;
    }

    public static previewURL: string;

    public static setPreviewFileUrl(url: string) {
        this.previewURL = url;
    }

    public static getPreviewFileUrl() {
        return this.previewURL;
    }

    /**
     * Interest Rate Default value
     */
    public static DefaultLoanType = 'CollateralLoan';
    public static AddNewHeading = 'Add New';
    public static EditHeading = 'Edit';
    public static InterestRateCodeStaticKey = 'InterestRateCode';
    public static InterestRateStaticKey = 'InterestRates';
    public static INTEREST_RATE_CODES_MENU_NAME = 'interest_rate_codes';
    public static InterestRateExportTitle = 'Interest Rate';
    public static InterestRateCodeDefaultWidth = '';
    public static InterestRateCodeUpdatedWidth = 'col-md-8 col-lg-8';
    // public static ENABLED_KEY = 'enabled';

    /**
     * Interest Rate Code Confirmation popup title and message for Deleting
     */
    public static CONFIRMATION_POPUP_TITLE = 'Confirmation';
    public static IR_SINGLE_MSG = 'Are you sure, you want to delete the selected record ' + CyncConstants.SELECTED_RECORD_NAMES + ' ?';
    public static IR_MULTIPLE_MSG = 'Are you sure, you want to delete the selected records ' + CyncConstants.SELECTED_RECORD_NAMES + ' ?';
    public static InterestRates_SINGLE_MSG = 'Are you sure, you want to delete the selected record with date ' + CyncConstants.SELECTED_RECORD_NAMES + ' ?';
    public static InterestRates_MULTIPLE_MSG = 'Are you sure, you want to delete the selected records with date ' + CyncConstants.SELECTED_RECORD_NAMES + ' ?';

    /**
     * Deleted Records Success Message
     */
    public static DELETE_SUCCESS_MSG = 'Records Deleted Successfully';

    /**
     * Created Record Success Message
     */
    public static CREATE_SUCCESS_MSG = 'Record Created Successfully';

    /**
     * Updated Record Success Message
     */
    public static UPDATE_SUCCESS_MSG = 'Record Updated Successfully';

    /**
     * Menu Name that needs to be passed as query param
     * for menu specific api
     */
    public static INELIGIBILITY_REASONS_MENU_NAME = 'ineligibility_reasons';

    /**
     * Menu Name that needs to be passed as query param
     * for menu specific api
     */
    public static CLIENT_TRANSACTION_MENU_NAME = 'client_summary';

    /**
     * Event Types (On select of grid row or grid checkbox)
     */
    public static CHECKBOX_EVENT_TYPE = 'checkbox';
    public static ROW_EVENT_TYPE = 'row';

    /**
     * Export api query param
     */
    public static EXPORT_COLUMN_PARAM = 'cols[]=';
    public static EXPORT_ROW_PARAM = 'rows[]=';

    public static FINANCIAL_EXPORT_COLUMN_PARAM = 'cols=';
    public static FINANCIAL_EXPORT_ROW_PARAM = 'rows=';

    /**
     * Default Row Count For Interest Rate Codes
     */
    public static INTEREST_RATE_CODES_DEFAULT_ROW_COUNT = 1000;
    public static DEFAULT_ORDER_BY = 'updated_at';
    public static DEFAULT_SORT_BY = 'desc';


    /**
     * Default Edit Page/Manage Component html action button text
     */
    public static EDIT_PAGE_SAVE_BTN_TEXT = "Save";
    public static EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY = true;
    public static ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY = true;
    public static ADD_PAGE_SAVE_AND_NEW_BTN_DISABLE_PROPERTY = true;
    public static SAVE_AND_NEW_BTN_REQUIRED_PROPERTY = true;
    public static ADD_PAGE_SAVE_BTN_TEXT = "Save";
    public static SAVE_AND_GO_TO_NEXT_BTN_TEXT = "Next";

    public static ADD_PAGE_SAVE_AND_NEW_BTN_TEXT = "Save & New";
    public static ADD_PAGE_SAVE_AND_VIEW_BTN_TEXT = "Save & View";
    public static ADD_EDIT_PAGE_CANCEL_BTN_TEXT = "Cancel";
    public static ADD_EDIT_PAGE_BACK_BTN_TEXT = "Back";
    public static FORM_VALIDATION_WITH_LABEL_MSG_PROPERTY = true;
    public static SHOW_ON_SCROLL_DATA_LOADER_PROPERTY = true;

    public static CLIENT_SELECTION_MESSAGE = 'please select client !';
    public static SELECT_CLIENT_PLACEHOLDER = 'Select Client';
    public static GET_BORROWER_BY_ID = 'get_borrower_by_id';

    /**
     * DataTable id for checking html
     */
    public static DATA_TABLE_ID = 'main_contents';
    /**
     * Seasonal Advance Rate
     */
    public static GET_SEASONAL_ADVANCE_RATE_LIST = 'get_seasonal_advance_rate_list';
    public static DELETE_MULTIPLE_SEASONAL_ADVANCE_RATE_RECORDS = 'delete_multiple_seasonal_advance_rate_records';
    public static SEARCH_SEASONAL_ADVANCE_RATE = 'search_seasonal_advance_rate';
    public static ADD_SEASONAL_ADVANCE_RATE = 'add_seasonal_advance_rate';
    public static GET_OR_SEASONAL_ADVANCE_RATE = 'get_or_update_seasonal_advance_rate';
    public static EXPORT_SEASONAL_ADVANCE_RATE = 'export_seasonal_advance_rate';

    /**
     * Seasonal Advance Rate Menu Name
     * used in grid model type and grid model menu name
     */
    public static SEASONAL_ADVANCE_RATE = 'Seasonal Advance Rate';

    /**
     * Seasonal Advance Rate Grid Column Header Names
     */
    public static SEASONAL_ADVANCE_RATE_COLLATERAL_TYPE = 'Collateral Type';
    public static SEASONAL_ADVANCE_RATE_AS_OF_DATE = 'As of Date';
    public static SEASONAL_ADVANCE_RATE_SUB_LIMIT = 'Sub Limit';
    public static SEASONAL_ADVANCE_RATE_NOLV_VALUE = 'NOLV Value';
    public static SEASONAL_ADVANCE_RATE_ADVANCE_RATE = 'LTV / Advance';
    public static SEASONAL_ADVANCE_RATE_ADJUSTED_RATE = 'Adjusted Advance Rate';
    public static SEASONAL_ADVANCE_RATE_LOW_VALUE = 'Low Value';
    public static SEASONAL_ADVANCE_RATE_HIGH_VALUE = 'High Value';
    public static SEASONAL_ADVANCE_RATE_BASED_ON = 'Based On';
    public static SEASONAL_ADVANCE_RATE_CAL_CAP_BY = 'Cal. Cap By';
    public static SEASONAL_ADVANCE_RATE_MAX_CAP = 'Max Cap %';
    /**
     * Seasonal Advance Rate Response Keys
     */
    public static SEASONAL_ADVANCE_RATE_RESPONSE_KEY = 'seasonal_advance_rate';

    /**
     * Seasonal Advance Rate Menu Name that needs to be passed as query param
     * for menu specific api
     */
    public static SEASONAL_ADVANCE_RATE_MENU_NAME = 'seasonal_advance_rate';

    /**
     * Seasonal Advance Rate divisions list that needs to be passed as query param
     * for menu specific api
     */
    public static SEASONAL_ADVANCE_RATE_DIVISIONS_LIST = 'seasonal_advance_rate_division_list';
    public static SEASONAL_DIVISION_RESPONSE_KEY = 'divisionscode';

    /**
     * ------------------------------- Collateral Division Code -----------------------------
     */

    /**
     * Collateral Division
     */
    public static GET_COLLATERAL_DIVISION_LIST = 'get_collateral_division_list';
    public static DELETE_MULTIPLE_COLLATERAL_DIVISION_RECORDS = 'delete_multiple_collateral_division_records';
    public static SEARCH_COLLATERAL_DIVISION = 'search_collateral_division';
    public static ADD_COLLATERAL_DIVISION = 'add_collateral_division';
    public static GET_OR_UPDATE_COLLATERAL_DIVISION = 'get_or_update_collateral_division';
    public static EXPORT_COLLATERAL_DIVISION = 'export_collateral_division';

    /**
     * Collateral Division Name
     * used in grid model type and grid model menu name
     */
    public static COLLATERAL_DIVISION = 'Collateral Division';

    /**
     * Collateral Division Grid Column Header Names
     */
    public static COLLATERAL_DIVISION_NAME = 'Division';
    public static COLLATERAL_DIVISION_DESCRIPTION = 'Description';
    /**
     * Collateral Division Response Keys
     */
    public static COLLATERAL_DIVISION_RESPONSE_KEY = 'divisionscode';

    /**
     * Collateral Division Menu Name that needs to be passed as query param
     * for menu specific api
     */
    public static COLLATERAL_MENU_PERMISSION_NAME = 'collateral_advance_rate';

    /**
     * ------------------------------- Collateral Advance Rate Code -----------------------------
     */
    /**
     * Collateral Advance Rate
     */
    public static GET_COLLATERAL_ADVANCE_RATE_LIST = 'get_collateral_advance_rate_list';
    public static DELETE_MULTIPLE_COLLATERAL_ADVANCE_RATE_RECORDS = 'delete_multiple_collateral_advance_rate_records';
    public static SEARCH_COLLATERAL_ADVANCE_RATE = 'search_collateral_advance_rate';
    public static ADD_COLLATERAL_ADVANCE_RATE = 'add_collateral_advance_rate';
    public static GET_OR_UPDATE_COLLATERAL_ADVANCE_RATE = 'get_or_update_collateral_advance_rate';
    public static EXPORT_COLLATERAL_ADVANCE_RATE = 'export_collateral_advance_rate';

    /**
     * Collateral Advance Rate Menu Name
     * used in grid model type and grid model menu name
     */
    public static COLLATERAL_ADVANCE_RATE = 'Collateral Advance Rate';

    /**
     *Collateral Advance Rate Grid Column Header Names
     */
    public static COLLATERAL_ADVANCE_RATE_NAME = 'Division';
    public static COLLATERAL_ADVANCE_RATE_DESCRIPTION = 'Description';
    /**
     * Collateral Advance Rate Response Keys
     */
    public static COLLATERAL_ADVANCE_RATE_RESPONSE_KEY = 'collateral_advance_rates';
    /**
     * Collateral Advance Rate Redirect home page
     */
    public static COLLATERAL_ADVACNE_RATE_HOME_REDIRECT = 'collateral_advance_rate_home_page';

    /**
     * File Upload end points
     */
    public static GET_OTHER_FILE_UPLOADS = 'get_other_file_uploads';
    public static OTHER_FILE_UPLOAD_TYPE = 'Upload Other Required Documents';
    public static AUTO_FILE_UPLOAD_TYPE = 'ABL Auto File Upload';
    public static DELETE_AUTO_FILE_UPLOAD = 'delete_auto_file_upload';
    public static UPLOAD_OTHER_REQUIRED_FILES = 'upload_other_required_files';
    public static REPROCESS_COLLATERAL_FROM = 'reprocess_collateral_from';
    public static UPLOADS_PREVIEW = 'uploads_preview';


    /*   
     * File Upload end points
     */
    public static GET_ROLLFORWARD_LOGS = 'get_rollforward_logs';
    public static CREATE_ROLLFORWARD_LOGS = 'create_rollforward_logs';
    public static GET_DIVISION_DATA = 'get_division_data';
    public static GET_COLLATERAL_DATA = 'get_collateral_data';
    public static UPDATE_ROLLFORWARD_DATA = 'update_rollforward_data';

    public static DELETE_ROLLFORWARD_DATA = 'delete_rollforward_data';

    public static ROLLFORWARD_INQUIRY = 'rollforwardi-inquiry';

    public static SELECT_ACTIVITY_DATE_VALIDATION_ERROR_MESSAGE = 'To Activity Date should be greater than From Activity Date!';

     /**
      * End points for inventory rollforward 
      */
    public static GET_INVENTORY_ROLLFORWARD_DIVISION_LIST = 'get_inventory_rollforward_division_list';
    public static GET_INVENTORY_ROLLFORWARD_PRODUCT_GROUP_NAME = 'get_inventory_rollforward_product_group_name';
    public static GET_INVENTORY_ROLLFORWARDS='get_inventory_rollforwards';
    public static GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA = 'get_inventory_rollforward_collateral_data';
    public static GET_INVENTORY_ROLLFORWARD_COLLATERAL_DATA_BASED_ON_DIVISION_ID = 'get_inventory_rollforward_collateral_data_based_on_division_id';
    public static GET_INVENTORY_ROLLFORWARD_WITH_DIVISION_ID = 'get_inventory_rollforwards_with_division_id';
    public static GET_INVENTORY_ROLLFORWARD_WITH_DIVISION_ID_COLLATERAL_ID = 'get_inventory_rollforwards_with_division_id_collateral_id';
    public static GET_INVENTORY_ROLLFORWARD_WITH_DIVISION_ID_COLLATERAL_ID_PRODUCT_GROUP_ID = 'get_inventory_rollforwards_with_division_id_collateral_id_product_id';
    public static GET_INVENTORY_ROLLFORWARD_LOG_DATA = 'get_inventory_rollforwards_log_data';
    public static CREATE_INVENTORY_ROLLfORWARD_LOG = 'create_inventory_roll_forward';
    public static GET_COLLATERAL_BASED_PRODUCT_GROUP = 'get_product_group_based_on_collateral_id';
    public static UPDATE_INVENTORY_ROLLFORWARD_LOG_DATA = 'update_inventory_rollforward_log_data';
    public static DELETE_INVENTORY_ROLLFORWARD_LOG_DATA = 'delete_inventory_rollforward_log_data';
   
    /**
    * Advance search end points
    */
    public static GET_COLUMNS = 'get_columns';
    public static GET_OPERATORS = 'get_operators';
    public static GET_DROPDOWN_VALUES = 'get_dropdown_values';
    public static GET_SEARCH_DATA = 'get_advance_search_data';
    public static GET_SEARCH_DATA_INTEREST_RATE_CODE = 'get_advance_search_data_for_interest_rate_code';

    /**
     * Transfer client to UDF starts
     */
    public static TRANSFER_CLIENT_FROM_HEADING = 'Transfer Clients From';
    public static TRANSFER_CLIENT_TO_HEADING = 'Transfer Clients To';
    public static GET_TRANSFER_CLIENT_UDF_LIST = 'get_transfer_client_udf_list';
    public static GET_TRANSFER_CLIENT_UDF_VALUES_LIST = 'get_transfer_client_udf_values_list';
    public static GET_TRANSFER_UDF_CLIENT_DETAILS = 'get_transfer_udf_client_details';
    public static UPDATE_TRANSFER_UDF_CLIENT_DETAILS = 'update_transfer_udf_client_details';
    public static TRANSFER_CLIENTS_POP_UP_MESSAGE = 'Transferring Client(s) will link them with a new level and all levels associated. Would you like to proceed?';
    public static TRANSFER_CLIENTS_UPDATE_SUCCESS_MSG = 'Clients Tranferred Successfully';
    public static TRANSFER_CLIENTS_UDF_FROM_STRING = 'from';
    public static TRANSFER_CLIENTS_UDF_To_STRING = 'to';

    /**
     * Transfer client to UDF end
     */
    public static UDF_DEFINITION_MENU_NAME = 'udf_definition';
    public static UDF_MAPPING_MENU_NAME = 'udf_mapping';
    public static UDF_TRANSFER_MENU_NAME = 'transfer_clients_to_udf';
    /**
     * for ABL File upload
     */
    public static GET_UPLOAD_BBC_DATA_FILES = 'get_upload_bbc_data_files';
    public static GET_AUTO_FILE_UPLOAD = 'get_auto_file_upload';
    public static GET_DATA_REVIEW_ON_ROW_EXPAND = 'get_data_review_on_row_expand';
    public static GET_BORROWER_DIVISIONS_DROPDOWN = "get_borrower_divisions_dropdown";
    public static UNDO_DATA_REVIEW_UPLOADED_FILE = 'undo_data_review_uploaded_file';
    public static UPLOAD_BBC_DATA_FILES = 'upload_bbc_data_files';


    /**
     * UDF Definition API Endpoints starts
     */
    public static GET_UDF_DEFINITION_LIST = 'get_udf_definition_list';
    public static GET_OR_UPDATE_UDF_DEFINITION = 'get_or_update_udf_definition';
    public static ADD_UDF_DEFINITION = 'add_udf_definition';
    public static DELETE_UDF_DEFINITION = 'delete_udf_definition';
    public static EXPORT_UDF_DEFINITION = 'export_udf_definition';
    public static GET_FIELD_TYPE_LIST = 'get_field_type_list';
    public static GET_NUMERIC_VALIDATION_TYPE = 'get_numeric_validation_type';
    public static GET_ALPHANUMERIC_VALIDATION_TYPE = 'get_alphanumeric_validation_type';
    /**
     * UDF Definition API Endpoints ends
     */

    /**
     * UDF Definition Grid Type
     */
    public static UDF_DEFINITION_SUMMARY = 'UDF Definition - Summary';

    /**
     * UDF Definition Grid Column Names
     */
    public static UDF_NAME = 'UDF Name';
    public static UDF_DESCRIPTION = 'Description';
    public static UDF_FIELD_TYPE = 'Field Type';
    public static UDF_VALIDATION_TYPE = 'Validation Type';
    public static UDF_STATUS = 'Status';

    /**
     * UDF Definition Listing API, Response Key
     */
    public static UDF_DEFINITION_LIST_RESPONSE_KEY = 'udfs';

    /**
     * Active and Inactive Labels
     */
    public static INACTIVE = 'InActive';
    public static ACTIVE = 'Active';

    /**
     * Field Type (Numeric and AlphaNumeric) and
     * Validation Type (Range, Length, LOV, None)
     * constants
     */
    public static NUMERIC = 'N';
    public static ALPHA_NUMERIC = 'AN';
    public static RANGE = 'R';
    public static LENGTH = 'L';
    public static LOV = 'LOV';
    public static NONE = 'N';



    /**
     * Menu Name that needs to be passed as query param
     * for menu specific api
     */
    public static ABL_FILE_UPLOAD_MENU_NAME = 'abl_file_uploads_documents';
    public static OTHER_REQUIRED_FILE = 'upload_abl_required_documents';
    public static AUTO_FILE_UPLOAD = 'auto_file_uploads_list_view';

    /**
     * File upload radio button bindings value
     */
    public static ABL_FILE_UPLOAD_VALUE = 'upload bbc data files';
    public static OTHER_REQUIRED_DOC_VALUE = 'upload other required documents';
    public static AUTO_FILE_UPLOAD_VALUE = 'abl auto file upload';

    public static UDF_FIELD_VALIDATION_TYPE_LOV = 'LOV';
    public static RANGE_VALIDATION_TYPE = 'R';
    public static LENGTH_VALIDATION_TYPE = 'L';

    // Menu Name for ABL file upload
    public static CASH_RECEIPT = 'Cash Receipts';
    public static RECEIVABLE_SUMMARY = 'Summary Receivables';
    public static RECEIVABLE_DETAIL = 'Detail Receivables';
    public static PAYABLE_SUMMARY = 'Summary Payables';
    public static PAYABLE_DETAIL = 'Detail Payables';
    public static ASSET_ROUTE = 'Assets / Inventory';
    public static VENDOR_ROUTE = 'Vendors';
    public static CUSTOMER_ROUTE = 'Debtors';

    // Data Type constants for file upload
    public static CASHRECEIPT = 'CashReceipt';
    public static RECEIVABLESUMMARY = 'ReceivableSummary';
    public static ASSET = 'Asset';
    public static PAYABLESUMMARY = 'PayableSummary';
    public static RECEIVABLE = 'Receivable';
    public static PAYABLE = 'Payable';
    public static VENDOR = 'Vendor';
    public static CUSTOMER = 'Customer';
    public static BORROWERRECEIVABLE = 'BorrowerReceivable';

    public static MAPPING_LIST_VIEW = 'Mapping List View';

    /**
     * IP Address Setup API Endpoints starts
     */
    public static GET_IP_ADDRESS_SETUP_LIST = 'get_ip_address_setup_list';
    public static GET_OR_UPDATE_IP_ADDRESS_SETUP = 'get_or_update_ip_address_setup';
    public static ADD_IP_ADDRESS_SETUP = 'add_ip_address_setup';
    public static DELETE_IP_ADDRESS_SETUP = 'delete_ip_address_setup';
    public static EXPORT_IP_ADDRESS_SETUP = 'export_ip_address_setup';
    public static GET_IP_TYPE_LIST = 'get_ip_type_list';

    /**
    * IP Address Setup API Endpoints ends
    */

    /**
    * IP Address Setup Grid Type
    */
    public static IP_ADDRESS_SETUP_SUMMARY = 'IP Address Setup - Summary';

    /**
     * IP Address Setup Grid Column Names
     */
    public static IP_ADDR_NAME = 'Name';
    public static IP_ADDR_DESCRIPTION = 'Description';
    public static IP_ADDR_IP_TYPE = 'IP Type';
    public static IP_ADDR_STATUS = 'Status';

    /**
     * UDF Definition Listing API, Response Key
     */
    public static IP_ADDRESS_SETUP_LIST_RESPONSE_KEY = 'ip_whitelists';

    /**
     * Menu Name that needs to be passed as query param
     * for menu specific api (IP ADDRESS SETUP)
     */
    public static IP_ADDR_SETUP_MENU_NAME = 'ip_address_setup';

    // One of the IP Type in the IPType dropdown list (MANAGE IP ADDRESS SETUP)
    public static FIXED = 'F';
    public static HEADER_FIXED = 'Fixed';
    public static HEADER_RANGE = 'Range';
    public static FINANCE_HOST = 'finance';
    public static CASH_HOST = 'CASH_APP';
    public static ABL_HOST = 'ABL';
    public static MCL_HOST = 'MCL';
    public static FACTORING_HOST = 'factoring';
    public static WEBHOOK_HOST = 'webhook';

    /**
    * Broker commission
    */
    public static BROKER_COMMISSION_DETAILS = 'broker_commission_details';
    public static RESET_BROKER_COMMISSION_DASHBOARD = 'reset-broker_commission_dashboard';
    public static BROKER_COMMISSION_INVOICE_DETAILS = 'broker_commission_invoice_details';
    public static PAYABLE_INVOICES_ADD_TO_BROKER_COMMISSION = 'payable _invoices_add_to_broker_commission';
    public static CHECK_BROKERS = 'check_brokers';
    public static GET_ALL_BROKERS = 'get_all_brokers';
    public static RELEASE_BROKER_COMISSION = 'release_broker_commission';
    public static PRINT_RELEASED_INVOICES_REPORT = 'print_released_invoices_report';
    public static EXPORT_EXCEL_ERROR_MESSAGE = 'Please select some columns to export excel file';
    public static INVOICE_NOT_SELECTED_WARNING_MESSAGE = 'Please select atleast one invoice in order to proceed';
    public static CLOSE_BUTTON_WARNING_MESSAGE = 'The changes made have not been saved. Do you wish to discard these changes and close the window?';
    public static RELEASE_COMMISSION_WARNING_MESSAGE = 'Please select atleast one Broker in order to proceed';
    public static GET_FUNDED_EMPLOYED = 'get_funds_employed';
    /**
    * factoring fee setup
    */
   public static FACTORING_FEE_SETUP_ID = 'factoring_fee_setup_id';
   public static FACTORING_FFEE_SETUP_UPDATE_PARAMETERS = 'factoring_fee_setup_update_parameters';
   public static FEE_SETUP_FEE_NAMES = 'fee_setup-fee_names';
   public static ADD_NEW_FEE = 'add_new_fee';
   public static GET_SELECTED_FEE_NAME_DATA = 'get_selected_fee_name_data';
   public static GET_HISTORY_TABLE_DATA= 'get_history_table_data';
   /**
    * Financial Statements start
    */
    public static FINANCIAL_STATEMENTS_SETUP_HOME_PAGE_REDIRECT_URL = 'financial_statements_setup_home_redirect';
    public static FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL = 'financial_statements_balance_sheet_redirect';
    public static FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL = 'financial_statements_income_statement_redirect';
    public static FINANCIAL_STATEMENTS_CASH_FLOW_PAGE_REDIRECT_URL = 'financial_statements_cash_flow_redirect';
    public static FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL = 'financial_statements_summary_page_redirect';
    public static FINANCIAL_ANALYZER_REDIRECT_URL = 'financial_analyzer_redirect_url';
    public static GET_FINANCIAL_STATEMENT_PROJECT_DATA = 'get_financial_statement_project_data';
    public static SAVE_FINANCIAL_STATEMENT_PROJECT_DATA = 'save_financial_statement_project_data';
    public static UPDATE_FINANCIAL_STATEMENT_PROJECT_DATA = 'update_financial_statement_project_data';
    public static GET_FINANCIAL_SUMMARY_DATA = 'get_financial_summay_data';
    public static FINANCIAL_STATEMENT_BALANCE_SHEET_SAVE_SUCCESS_MSG = 'Balance Sheet Saved Successfully';
    public static FINANCIAL_STATEMENT_BALANCE_SHEET_UPDATE_SUCCESS_MSG = 'Balance Sheet Updated Successfully';
    public static FINANCIAL_STATEMENT_INCOME_STMT_SAVE_SUCCESS_MSG = 'Income Statement Saved Successfully';
    public static FINANCIAL_STATEMENT_INCOME_STMT_UPDATE_SUCCESS_MSG = 'Income Statement Updated Successfully';

    public static FINANCIAL_STATEMENT_CASH_FLOW_SAVE_SUCCESS_MSG = 'Cash Flow Saved Successfully';
    public static FINANCIAL_STATEMENT_CASH_FLOW_UPDATE_SUCCESS_MSG = 'Cash Flow Updated Successfully';

    public static FINANCIAL_STATEMENT_BALANCE_SHEET_ERROR_VALIDATION_MSG = 'Please complete balance sheet setup';
    public static FINANCIAL_STATEMENT_DOWNLOAD_TEMPLATE_URL = 'financial_statement_download_template_url';
    public static FINANCIAL_STATEMENT_LIST_PARAMETERS = 'listParameters';
    public static FINANCEIAL_RATIO_REPORT_GRAPH = 'get_financial_ratio_report';
    public static EXPORT_FINANCIAL_SUMMARY_DATA = 'export_financial_summay_data';
    public static EXPORT_FOLDER_FINANCIAL_SUMMARY_DATA = 'export_folder_financial_summay_data';
    public static FINANCEIAL_HIGHLIGHTS_API = 'get_financial_highlights';
    public static FINANCIAL_FILE_UPLOAD_URL = 'financial_statement_file_upload_url';
    public static GET_PROJECT_DETAILS = 'get_project_details';
    public static CUSTOM_FINANCIAL_RATIO_CREATE = 'create_new_ratio_formula';
    public static CUSTOM_FINANCIAL_RATIO_UPDATE = 'updateCustomFormulas';
    public static GET_CUSTOM_FINANCIAL_RATIOS = 'custom_formulas';
    public static DELETE_CUSTOM_FINANCIAL_RATIOS = 'delete_custom_formulas';
    public static GET_CUSTOM_FINANCIAL_RATIOS_BY_ID = 'custom_formulas_by_id';
    public static RATIOS_LIST_CATEGORIES = 'get_ratio_categories';
    public static DRAFT_FINANCE_STMT = 'draftFinanceProject';
    public static DRAFT_RATIOS = 'draftRatios';

    /**
    * Financial Statements end
    */

    /** currency code api admin module constants  */
    public static LIST_CURRENCY_CODES = 'list_currency_codes';
    public static GET_CURRENCY_CODE_DETAILS = 'get_currency_code_details';
    public static UPDATE_CURRENCY_CODE = 'update_curreny_code';

    public static RECALCULATE_EXCHANGE_RATE = 'recalculate_exchange_rate';


    /**
     * The following are the message sets for Error Handler especially for the popup
     */

    public static NETWORK_ERROR_TITLE = 'Something Went Wrong!';
    public static NETWORK_ERROR_MESSAGE = 'Please check your internet connection and try again.';

    public static SERVER_SIDE_ERROR_TITLE = 'Something went wrong!';
    public static SERVER_SIDE_ERROR_MESSAGE = 'We\'re sorry. We\'re having some trouble completing your request. Please try again.';

    public static ERROR_IN_PROCESSING_REUEST = 'There was an error while processing your request. Please check your formula and try again ';


    /**
     * System parameter page display api
     */
    public static PAGE_DISPLAY_COUNT = 'page_display_count';



    //File Name for Report Template
    public static LENDER_DETAILS = 'lender';
    public static UPDATE_REPORT_LENDER_DETAILS = 'report_templates/update_lender';


    //UDF response limit
    public static UDF_RESPONSE_LIMIT = '100';

    //Upload BBC Data file redirect back url
    public static BBC_DATA_FILE_BACK_URL = '/angular/#/uploads/upload-bbc-data-files';

    /**
  * Previous url set string for financial statements
  */
    public static setRowDataCreditQueue(name: string) {
        this.creditQueueRowData = name;
    }

    /**
    * Previous url get string for financial statements
    */
    public static getRowDataCreditQueue(): string {
        return this.creditQueueRowData;
    }

    /**
    * Term code variable declaration
    */
    static termCodeRowData: any;

    /**
    * Get term code row data
    */
    public static getTermCodeRowData(): any {
        return this.termCodeRowData;
    }

    /**
    * Set term code row data
    * @param data
    */
    public static setTermCodeRowData(data: any) {
        this.termCodeRowData = data;
    }


    /**
    * Term Codes API URLS
    */
    public static TERM_CODES_LIST = 'term_codes_list';
    public static GET_TERM_CODES_DATA_BY_ID = 'get_term_codes_data_by_id';
    public static ADD_TERM_CODES = 'add_term_codes';
    public static UPDATE_TERM_CODES = 'update_term_codes';
    public static DELETE_TERM_CODES = 'delete_term_codes';
    public static TERM_CODES_REDIRECT_URL = 'term_codes_redirect_url';
    public static DELETE_RECORDS_POPUP_MESSAGE = 'Are you sure you want to delete ';
    public static CANCEL_BUTTON_POPUP_MESSAGE = 'Are you sure you want to cancel?';

    /**
    * Letter Processing API URLS
    */
    public static LETTER_PROCESSING_LIST = 'letter_processing_list';

    /**
    * automatic mail variable declaration
    */
    static automaticMail: any;

    /**
    * Get getAutomaticMailValue
    */
    public static getAutomaticMailValue(): any {
        return this.automaticMail;
    }

    /**
    * Set AutomaticMailValue
    * @param data
    */
    public static setAutomaticMailValue(data: any) {
        this.automaticMail = data;
    }

    /**
    * Multi Factor auth value
    */
    public static multiFactorAuth: boolean;

    /**
    * Set Multi Factor Auth value
    * @param multiFactorAuth
    */
    public static setMultiFactorAuth(multiFactorAuth: boolean) {
        this.multiFactorAuth = multiFactorAuth;
    }

    /**
    * Get Multi Factor Auth value
    */
    public static getMultiFactorAuth(): boolean {
        return this.multiFactorAuth;
    }

    /**
    * broker inquiry API URLS
    */
    public static BROKER_INQUIRY_LIST = 'broker_inquiry_list';

    /**
     * division list with id
     */
    public static GET_DIVISION_LIST = 'get_division_list';

    /** division list with id null*/

    public static DIVISION_LIST_WITH_ID_NULL = 'division_list_with_id_null';

    /** grid data with collateral id null and division id not null */

    public static DIVISION_LIST_WITH_ID = 'division_list_with_id';

    /** get division list with collateral list */

    public static DIVISION_LIST_WITH_COLLATERAL_LIST = 'division_list_with_collateral_list';

    /**get data based on callteral list id */

    public static DIVISION_LIST_WITH_COLLATERAL_LIST_ID = 'division_list_with_collateral_list_id';

    /**
     * bbc recalculation
     */
    public static BBC_RECALCULATION = 'bbc_recalculation';

    /** process bbc warning popup message */

    public static PROCESS_BBC_WARNING_MESSAGE = 'BBC Process Pending : Cash Posted or New Files Uploaded, Do You Want to Process BBC?';

    /**
    *  Client Template Statements start
    */
    public static DELETE_TEMPLATE_CONFIRMATION = 'Do you want to delete selected template(s)?';

    /**
    *  Client Template roles and permission
    */
    public static GET_USER_INFO = 'get_user_info';
    public static CLIENT_TEMPLATE_ROLES_AND_PERMISSION = 'client_template_roles_and_permission';

    /**
     * BUCKET AGING API URL'S
     * 
     */
    public static BUCKET_AGING_LIST = 'bucket_aging_list';

    /** delete ar bucket aging */
    public static DELETE_AR_BUCKET_AGING = 'delete_ar_bucket_aging';

    /** delete ap bucket aging */
    public static DELETE_AP_BUCKET_AGING = 'delete_ap_bucket_aging';

    /** save bucket aging data */
    public static SAVE_BUCKET_AGING_DATA = 'save_bucket_aging_data';

    /**
    * Loan Activity Loan Enquiry 
    */
    public static GET_LOAN_ACTIVITY_LOAN_ENQUIRY_LIST = 'get_loan_activity_loan_enquiry_list';
    public static GET_CHECK_IMAGES_URL = 'get_check_images_url';
    public static GET_LOAN_ENQUIRY_STREAM_DATA_URL = 'get_loan_enquiry_stream_data_url';

    /**
    * Loan Activity Loan summary 
    */
    public static GET_LOAN_SUMMARY_LIST = 'get_loan_summary_list';
    public static GET_LOAN_SUMMARY_DOCUMENT_URL = 'get_loan_summary_document_url';

    public static SELECT_DATE_SEARCH_ERROR_MESSAGE = 'Please select date to search Loan Inquiry data';
    public static SELECT_DATE_VALIDATION_ERROR_MESSAGE = 'To Effective Date should be greater than From Effective Date!';

    public static GRID_CONFIG_API_URL = 'grid_config_api_url';


    /**
    * Participation Loans
    */
     public static GET_LOAN_MAPPING_CATEGORIES = 'get_loan_mapping_categories';
     public static GET_MAPPED_UNMAPPED_LOANS = 'get_mapped_unmapped_loans';
     public static MAP_LOAN_WITH_CATEGORY = 'map_loan_with_category';

    
    /**
     * cash control api
     */
    public static GET_CASH_CONTROL_LIST = 'get_cash_control_list';
    public static ADD_CASH_CONTROL_LIST = 'add_cash_control_list';
    public static UPDATE_CASH_CONTROL_LIST = 'update_cash_control_list';
    public static DELETE_CASH_CONTROL_LIST = 'delete_cash_control_list';

    /**
     * create new page apis
     */
    public static GET_LOAN_TYPE_DROPDOWN_LIST = 'get_loan_type_dropdown_list';
    public static GET_INTEREST_RATE_DROPDOWN_LIST = 'get_interest_rate_dropdown_list';
    public static SAVE_NON_ABL_LOAN = 'save_non_abl_loan';

    /**
     * interest detail apis
     */
    public static GET_INTEREST_DETAIL_ABL_GRID_DATA = 'get_interest_detail_abl_grid_data';
    public static GET_INTEREST_DETAIL_ABL_TABLE_DATA = 'get_interest_detail_abl_table_data';
    public static GET_INTEREST_DETAIL_MCL_GRID_DATA = 'get_interest_detail_mcl_grid_data';
    public static GET_INTEREST_DETAIL_MCL_TABLE_DATA = 'get_interest_detail_mcl_table_data';

    /**
     * delete interest detail
     */
    public static DETAIL_INTEREST_DETAIL_ABL_DATA = 'detail_interest_detail_abl_data';
    public static DETAIL_INTEREST_DETAIL_MCL_DATA = 'detail_interest_detail_mcl_data';

    /**
     * loan set up landing page api
     */
    public static UPDATE_ABL_LOAN = 'update_abl_loan';
    public static UPDATE_MCL_LOAN = 'update_mcl_loan';

    /** fetch loan set up data if loan id is of type abl **/
    public static FETCH_LOAN_SETUP_ABL_ID_DATA = 'fetch_loan_setup_abl_id_data';

     /** fetch loan set up data if loan id is of type mcl **/
     public static FETCH_LOAN_SETUP_MCL_ID_DATA = 'fetch_loan_setup_mcl_id_data';

}