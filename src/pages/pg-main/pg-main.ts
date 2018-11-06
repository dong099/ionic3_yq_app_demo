import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeService } from '../../providers/native-service';
import { PAGE_SIZE, ERROR_BANG, WWW_IMGS_URL, DEFAULT_AVATAR } from '../../providers/Constants';
import { GlobalData } from '../../providers/global-data';

import { URLSearchParams } from '@angular/http';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';

/**
 * Generated class for the PgMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg-main',
  templateUrl: 'pg-main.html',
})
export class PgMainPage {
  itemList: any; //storing all items
  dataType: string = "a";
  //page status control params
  page: number = 0;
  pageStatusMsg: string = "Loading, pls wait...";
  lastSearchs: any;

  pgSeg: string = "all";
  records: any = {oid_index:0,name:'',addr:'',geo_point:''};

  constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public nativeService: NativeService,
    private httpSvc: YqHttpService,
    private translate: TranslateService,
    private globalData: GlobalData,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getListFromDb();
  }

  segChanged (ev: any){
    //let val = ev.target.value;
    //alert(ev.target.value);
    //if(this.pgSeg!=="a") {
      this.getListFromDb(this.pgSeg);
    //} 
  }

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
        this.nativeService.showToast("您还没有登录!");
        return false;
      }


      let params = new URLSearchParams();  //great pit, it's from http package.
      //page, size, sort=fielda,asc/desc
      params.append('page', this.page.toString());
      params.append('size', PAGE_SIZE.toString());



      if (this.lastSearchs) {
        params.append('name', this.lastSearchs.name); //from pg-search.ts
        params.append('addr', this.lastSearchs.addr); 

      } else {

        switch (this.dataType) {
          case "f":
            params.append('uId', loggedUser.oidIndex);
            break;
          case "m":
            params.append('createdBy', loggedUser.oidIndex);
            break;
          default:
            break;
        }
      }

 

      this.httpSvc.getData("/getYqPlayground", params)
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
      //this.storage.set(this.YUEMAIN_CACHE, this.itemList);
    }
  } 


  goPos(pg: any) {
    this.navCtrl.push('MapSearchPage', { data: [pg], callback: this.getMapData });
  }

  getMapData = (data) => {
    return new Promise((resolve, reject) => {
      //this.logContent = data.address + "（" + data.position.lng + "," + data.position.lat + ')';   
      resolve();
    });
  };

  gotoMapSearch(){
    this.navCtrl.push('MapSearchPage',{data:this.records, callback: this.getData});
  }


  getData = (data) => {
    return new Promise((resolve, reject) => {   
      //this.logContent = data.address + "（" + data.position.lng + "," + data.position.lat + ')';   
      resolve();
    });
  };

  getAvatar(imgName: string) {
    if (imgName) {
      return WWW_IMGS_URL + imgName;
    } else {
      return DEFAULT_AVATAR;
    }
  }

  checkPgDetail(pg: any) { 
    this.gotoEdit(pg.oidIndex);
  }

  gotoSearch(){ 
    let modal = this.modalCtrl.create("PgSearchPage", { data: this.lastSearchs }); 
    modal.present();

    modal.onWillDismiss((data: string) => {
      if (data) {
        this.lastSearchs = data;
        this.getListFromDb();
        
      }
    });

  }
 

  gotoEdit(oid: number) {
    this.navCtrl.push('AddPgDetailPage', { oidIndex: oid, callback: this.getDtlData });
  }

 

  //等同语法
  //getData = function(_params) 
  getDtlData = (data) => {
    return new Promise((resolve, reject) => {

      if (data) {
        this.ionViewDidLoad();
      }

      resolve();
    });
  };




}
