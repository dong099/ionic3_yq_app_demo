import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { GlobalData } from '../../providers/global-data';
import { NativeService } from '../../providers/native-service';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { Util } from '../../providers/yq-utils';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';
import { ERROR_BANG } from '../../providers/Constants';
 
 

 
declare var Wechat;

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: any = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController,
    private globalData: GlobalData,
    public navParams: NavParams,
    public translate: TranslateService,
    private httpSvc: YqHttpService,
    private nativeService: NativeService) { 

      this.login.username = this.navParams.data.username;

    }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {

      let headers: any = ConfigProvider.formHeaders;
      let postUrl: string = "/login"; 

      //organize FormData if it has $file choosed
      let formData: FormData = new FormData();
 

      formData.append("rowData", Util.toJsonString(this.login));

      this.httpSvc.postData(postUrl, "yq_users", formData, headers)
        .subscribe(data => {
          //this.onSuccess(<any>data);
          this.globalData.login(this.login.username,  data);
          this.nativeService.hideLoading();
          //this.navCtrl.push('TabsPage');
          this.navCtrl.pop();
        }, error => {
          this.onError(<any>error);
          // this.submitted = false;
        });
 
    }
  }

  onError(message: any) {
    this.translate.get([message, ERROR_BANG]).subscribe(res => {
      this.nativeService.showToast(res[ERROR_BANG] + "[" + res[message] + "]");
    });
  }

  onSignup() {
    this.navCtrl.push('SignupPage',{ oidIndex: -1 });
  }


  wechatLogin(typ: number) {
    if (typeof Wechat === "undefined") {
      this.nativeService.showToast("Wechat plugin is not installed.");
      return false;
    } 

    //https://github.com/xu-li/cordova-plugin-wechat

    if (typ === 0) {
      //yq sec: a526d86fd3025074ad3b46032b70ca26

      var scope = "snsapi_userinfo", state = "_" + (+new Date());
      Wechat.auth(scope, state, function (response) {
          // you may use response.code to get the access token.
          alert(JSON.stringify(response));
      }, function (reason) {
          alert("Failed: " + reason);
      });

    }  
  }


  forgetPwd(){
    this.navCtrl.push('ForgotPwdPage');    
  }

}
