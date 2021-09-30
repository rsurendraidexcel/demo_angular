import { Injectable } from '@angular/core';
import {Http, Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrencyPairServices {
			  constructor(private http: Http){
			    console.log('Currecypair service Ready to searve');
			  }

		   //lenderId:string = "SBI11";
		   //hostName:string = "http://172.16.5.75:8080/v1/lenders/";

		   lenderId= 'AmitLender';
		   hostName= 'http://currency-1397145902.us-east-1.elb.amazonaws.com/v1/lenders/';

	      getCurrencyPair() {
	        const url = this.hostName + this.lenderId + '/currencypairs';
	        return this.http.get(url); //.subscribe(data => this.data=data);
		  }

	}
