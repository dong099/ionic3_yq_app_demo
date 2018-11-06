import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { GlobalData } from '../../providers/global-data';
import { WWW_IMGS_URL, ERROR_BANG, DEFAULT_AVATAR } from '../../providers/Constants';
import { UpdatePicPage } from '../../components/ion2-images/update-pic';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { YqHttpService } from '../../providers/yq-http-service';
import { NativeService } from '../../providers/native-service';
import { TranslateService } from 'ng2-translate';
import { InAppBrowser } from '@ionic-native/in-app-browser';


/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  //@ViewChild('avararImg') avararImg: any;

  username: string;
  avatarPath: string;
  // constructor(public navCtrl: NavController, public navParams: NavParams) {
  // }
  constructor(public alertCtrl: AlertController,
    private globalData: GlobalData,
    private modalCtrl: ModalController,
    private httpSvc: YqHttpService,
    public inAppBrowser: InAppBrowser,
    public translate: TranslateService,
    private nativeService: NativeService,
    public navCtrl: NavController) {


  }


  ionViewDidLoad() {
    this.getUsername();
  }

  showBigImg() {

    if (this.avatarPath && this.avatarPath !== DEFAULT_AVATAR) {
      this.inAppBrowser.create(
        this.avatarPath,
        '_blank',
        'location=no'
      );
      return false;
    }
  }



  updateUser() {
    this.globalData.getLoggedUser().then((loggedUser) => {
      this.navCtrl.push('SignupPage', { oidIndex: loggedUser.oidIndex });
    });

  }



  getUsername() {
    this.globalData.getLoggedUser().then((loggedUser) => {

      this.username = loggedUser.username;
      if (loggedUser.headImgUrl)
        this.avatarPath = WWW_IMGS_URL + loggedUser.headImgUrl;
      else
        this.avatarPath = DEFAULT_AVATAR;

    });

  }

  updatePic() {
    let modal = this.modalCtrl.create(UpdatePicPage, { avatarPath: this.avatarPath });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.avatarPath = data.avatarPath;

        //to upload changes
        this.uploadAvatar(this.avatarPath);

      }
    });
  }


  uploadAvatar(imgData: any) {

    this.globalData.getLoggedUser().then((loggedUser) => {

      let headers: any = ConfigProvider.formHeaders;
      let postUrl: string = "/uploadAvatar";

      //organize FormData if it has $file choosed
      let formData: FormData = new FormData();
      formData.append("rowData", "{'oidIndex':'" + loggedUser.oidIndex + "','avatarData':'" + imgData + "'}");

      this.httpSvc.postData(postUrl, "yq_users", formData, headers)
        .subscribe(data => {
          this.globalData.login(loggedUser.username, data);
          this.nativeService.hideLoading();

          this.navCtrl.push('TabsPage');
          //this.navCtrl.pop();

        }, error => {
          this.onError(<any>error);
          // this.submitted = false;
        });




    });

  }


  onError(message: any) {
    this.translate.get([message, ERROR_BANG]).subscribe(res => {
      this.nativeService.showToast(res[ERROR_BANG] + "[" + res[message] + "]");
    });
  }


  changePassword() {
    console.log('Clicked to change password');
  }


}
