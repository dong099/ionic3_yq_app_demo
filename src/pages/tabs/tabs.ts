import { Component, ViewChild } from '@angular/core';
import {Tabs, IonicPage,  NavController,  NavParams} from 'ionic-angular';
 
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
     @ViewChild('mainTabs') tabs: Tabs;
    // set the root pages for each tab
    tab1Root: any = 'YueMainPage';
    tab2Root: any = 'PgMainPage';
    tab3Root: any = 'CommunicationMainPage';
    tab4Root: any = 'MeMainPage';
    tab5Root: any = 'AddYuePage';
    mySelectedIndex: number;
  
 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage) {
      
      this.mySelectedIndex = navParams.data.tabIndex || 0;
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    
  }

}
