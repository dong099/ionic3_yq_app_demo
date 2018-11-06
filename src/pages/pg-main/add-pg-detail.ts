import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AutoCompleteProvider } from '../../providers/autoCompleteProvider';
import { DEFAULT_AVATAR, PG, ERROR_BANG, SUCCESS_BANG, WWW_IMGS_URL } from '../../providers/Constants';
import { TranslateService } from 'ng2-translate';
import { GlobalData } from '../../providers/global-data';
import { YqHttpService } from '../../providers/yq-http-service';
import { NativeService } from '../../providers/native-service';
import { Util } from '../../providers/yq-utils';
import { SearchAddress } from './search-address/search-address';
import { NgForm } from '@angular/forms';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the AddPgDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-pg-detail',
  templateUrl: 'add-pg-detail.html',
})
export class AddPgDetailPage {
  currId: number = -1;
  callback: any;

  avatarPath: string = DEFAULT_AVATAR;
  formOpt: any = PG;

  constructor(
    public navCtrl: NavController, 
    public globalData: GlobalData,
    private httpSvc: YqHttpService,
    private nativeService: NativeService,
    public translate: TranslateService,
    public changeDetectionRef : ChangeDetectorRef,
    public modalCtrl: ModalController,
    public inAppBrowser: InAppBrowser,
    private autoCompleteProvider: AutoCompleteProvider,
    public navParams: NavParams) {



      this.currId = this.navParams.data.oidIndex;
      this.callback = this.navParams.get('callback');
  }

  ionViewDidLoad() {
    this.getDetailFromDb();
  }

  getDetailFromDb() {
    if (this.currId === -1) {
      this.globalData.getLoggedUser().then((loggedUser) => {
        this.formOpt.createdBy = loggedUser;
      });
     
      return;
    }
    this.httpSvc.getData("/getData/yq_playground/" + this.currId)
      .subscribe(data => {

        console.log(data);
        this.formOpt = data;
        console.log(this.formOpt.name);

      }, error => {
        this.onError(<any>error);
      });
  }


  onError(message: any) {
    this.translate.get([message, ERROR_BANG]).subscribe(res => {
      this.nativeService.showToast(res[ERROR_BANG] + "[" + res[message] + "]");
    });
  }

  onSuccess(message: any) {

    this.translate.get(SUCCESS_BANG).subscribe(res => {
      this.nativeService.showToast(res + "[" + Util.getErrorMessage(message) + "]");
 
      this.callback(true).then(() => { 
        this.navCtrl.setRoot('PgMainPage');
      });

    });
  }


  getGeo(){
    //跳转到地址查询搜索页面,并返回一个地址对象(经纬坐标+中文地址) 
 
    //modalCtrl.create页面的双引号是要的，不然就报错了说没有引入 

    //Ctrl+P  , input : #GetMapLocationPage, this will find the definition file, or Ctrl + T
 
    let locationSearchModal = this.modalCtrl.create("GetMapLocationPage", { geoPoint: this.formOpt.geoPoint,address: this.formOpt.addr});
    locationSearchModal.present();
    let that = this;
    locationSearchModal.onDidDismiss(item => {
      if (item) {
        that.formOpt.geoPoint=(item.position.lng + "," + item.position.lat);
        that.formOpt.addr=item.address;
       
      }
    });
    //this.changeDetectionRef.detectChanges(); 
  }


  getSelect(sel: any) {
    this.formOpt.city = sel.name;
  }


  doPg(form: NgForm) {

    console.log(form.value);

    // this.submitted = true;

    let headers: any = ConfigProvider.formHeaders;
    let postUrl: string = "/insertOrUpdate"; 

    //organize FormData if it has $file choosed
    let formData: FormData = new FormData();

    //for avatar part
    if(this.avatarPath 
      && this.avatarPath !== DEFAULT_AVATAR
      && !this.avatarPath.startsWith(WWW_IMGS_URL))
      this.formOpt.avatarData = this.avatarPath;

    formData.append("rowData", Util.toJsonString(this.formOpt));

    this.httpSvc.postData(postUrl, "yq_playground", formData, headers)
      .subscribe(data => {
        this.onSuccess(<any>data);
      }, error => {
        this.onError(<any>error);
        // this.submitted = false;
      });


  }


  updatePic() {
    this.globalData.getLoggedUser().then((loggedUser: any) => {
      if (!loggedUser || !this.formOpt.createdBy || loggedUser.oidIndex != this.formOpt.createdBy.oidIndex) {

        if (this.formOpt.pgImgUrl)
          this.inAppBrowser.create(
            WWW_IMGS_URL + this.formOpt.pgImgUrl,
            '_blank',
            'location=no'
          );
        return false;

      } else {
        let modal = this.modalCtrl.create("UpdatePicPage", { avatarPath: this.avatarPath });
        modal.present();
        modal.onDidDismiss(data => {
          data && (this.avatarPath = data.avatarPath)
        });
      }


    });    
  }



}
