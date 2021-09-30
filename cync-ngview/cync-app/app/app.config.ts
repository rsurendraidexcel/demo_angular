import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { DOCUMENT } from '@angular/common';
declare let require;
export interface EnvConfig {
    env: string;
}
export interface APIHostConfig {
    host: string;
    host_ror: string;
    host_finance: string;
    host_notification: string;
    cyncUserCookie: string;
    lenderId: string;
    notificationAPIKey: string,
    assets_path: string;
    host_factoring: string;
    host_abl:string;
    cdn_url: string;
    host_mcl: string;
    host_cash_application: string;
    host_webhook: string;
    host_tableau: string;
    host_tableau_tiket_token: string; 
    host_lambda_api: string;
    host_matomo_tracker: MatomConfig;
}
export interface MatomConfig{
    urlPath: string;
    siteId: number
}

@Injectable()
export class AppConfig {
    private config: Object = null;
    private env: Object = null;
    private lender: string[];
    private cyncCookie: any;
    private envName: string;

    /**
     * 
     * @param document 
     * @param http 
     * @param cookieService 
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private http: HttpClient,
        private cookieService: CookieService) {

    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
    * 
    */
    public getEnvName(): string {
        return this.envName;
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get<EnvConfig>('./assets/environment/env.json').subscribe(envResponse => {
                let tempEnvResponse = envResponse as EnvConfig;
                this.env = tempEnvResponse;
                this.envName = envResponse.env;
                this.http.get<APIHostConfig>('./assets/environment/config.' + envResponse.env + '.json').subscribe(responseData => {
                        this.config = responseData as APIHostConfig;
                        this.lender = window.location.hostname.split('.');
                        this.config['lenderId'] = this.lender[0];
                        this.config['host_ror'] = this.config['host_ror'].replace('lenderId', this.lender[0]);
                        this.config['host_factoring'] = this.config['host_factoring'].replace('lenderId', this.lender[0]);
                        this.config['host_mcl'] = this.config['host_mcl'].replace('lenderId', this.lender[0]);
                        this.config['host_webhook'] = this.config['host_webhook'].replace('lenderId', this.lender[0]);
                        this.config['host_cash_application'] = this.config['host_cash_application'].replace('lenderId', this.lender[0]);
                        CyncConstants.setAssetsPath(this.config[CyncConstants.ASSETS_PATH]);
                        this.loadLibrariesAtIndexHtml();
                        resolve(true);
                 }, (error) => {
                        console.error('Error reading ' + envResponse.env + ' configuration file');
                        reject(error);
                 });
            
            },(error) => {
                 console.log('Configuration file "env.json" could not be read');
                 this.cyncCookie = this.cookieService.get('cync_authorization');
                 if (this.cyncCookie != null && this.cyncCookie != '') this.config['cyncUserCookie'] = this.cyncCookie;
                 reject(true);
            }, () => {
                console.log("::Complite Confg::");
            });
        });
    }

    /** 
    * New Lender config method without calling http request 
    * This method:
    * a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
    * b) Loads "config.[env].json" to get alloadConfigl env's variables (e.g.: 'config.development.json')
    */
    public loadConfig() {
        let envResponse = require('../assets/environment/env.json');
        this.env = envResponse['env'];
        this.envName = envResponse['env'];
        console.log("Environment File: ", envResponse['env']);
        this.config = require('../assets/environment/config.' + envResponse['env'] + '.json');
        this.lender = window.location.hostname.split('.');
        this.config['lenderId'] = this.lender[0];
        this.config['host_ror'] = this.config['host_ror'].replace('lenderId', this.lender[0]);
        this.config['host_factoring'] = this.config['host_factoring'].replace('lenderId', this.lender[0]);
        this.config['host_mcl'] = this.config['host_mcl'].replace('lenderId', this.lender[0]);
        this.config['host_webhook'] = this.config['host_webhook'].replace('lenderId', this.lender[0]);
        this.config['host_cash_application'] = this.config['host_cash_application'].replace('lenderId', this.lender[0]);
        CyncConstants.setAssetsPath(this.config[CyncConstants.ASSETS_PATH]);
        this.loadLibrariesAtIndexHtml();
    }

    /**
     * this method will replace this asset path for js and css file based on environment specified 
     * in config.env.json
     */
    private loadLibrariesAtIndexHtml() {
        this.appendAssetPath('jquery-lib', 'src');
        this.appendAssetPath('bootstrap-lib', 'src');
        this.appendAssetPath('jquery.event-lib', 'src');
        this.appendAssetPath('sidemenu-lib', 'src');
        this.appendAssetPath('bootstrap-calendar-lib', 'src');
        this.appendAssetPath('custom-js', 'src');
        this.appendAssetPath('bootstrap-calendar-css', 'href');
        this.appendAssetPath('favicon-icon', 'href');

    }

    /**
     * this method first gets the exisiting path using javascript getAttribute method
     * then it replace the path with the path mentioned in env config file
     * and then it sets the path back.
     * @param elementId 
     * @param attributeName 
     */
    private appendAssetPath(elementId: string, attributeName: string) {
        if (this.document.getElementById(elementId) != null && this.document.getElementById(elementId) != undefined) {
            let path: string = this.document.getElementById(elementId).getAttribute(attributeName);
            path.replace('assets', this.config[CyncConstants.ASSETS_PATH]);
            this.document.getElementById(elementId).setAttribute(attributeName, path);
        }
    }

    /**
     * to check whether we are on local server or not
     */
    public MI_ON_LOCAL_SERVER() {
        let flag: boolean = false
        if (this.envName != null || this.envName != undefined)
            flag = this.envName.toLowerCase() === 'local'.toLowerCase();
        return flag;
    }
}
