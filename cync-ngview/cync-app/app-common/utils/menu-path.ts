/**
 * This class is used to store the angular menu paths
 */
export class MenuPaths {

    public static BASIC_PARAMETERS = "Basic Parameters";
    public static ADVANCE_RATE = "Advance Rate";
    public static BUCKET_AGEING = "Bucket Ageing";
    public static OTHER_PREFERENCES = "Other Preferences";
    public static COLLATERAL_RESERVES = "Collateral Reserves";
    public static ASSET_AMORTIZATION = "Asset Amortization";
    public static CLIENT_DETAILS = "Client Details";
    public static CLIENT_MAPPING = "Client Mapping";
    public static CLIENT_TRANSACTION_SUMMARY = "Client Transaction Summary";
    public static UPLOAD_REQUIRED_DOCUMENTS = "Upload Required Documents";
    public static ABL_AUTO_FILE_UPLOADS = "ABL Auto File Uploads";
    public static BBC_HISTORICAL_DATA_PROCESS = "BBC Historical Data Process";
    public static FILE_CLASSIFICATIONS = "File Classifications";
    public static CLIENT_LOAN_GUARANTORS = "Guarantors";
    public static EXCEPTION = "Exception";


    //Menu path map having keys as menu names and value as angular path
    //This can be removed once response is sent from menu apis in the same order
    public static MENU_PATH_MAP = new Map([
        [MenuPaths.CLIENT_DETAILS, "/#/abl-client-maintenance/client-creation"],
        [MenuPaths.CLIENT_MAPPING, "/#/abl-client-maintenance/client-mapping"],
        [MenuPaths.CLIENT_TRANSACTION_SUMMARY, "/#/abl-client-maintenance/client-transaction"],
        [MenuPaths.BASIC_PARAMETERS , "/#/bbc-preference-setup/basic-parameters"],
        [MenuPaths.ADVANCE_RATE, "/#/bbc-preference-setup/advance-rate/collateral-advance-rate"],
        [MenuPaths.BUCKET_AGEING, "/#/bbc-preference-setup/bucket-ageing/ar-bucket-ageing"],
        [MenuPaths.OTHER_PREFERENCES, "/#/bbc-preference-setup/other-preferences/activity-tickler"],
        [MenuPaths.COLLATERAL_RESERVES, "/#/bbc-preference-setup/collateral-reserves"],
        [MenuPaths.ASSET_AMORTIZATION, "/#/bbc-preference-setup/asset-amortization"],
        [MenuPaths.ABL_AUTO_FILE_UPLOADS, "/#/uploads/abl-auto-file-uploads"],
        [MenuPaths.FILE_CLASSIFICATIONS, "/#/otherGeneralCodes/file-classifications"],
        [MenuPaths.CLIENT_LOAN_GUARANTORS, "/#/otherGeneralCodes/client-loan-terms/guarantors"],
        [MenuPaths.EXCEPTION , "/#/otherGeneralCodes/lender_exceptions"],

    ]);


    // Using this path in chargecodes component to navigate back to listing screen
    public static CHARGE_CODES_PATH = 'otherGeneralCodes/charge-codes';
    public static LOAN_TYPE_PATH = 'otherGeneralCodes/loan-type';

        // Using this path in add project component to navigate back to listing screen
        public static LIST_FINANCE_ANALYZER_PATH = 'financial/financial-analyzer';
        public static LIST_FINANCE_RATIO_PATH = 'financial/financial-ratio';
        public static LIST_FINANCE_STATMENTS_PATH = 'financial/financial-statements';
        public static LIST_FINANCE_STATMENTS_PATH_WITH_SUMMAY = 'financial/financial-statements/summary';

        public static LIST_FINANCE_STATMENTS_PATH_WITH_BALANCESHEET = 'financial/financial-statements/balancesheet';
        public static LIST_FINANCE_STATMENTS_PATH_WITH_INCOME = 'financial/financial-statements/income';
        public static LIST_FINANCE_STATMENTS_PATH_WITH_CASHFLOW = 'financial/financial-statements/cashflow';

        public static  LIST_FINANCE_STATMENTS_PATH_WITH_HIGHLIGHT='financial/financial-highlights';
    /**
     *  Ineligibility Reason Summary page Path
     */
    public static INELIGIBILITY_REASON_PATH = 'otherGeneralCodes/ineligibility-reasons';

    /**
     * Udf Definition Summary page path
     */
    public static UDF_DEFINITION_PATH = 'udf/udf-definition';

    public static IP_ADDRESS_SETUP_PATH = 'lenderDetails/ip-address-setup';


    //Menus having radio buttons with key as parent path and rest as child paths
    //This needs to be retained even when response from menu apis is returned in the required order
    public static MENU_PATH_WITH_RADIO_BUTTONS = new Map([
        ["/notificationCenter/global-setting", ["/notificationCenter/role-setting","/notificationCenter/user-setting"]],
        ["/bbc-preference-setup/other-preferences/activity-tickler", ["/bbc-preference-setup/other-preferences/comments","/bbc-preference-setup/other-preferences/report-comments","/bbc-preference-setup/other-preferences/exceptions"]],
        ["/bbc-preference-setup/advance-rate/collateral-advance-rate", ["/bbc-preference-setup/advance-rate/list-seasonal-advance-rate"]],
        ["/bbc-preference-setup/bucket-ageing/ar-bucket-ageing", ["/bbc-preference-setup/bucket-ageing/ap-bucket-ageing"]],
        ["/client-maintenance/client-loan-terms", ["/client-maintenance/client-loan-terms/guarantors","/client-maintenance/client-loan-terms/borrower-guarantors","/client-maintenance/client-loan-terms/third-party-guarantors","/client-maintenance/client-loan-terms/insurance-policies","/client-maintenance/client-loan-terms/personal-guarantors","/client-maintenance/client-loan-terms/loan-fees","/client-maintenance/client-loan-terms/ineligible-advances"]],
        ["/uploads", ["/uploads/upload-bbc-data-files","/uploads/upload-other-required-documents","/uploads/abl-auto-file-uploads"]],
        ["/udf", ["/udf/udf-definition","/udf/udf-mapping","/udf/transfer-client-to-udf"]],
        ["/financial/financial-analyzer", ["/financial/financial-statements","/financial/financial-ratio","/financial/financial-highlights"]]
    ]);

    public static CLIENT_REQUIRED_MENU_PATHS = ['/uploads','/financial/financial-analyzer'];


}