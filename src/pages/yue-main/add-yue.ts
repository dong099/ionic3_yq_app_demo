import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddYuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-yue',
  templateUrl: 'add-yue.html',
})
export class AddYuePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
 
  }



  createTeam() { 
    this.navCtrl.push('TeamMainPage', { oidIndex: -1, callback: this.getTeamData });
  }

  getTeamData = (data) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };


  goYue() {

    this.navCtrl.push('AddYueDetailPage',{ oidIndex: -1,callback: this.getData });
  }

  //等同语法
  //getData = function(_params) 
  getData = (data) =>
  {
    return new Promise((resolve, reject) => {
   
       //to use `data` directly 
       if(data) {
        this.navCtrl.push('YueMainPage');   
       }
   
      resolve();
    });
  };

}
