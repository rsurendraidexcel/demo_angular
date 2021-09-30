/**
 * This class will have all the message that we are showing on UI
 * its only for client side valdiation
 */
export class ClientValidationMessages {
    public static UPLOAD_BBC_DATA_FILES_BBC_DATE_REQUIRED = 'Please select bbc date before processing !';
    public static UPLOAD_BBC_DATA_FILES_BBC_SUPPORTED_FILE = ' - Unsupported File. Please check the mapping and upload AR Detail data';
    public static UPLOAD_BBC_DATA_FILES_ONLY_UPLOAD_IMAGE_NOT_REQUIRED = 'Please upload file as only uploading image is not possible ';
    public static UPLOAD_BBC_DATA_APPEND_OVERRIDE = 'Files are already uploaded for the following collaterals. Do you want to Append or Overwrite?';
    public static UNDO_DATA_BASED_ON_ROW_CLICKED = 'File has been deleted successfully';
    public static EXPAND_ROW_USER_PERMISSION = 'You are not allowed to access this resource';
    public static SAVE_UDF_MAPPING = 'UDF Mapping saved successfully';
    public static UPDATE_UDF_MAPPING = 'UDF Mapping updated successfully';
    public static DELETE_UDF_MAPPINGS = 'Are you sure, you want to delete UDFs mapped to programs ';
    public static EXCHANGE_RATE_VALIDATION_MSG = 'The file being uploaded contains collateral that needs to be converted to USD. Please enter exchange rates.';
    public static USER_NOT_ALLOWED = 'User is not allowed to view this page';
    public static EXCHANGE_RATE_SUCCESS = 'Exchange Rate Value Successfully pushed to the queue.';
    public static REPROCESS_COLLATERAL_NAME = 'Re Apply Collateral Successfully pushed to the queue.';
    public static UDF_MAPPING_PROGRESS_MESSAGE = 'UDF Mapping is under process';
}