
import { Injectable } from '@angular/core';
import {
  Http, Response, Headers, RequestOptions
} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs";




import { NativeService } from './native-service';
import { ConfigProvider } from './ConfigProvider';
import { Util } from './yq-utils';
import { APP_SERVE_URL, REQUEST_TIMEOUT } from './Constants';





@Injectable()
export class YqHttpService {
 
  constructor(public http: Http, private nativeService:NativeService) {
  }


  /**
   * 
   * @param inUrl 
   * @param md 
   * @param helper 
   */
  getData(inUrl: string, paramsMap?: any): Observable<any> {
    let h =  ConfigProvider.formHeaders;
    if(!paramsMap) paramsMap = {};
    //headers.append("Accept", "application/json");
    //let params = new URLSearchParams(); //great pit, it's URLSearchParams from http package.
    //params.append('username', "lisi");
 
    let options = new RequestOptions({ headers: h, params: paramsMap });

    inUrl = Util.formatUrl(inUrl.startsWith('http') ? inUrl : APP_SERVE_URL + inUrl);
    console.log("getData URL " + inUrl);
    return Observable.create((observer: any) => {
        this.http.get(inUrl, options).timeout(REQUEST_TIMEOUT).map(Util.extractData).catch(this.handleError)
            .subscribe(data => {              
                observer.next(data);
                observer.complete();
    
            }, (err) => {
                observer.error(err);
                observer.complete();
            });
    });

}

  
  /**
   * 
   * @param inUrl  -- Restful Mapping Url
   * @param objName  - real db table name
   * @param inData   - string or FormData
   * @param headers   - Configprovider.*
   */
  postData(inUrl: string, objName:string, inData: any, headers?: Headers, timeout?: number): Observable<JSON> {

 
    inUrl = Util.formatUrl(inUrl.startsWith('http') ? inUrl : APP_SERVE_URL + inUrl);

    console.log("postData : " + inUrl);
    //return this.addData(inUrl, inData, headers || new Headers({ "Content-Type": "application/x-www-form-urlencoded" }));
    return this.addData(inUrl, objName, inData, headers || ConfigProvider.formHeaders , timeout || REQUEST_TIMEOUT);
  }

  addData(inUrl: string, objName: string, inData: any, headers: Headers, timeout: number): Observable<any> {
    //let _headers = headers || new Headers({ "Content-Type": "application/json" });
    let _headers = headers || ConfigProvider.defaultHeaders;
    let _options = inData instanceof FormData ? null : new RequestOptions({ headers: _headers });

    if(inData instanceof FormData){ //formData

        inData.append("listName", objName);
        //inData.append("rowData", Util.toJsonString(inData)); //should already in formData

        
    } else { //string
        let queryParam = "?listName=" + encodeURIComponent(objName);
        queryParam += "&rowData=" + encodeURIComponent(Util.toJsonString(inData));
        inUrl += queryParam; 

    }

    this.nativeService.showLoading("please wait, processing...");

    return this.http.post(inUrl, inData, _options).timeout(timeout)
      .map(Util.extractData)
      .catch(this.handleError);

  }

  

  private handleError(error: Response | any) {
    
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        if (error.status === 0) {
            errMsg = "UNABLE_TO_REACH_SERVER";
        } else {
            try {
                const body = error.json() || "";
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
            } catch (e) {
                errMsg = `${error.status} - ${e.message}`;
            }
        }
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
}



}