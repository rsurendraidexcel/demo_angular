import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from "ag-grid-enterprise";

const licenseKey = "CompanyName=Idexcel Inc,LicensedApplication=cyncsoftware.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-014872,ExpiryDate=9_May_2022_[v2]_MTY1MjA1MDgwMDAwMA==142d6d0d65dc8afb5d9d8a1bf32f0cc0";
//const cleanedLicenseKey = licenseKey.replace(/[\u200B-\u200D\uFEFF]/g, '');
LicenseManager.setLicenseKey(licenseKey);
if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
