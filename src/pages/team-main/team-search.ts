import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';
import { ERROR_BANG } from '../../providers/Constants';
import { NativeService } from '../../providers/native-service';

import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the TeamSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-search',
  templateUrl: 'team-search.html',
})
export class TeamSearchPage {


  currUid: number;

  pageStatusMsg: string = "Loading, pls wait...";

  callback: any;

  items: any;
  // = [{ "oid_index": "01", "team_name": "队名1" },
  //{ "oid_index": "02", "team_name": "足球梦之队" },
  //{ "oid_index": "03", "team_name": "队名3" }];


  constructor(public navCtrl: NavController,
    private httpSvc: YqHttpService,
    private nativeService: NativeService,
    private translate: TranslateService,

    public navParams: NavParams) {

    this.currUid = this.navParams.data.uid;
    this.callback = this.navParams.get('callback');

  }

  ionViewDidLoad() {
    //this.getListFromDb();
    this.loadItems().subscribe(res => {
      this.items = res; 
      if (!res || res.length === 0) {
        this.pageStatusMsg = "还没有搜索到数据！";
      }


    }, error => {
      this.onError(<any>error);
    });
  }

  loadItems(): Observable<any> {
    let params = new URLSearchParams();  //great pit, it's from http package.
    params.append('paramMap', "{leader:{t:int,v:'" + this.currUid + "'}}");
    /**
     * for exact query - s
     * format of paramMap json:
     * 
     * {
     *    paramName: {
     *        t: [int, str], //only support 2 types
     *        v: 'paramValue' //for `str` type, it will support wildcard query, e.g. '%strContent%'
     *    }
     * }
     * 
     * check back-end : YqCmnServiceImpl.getParamMap(param)
     * 
     * another sample on : PgSearchRtnPage
     * 
     */


    return this.httpSvc.getData("/getData/yq_team/", params)
      .map(result => {
        return result;
      });
  }



  onError(message: any) {
    this.translate.get(ERROR_BANG).subscribe(res => {
      this.nativeService.showToast(res + "[" + message + "]");
      this.pageStatusMsg = "Loading failed, pls check network.";
    });
  }



  filterItems(ev: any) {

    this.loadItems().subscribe(res => {
      this.items = res;



      let val = ev.target.value;

      if (val && val.trim() !== '') {
        this.items = this.items.filter(function (item) {
          return item.teamName.toLowerCase().includes(val.toLowerCase());
        });

      }
    });

  }

  itemSelected(item?: any) {

    this.callback(item).then(() => { this.navCtrl.pop() });

  }

}
