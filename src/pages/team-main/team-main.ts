import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TEAM, ERROR_BANG, SUCCESS_BANG } from '../../providers/Constants';
import { NgForm } from '@angular/forms';
import { GlobalData } from '../../providers/global-data';
import { YqHttpService } from '../../providers/yq-http-service';
import { NativeService } from '../../providers/native-service';
import { TranslateService } from 'ng2-translate';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { Util } from '../../providers/yq-utils';

/**
 * Generated class for the TeamMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-main',
  templateUrl: 'team-main.html',
})
export class TeamMainPage {

  formOpt: any = TEAM;

  currId: number = -1;
  callback: any;

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
  }

  getDetailFromDb() {
    if (this.currId === -1) {
      this.globalData.getLoggedUser().then((loggedUser) => {
        this.formOpt.leader = loggedUser;
      });
      this.formOpt = TEAM;
      return;
    }
    this.httpSvc.getData("/getData/yq_team/" + this.currId)
      .subscribe(data => {
        console.log(data);
        this.formOpt = data;
      }, error => {
        this.onError(<any>error);
      });
  }

  onError(message: any) {
    this.translate.get([message, ERROR_BANG]).subscribe(res => {
      this.nativeService.showToast(res[ERROR_BANG] + "[" + res[message] + "]");
    });
  } 

  update(form: NgForm){
    
    let headers: any = ConfigProvider.formHeaders;
    let postUrl: string = "/insertOrUpdate"; 

    //organize FormData if it has $file choosed
    let formData: FormData = new FormData();
    formData.append("rowData", Util.toJsonString(this.formOpt));

    this.httpSvc.postData(postUrl, "yq_team", formData, headers)
      .subscribe(data => {
        this.onSuccess(<any>data);
      }, error => {
        this.onError(<any>error);
        // this.submitted = false;
      });
  }


  onSuccess(message: any) {

    this.translate.get(SUCCESS_BANG).subscribe(res => {
      this.nativeService.showToast(res + "[" + Util.getErrorMessage(message) + "]");

      //this.navCtrl.pop();
      this.callback(true).then(() => { 
        this.navCtrl.pop();
      });

    });
  }

}
