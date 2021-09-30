import { Injectable } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Injectable()
export class APIMapper {
    endpoints: any;
    searchAPIs: any;
    routerPath: any;

    constructor() {
        this.exportEndpoints();
        this.exportSearchAPIs();
    }
    exportEndpoints() {
        this.endpoints = {
            "User List": "admin/users",
            "get_user_details": "admin/users/",
            "get_roles": "roles",
            "sales_region": "general_codes/sales_regions",
            "get_borrowers": "borrowers",
            'get_borrower_by_id': 'borrowers/{borrower_id}',
            "get_all_users": "admin/users",
            "send_activiation_email": "admin/users",
            "new_user_extends_login": "extended_logins",
            "add_new_user": "admin/users",
            "update_user_details": "admin/users",
            "get_ar_bucket_ageing": "borrowers/{clientId}/bucket_ageings",
            "get_ap_bucket_ageing": "borrowers/{clientId}/payable_bucket_agings",
            "get_client_loan_guarantors": "borrowers/{clientId}/guarantors?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}",
            "update_client_loan_guarantors": "borrowers/{clientId}/guarantors",
            "get_client_loan_third_party_guarantors": "borrowers/{clientId}/third_party_guarantors?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}",
            "update_client_loan_third_party_guarantors": "borrowers/{clientId}/third_party_guarantors",
            "get_client_loan_insuranec_policies": "borrowers/{clientId}/insurance_policies?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}",
            "update_client_loan_insurance_policies": "borrowers/{clientId}/insurance_policies",
            "get_client_borrower_guarantors": "borrowers/{clientId}/guarantor_borrowers?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}",
            "update_client_borrower_guarantors": "borrowers/{clientId}/guarantor_borrowers",
            "get_client_loan_personal_guarantors": "borrowers/{clientId}/personal_guarantors?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}",
            "update_client_loan_personal_guarantors": "borrowers/{clientId}/personal_guarantors",
            "get_borrower_details": 'borrowers/{selectedClientId}',
            'get_client_bbc_options': 'borrowers/{selectedClientId}/borrower_bbc_options',
            'get_borrower_basic_parameters': 'borrowers/{selectedClientId}/parameter',
            "unassigned_clients": "borrowers/get_unassigned_borrowers_list",
            "managers": "borrowers/get_managers_list",
            "map_clients_to_managers": "borrowers/assign_borrowers_to_managers",
            "seasonal_advance_rate_list": "borrowers/{id}/seasonal_advance_rates",
            "division": "borrowers/{id}/division_codes",
            "seasonal_advance_rate_list_division": "borrowers/{id}/seasonal_advance_rates?division_code_id={division_id}",
            "menus": "menus?borrower_id={borrower_id}",
            "current_state": "current_session_state",
            "get_ineligible_advances": "borrowers/{clientId}/ineligible_advances",
            "get_loan_fees": "borrowers/{clientId}/loan_terms",
            "get_scroll_ineligible_advances": "borrowers/{clientId}/ineligible_advances?page={page_no}&rows={rows}",
            "get_factoring_interest_setup":"borrowers/{clientId}/ineligible_advances",
            "get_funds_employed":"borrowers/{clientId}/loan_activities",
           // "get_funds_employed":"borrowers/{clientId}/loan_activities/?page={page_no}&rows={rows_no}",

            
            /**
             * Colleteral Loan preference setup api end points
             */
            "get_rate_adjustmenst": 'borrowers/{id}/rate_adjustments',
            "get_interest_details": 'borrowers/{id}/rate_adjustments/append_interest_details',
            "get_interest_rate_code": "loan_charge_codes/interest_rate_codes",
            "update_borrower_basic_parameter": "borrowers/{id}/parameter",

            /**
             * Client Transaction API Endpoints Starts
             */
            'get_client_transaction_for_abl': 'borrowers/summary?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'export_client_transaction': 'borrowers/summary?',
            'view_client_transaction': '/borrowers/summary?borrower_id=',
            'get_total_client_transaction_detail': 'borrowers/summary_total',
            /**
             * Client Transaction API Endpoints Ends
             */

            "get_bbc_preference_setup": "/borrowers/{borrowerId}/lender_ticklers",
            "get_comment": "comments?commentable_type=Borrower&commentable_id={commentId}",
            "get_report_comment": "borrowers/{borrowerId}/comment_sets",
            "get_client_details": "borrowers?page={pageNumber}&rows={numOfRows}",

            /**
             * Fund Request API Endpoints starts
             */
            'get_fund_request': 'borrowers/{selectedClientId}/fund_request',
            'get_fund_request_by_bbc_and_fund_date': 'borrowers/{selectedClientId}/fund_request?bbc_id={bbcIdValue}&given_fund_requested_dt={fundRequestedDateValue}',
            'save_fund_request': 'borrowers/{selectedClientId}/bbcs/{bbcIdValue}/save_fund_request',
            'delete_fund_request': 'borrowers/{selectedClientId}/undo_fund_request?bbc_id={bbcIdValue}',
            /**
             * Fund Request API Endpoints ends
             */

            /**
             * Client Creation API Endpoints Starts
             */
            'get_countries_list': 'general_codes/countries/all_countries',
            'get_states_list_by_country': 'general_codes/state_provinces/state_provinces_list?country_id={countryIdValue}',
            'get_currencies_list': 'general_codes/currencies',
            'get_sales_region_list': 'general_codes/sales_regions',
            'get_naics_code_list': 'general_codes/naics_codes/public_list',
            /**
             * Client Creation API Endpoints Ends
             */

            /**
             * Exception API Endpoints Starts
             */
            'get_exception_list': 'general_codes/lender_exceptions?order_by={order_by}&sort_by={sort_by}&page={page}&rows={rows}&search=',
            'get_exception_details': '/general_codes/lender_exceptions/{id}',
            'add_lender_exception': 'general_codes/lender_exceptions',
            'update_lender_exception': 'general_codes/lender_exceptions/{id}',
            'delete_lender_exceptions': 'general_codes/lender_exceptions',
            'getExceptionDropDownOrvaluetype': '/general_codes/lender_exceptions/get_operator_or_value_type_list',
            /**
             * Exception API Endpoints Ends
             */

            /**
             * Menu Specific API Endpoint
             */
            'menu_specific_api': 'roles/{role_id}/role_permissions/menu_specific_permissions?menu_name={menu_name}',

            /**
             * APIs for Other General Codes -> Charge Codes
             */
            'charge_codes_api': 'general_codes/charge_codes',
            'charge_codes_get_all': 'general_codes/charge_codes?order_by={order_by}&sort_by={sort_by}&page={page}&rows={rows}&search=',
            'charge_codes_by_id': 'general_codes/charge_codes/{id}',

            /**
             * APIs for Financial Analyzer -> List Project`
             */
            'list_project_list_api': 'projects/summary/{clientId}',
            'list_project_api': 'projects/summary',
            'list_project_folder_api': 'projects/folder/{folderId}?page={page}&row={rows}&direction={direction}&sortBy={sortBy}&search=',
            'list_project_get_all': 'projects/summary/{clientId}?page={page}&row={rows}&direction={direction}&sortBy={sortBy}&search=',
            'list_project_by_id': 'projects/{id}',
            'delete_list_project': 'projects',
            'folders_list_project': 'folders/client/{clientId}',
            'get_folders_list_project': 'projects/folder/{id}',
            'get_balanceSheet_list': '/projects/balance-sheet-years',
            'get_financial_periods': '/projects/financial-periods',
            'get_financial_time_lines': '/projects/financial-time-lines',
            'get_financial_period_types': '/projects/financial-period-types',


            /**
             * APIs for Financial Ratio -> Get List
             */
            'list_ratio_api': 'ratios',
            'post_ratio_api': 'ratios/{{id}}',
            'save_and_edit': '/ratios/{projectId}/ratioSetup',
            'get_financial_ratio_report': '/ratios/{projectId}/viewRatioChart?type={type}',
            'get_financial_highlights': '/finance-highlight/project/{projectId}',



            //Add code for naics codes api
            'nat_signs': 'general_codes/charge_codes/get_natural_sign',
            'frequency': 'general_codes/charge_codes/get_frequency',
            'charge_type': 'general_codes/charge_codes/get_charge_types',
            'posting_type': 'general_codes/charge_codes/get_posting_type',
            'source_type': 'general_codes/charge_codes/get_source_type',
            'get_file_classifications_list': 'general_codes/file_classifications?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'update_file_classifications_list': 'general_codes/file_classifications',
            /**
             * InEligibility Reasons API Endpoints starts
             */
            'get_ineligibility_reasons_list': 'general_codes/ineligibility_reasons?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'delete_multiple_ineligibility_reasons_records': 'general_codes/ineligibility_reasons?ids={selectedRecordIds}',
            'add_ineligibility_reasons': 'general_codes/ineligibility_reasons',
            'get_or_update_ineligibility_reasons': 'general_codes/ineligibility_reasons/{selectedRecordId}',
            'export_ineligibility_reasons': 'general_codes/ineligibility_reasons?',
            /**
             * InEligibility Reasons API Endpoints ends
             */
            'get_corporate_list': 'borrowers/get_company_list',
            //  'nat_signs':'',
            //  'frequency':'',
            //  'charge_type':'',
            //  'get_file_classifications_list': 'general_codes/file_classifications',

            /**
            * Get loan type API Endpoints
            */
            'loan_type_api': 'non_abl_loan_types',
            'loan_type_by_id': 'non_abl_loan_types/{id}',
            'get_loan_type_list': 'non_abl_loan_types?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'delete_loan_type_api': 'non_abl_loan_types/delete_multiple',
            /**
             * Interest Rate Codes API Endpoints starts
             */
            'get_interest_rate_loan_types_request': 'loan_charge_codes/interest_rate_codes/get_all_loan_type',
            'get_interest_rate_codes_request': 'loan_charge_codes/interest_rate_codes?loan_type=',
            'add_interest_rate_codes_request': 'loan_charge_codes/interest_rate_codes',
            'delete_interest_rate_code_request': 'loan_charge_codes/interest_rate_codes',
            'get_interest_rate_code_details': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}',
            'get_interest_rates_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates',
            'add_interest_rates_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates',
            'delete_interest_rates_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates',
            'get_single_interest_rate_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates/{interestRateId}',
            'delete_interest_rate_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates/{interestRateId}',
            'update_interest_rates_request': 'loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates/{interestRateId}',
            'interest_rate_home_page': '/otherGeneralCodes/interest-rate-codes',
            'interest_rates_calendar_range': 'loan_charge_codes/charges_calendars/cync_year_range',
            /**
             *  Interest Rate Codes API Endpoints ends
             */

            /**
             * Seasonal Advace Rate API Endpoints starts
             */
            'get_seasonal_advance_rate_list': 'borrowers/{selectedClientId}/seasonal_advance_rates?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'delete_multiple_seasonal_advance_rate_records': 'borrowers/{selectedClientId}/seasonal_advance_rates?ids={selectedRecordIds}',
            'add_seasonal_advance_rate': 'borrowers/{selectedClientId}/seasonal_advance_rates',
            'get_or_update_seasonal_advance_rate': 'borrowers/{selectedClientId}/seasonal_advance_rates/{selectedRecordId}',
            'export_seasonal_advance_rate': 'borrowers/{selectedClientId}/seasonal_advance_rates?',
            'seasonal_advance_rate_division_list': 'borrowers/{selectedClientId}/division_codes',
            /**
             * Seasonal Advace Rate API Endpoints ends
             */

            /**
             * Collateral Division API Endpoints starts
             */
            'get_collateral_division_list': 'borrowers/{selectedClientId}/division_codes?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'delete_multiple_collateral_division_records': 'borrowers/{selectedClientId}/division_codes?ids={selectedRecordIds}',
            'add_collateral_division': 'borrowers/{selectedClientId}/division_codes',
            'get_or_update_collateral_division': 'borrowers/{selectedClientId}/division_codes/{selectedRecordId}',
            'export_collateral_division': 'borrowers/{selectedClientId}/division_codes?',
            'collateral_advance_rate_home_page': '/bbc-preference-setup/advance-rate/collateral-advance-rate',
            /**
             * Collateral Division API Endpoints ends
             */

            /**
             * End points for file upload
             */
            'get_abl_uploads': 'abl_uploads?borrower_id={clientId}',
            'get_data_review_on_row_expand': 'borrowers/{clientId}/data_review?mapping_id={mapping_id}&data_type={data_type}',
            'get_other_file_uploads': 'document_uploads?borrower_id={clientId}',
            'get_upload_bbc_data_files': 'abl_uploads?borrower_id={clientId}&search={searchTerm}&order_by={order_by}&sort_by={sort_by}&page={page}&rows={rows}',
            'get_borrower_divisions_dropdown': 'borrowers/{clientId}/division_codes',
            'undo_data_review_uploaded_file': 'uploads/{id}/undo?borrower_id={clientId}',
            'upload_bbc_data_files': 'uploads/bulk_abl',
            'get_auto_file_upload': 'borrowers/{clientId}/auto_file_uploads',
            'delete_auto_file_upload': 'uploads/{id}?borrower_id={clientId}&monr_chk=1',
            'upload_other_required_files': 'uploads/bulk_documents',
            'reprocess_collateral_from': 'uploads/{rowId}/reapply_collateral_name',
            'uploads_preview': 'uploads/preview?mapping_id={mapping_id}',

            /**
             * End points for rollforward logs
             */
            'get_rollforward_logs': 'borrowers/{clientId}/rollforward_logs',
            'get_division_data': 'borrowers/{clientId}/roll_forwards/get_division_name',
            'create_rollforward_logs': 'borrowers/{clientId}/rollforward_logs',
            'get_collateral_data': 'borrowers/{clientId}/roll_forwards/get_collateral_data?division_code_id={divisionId}&b_id={clientId}',
            'update_rollforward_data': 'borrowers/{clientId}/rollforward_logs/multi_rollforward_log_update',

            'delete_rollforward_data': 'borrowers/{clientId}/rollforward_logs/{ids}',

            'rollforwardi-inquiry': 'rollforward_logs/rollforward_inquiry?from_activity_date={from_date}&to_activity_date={to_date}',
          
           /**
            * End points for inventory rollforward 
            */
             'get_inventory_rollforward_division_list':'borrowers/{clientId}/inventory_rollforwards/divisions',
             'get_inventory_rollforward_product_group_name':'borrowers/{clientId}/inventory_rollforwards/product_groups',
             'get_inventory_rollforward_collateral_data':'borrowers/{clientId}/inventory_rollforwards/collaterals',
             'get_inventory_rollforward_collateral_data_based_on_division_id':'borrowers/{clientId}/inventory_rollforwards/collaterals?division_code_id={division_id}',
             'get_inventory_rollforwards':'borrowers/{clientId}/inventory_rollforwards',
             'get_inventory_rollforwards_with_division_id':'borrowers/{clientId}/inventory_rollforwards?page=roll_forwards&balance_name_id={division_id}',
             'get_inventory_rollforwards_with_division_id_collateral_id':'borrowers/{clientId}/inventory_rollforwards?page=roll_forwards&balance_name_id={division_id}&collateral_id={collateral_id}',            
             'get_inventory_rollforwards_with_division_id_collateral_id_product_id':'borrowers/{clientId}/inventory_rollforwards?page=roll_forwards&balance_name_id={division_id}&collateral_id={collateral_id}&product_group_id={product_group_id}',
             'get_inventory_rollforwards_log_data':'borrowers/{clientId}/inventory_rollforward_logs',
             'create_inventory_roll_forward':'borrowers/{clientId}/inventory_rollforward_logs',
             'get_product_group_based_on_collateral_id':'borrowers/{clientId}/inventory_rollforwards/product_groups?collateral_advance_rate_id={collateral_id}',
             'update_inventory_rollforward_log_data':'borrowers/{clientId}/inventory_rollforward_logs/multi_update',
             'delete_inventory_rollforward_log_data':'borrowers/{clientId}/inventory_rollforward_logs/multi_delete?{ids}',
             /**
             * UDF Mapping Endpoints begins
             */
            'udf-mapping-api': 'udf_mappings',
            'udf_lovs': 'udf_mappings/udfs',
            'programs_lovs': 'udf_mappings/programs',
            'client_program_params_lovs': 'udf_mappings/client_programs',
            'reports_list': 'udf_mappings/reports_list',
            'get_clients_for_param': 'udf_mappings/search_client_programs?search_by={searchBy}&key_word={keyValue}&limit={limit}',
            'get_parameters_for_programs': 'parameters-for-program/{program_code}',
            'get_udf_details_by_id': 'udf_mappings/udf_values?udf_id={udfId}',
            'get_udf_mapping_by_program_id': 'udf_mappings/udf_by_program?program_id={programId}',
            'update-udf-mapping': 'udf_mappings/update_udf_mappings',
            'delete-udf-mapping': 'udf_mappings/delete_udf_mappings?program_id=',
            'get-clients-by-udf-id': 'udf_mappings/clients_by_lov_value',
            'get_last_sequence': 'udf_mappings/last_sequence?program_id={programId}',
            'get_clients_by_programe_id': 'udf_mappings/clients_by_program?program_id={programId}',
            'get_loan_programs_lov':'udf_mappings/loan_programs',
            'search_for_loan_setup_lov':'udf_mappings/search_loan_programs?search_by={searchBy}&key_word={keyValue}&limit={limit}',
            'get_loan_activity_programs_lov':'udf_mappings/loan_activity_programs',
            /**
             * UDF Mapping Endpoints ends
             */

            /**
              * Advance search end point start
              */
            'get_columns': 'advance_search/get_columns?model={model}',
            'get_operators': 'advance_search/get_operators?data_type={data_type}',
            'get_dropdown_values': 'advance_search/get_drop_down?model={model}&column={column_value}',
            'get_advance_search_data': 'general_codes/{model}/advance_search?page={page}&rows={rows}',
            'get_advance_search_data_for_interest_rate_code': 'loan_charge_codes/interest_rate_codes/advance_search?loan_type={loanType}&page={page}&rows={rows}',
            /**
            * Advance search end point end
            */

            /**
             * Transfer Client UDF API Endpoints starts
             */
            'get_transfer_client_udf_list': 'client_transfers',
            'get_transfer_client_udf_values_list': 'client_transfers/udf_values?udf_id=',
            'get_transfer_udf_client_details': 'client_transfers/client_lists?udf_id={udf_id}&udf_value={udf_value}',
            'update_transfer_udf_client_details': 'client_transfers/transfer_clients',
            /**
             * Transfer Client UDF API Endpoints ends
             */

            /**
             * UDF Definition API Endpoints starts
             */
            'get_udf_definition_list': 'udfs?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}&search=',
            'get_or_update_udf_definition': 'udfs/',
            'add_udf_definition': 'udfs',
            'delete_udf_definition': 'udfs?ids=',
            'export_udf_definition': 'udfs?',
            'get_field_type_list': 'udfs/field_type',
            'get_numeric_validation_type': 'udfs/validation_type?field_type=N',
            'get_alphanumeric_validation_type': 'udfs/validation_type?field_type=AN',
            /**
             * UDF Definition API Endpoints ends
             */

            /**
             * IP Address Setup API Endpoints starts
             */
            'get_ip_address_setup_list': 'ip_whitelists?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}&search=',
            'get_or_update_ip_address_setup': 'ip_whitelists/',
            'add_ip_address_setup': 'ip_whitelists',
            'delete_ip_address_setup': 'ip_whitelists?ids=',
            'export_ip_address_setup': 'ip_whitelists?',
            'get_ip_type_list': 'ip_whitelists/list_ip_types',

            /**
            * IP Address Setup API Endpoints ends
            */
            /**
            * Financial Statements API Endpoints starts
            */
            'financial_analyzer_redirect_url': 'financial/financial-analyzer',
            'financial_statements_setup_home_redirect': 'financial/financial-statements/{projectId}',
            'financial_statements_balance_sheet_redirect': 'financial/financial-statements/balancesheet/{projectId}',
            'financial_statements_income_statement_redirect': 'financial/financial-statements/income/{projectId}',
            'financial_statements_cash_flow_redirect': 'financial/financial-statements/cashflow/{projectId}',
            'financial_statements_summary_page_redirect': 'financial/financial-statements/summary/{projectId}',
            'get_financial_statement_project_data': 'financial-statement/project/{projectId}',
            'save_financial_statement_project_data': 'financial-statement',
            'update_financial_statement_project_data': 'financial-statement/project/{projectId}',
            'get_financial_summay_data': 'financial-statement/project/{projectId}/finance-statement-summary',
            'financial_statement_download_template_url': 'financial-statement/download-template/{projectId}',
            'export_financial_summay_data': 'projects/export/client/{clientId}',
            'export_folder_financial_summay_data': 'projects/export/folder/{folderId}',
            'financial_statement_file_upload_url': 'financial-statement/project/{projectId}/upload',
            'get_project_details': 'projects/{projectId}',
            'draftFinanceProject': 'drafts/{projectId}',
            'draftRatios': 'drafts/ratio/{projectId}',


            /**
            * Financial Statements API Endpoints end
            */


            /**
             * Custom Financial Ratios End Points
             */
            'create_new_ratio_formula': 'ratios/{clientId}/custom-formula',
            'updateCustomFormulas': 'ratios/{clientId}/custom-formula/{customFormulaId}',
            'listParameters': 'financial-statement/{clientId}/list-parameters',
            'get_ratio_categories': 'ratios/categories',
            'custom_formulas': 'ratios/{clientId}/custom-formula?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}&search={searchValue}',
            'custom_formulas_by_id': 'ratios/{clientId}/custom-formula/{customFormulaId}',
            'delete_custom_formulas': 'ratios/{clientId}/custom-formula',
            // API for get Finance Project Status
            'get_finance_status_api': 'projects/{projectId}/status',

            // API for get information about multiple user login for same client
            'get_multiple_user_login_info': 'user_activity_logs/get_multi_user_alert_status?borrower_id={borrowerId}&user_id={userId}',

            /** api for currency code admin module */
            'list_currency_codes': 'general_codes/currencies?sort_by={sortByValue}&order_by={orderByValue}&page={pageNumValue}&rows={numOfRowsValue}',
            'get_currency_code_details': 'general_codes/currencies',
            'update_curreny_code': 'general_codes/currencies',
            'recalculate_exchange_rate': 'general_codes/currencies/recalculate_exchange_rate',
            'page_display_count': 'system_parameters/get_page_display',

            /**credit queue factoring api */
            'list_credit_queue_with_pagination': 'credit_queues?page={page_no}&rows={rows}',
            'list_credit_queue': 'credit_queues',
            'add_edit_queue': 'credit_queues/{id}',
            'comment_queue_list': 'credit_queues/:id/comments',
            'debtor_popup_details': 'credit_queues/{id}/{borrower_id}/debt_info',
            'client_popup_details': 'credit_queues/{id}/client_info',
            'status_dropdown_values': 'credit_queues/status_list',
            'debtor_dropdown_values': 'credit_queues/{id}/debtor_list',
            'client_dropdown_values': 'credit_queues/client_list',
            'comment_history': 'credit_queues/{id}/comments',
            'withdraw_queue': 'credit_queues/validate_req',

            /** Broker commission api*/
            'broker_commission_details': 'broker_release',
            'reset-broker_commission_dashboard': 'broker_release/reset_all',
            'broker_commission_invoice_details': 'broker_release/{id}/invoice_details',
            'payable _invoices_add_to_broker_commission': 'broker_release/add_to_broker_commission',
            'check_brokers': 'broker_release/check_all_broker',
            'get_all_brokers': 'broker_release/brokers_list',
            'release_broker_commission': 'broker_release/release_broker_commission',
            'print_released_invoices_report': 'broker_release/print_released_invoices_report',

            /** Term Codes api */
            'term_codes_list': 'term_codes?status={status}',
            'get_term_codes_data_by_id': 'term_codes/{id}',
            'add_term_codes': 'term_codes',
            'update_term_codes': 'term_codes/{id}',
            'delete_term_codes': 'term_codes?ids={ids}',
            'term_codes_redirect_url': 'term-codes',

            /** broker inquiry api */

            'broker_inquiry_list': 'broker_release/broker_enquiry',
              
             /** factoring fee setup api */

             'factoring_fee_setup_id':'borrowers/{borrower_id}/fee_setup.json',
             'factoring_fee_setup_update_parameters':'borrowers/{borrower_id}/fee_setup/{fee_setupId}.json',
             'fee_setup-fee_names':'borrowers/{borrower_id}/fee_setup/fee_names',
             'add_new_fee':'borrowers/{borrower_id}/fee_setup',
             'get_selected_fee_name_data':'borrowers/{borrower_Id}/fee_setup/{fee_id}.json',
             'get_history_table_data':'borrowers/{borrower_id}/fee_setup/{fee_id}/fee_histories.json',

            /**
             * ABL Rollforward api urls
             * 
             */
            /** get all the division list  */
            'get_division_list': 'borrowers/{clientId}/roll_forwards/get_division_name',

            /** division inquiry api with id null*/
            'division_list_with_id_null': 'borrowers/{clientId}/roll_forwards',

            /** division inquiry api with id */
            'division_list_with_id': 'borrowers/{clientId}/roll_forwards?page=roll_forwards&balance_name_id={division_id}',

            /**get division list with collateral list*/
            'division_list_with_collateral_list': 'borrowers/{clientId}/roll_forwards/get_collateral_data?division_code_id={division_id}&b_id={clientId}',

            /**get data based on callteral list id */
            'division_list_with_collateral_list_id': 'borrowers/{clientId}/roll_forwards?page=roll_forwards&balance_name_id={division_id}&collateral_id={collateral_id}',

            /** letter processing api */
            'letter_processing_list': 'borrowers/{clientId}/verification_letter_processes?letter_type={letterType}',

            /** bbc recalculation */
            'bbc_recalculation': 'borrowers/{clientId}/bbc_start',

            /**
             *  Client Template roles and permission
             */
            'get_user_info': 'users/get_user_info',
            'client_template_roles_and_permission': 'roles/{role_id}/role_permissions/menu_specific_permissions?menu_name=client_templates',

            /**
             * 
             * BUCKET AGING API URLS
             * 
             */
            /** get all the bucket aging list */
            'bucket_aging_list': 'client_templates/{id}',

            /** delete ar bucket aging */
            'delete_ar_bucket_aging': 'bucket_ageings?ids={ids}',

            /**delete ap bucket aging list */
            'delete_ap_bucket_aging': 'payable_bucket_agings?ids={ids}',

            /**save bucket aging data */
            'save_bucket_aging_data': 'client_templates/{id}/create_buckets',

            /** Ineligible caluclation */
            'get_system_defined_ineligibility_reasons': 'ineligible_calculations/get_system_defined_ineligible_reasons?client_template_id={client_template_id}',
            'apply_ineligible_calculations': 'ineligible_calculations/save_and_apply_calculations',
            'get_template_data': 'client_templates/{id}',

            //multiple client assign
            'do_not_update_template': 'client_templates/{templateId}/one_time_use_and_donot_update_template',
            'update_template': 'client_templates/{templateId}/one_time_use_and_update_template',
            'copy_template': 'client_templates/{templateId}/one_time_and_copy_of_template',
  
            //Client Parameter - BBC File Required
            'get_bbc_file_required':'borrowers/{client_Id}/addendums',
            'get_collateral_data_bbc':'borrowers/{client_Id}/addendums/select_collateral_from_list',
            'save_bbc_file_required_data':'borrowers/{client_Id}/addendums',
            'file_classification_list':'/borrowers/{client_Id}/addendums/get_list_of_file_classifications',
            'get_mapping_group_data':'borrowers/{client_Id}/addendums/get_mapping_group',
            'get_frequency_data':'borrowers/{client_Id}/addendums/get_bbc_frequency',
            'get_bbc_division_data':'borrowers/{client_Id}/addendums/set_division',
            'load_division_based_data':'borrowers/{client_Id}/addendums/load_data_basedon_division?division_code_id={division_id}',
            'delete_bbc_file_data':'borrowers/{client_Id}/addendums/{ids}',
            'update_bbc_required_file_data':'borrowers/{client_Id}/addendums/update_addendums',
            'mapping_group_based_data':'borrowers/{client_Id}/addendums/load_respective_mapping?mapping_id={mapping_Id}',
            /***
            * Loan Activity Loan Enquiry API
            */
            'get_loan_activity_loan_enquiry_list': 'loan_inquery/stream_data',
            'get_check_images_url': 'check_images/{id}/check_image_url',
            'get_loan_enquiry_stream_data_url': 'loan_inquery/stream_data?from_date={from_date}&to_date={to_date}',

            /***
            * Loan Activity Loan Summary API
            */
            'get_loan_summary_list': 'loan_summary',
            'get_loan_summary_document_url': 'documents/{id}?loan_type={loan_type}',
            'grid_config_api_url': 'grid_configs/{id}',

            /**
             * Participation Loans
             */
            'get_loan_mapping_categories':'/loan_mappings/get_categories',
            'get_mapped_unmapped_loans':'borrowers/{borrower_id}/loan_mappings/get_mapped_loan_number?category_id={category_id}',
            'map_loan_with_category':'borrowers/{borrower_id}/loan_mappings/map_loans_with_category',
            /**
             * Cash Control API
             */
            'get_cash_control_list': 'general_codes/cash_controls',
            'add_cash_control_list': 'general_codes/cash_controls',
            'update_cash_control_list': 'general_codes/cash_controls/{id}',
            'delete_cash_control_list': 'general_codes/cash_controls?ids={ids}',

            /**
             * loan setup api
             */
            'get_loan_type_dropdown_list': 'non_abl_loan_types/get_all_non_abl_loan_types',
            'get_interest_rate_dropdown_list': 'borrowers/{clientId}/loan_numbers/interest_rate_codes',
            'save_non_abl_loan': 'loan_numbers',

            /**
             * interest detail grid api
             */
            'get_interest_detail_abl_grid_data': 'borrowers/{clientId}/rate_adjustments',
            'get_interest_detail_abl_table_data' : 'borrowers/{clientId}/rate_adjustments/rate_with_interest',
            'get_interest_detail_mcl_grid_data' : 'loan_numbers/{loanId}/rate_adjustments',
            'get_interest_detail_mcl_table_data' : 'loan_numbers/{loanId}/rate_adjustments/all_rates_with_interest',
            'detail_interest_detail_abl_data' : 'borrowers/{clientId}/rate_adjustments/{rate_adjustment_id}',
            'detail_interest_detail_mcl_data' : 'loan_numbers/{loanId}/rate_adjustments/{rate_adjustment_id}',

            /**
             * loan set up landing api
             */
            'update_abl_loan' : 'borrowers/{clientId}/loan_numbers/{ablLoanId}',
            'update_mcl_loan' : 'loan_numbers/{mclLoanId}',

            /** fetch loan set up data based on loan ids type */
            'fetch_loan_setup_abl_id_data': 'borrowers/{clientId}/loan_numbers',
            'fetch_loan_setup_mcl_id_data': 'loan_numbers/fetch_specific_non_abl_loan?borrower_id={clientId}&loan_id={mclLoanId}',

            

        }
    }

    exportSearchAPIs() {
        this.searchAPIs = {
            'general_codes': '/general_codes/naics_codes?search=',
            'sale_region': '/general_codes/naics_codes?search=',
            'rate_adjustments': 'borrowers/{id}/rate_adjustments?search',
            'Charge Codes': 'general_codes/charge_codes?search=',
            'List Project': 'general_codes/charge_codes?search=',
            'File Classification': 'general_codes/file_classifications?search=',
            'search_ineligibility_reasons': 'general_codes/ineligibility_reasons?search=',
            'Insurance Policies': 'borrowers/{clientId}/insurance_policies?search=',
            'Borrower Guarantors': 'borrowers/{clientId}/guarantor_borrowers?search=',
            'Personal Guarantors': 'borrowers/{clientId}/personal_guarantors?search=',
            'Third Party Guarantors': 'borrowers/{clientId}/third_party_guarantors?search=',
            'Guarantors': 'borrowers/{clientId}/guarantors?search=',
            'interest_rate_codes': '/loan_charge_codes/interest_rate_codes?search=',
            'interest_rates': '/loan_charge_codes/interest_rate_codes/{interestRateCodeId}/interest_rates?search=',
            'search_seasonal_advance_rate': 'borrowers/{selectedClientId}/seasonal_advance_rates?search=',
            'search_collateral_division': 'borrowers/{selectedClientId}/division_codes?search=',
        }
    }


}