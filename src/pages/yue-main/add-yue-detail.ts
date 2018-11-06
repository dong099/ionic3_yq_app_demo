import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalData } from '../../providers/global-data';

import { YqHttpService } from '../../providers/yq-http-service';
import { DEFAULT_AVATAR, calOptions, ERROR_BANG, SUCCESS_BANG, YUEMAINFORM } from '../../providers/Constants';
import { UpdatePicPage } from '../../components/ion2-images/update-pic';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { CalendarModal } from '../../components/ion2-calendar/components/calendar.modal';

import { ConfigProvider } from '../../providers/ConfigProvider';
import { NativeService } from '../../providers/native-service';
import { Util } from '../../providers/yq-utils';
/**
 * Generated class for the AddYueDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-yue-detail',
  templateUrl: 'add-yue-detail.html',
})
export class AddYueDetailPage {
 
  currId: number = -1;
  callback: any;

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  formOpt: any = YUEMAINFORM; //Object.assign({}, YUEMAINFORM);

  actCats = [];
  actCatOpts: any = {
    title: '选择发起活动的类型',
    subTitle: '归个类容易查找'
  };

  constructor(public navCtrl: NavController,
    public globalData: GlobalData,
    private httpSvc: YqHttpService,
    private nativeService: NativeService,
    public translate: TranslateService,
    public navParams: NavParams) {

    

    this.currId = this.navParams.data.oidIndex;
    this.callback = this.navParams.get('callback');
  
  }

 

  ionViewDidLoad() {

    this.getDetailFromDb();

    this.globalData.loadGlobalSelectOpts()
      .subscribe(res => {
        this.actCats = res.json().activities;
        //this.ref.detectChanges();
      }, error => {
        console.log(error);
      });

     
  }


  getDetailFromDb() {
    if (this.currId === -1) {
      this.globalData.getLoggedUser().then((loggedUser) => {
        this.formOpt.yueUid = loggedUser;
      });
     
      return;
    }
    this.httpSvc.getData("/getData/yq_yue_main/" + this.currId)
      .subscribe(data => {

        console.log(data);
        this.formOpt = data;


      }, error => {
        this.onError(<any>error);
      });
  }



  getTeam() {
 
    this.globalData.getLoggedUser().then((loggedUser:any) => {
      this.navCtrl.push('TeamSearchPage', {uid:loggedUser.oidIndex, callback: this.getTeamItem });
    });
    
  }

  getPg() {
    this.navCtrl.push('PgSearchRtnPage', { callback: this.getPgItem });
  }

  getTeamItem = (data) => {
    return new Promise((resolve, reject) => {
      if (data) {
        this.formOpt.yueTid = data;
      }
      resolve();
    });
  };

  getPgItem = (data) => {
    return new Promise((resolve, reject) => {
      if (data) {
        this.formOpt.yuePid = data;
      }
      resolve();
    });
  };

 

  doYue(form: NgForm) {

    // this.submitted = true;

    let headers: any = ConfigProvider.formHeaders;
    let postUrl: string = "/insertOrUpdate"; 

    //organize FormData if it has $file choosed
    let formData: FormData = new FormData();
    formData.append("rowData", Util.toJsonString(this.formOpt));

    this.httpSvc.postData(postUrl, "yq_yue_main", formData, headers)
      .subscribe(data => {
        this.onSuccess(<any>data);
      }, error => {
        this.onError(<any>error);
        // this.submitted = false;
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

      //this.navCtrl.pop();
      this.callback(true).then(() => { 
        this.navCtrl.setRoot('AddYuePage');
      });

    });
  }




}
