import {Injectable} from "@angular/core";

import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {Observable} from "rxjs";
import { Platform, AlertController, Loading, ToastController, LoadingController } from 'ionic-angular';
import {File, FileEntry} from "@ionic-native/file";
import {Network} from "@ionic-native/network";
import {AppVersion} from "@ionic-native/app-version";
import {APP_DOWNLOAD, APK_DOWNLOAD, IMAGE_SIZE, QUALITY_SIZE, REQUEST_TIMEOUT} from "./Constants";
import { Logger } from './logger';
import {Toast} from "@ionic-native/toast";
// import {AppMinimize} from "@ionic-native/app-minimize";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GlobalData } from './global-data';
import {Diagnostic} from "@ionic-native/diagnostic";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import { Utils } from './Utils';
import {Position} from "../model/Types";


declare var LocationPlugin;
declare var AMapNavigation;

@Injectable()
export class NativeService {
    private loading: Loading;
    private loadingIsOpen: boolean = false;

    constructor(private platform: Platform,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        // private statusBar: StatusBar,
        // private splashScreen: SplashScreen,
        private appVersion: AppVersion,
        private camera: Camera,
        private toast: Toast,
        private transfer: Transfer,
        private file: File,
        private inAppBrowser: InAppBrowser,
        private imagePicker: ImagePicker,
        private network: Network,
        // private appMinimize: AppMinimize,
        private loadingCtrl: LoadingController,
        private globalData: GlobalData,
        private diagnostic: Diagnostic,
        public logger: Logger
    ) { 

    }




  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.globalData.showLoading) {
      return;
    }
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {

        if (this.loadingIsOpen) {
          this.loading.dismiss();
          this.showToast("Timeout, please check the network.");
        }

        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
   

      }, REQUEST_TIMEOUT);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    if (!this.globalData.showLoading) {
      this.globalData.showLoading = true;
    }
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };



  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
      //**  https://github.com/apache/cordova-plugin-camera
      // * DATA_URL	number	0	Return base64 encoded string. DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible
      //  FILE_URI	number	1	Return file uri (content://media/external/images/media/2 for Android)
      //  NATIVE_URI	number	2	Return native uri (eg. asset-library://... for iOS)
      // */
    }, options);

    //https://github.com/apache/cordova-plugin-camera#cameraoptions-errata-
    // const options: CameraOptions = {
    //   quality: 100,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }



    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64:
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;
    //  }, (err) => {
    //   // Handle error
    //  });

    return this.getPicture(ops);
  };


   /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: QUALITY_SIZE,//图像质量，范围为0 - 100
      allowEdit: true,//选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      //targetWidth: IMAGE_SIZE,//缩放图像的宽度（像素）
      //targetHeight: IMAGE_SIZE,//缩放图像的高度（像素）
      saveToPhotoAlbum: false,//是否保存到相册
      correctOrientation: true//Rotate the image to correct for the orientation of the device during capture.
    }, options);
    return Observable.create(observer => {


      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {

          observer.next('data:image/jpg;base64,' + imgData);

        } else {

          observer.next(imgData);

        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
        this.alert('获取照片失败' + err);
      });
    });
  };




  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
      maximumImagesCount: 6,
      width: IMAGE_SIZE,//缩放图像的宽度（像素）
      height: IMAGE_SIZE,//缩放图像的高度（像素）
      quality: QUALITY_SIZE//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          let imgBase64s = [];//base64字符串数组
          for (let fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            })
          }
        }
      }).catch(err => {
        this.logger.log(err, '通过图库选择多图失败');
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
      });
    });
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app版本号失败');
      });
    });
  }

  /**
   * 获得app name,如现场作业
   * @description  对应/config.xml中name的值
   */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app name失败');
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app包名失败');
      });
    });
  }




  alert(title: string, subTitle: string = "",): void {
    this.hideLoading();
    this.alertCtrl.create({
      title: title,
      mode: "ios",
      subTitle: subTitle,
      buttons: [{text: '确定'}]
    }).present();
  };


   /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {

    this.hideLoading();

    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'bottom',
        showCloseButton: false
      }).present();
    }
  };


  /**
   * 调用最小化app插件
   */
  minimize(): void {
    // this.appMinimize.minimize()
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }


    /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }



  /**
   * 下载安装app
   */
  downloadApp(): void {
    if (this.isIos()) {//ios打开网页下载
      this.openUrlByBrowser(APP_DOWNLOAD);
    }
    if (this.isAndroid()) {//android本地下载
      let backgroundProcess = false;//是否后台下载
      let alert = this.alertCtrl.create({//显示下载进度
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: [{
          text: '后台下载', handler: () => {
            backgroundProcess = true;
          }
        }
        ]
      });
      alert.present();

      const fileTransfer: TransferObject = this.transfer.create();
      const apk = this.file.externalRootDirectory + `android_${Utils.getSequence()}.apk`; //apk保存的目录

      //下载并安装apk
      fileTransfer.download(APK_DOWNLOAD, apk).then(() => {
        window['install'].install(apk.replace('file://', ''));
      }, err => {
        alert.dismiss();
        this.logger.log(err, 'android app 本地升级失败');
        this.alertCtrl.create({
          title: '前往网页下载',
          subTitle: '本地升级失败',
          buttons: [
            {
              text: '确定',
              handler: () => {
                this.openUrlByBrowser(APP_DOWNLOAD);//打开网页下载
              }
            }
          ]
        }).present();
      });

      let timer = null;//由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
      fileTransfer.onProgress((event: ProgressEvent) => {
        let progress = Math.floor(event.loaded / event.total * 100);//下载进度
        this.globalData.updateProgress = progress;
        if (!backgroundProcess) {
          if (progress === 100) {
            alert.dismiss();
          } else {
            if (!timer) {
              timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
                let title = document.getElementsByClassName('alert-title')[0];
                title && (title.innerHTML = `下载进度：${progress}%`);
              }, 1000);
            }
          }
        }
      });
    }
  }


    /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }


 


  /**
   * 获得用户当前坐标
   */
  getUserLocation() {
    return Observable.create(observer => {
      if (this.isMobile()) {
        this.assertLocationService().subscribe(res => {
          if (res) {
            this.assertLocationAuthorization().subscribe(res => {
              if (res) {
                return this.getLocation(observer);
              }
            })
          }
        })
      } else {
        console.log('非手机环境,即测试环境返回固定坐标'); 
        observer.next({'lng': 121.47519, 'lat': 31.228833});
      }
    });
  }



  private getLocation(observer) {
    LocationPlugin.getLocation(data => {
      observer.next({'lng': data.longitude, 'lat': data.latitude});
    }, msg => {
      observer.error('获取位置失败');
      if (msg.indexOf('缺少定位权限') != -1) {
        alert('缺少定位权限，请在手机设置中检查是否同时已开启GPS和应用授权定位')
      } else if (msg.indexOf('WIFI信息不足') != -1) {
        alert('定位失败,请确保连上WIFI或者关掉WIFI只开流量数据')
      } else if (msg.indexOf('网络连接异常') != -1) {
        alert('网络连接异常,请检查您的网络是否畅通')
      } else {
        alert('位置错误,错误消息:' + msg);
        this.logger.log(msg, '获取位置失败');
      }
    });
  }

 //检测app位置服务是否开启
 private assertLocationService = (() => {
  let enabledLocationService = false;//手机是否开启位置服务
  return () => {
    return Observable.create(observer => {
      if (enabledLocationService) {
        observer.next(true);
      } else {
        this.diagnostic.isLocationEnabled().then(enabled => {
          if (enabled) {
            enabledLocationService = true;
            observer.next(true);
          } else {
            enabledLocationService = false;
            this.alertCtrl.create({
              title: '您未开启位置服务',
              subTitle: '正在获取位置信息',
              buttons: [{text: '取消'},
                {
                  text: '去开启',
                  handler: () => {
                    this.diagnostic.switchToLocationSettings();
                  }
                }
              ]
            }).present();
          }
        }).catch(err => {
          this.logger.log(err, '调用diagnostic.isLocationEnabled方法失败');
        });
      }
    });
  };
})();

//检测app是否有定位权限
private assertLocationAuthorization = (() => {
  let locationAuthorization = false;
  return () => {
    return Observable.create(observer => {
      if (locationAuthorization) {
        observer.next(true);
      } else {
        this.diagnostic.isLocationAvailable().then(res => {
          if (res) {
            locationAuthorization = true;
            observer.next(true);
          } else {
            locationAuthorization = false;
            this.diagnostic.requestLocationAuthorization('always').then(res => {//请求定位权限
              if (res == 'DENIED_ALWAYS') {//拒绝访问状态,必须手动开启
                locationAuthorization = false;
                this.alertCtrl.create({
                  title: '缺少定位权限',
                  subTitle: '请在手机设置或app权限管理中开启',
                  buttons: [{text: '取消'},
                    {
                      text: '去开启',
                      handler: () => {
                        this.diagnostic.switchToSettings();
                      }
                    }
                  ]
                }).present();
              } else {
                locationAuthorization = true;
                observer.next(true);
              }
            }).catch(err => {
              this.logger.log(err, '调用diagnostic.requestLocationAuthorization方法失败');
            });
          }
        }).catch(err => {
          this.logger.log(err, '调用diagnostic.isLocationAvailable方法失败');
        });
      }
    });
  };
})();



/**
   * 地图导航
   * @param startPoint 开始坐标
   * @param endPoint 结束坐标
   * @param type 0实时导航,1模拟导航,默认为模拟导航
   */
  navigation(startPoint: Position, endPoint: Position, type = 1): Observable<string> {
    return Observable.create(observer => {
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        AMapNavigation.navigation({
          lng: startPoint.lng,
          lat: startPoint.lat
        }, {
          lng: endPoint.lng,
          lat: endPoint.lat
        }, type, message => {
          observer.next(message);
        }, err => {
          this.logger.log(err, '导航失败');
          this.alert('导航失败');
        });
      } else {
        this.alert('非手机环境不能导航');
      }
    });
  }





}