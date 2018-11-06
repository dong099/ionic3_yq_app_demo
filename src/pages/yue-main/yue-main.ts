import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WX_SHARE_URL, DEFAULT_AVATAR, PAGE_SIZE, ERROR_BANG, WWW_IMGS_URL } from '../../providers/Constants';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/native-service';
import { GlobalData } from '../../providers/global-data';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';
import { ConfigProvider } from '../../providers/ConfigProvider';

import { URLSearchParams } from '@angular/http';

/**
 * Generated class for the YueMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare var Wechat;
declare var AMap;

@IonicPage()
@Component({
  selector: 'page-yue-main',
  templateUrl: 'yue-main.html',
})
export class YueMainPage {
  YUEMAIN_CACHE: string = "YUEMAIN_CACHE";
  dataType: string = "a";
  actCats = [];

  itemList: any; //storing all items

  //page status control params
  page: number = 0;
  pageStatusMsg: string = "Loading, pls wait...";

  lastSearchs: any;


  constructor(public navCtrl: NavController,
    public inAppBrowser: InAppBrowser,
    private nativeService: NativeService,
    private httpSvc: YqHttpService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    public domSanitizer: DomSanitizer,
    private globalData: GlobalData,
    private sanitize: DomSanitizer,
    public modalCtrl: ModalController,
    public storage: Storage,
    public navParams: NavParams) {
  }



  /**
  * this one can refresh page after each pop back.
  * 	Runs when the page has fully entered and is now the active page. 
  * This event will fire, whether it was the first load or a cached page.
  *  https://ionicframework.com/docs/api/navigation/NavController/
  */
  ionViewDidEnter() {
    this.controlLoginIcon();

  }

  /**
   * 	Runs when the page has loaded. This event only happens once per page being created. 
   * If a page leaves but is cached, then this event will not fire again on a subsequent viewing. 
   * The ionViewDidLoad event is good place to put your setup code for the page.
   * 
   */
  ionViewDidLoad() {

    this.getCurrentCity();

    this.prepareData();

    this.globalData.loadGlobalSelectOpts()
      .subscribe(res => {
        this.actCats = res.json().activities;
        //this.ref.detectChanges();
      }, error => {
        console.log(error);
      });
  }

  prepareData() {

    if (!this.nativeService.isConnecting) {
      this.nativeService.showToast("当前网络状况不佳， 请检查网络设置!");
      this.storage.get(this.YUEMAIN_CACHE)
        .then((cachData) => {
          this.itemList = cachData;
        });
    } else {
      this.getListFromDb();
    }

  }

  gotoYueSearch() {
    let modal = this.modalCtrl.create("YueSearchPage", { data: this.lastSearchs });
    modal.present();

    modal.onWillDismiss((data: string) => {
      if (data) {

        this.lastSearchs = data;
        this.getListFromDb();

      }
    });

  }

  gotoCitySearch() {
    //for this modalCtroller, it needs to add module file in app.module.ts, ==>looks not necessary
    let modal = this.modalCtrl.create("CitySearchPage", "");
    modal.present();

    modal.onWillDismiss((data: string) => {
      if (data) {
        this.globalData.storeCity(data);
        this.cityCode = data;
        this.getListFromDb();

      }
    });


  }

  getCurrentCity() {
    this.globalData.getCurrCity().then((currCity) => {

      if (currCity) {
        this.cityCode = currCity;
      } else {
        this.getCityInfo();

      }

    });

  }

  cityCode: string = "";
  getCityInfo() {
    //加载城市查询插件 
    //http://lbs.amap.com/api/javascript-api/reference/location/#m_AMap.CitySearch
    let that = this;
    AMap.service(["AMap.CitySearch"], function () {
      //实例化城市查询类 
      var citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市 
      citysearch.getLocalCity(function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            var cityinfo = result.city;
            //var citybounds = result.bounds; 

            var cityCode = cityinfo.replace("市", "");
            that.cityCode = cityCode;
            that.globalData.storeCity(cityCode);
          }
        } else {
          that.nativeService.showToast("您当前所在城市：" + result.info + "");
        }
      });
    });
  }

  getMenu(typ: string) {
    if (this.dataType === typ) {
      return "imgTitle";
    }
  }
  loginColor: SafeStyle = "";
  controlLoginIcon() {
    this.globalData.hasLoggedIn().then((hasLoggedIn) => {
      if (hasLoggedIn) {
        //bypassSecurityTrustHtml  
        this.loginColor = this.sanitize.bypassSecurityTrustStyle("color:#32db64;");
      } else {
        this.loginColor = "";
      }
    });

  }


  goToUrl(fab: FabContainer) {
    this.inAppBrowser.create(
      WX_SHARE_URL,
      '_blank'
    );
    fab.close();
  }

  goToTutorial(fab: FabContainer) {
    this.navCtrl.push('TutorialPage');
    fab.close();
  }


  wechatLogin(typ: number) {
    if (typeof Wechat === "undefined") {
      this.nativeService.showToast("Wechat plugin is not installed.");
      return false;
    }

    let params: any = {
      scene: 1 //       label: "会话"-value: 0 ,  "朋友圈"-value: 1,   "收藏"-value: 2
    };


    params.message = {
      title: "Hi, there",
      description: "This is description.",
      thumb: "www/" + DEFAULT_AVATAR, //needs `www`
      mediaTagName: "TEST-TAG-001",
      messageExt: "这是第三方带的测试字段",
      messageAction: "<action>dotalist</action>",
      media: {}
    };



    //SHARING IMAGE
    //params.message.media.type = Wechat.Type.IMAGE;    
    params.message.media.image = "www/assets/img/avatar.png";

    //SHARING URL
    params.message.media.type = Wechat.Type.WEBPAGE;
    params.message.media.webpageUrl = WX_SHARE_URL;

    //https://github.com/xu-li/cordova-plugin-wechat

    if (typ === 1) {
      Wechat.share(params, function () {
        alert("Success");
      }, function (reason) {
        alert("Failed: " + reason);
      });
    }
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

  addFav(yItem: any) {

    this.globalData.getLoggedUser().then((loggedUser: any) => {

      if (!loggedUser) {
        this.nativeService.showToast("please login first!");
        return false;
      }

      let validatedKey = "LOGGED_USER_THUMB_" + yItem.oidIndex + "_" + loggedUser.oidIndex;

      this.storage.get(validatedKey).then((value) => {
        if (value) {
          this.nativeService.showToast("you already thumbed this one!");
          return false;
        }
        let headers: any = ConfigProvider.formHeaders;
        let postUrl: string = "/updateThumb";

        //organize FormData if it has $file choosed
        let formData: FormData = new FormData();
        formData.append("rowData", "{oidIndex:" + yItem.oidIndex + ",currUid:" + loggedUser.oidIndex + "}");

        this.httpSvc.postData(postUrl, "yq_yue_main", formData, headers)
          .subscribe(data => {
            this.onSuccessThumb(data, yItem);

            //to control user's duplicate behaviour
            this.storage.set(validatedKey, "true");

          }, error => {
            this.onError(<any>error);
            // this.submitted = false;
          });



      });

    });


  }

  onSuccessThumb(message: any, yItem: any) {
    yItem.thumbNum = message.rtnVal;
    this.nativeService.hideLoading();
  }

  gotoComments(oid: number, event) {
    console.log(event);
    this.nativeService.alert("密码已经发送到您的email， 请记住您的登陆用户名：nicole.");
    //this.changeDetectorRef.detach();
    //event.stopPropagation();
    //event.preventDefault();
    //return false;
  }

  goYue(oid: number) {
    this.navCtrl.push('AddYueDetailPage', { oidIndex: oid, callback: this.getData });
  }

  checkUserProfile(uid: number) {
    this.navCtrl.push('SignupPage', { oidIndex: uid });
  }

  //等同语法
  //getData = function(_params) 
  getData = (data) => {
    return new Promise((resolve, reject) => {

 
      if (data) {
        //this.ionViewDidLoad();
      }

      resolve();
    });
  };

  /////////////////////////////////////////////////////////
  /////functions on current page
  /////////////////////////////////////////////////////////
  resetPageStatus() {
    this.page = 0;
    this.itemList = null;
  }

  getListFromDb(typ?: string) {
    if (typ) {
      this.lastSearchs = null;
    }

    this.globalData.getLoggedUser().then((loggedUser: any) => {

      if (typ) {
        this.dataType = typ;
      }

      if (typ && typ !== "a" && !loggedUser) {
        this.nativeService.showToast("please login first!");
        return false;
      }


      let params = new URLSearchParams();  //great pit, it's from http package.
      //page, size, sort=fielda,asc/desc
      params.append('page', this.page.toString());
      params.append('size', PAGE_SIZE.toString());



      if (this.lastSearchs) {

        params.append('yueUidName', this.lastSearchs.yueUid);
        params.append('yuePidName', this.lastSearchs.yuePid);
        params.append('activityCat', this.lastSearchs.activityCat);
        params.append('title', this.lastSearchs.title);

      } else {

        switch (this.dataType) {
          case "b":
            params.append('yueUid', loggedUser.oidIndex);
            break;
          case "c":
            params.append('yinUid', loggedUser.oidIndex);
            break;
          default:
            break;
        }
      }

      //cityCode
      params.append('city', this.cityCode);

      this.httpSvc.getData("/getYqYueMain", params)
        .subscribe(data => {
          this.onSuccess(<any>data);
          //if (typ && data.content.length === 0)
          //  this.nativeService.showToast("没有查询到数据！");

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

  onSuccess(message: any) {
    //to parse Page json
    console.log(message);





    if (this.itemList && !(this.itemList.length === 0) && this.page != 0) {
      this.itemList = this.itemList.concat(message.content);

    } else {
      this.itemList = message.content;
    }

    if (!this.itemList || this.itemList.length === 0)
    this.pageStatusMsg = "No Records Found.";

    if (message.content.length === 0) {
      //this.loadingText = ("already the last page!");
      //this.loadingDone = true;
    } else {
      //to cache previous data
      this.storage.set(this.YUEMAIN_CACHE, this.itemList);
    }
  }

  getAvatar(imgName: string) {

    if (imgName) {
      return WWW_IMGS_URL + imgName;
    } else {
      return DEFAULT_AVATAR;
    }
  }

  goPos(pId: any) {
    this.navCtrl.push('MapSearchPage', { data: [pId], callback: this.getMapData });
  }

  getMapData = (data) => {
    return new Promise((resolve, reject) => {
      //this.logContent = data.address + "（" + data.position.lng + "," + data.position.lat + ')';   
      resolve();
    });
  };

  convertCatCd(catCd: string) {
    console.log(catCd);
    let i = { "name": catCd };
    if (catCd && this.actCats) {

      this.actCats.forEach((actCat: any) => {
        if (actCat.code === catCd) {
          i = actCat;
          return false;
        }
      });

      return i.name;
    }

  }


  //http://ionicframework.com/docs/api/components/refresher/Refresher/
  doRefresh(refresher) {
    this.resetPageStatus();
    this.prepareData();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  //no use , sample codes, item is a json
  getKeys(item) {
    return Object.keys(item);
  }

}
