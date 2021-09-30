
export interface AffilatedLenderList {
  id: number;
  name:  string;
}

export interface  AffiliatedLender {
      name: string;
      email: string;
      phone_no: number;
      fax_no: number;
      address_1: string;
      address_2: string;
      city: string;
      state_province_id: string;
      country_id: string;
      zip_code: number;
      logo_path: string;
      currency: string;
      time_zone:string;
    }