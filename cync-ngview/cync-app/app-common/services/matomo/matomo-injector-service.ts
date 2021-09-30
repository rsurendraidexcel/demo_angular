import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { AppConfig, APIHostConfig} from '@app/app.config';
declare var window: {
    [key: string]: any;
    prototype: Window;
    new(): Window;
};
@Injectable()
export class MatomoInjectorService {
    hostConfig: APIHostConfig;
    constructor(private config: AppConfig, private router: Router, private atdRoute: ActivatedRoute) {
        this.hostConfig = <APIHostConfig>this.config["config"];
        //console.log(this.hostConfig["host_matomo"]["urlPath"]);
        window._paq = window._paq || [];
    }
    matomoEntry(data: any) {
        try {
            this.init(`${this.hostConfig["host_matomo_tracker"]["urlPath"]}`, this.hostConfig["host_matomo_tracker"]["siteId"], data);
            this.commonTrakingInfo(data);
        } catch (error) {
            console.log(error);
        }
    }
    commonTrakingInfo(data: any) {
        console.log("::Matommo-Tracker::",data);
        window['_paq'].push(['trackContentImpression', `LenderName: ${document.domain} - ${data.borrower_name}, UserId:${data.user_id}, e-mail: ${data.user_email}`, `${data.bred_crumb}`, `${data.screen_name}`]);
    }

    init(url: string, id: number, entry_data?: any) {
        let urlRef=window.location.port=='' ? `${window.origin}/angular/#`:`${window.origin}`;
        window._paq.push(['setDocumentTitle', `${document.domain} / Cync Application -> ${entry_data.screen_name}`]);
        window._paq.push(['setUserId', `User login:${entry_data.user_login},e-mail:${entry_data.user_email}`]);
        window._paq.push(['enableLinkTracking']);
        window._paq.push(['trackPageView']);
        window._paq.push(['trackAllContentImpressions']);
        window._paq.push(['setReferrerUrl', `${urlRef}${this.atdRoute["_routerState"].snapshot["url"]}`]);
        (() => {
            const u = url;
            window._paq.push(['setTrackerUrl', u + 'matomo.php']);
            window._paq.push(['setSiteId', id.toString()]);
            window._paq.push(['setCustomUrl', `${entry_data.url}`]);
            window._paq.push(["setDomains", ['*.cyncsoftware.com']]);
            window._paq.push(["enableCrossDomainLinking"]);
            const d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = u + 'matomo.js';
            if (this.verifyScriptLoad() === false) {
                s.parentNode.insertBefore(g, s);
            }
        })();
    }

    verifyScriptLoad(): boolean {
        const dt = document;
        let slist: any = <any>dt.getElementsByTagName('script');
        let available: boolean = false;
        for (var item of slist) {
            if (item.src === `${this.hostConfig["host_matomo_tracker"]["urlPath"]}matomo.js`) {
                available = true;
            }
        }
        return available;
    }
}