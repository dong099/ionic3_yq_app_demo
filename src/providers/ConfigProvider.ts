import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigProvider {

  constructor() {
  }

   /**
   * 获取域名
   * @param versionType 版本类型，0:正式环境，1:测试环境，2: 本地
   */
  static getDomainInfo(versionType: number = 1): any{
    let domain: string;
    switch(versionType){
      case 0: domain = "http://"; break;  //正式环境
      case 1: domain = "http://"; break;    //测试环境
      case 2: domain = ""; break;    //本地
      default: domain = ""; break;
    }
    return {domain: domain, versionType: versionType};
  }

  /**
   *获取api地址
   */
  static getApiHost(){
      return ConfigProvider.getDomainInfo().domain + "";
  }

  static defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});
  static formHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json'});
  static uploadHeasers = new Headers({'Content-Type': 'multipart/form-data'});
  static textHeasers = new Headers({ "Content-Type": "text/plain" });

  //
  static defaultOptions = new RequestOptions({headers: ConfigProvider.defaultHeaders});
  static formOptions = new RequestOptions({headers: ConfigProvider.formHeaders});
  static uploadOptions = new RequestOptions({headers: ConfigProvider.uploadHeasers});

}

 