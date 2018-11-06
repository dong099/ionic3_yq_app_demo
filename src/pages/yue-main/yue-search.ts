import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from '../../providers/native-service';
import { GlobalData } from '../../providers/global-data';

/**
 * Generated class for the YueSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-yue-search',
  templateUrl: 'yue-search.html',
})
export class YueSearchPage {
  actCats = [];
  actCatOpts: any = {
    title: '选择发起活动的类型',
    subTitle: '归个类容易查找'
  };

  searchParams: any = {
    yueUid: '',
    yuePid: '',
    activityCat: '',
    title: ''
  }



  constructor(public navCtrl: NavController,
    public nativeService: NativeService,
    public viewCtrl: ViewController,
    public globalData: GlobalData,
    //private ref: ChangeDetectorRef,
    public navParams: NavParams) {

      this.searchParams = this.navParams.get('data');
      if(!this.searchParams) 
        this.searchParams = {
          yueUid: '',
          yuePid: '',
          activityCat: '',
          title: ''
        };

  }


  

  ionViewDidLoad() {
 
    this.globalData.loadGlobalSelectOpts()
      .subscribe(res => {
        this.actCats = res.json().activities;
        //this.ref.detectChanges();
      }, error => {
        console.log(error);
      });
  }



  dismiss() {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss();
  }

  applyFilter() {
    if (this.searchParams.yueUid == ""
      && this.searchParams.yuePid == ""
      && this.searchParams.activityCat == "") {
      this.nativeService.showToast("请输入查询过滤条件！");
      return false;
    } else {
      this.viewCtrl.dismiss(this.searchParams);
    }

  }


  resetFilter(){
    this.searchParams = {
      yueUid: '',
      yuePid: '',
      activityCat: '',
      title: ''
    };
    this.viewCtrl.dismiss(this.searchParams);    
  }


}
