import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { YqHttpService } from '../../providers/yq-http-service';
import { TranslateService } from 'ng2-translate';
import { ERROR_BANG } from '../../providers/Constants';
import { NativeService } from '../../providers/native-service';

import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the PgSearchRtnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg-search-rtn',
  templateUrl: 'pg-search-rtn.html',
})
export class PgSearchRtnPage {
  callback: any;

  pageStatusMsg: string = "No data found, pls try again...";

  items: any;
  //= [{"oid_index":"01","name":"上海体育馆","addr":"上海市零陵路1000号"},
  //              {"oid_index":"02","name":"闵行体育馆","addr":"上海市闵行公园1000号上海市闵行公园1000号上海市闵行公园1000号上海市闵行公园1000号上海市闵行公园1000号"},
  //              {"oid_index":"03","name":"普陀体育馆","addr":"上海市桃浦路1000号"}];

  constructor(public navCtrl: NavController,
    private httpSvc: YqHttpService,
    private nativeService: NativeService,
    private translate: TranslateService,

    public navParams: NavParams) {
    this.callback = this.navParams.get('callback');
  }

  ionViewDidLoad() {

  }


  getListFromDb(pgName: string) {
    let params = new URLSearchParams();  //great pit, it's from http package.

    //refer to TeamSearchPage
    params.append('paramMap', "{name:{t:str,v:'%" + pgName + "%'}}");

    this.httpSvc.getData("/getData/yq_playground/", params)
      .subscribe(data => {
        this.items = data;
        console.log(this.items);
        if(!this.items || this.items.length === 0) {
          this.pageStatusMsg = "No data found!";
        }
      }, error => {
        this.onError(<any>error);
      });
  }

  onError(message: any) {
    this.translate.get(ERROR_BANG).subscribe(res => {
      this.nativeService.showToast(res + "[" + message + "]");
      this.pageStatusMsg = "Loading failed, pls check network.";
    });
  }

  filterItems(ev: any) {

    let val = ev.target.value;

    if (val && val.trim() !== '') {

      this.getListFromDb(val);

    }
  }

  itemSelected(item?: any) {

    this.callback(item).then(() => { this.navCtrl.pop() });

  }

}
