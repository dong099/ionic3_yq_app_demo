import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


import {TextInput, IonicPage,  NavController,  ModalController,  NavParams} from 'ionic-angular';
 
import { DEFAULT_AVATAR, USER, ERROR_BANG, SUCCESS_BANG, WWW_IMGS_URL } from '../../providers/Constants';
//import { NativeService } from '../../providers/native-service';
import { UpdatePicPage } from '../../components/ion2-images/update-pic';
import { GlobalData } from '../../providers/global-data';
import { AutoCompleteProvider } from '../../providers/autoCompleteProvider';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';
import { NativeService } from '../../providers/native-service';
import { Util } from '../../providers/yq-utils';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { URLSearchParams } from '@angular/http';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



 


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
}) 
export class SignupPage {
  //@ViewChild('username') usernameCtrl: TextInput;

  previewFlag: boolean = true;
  avatarPath: string = DEFAULT_AVATAR;
  signup: any = USER;
  submitted = false;
  currId: number = -1;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private httpSvc: YqHttpService,
    public inAppBrowser: InAppBrowser,
    private nativeService: NativeService,
    public translate: TranslateService,
    private autoCompleteProvider: AutoCompleteProvider,
    public navParams: NavParams,
    private globalData: GlobalData
    ) {

      this.currId = this.navParams.data.oidIndex;

  }

  ionViewDidLoad(){    

    this.getDetailFromDb();

    this.setPreviewFlag();

    
  }

  setPreviewFlag(){

    this.globalData.getLoggedUser().then((loggedUser: any) => {
      if (this.currId === -1){
        this.previewFlag = false;
      } else if(!loggedUser)
        this.previewFlag = true;
      else
        this.previewFlag = (loggedUser.oidIndex!= this.currId);

    });

   
  }

  getDetailFromDb() {
    if (this.currId === -1) {
      this.getCurrentCity();
      return;
    }
    this.httpSvc.getData("/getData/yq_users/" + this.currId)
      .subscribe(data => {

        this.signup = data;

        if (this.signup.headImgUrl!=="") {
          this.avatarPath = WWW_IMGS_URL + this.signup.headImgUrl;
        }

        


      }, error => {
        this.onError(<any>error);
      });
  }

  onError(message: any) {
    this.translate.get([message, ERROR_BANG]).subscribe(res => {
      this.nativeService.showToast(res[ERROR_BANG] + "[" + res[message] + "]");
    });
  }
 

  onSignup(form: NgForm) {
    if (form.valid) {
      
      this.submitted = true;
      let headers: any = ConfigProvider.formHeaders;
      let postUrl: string = "/insertOrUpdate"; 

      //organize FormData if it has $file choosed
      let formData: FormData = new FormData();

      if(this.avatarPath 
        && this.avatarPath !== DEFAULT_AVATAR
        && !this.avatarPath.startsWith(WWW_IMGS_URL))
        this.signup.avatarData = this.avatarPath;

      formData.append("rowData", Util.toJsonString(this.signup));

      this.httpSvc.postData(postUrl, "yq_users", formData, headers)
        .subscribe(data => {
          //this.onSuccess(<any>data);
          this.nativeService.hideLoading();
          if(this.signup.oidIndex)
          this.globalData.login(this.signup.username,  this.signup);

          //if(!this.previewFlag)
          //this.navCtrl.push('LoginPage',{ username: this.signup.username });
          this.navCtrl.pop();

        }, error => {
          this.onError(<any>error);
          // this.submitted = false;
        });

    }
  }

  validateUserName(){

    //refer to TeamSearchPage
    let params = new URLSearchParams();  //great pit, it's from http package.
    params.append('paramMap', "{username:{t:str,v:'" + this.signup.username + "'}}");

    this.httpSvc.getData("/getData/yq_users/", params)
      .subscribe(data => {
     
        if(data && data.length > 0) {
          this.nativeService.showToast("用户名" + this.signup.username + "已经存在， 请尝试新的用户名！");
        }
      }, error => {
        this.onError(<any>error);
      });


    /**
      let headers: any = ConfigProvider.formHeaders;
      let postUrl: string = "/getUserCnt"; 

      //organize FormData if it has $file choosed
      let formData: FormData = new FormData();
 

      formData.append("rowData", "{'username':'" + this.signup.username + "'}");

      this.httpSvc.postData(postUrl, "yq_users", formData, headers)
        .subscribe(data => {
          //this.onSuccess(<any>data);
          let userCnt = (<any>data).userCnt;
          if(userCnt > 0)  {
            this.nativeService.showToast("用户名" + this.signup.username + "已经存在， 请尝试新的用户名！");
            //this.usernameCtrl.setFocus(); //exception

          } else{
             this.nativeService.hideLoading();
          }

        }, error => {
          this.onError(<any>error);
          // this.submitted = false;
        });
      */
  }
 

  getSelect(sel: any) {
    this.signup.city = sel.name;
  }

  getCurrentCity() {
    if(this.signup.oidIndex) return false;
    this.globalData.getCurrCity().then((currCity) => {
      if (currCity) {
        this.signup.city = currCity + "市";
      }
    });
  }






  updatePic() {
    //won't allow update of img for edit
    if(this.previewFlag) {     
      if(this.signup.headImgUrl)
        this.inAppBrowser.create(
          WWW_IMGS_URL + this.signup.headImgUrl,
          '_blank',
          'location=no'
        );
      return false;
    }
    let modal = this.modalCtrl.create(UpdatePicPage, { avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }

}
