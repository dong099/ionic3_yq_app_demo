import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { Response } from "@angular/http";

/**
 *  npm install --save xml-objtree
 *        https://www.npmjs.com/package/xml-objtree
 * 
 *      
 *    the path is relative to under current $project/node_modules
 * 
 */
import * as ObjTree from 'xml-objtree/src/ObjTree.js';  
// import { NativeService } from './native-service';
import { Storage } from '@ionic/storage';
// declare var ObjTree: any;
 

export class Util {
 

  constructor(private storage:Storage) {
  }

  static isErrorMessage(json: any): boolean {
    return Boolean((json.code > 1000 && json.message) || (json.returnValue === -1));
  }

  static getErrorMessage(res: any): string {
    return res.message || res.returnComment;
  }

  static parseXML(xml: string): any {
    let objTree = new ObjTree();
    return objTree.parseXML(xml);
  }
  static extractXmlData(res: Response): any {
    let body: string = /application\/xml/.test(res.headers.get("Content-Type")) ?
      res.text() : res.json().entity;
    let json = Util.parseXML(body);
    if (!json) {
      if (Util.isErrorMessage(JSON.parse(body))) {
        throw new Error(Util.getErrorMessage(JSON.parse(body)));
      }
      return json;
    } else {
      // let isSnapshotObject;
      // isSnapshotObject = _.find(json, (value: any, key) => !_.isUndefined(value.isSnapshot));
      // if (!_.isUndefined(isSnapshotObject)) {
      //   json.isSnapshot = isSnapshotObject.isSnapshot === "true" ? true : false;
      //   delete isSnapshotObject.isSnapshot;
      // }
      return json;
    }
  }

  static extractData(res: Response): any {
    

    if (/application\/xml/.test(res.headers.get("Content-Type"))) {
      return Util.extractXmlData(res);
    } else {
      let body = res.json();
      if (body.entity !== undefined) {
        try {
          if (typeof body.entity === "string") {
            body = JSON.parse(body.entity);
          } else {
            body = body.entity;
          }
        } catch (e) {
          // May be it is XML data
          body = Util.extractXmlData(res);
        }
      }
      //sample failure msg: {"code":2001,"message":"Creating yq_demo_table is failed."}
      if (!Util.isErrorMessage(body)) {
        return body;
      } else {
        throw new Error(Util.getErrorMessage(body));
      }
    }
  }

  static handleError(error: Response | any): ErrorObservable {
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
  static generateUUID(pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
    let d = new Date().getTime();
    let uuid = pattern.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  /**
   * 
   * 
   * @param {*} data JSON object 
   * @returns {string} Stringified JSON data with $$ attributes removed
   * 
   * @memberOf ObjectBase
   */
  static toJsonString(data: any): string {
    return JSON.stringify(data, (key, value) => /(^\$\$)|(__gohashid)/.test(key) ? undefined : value);
  }



  ///////////////////////////////////////////////

    /**
   * 把url中的双斜杠替换为单斜杠
   * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
   * @param url
   * @returns {string}
   */
  static formatUrl(url: string = ''): string {
    let index = 0;
    if (url.startsWith('http')) {
      index = 7
    }
    return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
  }


  getRestServer(){

    this.storage.get('CURR_SERVER_URL')
    .then((serverUrl) => {
      if (serverUrl) {
            if(serverUrl==='LOCAL_SERVE_URL') {
              this.storage.set('CURR_SERVER_URL', 'WWW_SERVE_URL');        
            }else {
              this.storage.set('CURR_SERVER_URL', 'LOCAL_SERVE_URL');        
            }
      } else {
        this.storage.set('CURR_SERVER_URL', 'LOCAL_SERVE_URL');        
      }

    });

  }


}
