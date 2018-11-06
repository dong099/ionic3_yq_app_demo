import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//import {Storage} from '@ionic/storage';
import { NativeService } from '../../providers/native-service';
//import { FileObj } from '../../model/FileObj';
/**
 * Generated class for the UpdatePicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var AlloyCrop;


@IonicPage()
@Component({
  selector: 'page-update-pic',
  templateUrl: 'update-pic.html',
})
export class UpdatePicPage {
  avatarPath: string;
  isChange: boolean = false;//头像是否改变标识
  targetWidth: number = 0;
  targetHeight: number = 0;

  constructor(private params: NavParams,
    public navCtrl: NavController, 
    private viewCtrl: ViewController,
    private nativeService: NativeService) {

      this.avatarPath = this.params.get('avatarPath');
      this.targetWidth = this.params.get('targetWidth')?this.params.get('targetWidth'):this.targetWidth;
      this.targetHeight = this.params.get('targetHeight')?this.params.get('targetHeight'):this.targetHeight;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePicPage');
  }




  dismiss() {
    this.viewCtrl.dismiss();
  }

  //http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html
  getPicture(type) {//1拍照,0从图库选择
    let options = {
      //targetWidth: this.targetWidth,
      //targetHeight: this.targetHeight,
      quality: 100
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).subscribe(imageBase64 => {
        //this.getPictureSuccess(imageBase64);
        this.avatarPath = imageBase64;
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).subscribe(imageBase64 => {
        //this.getPictureSuccess(imageBase64);
        this.avatarPath = imageBase64;
      });
    }
  }




  private getPictureSuccess(imageBase64) {
    new AlloyCrop({//api:https://github.com/AlloyTeam/AlloyCrop
      image_src: imageBase64,
      circle: true, // optional parameters , the default value is false
      width: 256, // crop width
      height: 256, // crop height
      output: 1,
      ok: (base64) => {
        this.isChange = true;
        this.avatarPath = base64;
      },
      cancel: () => {
      },
      ok_text: "确定", // optional parameters , the default value is ok
      cancel_text: "取消" // optional parameters , the default value is cancel
    });

  }


  saveAvatar() {
    // if (this.isChange) {
    //   let fileObj = <FileObj>{'base64': this.avatarPath};
    //   this.fileService.uploadByBase64(fileObj).subscribe(fileObj => {// 上传头像图片到文件服务器
    //     let avatarId = fileObj.id, avatarPath = fileObj.origPath;
    //     this.mineService.updateUserAvatarId(avatarId).subscribe(res => {//保存avatar字段到用户表
    //       this.storage.get('LoginInfo').then((loginInfo: LoginInfo) => {
    //         loginInfo.user.avatarId = avatarId;
    //         loginInfo.user.avatarPath = avatarPath;
    //         this.storage.set('LoginInfo', loginInfo);
    //       });
          this.viewCtrl.dismiss({avatarPath: this.avatarPath});
    //     });
    //   });
    // } else {
    //   this.dismiss();
    // }
  }



}
