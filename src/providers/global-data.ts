import { Injectable } from '@angular/core';
import { HAS_LOGGED_IN, LOGGED_USER, CURR_CITY } from './Constants';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { UserInfo } from '../model/UserInfo';

@Injectable()
export class GlobalData {

  private _userId: string;//用户id
  private _username: string;//用户名
  // private _fullName: string;//姓名
  private _token: string;//token

  data: any;

  constructor(
    public http: Http,
    public storage: Storage
  ) { }

 

  loadGlobalSelectOpts(): Observable<any> { 

    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/select_opts.json')
        .map(result=>{
          this.data = result;
          return this.data;
        });
    }
  }

 


  //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
  private _showLoading: boolean = true;

  //app更新进度.默认为0,在app升级过程中会改变
  private _updateProgress: number = -1;


  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  // get fullName(): string {
  //   return this._fullName;
  // }

  // set fullName(value: string) {
  //   this._fullName = value;
  // }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  get updateProgress(): number {
    return this._updateProgress;
  }

  set updateProgress(value: number) {
    this._updateProgress = value;
  }


  login(username: string, user?:any): void {
    this.storage.set(HAS_LOGGED_IN, true);
    this.username = (username); 

    this.storage.set(LOGGED_USER, user);

  };

  signup(username: string, user?:any): void {
    this.storage.set(HAS_LOGGED_IN, true);
    this.username = (username);

 
    this.storage.set(LOGGED_USER, user);
  };

  logout(): void {
    this.storage.remove(HAS_LOGGED_IN);
    this.storage.remove(LOGGED_USER);


  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  getLoggedUser(): Promise<any> {
    return this.storage.get(LOGGED_USER).then((value) => {
      console.log(value);
      //value = { oid_index: 0, username: '测试用户', nick_name: '' };
      return value;
    });
  };

  storeCity(city: string): void {
    this.storage.set(CURR_CITY, city);
  };

  getCurrCity(): Promise<string> {
    return this.storage.get(CURR_CITY).then((value) => {
      return value;
    });
  };


}
