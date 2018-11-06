import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HAS_SEEN_TUTORIAL } from '../../providers/Constants';
/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  showSkip = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  onSlideChangeStart(slider: Slides) {
    //this.showSkip = !slider.isEnd();
  }

  startApp() {
    this.navCtrl.push('TabsPage').then(() => {
      this.storage.set(HAS_SEEN_TUTORIAL, 'true');
    })
  }

}
