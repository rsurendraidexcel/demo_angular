
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import  {CustomHttpService} from '../../services/http.service';

@Injectable()
export class CarService {

    constructor(private http: Http, private customHttpService: CustomHttpService) {}

    getCarsSmall() {

}

    }

