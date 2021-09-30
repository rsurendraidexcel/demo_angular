declare var $:any;
declare var window:any;
export const GlobalVariable = Object.freeze({
      //BASE_API_URL: 'https://10.20.1.53:8081/v1/',      
      BASE_API_URL_DEV: 'https://cssp-dev.cyncsoftware.com/v1/',
      BASE_API_URL_PRESTAGING: 'https://cssp-prestaging.cyncsoftware.com:8081/v1/',
      BASE_API_URL_STAGING: 'https://cssp-staging.cyncsoftware.com/v1/',
      BASE_API_URL_UAT: 'https://csspuat.cyncsoftware.com/v1/',
      BASE_API_URL_DEMO: 'https://cssp-production.cyncsoftware.com/v1/',
      BASE_API_URL_PROD: 'https://cssp-production.cyncsoftware.com/v1/',

      SERVICE_DESK_ID_DEV: '1',
      SERVICE_DESK_ID_PRESTAGING: '1',
      SERVICE_DESK_ID_STAGING: '1',
      SERVICE_DESK_ID_UAT: '1',
      SERVICE_DESK_ID_DEMO: '3',
      SERVICE_DESK_ID_PROD: '4',
      LENDER_HOST: function () {
            let lenderUrl;
            if(window.origin.includes("localhost")==true){
                  lenderUrl= "https://devrorapi.cyncsoftware.com";
            }
            else if(window.origin.includes("staging")==true){
                  lenderUrl= "https://staging.cyncsoftware.com";
            }
            else if(window.origin.includes("devrorapi")==true){
                  lenderUrl= "https://devrorapi.cyncsoftware.com";
            }
            else if(window.origin.includes("uattest")==true){
                  lenderUrl= "https://uattest.cyncsoftware.com";
            }
            else{
                  lenderUrl = window.origin; 
            } 
            // console.log(lenderUrl);

            return lenderUrl;
      },

      ATTACHMENT_IMAGE_TYPES: ['image/png','image/jpeg','image/jpg','image/bmp','image/gif','image/tiff'],
      ATTACHMENT_FILE_TYPES: ['text/plain','application/vnd.oasis.opendocument.text','application/pdf','application/zip','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      
 });