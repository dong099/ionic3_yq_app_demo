
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalData } from '../../providers/global-data';

import { URLSearchParams } from '@angular/http';
import { YqHttpService } from '../../providers/yq-http-service';
import { NativeService } from '../../providers/native-service';
import { TranslateService } from 'ng2-translate';
import { ERROR_BANG, WWW_IMGS_URL, DEFAULT_AVATAR } from '../../providers/Constants';

/**
 * Generated class for the MeMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-me-main',
  templateUrl: 'me-main.html',
})
export class MeMainPage {
  teamList: any; //storing all items

  currUser: any;
  avatarPath: string;

  pageStatusMsg: string = "登陆后可以创建自己的团队...";

  constructor(public navCtrl: NavController,
    private globalData: GlobalData,
    private httpSvc: YqHttpService,
    private nativeService: NativeService,
    private translate: TranslateService,
    public navParams: NavParams) {
  }


  ionViewDidEnter(){ 

    this.getLoggedUser();

    this.getTeamListFromDb();
  }

  getLoggedUser(){
    this.globalData.getLoggedUser().then((loggedUser: any) => {
      if(!loggedUser) {
        this.avatarPath = DEFAULT_AVATAR;
        return false;
      }
      this.currUser = loggedUser;
      if (loggedUser.headImgUrl)
        this.avatarPath = WWW_IMGS_URL + loggedUser.headImgUrl;
      else
        this.avatarPath = DEFAULT_AVATAR;
    });
  }

  getTeamListFromDb() {
    this.globalData.getLoggedUser().then((loggedUser: any) => {

      if (!loggedUser) {
        return false;
      }

      let params = new URLSearchParams();  //great pit, it's from http package.

      //refer to TeamSearchPage
      params.append('paramMap', "{leader:{t:int,v:'" + loggedUser.oidIndex + "'}}");
  
      this.httpSvc.getData("/getData/yq_team/", params)
        .subscribe(data => {
          this.teamList = data;
 
          if(!this.teamList || this.teamList.length === 0) {
            this.pageStatusMsg = "你还没有自己的团队!";
          }
        }, error => {
          this.onError(<any>error);
        });

    });  
  }

  onError(message: any) {
    this.translate.get(ERROR_BANG).subscribe(res => {
      this.nativeService.showToast(res + "[" + message + "]");
      this.pageStatusMsg = "Loading failed, pls check network.";
    });
  }

  gotoSettings() {
    this.navCtrl.push('SysSettingPage');

  }

  logout() {
    this.globalData.logout();
    this.navCtrl.setRoot('TabsPage');
  }

  support() {
    this.navCtrl.push('SupportPage');
  }

  info(pageInd: number) {
    this.navCtrl.push('InfoPage', { data: pageInd });
  }


  onLogin() {

    this.globalData.hasLoggedIn().then((hasLoggedIn) => {

      if (hasLoggedIn) {

        this.navCtrl.push('AccountPage');
      } else {
        this.navCtrl.push('LoginPage');

      }

    });
  }


  getTeamData = (data) => {
    return new Promise((resolve, reject) => {
      this.getTeamListFromDb();
      resolve();
    });
  };


  teamDtl(tid: number) {
    this.navCtrl.push('TeamMainPage', { oidIndex: tid, callback: this.getTeamData });
  }
}
