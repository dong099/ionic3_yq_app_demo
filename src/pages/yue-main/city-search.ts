import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AutoCompleteProvider } from '../../providers/autoCompleteProvider';

import { NativeService } from '../../providers/native-service';

/**
 * Generated class for the CitySearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-city-search',
  templateUrl: 'city-search.html',
})
export class CitySearchPage {

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private autoCompleteProvider: AutoCompleteProvider,
    private nativeService: NativeService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitySearchPage');
  }

  selectedCity: string = "";

  getSelect(sel: any) {
    this.selectedCity = sel.name;
  }

  applyCity() {
    if (this.selectedCity) {
      let cityCode = this.selectedCity.replace("市",""); 
      
      this.dismiss(cityCode);
    } else {
      this.nativeService.showToast("请输入并选择您的城市！");
      return false;
    }
  }

  dismiss(data?: string) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

}
