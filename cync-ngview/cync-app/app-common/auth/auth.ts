import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfig } from '../../app/app.config';

@Injectable()
export class AuthGuard implements CanActivate {
    location: any;

    constructor(private router: Router,  private config: AppConfig) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.config.getConfig('cyncUserCookie')) {
            //console.log("ror api cookie::"+this.config.getConfig('cyncUserCookie'));
            return true;
        } else {
            //console.log('no cookie')
            return true; //local development
           // return false; //for prestaging,staging & production
        }
        // not logged in so redirect to login page with the return url
        //window.location.href = 'https://rorapi.cyncsoftware.com';
        //return true;     
    }
}
