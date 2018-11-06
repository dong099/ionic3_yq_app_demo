import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from '../../providers/native-service';




/**
 * Generated class for the PgSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg-search',
  templateUrl: 'pg-search.html',
})
export class PgSearchPage {
  
  searchParams: any = {
    name: '',
    addr: ''
  }

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public nativeService: NativeService,
    public navParams: NavParams) {

      this.searchParams = this.navParams.get('data');
      if(!this.searchParams) 
        this.searchParams = {
          name: '',
          addr: ''
        };

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PgSearchPage');

    //this.mapLocation();
  }

  
  dismiss() {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss();
  }

  applyFilter() {
    if (this.searchParams.name == ""
      && this.searchParams.addr == "") {
      this.nativeService.showToast("请输入查询过滤条件！");
      return false;
    } else {
      this.viewCtrl.dismiss(this.searchParams);
    }

  }

  resetFilter(){
    this.searchParams = {
      name: '',
      addr: ''
    };
    this.viewCtrl.dismiss(this.searchParams);    
  }





}
