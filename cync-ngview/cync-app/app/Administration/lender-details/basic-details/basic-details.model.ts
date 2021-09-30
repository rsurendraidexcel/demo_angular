export class BasicDetailsModel  {
  basic_information: basicInformation;
  password_details:  passwordDetails;
  display_links: displayLinks;
  factoring_fee_setup: factoringSetup;

}

 class basicInformation{
            id: number;
            display_name: string;
            email: string;
            time_zone: string;
            logo_path: string;
            current_logo: string;
            banner_logo_path: string;
            current_banner: string;
            street_address: string;
            other_address: string;
            city: string;
            state_province: string;
            country: string;
            zip_code: string;
            phone_no: string;
            fax_no: string;
}
 class passwordDetails{
            no_of_uppercase_in_passwrd: number;
            no_of_lowercase_in_passwrd: number;
            no_of_digit_in_passwrd: number;
            no_of_special_character_for_passwrd: number;
            no_of_login_attempt: number;
            disallow_repeated_letters: boolean;
            character_repitition_limit: number;
            passwrd_minimum_length: number;
            passwrd_maximum_length: number;
            passwrd_expire_in: number;
            passwrd_reuse_count: number;
            restricted_passwrd_words: string;
            is_deactivate_user: boolean;
            no_of_days_to_deactivate: number;
            is_delete_user: boolean;
            no_of_days_to_delete: number;
            automatic_emails: string;
            message_to_user: string;
}
 class displayLinks{

            enable_links: boolean;
            enable_links_footer: boolean;
            security_link: string;
            privacy_link: string;
            termsandconditions_link: string;
            disclaimers_link: string;

}
class factoringSetup{
            factoring_fees_rule_is_accrued: boolean;
}
