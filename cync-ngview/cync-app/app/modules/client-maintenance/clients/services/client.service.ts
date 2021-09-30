import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import {
    ClientApiResponse,
    ClientDetails,
    Country,
    State,
    Borrower,
    BorrowerResponse,
    Currency,
    CurrenciesResponse,
    SalesRegion,
    SalesRegionResponse,
    NaicsCode,
    NaicsCodeResponse,
    NaicsCodeCombined
} from '../models/manage-client.model';

@Injectable()
export class ClientService {
    constructor(private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper) { }

    apiEndpoint: string = '';
    getClientDetails(): Observable<ClientDetails> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return this.serializeClientDetailsObject(<ClientApiResponse>JSON.parse(data._body));
        })
    }

    public listClient(url : string ){
        return Observable.of(null);
    }

    getApiEndpoint() {
        return this.apiEndpoint;
    }

    serializeClientDetailsObject(clientApiResponseobj: ClientApiResponse): ClientDetails {
        return clientApiResponseobj['borrower'];
    }

    setCountriesListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_COUNTRIES_LIST];
    }

    getCountriesList(): Observable<Country[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return <Country[]>JSON.parse(data._body);
        })
    }

    setStatesListApiEndpoint(countryId: number) {
        this.apiEndpoint = this._helper.replaceEndpointQueryParameters(this._apiMapper.endpoints[CyncConstants.GET_STATES_LIST_BY_COUNTRY], CyncConstants.SELECTED_COUNTRY_ID_PARAM, countryId);
    }

    getStatesListBasedOnSelectedCountry(): Observable<State[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return <State[]>JSON.parse(data._body);
        })
    }

    setClientsListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_BORROWERS];
    }

    getClientsList(): Observable<Borrower[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return (<Borrower[]>this.serializeClientsListObject(JSON.parse(data._body)));
        })
    }

    serializeClientsListObject(clientsListResponse: BorrowerResponse): Borrower[] {
        return clientsListResponse['borrowers'];
    }

    setCurrenciesListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_CURRENCIES_LIST];
    }

    getCurrenciesList(): Observable<Currency[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return (<Currency[]>this.serializeCurrenciesListObject(JSON.parse(data._body)));
        })
    }

    serializeCurrenciesListObject(currenciesListResponse: CurrenciesResponse): Currency[] {
        return currenciesListResponse['currencies'];
    }

    setSalesRegionListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_SALES_REGION_LIST];
    }

    getSalesRegionList(): Observable<SalesRegion[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return (<SalesRegion[]>this.serializeSalesRegionListObject(JSON.parse(data._body)));
        })
    }

    serializeSalesRegionListObject(salesRegionListResponse: SalesRegionResponse): SalesRegion[] {
        return salesRegionListResponse['sales_regions'];
    }

    setNaicsCodeListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_NAICS_CODE_LIST];
    }

    getNaicsCodeList(): Observable<NaicsCode[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return (<NaicsCode[]>this.serializeNaicsCodeListObject(JSON.parse(data._body)));
        })
    }

    serializeNaicsCodeListObject(naicsCodeListResponse: NaicsCodeResponse): NaicsCode[] {
        return naicsCodeListResponse['naics_codes'];
    }

    getCombinedNaicsCode(): NaicsCodeCombined[] {
        let naicsCodeArr: NaicsCodeCombined[] = [];
        this.setNaicsCodeListApiEndpoint();
        this.getNaicsCodeList().subscribe(naicsCodeResp => {
            let tmpNaicsArr: NaicsCode[] = naicsCodeResp;
            tmpNaicsArr.forEach((data) => {
                let tmpArr: string[] = [];
                tmpArr.push(data.code);
                tmpArr.push(data.description);
                let tmpObj: NaicsCodeCombined = {
                    "id": data.id,
                    "naics_code": tmpArr.join(',')
                }
                naicsCodeArr.push(tmpObj);
            });
        });
        return naicsCodeArr;
    }

    searchForNaicsCode(query: any, naicsCodeList: NaicsCodeCombined[]): NaicsCodeCombined[] {
        let filtered: NaicsCodeCombined[] = [];
        naicsCodeList.forEach((data) => {
            if (data.naics_code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(data);
            }
        })
        return filtered;
    }

}

