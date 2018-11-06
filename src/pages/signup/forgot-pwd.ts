import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/ConfigProvider';
import { YqHttpService } from '../../providers/yq-http-service';
import { NativeService } from '../../providers/native-service';
import { TranslateService } from 'ng2-translate';
import { ERROR_BANG, SUCCESS_BANG } from '../../providers/Constants';
import { Util } from '../../providers/yq-utils';

/**
 * Generated class for the ForgotPwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-pwd',
  templateUrl: 'forgot-pwd.html',
})
export class ForgotPwdPage {

  email: string;

  constructor(public navCtrl: NavController,
    private httpSvc: YqHttpService,
    private alertCtrl: AlertController,
    private nativeService: NativeService,
    public translate: TranslateService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPwdPage');
  }

  sendMail(){
    let headers: any = ConfigProvider.formHeaders;
    let postUrl: string = "/sendMail"; 

    //organize FormData if it has $file choosed
    let formData: FormData = new FormData();
    formData.append("email", this.email);

    this.httpSvc.postData(postUrl, "yq_team", formData, headers, 20000)
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

  onSuccess(data: any) { 
      //this.nativeService.alert("密码已经发送到您的email， 请记住您的登陆用户名：" + data.userName);
      //this.navCtrl.pop(); 
      this.nativeService.hideLoading();
      let title = "密码已经发送到您的email， 请记住您的登陆用户名：" + data.userName;
      this.alertCtrl.create({
        title: title,
        mode: "ios",
        subTitle: "",
        buttons: [{text: '确定',handler: data => {
          this.navCtrl.pop(); 
        }}]
      }).present();
  }

}
