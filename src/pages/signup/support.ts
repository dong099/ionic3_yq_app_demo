import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  supportMessage:string;
  submitted:boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

  ionViewDidEnter(){
    let toast = this.toastCtrl.create({
      message: 'This does not actually send a support request.',
      duration: 3000
    });
    toast.present();
  }
   
  submit(form: NgForm) {

    this.submitted = true;

    if(form.valid) {

      this.submitted = false;
      this.supportMessage = "";

      let toast = this.toastCtrl.create({
        message: 'Your support request has been sent.',
        duration: 3000

      })

      toast.present();
    }
  }

  
  // ionViewCanLeave():boolean | Promise<boolean> {
  //   //if (!this.supportMessage || this.supportMessage.trim().length === 0) {

  //   if(this.supportMessage && this.supportMessage.trim().length > 0) {


  //     let alert = this.alertCtrl.create ({

  //       title: 'Leave this page?',
  //       message: 'Are you sure you want to leave this page? Your support message will not be submitted.',
  //       buttons: [
  //         {
  //           text: 'Stay',
  //           handler: data => {
  //             console.log('Cancel clicked');
  //             return false;
              
  //           }
  //         },
  //         {
  //           text: 'Leave',
  //           handler: data => {
  //             console.log('Saved clicked');
  //             return true;
  //           }
  //         }
  //       ]


  //     });
  //     alert.present();
  // }

  // }

   // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  ionViewCanLeave(): boolean | Promise<boolean> {
    // If the support message is empty we should just navigate
    if (!this.supportMessage || this.supportMessage.trim().length === 0) {
      return true;
    }

    return new Promise((resolve: any, reject: any) => {
      let alert = this.alertCtrl.create({
        title: 'Leave this page?',
        message: 'Are you sure you want to leave this page? Your support message will not be submitted.'
      });
      alert.addButton({ text: 'Stay', handler: reject });
      alert.addButton({ text: 'Leave', role: 'cancel', handler: resolve });

      alert.present();
    });
  }
  

}
