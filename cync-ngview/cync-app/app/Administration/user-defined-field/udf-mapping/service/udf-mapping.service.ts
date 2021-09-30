import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { UDFMappingSummaryRecords, UDFMappingSummaryModel, UDFDetailsModel, Program, ClientProgramParam, CommonIdNameModel, UDFMappingModel, UdfIdValuePair, UDFModelForClientMappings, LoanSetupProgramParam } from "../model/udf-mapping.model";
import { CyncHttpService } from "@cyncCommon/services/custom.http.service";
import { Helper } from "@cyncCommon/utils/helper";
import { SelectDropDown } from "@app/shared/models/select-dropdown.model";

/**
 * @author:Saakshi Sharma
 */
@Injectable()
export class UdfMappingService {

    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }
    
    /**
     * Method to get all the udf-program mapping records
     * @param url
     * @returns Observable of the Get all UDF Mapping Data
     */
    public getAllUdfMappingData(url: string): Observable<UDFMappingSummaryRecords> {
        // let uDFMappingSummaryRecords: UDFMappingSummaryRecords = new UDFMappingSummaryRecords();

        // let uDFMappingSummaryModel = new UDFMappingSummaryModel();
        // uDFMappingSummaryModel.id = 1;
        // uDFMappingSummaryModel.user_defined_field = 'Branch';
        // uDFMappingSummaryModel.programs = ['Client Details','Reports'];

        // let uDFMappingSummaryModel2 = new UDFMappingSummaryModel();
        // uDFMappingSummaryModel2.id = 2;
        // uDFMappingSummaryModel2.user_defined_field = 'Lender Group';
        // uDFMappingSummaryModel2.programs = ['Client Details','Reports'];

        // let uDFMappingSummaryModel3 = new UDFMappingSummaryModel();
        // uDFMappingSummaryModel3.id = 3;
        // uDFMappingSummaryModel3.user_defined_field = 'Lender/Officer';
        // uDFMappingSummaryModel3.programs = ['Client Details'];

        // uDFMappingSummaryRecords.recordTotal = 0;
        // uDFMappingSummaryRecords.udf_mapping = [uDFMappingSummaryModel,uDFMappingSummaryModel2,uDFMappingSummaryModel3];
        // uDFMappingSummaryRecords.udf_mapping = []
        // //uDFMappingSummaryRecords.udf_mapping = null;
        // return Observable.of(uDFMappingSummaryRecords);

        return this._cyncHttpService.get(url).map(data => <UDFMappingSummaryRecords>JSON.parse(data._body));
    }

    /**
     * Service Method to delete UDF Mappings
     * @param url
     * @returns Observable with response for Deleting the selected UDF Mappings
     */
    deleteUDFMapping(url: string): Observable<any> {
        return this._cyncHttpService.delete(url);
    }

    /**
     * Method to export the UDF Mapping Data to an excel sheet
     * @param url
     * @param filter
     */
    exportUdfMappingData(url: string, filter: string): Observable<Blob> {
        return this._cyncHttpService.getExportCall(url, filter);
    }

    /**
     * Method to get List of Programs
     * @param url
     */
    getPrograms(url:string) : Observable<Program[]>{
        return this._cyncHttpService.get(url).map(data => <Program[]>JSON.parse(data._body).programs);
    }

    /**
     * Method to get List of Client Program Params
     * @param url
     */
    getClientProgramParams(url:string) : Observable<ClientProgramParam[]>{
        return this._cyncHttpService.get(url).map(data => <ClientProgramParam[]>JSON.parse(data._body).client_programs);
    }


    /**
     * Method to get the clients based on the value provided
     * @param url
     */
    getClientsForProgramParam(url:string):Observable<CommonIdNameModel[]>{
        return this._cyncHttpService.get(url).map(data => <CommonIdNameModel[]>JSON.parse(data._body).clients);
    }

    /**
     * This method is used to get clients list by Program Parameter
     * @param url
     * @param programParam
     * @param programParamValue
     */
    searchClientMappings(url:string, programParam:string, programParamValue: Observable<string>):Observable<CommonIdNameModel[]>{
        return programParamValue.debounceTime(400).distinctUntilChanged().
            switchMap(value => {
                if (value == undefined || value == null || value.length == 0) {
                    return Observable.of([]);
                }
                const finalUrl = url.replace("{searchBy}", programParam).replace("{keyValue}",  value);
                return this.getClientsForProgramParam(finalUrl);
            });
    }

    /**
     * This method is used to get clients list by Program Paramter search value
     * @param url
     * @param programParam
     * @param programParamValue
     */
    getClientsBasedOnProgramParamSearch(url:string, programParam:string, programParamValue: string, limit: string) :Observable<CommonIdNameModel[]>{
        const finalUrl = url.replace("{searchBy}", programParam).replace("{keyValue}",  programParamValue).replace("{limit}", limit);
        return this.getClientsForProgramParam(finalUrl);
    }

    /**
     * Method to get the clients based on the value provided
     * @param url
     */
    getClientsForUdfSelected(url:string):Observable<CommonIdNameModel[]>{
        return this._cyncHttpService.get(url).map(data => <CommonIdNameModel[]>JSON.parse(data._body).clients);
    }

    /**
     * Method to get Management Reports
     * @param url
     */
    getManagementReports(url:string):Observable<CommonIdNameModel[]>{
        return this._cyncHttpService.get(url).map(data => <CommonIdNameModel[]>JSON.parse(data._body).reports);
    }

    /**
     * Method to get the list of UDF Fields
     * @param url
     */
    getUdfValues(url:string):Observable<CommonIdNameModel[]>{
        return this._cyncHttpService.get(url).map(data => <CommonIdNameModel[]>JSON.parse(data._body).udfs);
    }

    /**
     * Method to get the UDF Field details from Id
     * @param url
     */
    getUdfDetailsById(url:string):Observable<UDFDetailsModel>{
        return this._cyncHttpService.get(url).map(data => <UDFDetailsModel>JSON.parse(data._body).udf);
    }

    /**
     *  Method to get all the UDF Mapping Details By Program Id
     * @param url
     */
    getUDFMappingDetailsById(url:string):Observable<UDFMappingModel>{
        return this._cyncHttpService.get(url).map(data => <UDFMappingModel>JSON.parse(data._body));
    }

    /**
     *  Method to save UDF Mapping
     * @param url
     * @param model
     */
    saveUdfMapping(url:string, model:UDFMappingModel):Observable<any>{
        return this._cyncHttpService.post(url, model);
    }

    /**
     * Method to update UDF Mapping
     * @param url
     * @param model
     */
    updateUdfMapping(url: string, model: UDFMappingModel): Observable<any> {
        return this._cyncHttpService.patch(url, model);
    }


    /**
     * Get client mappings for Udfs
     * @param url
     * @param model
     */
    getClientMappingsForUdf(url: string, model: UDFModelForClientMappings): Observable<CommonIdNameModel[]> {
       return this._cyncHttpService.patch(url,model).map(data => <CommonIdNameModel[]>JSON.parse(data._body).clients);

    }

    /**
     * Get last sequence for udfs
     * @param url
     */
    getLastSequence(url:string): Observable<number>{
        return this._cyncHttpService.get(url).map(data => <number>JSON.parse(data._body).sequence);
    }

    /**
     * method to get mapped clients to a programe by programe id
     */
    getMappedClientsByProgrameId(url: string) :  Observable<CommonIdNameModel[]> {
        return this._cyncHttpService.get(url).map(data => <CommonIdNameModel[]>JSON.parse(data._body).clients);
 
    }
    /**
     * Method to get List of Client Program Params FOR LOAN SETUP
     * @param url
     */
    getLoanSetupProgramParams(url:string) : Observable<LoanSetupProgramParam[]>{
        return this._cyncHttpService.get(url).map(data => <LoanSetupProgramParam[]>JSON.parse(data._body).loan_programs);
    
     }
     /**
     * This method is used to get clients list by Program Paramter search value FOR LOAN SETUP PROGRAM
     * @param url
     * @param programParam
     * @param programParamValue
     */
    
        getClientsBasedOnProgramParamSearchForLs(url:string, programParam:string, programParamValue: string, limit: string) :Observable<CommonIdNameModel[]>{
         url = url.replace("{searchBy}", programParam).replace("{keyValue}",  programParamValue).replace("{limit}", limit);
        return this.getClientsForProgramParam(url);
    }
  /**
     * Method to get List of Client Program Params FOR LOAN Activity
     * @param url
     */
    getLoanActivityProgramParams(url:string) : Observable<LoanSetupProgramParam[]>{
        return this._cyncHttpService.get(url).map(data => <LoanSetupProgramParam[]>JSON.parse(data._body).reports);
    
     }
}