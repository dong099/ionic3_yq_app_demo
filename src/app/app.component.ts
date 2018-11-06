import { Component, ViewChild } from '@angular/core';

import { Keyboard, Nav, Platform,ToastController, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { NativeService } from '../providers/native-service';
import { HAS_SEEN_TUTORIAL } from '../providers/Constants';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild('content') nav: Nav;
  rootPage:any = HomePage;

  constructor(
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    public platform: Platform,
    statusBar: StatusBar, 
    public storage: Storage,
    private toastCtrl: ToastController,
    private nativeService: NativeService,
    splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.storage.get(HAS_SEEN_TUTORIAL)
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = 'TabsPage';
          //this.navCtrl.push('TabsPage'); 
        } else {
          this.rootPage = 'TutorialPage';
          //this.navCtrl.push('TutorialPage');
        }

      });



      //statusBar.styleDefault();
      statusBar.styleLightContent();
      splashScreen.hide();
      this.registerBackButtonAction();//注册返回按键事件
      //this.assertNetwork();//检测网络
    });
  }


  assertNetwork() { 
    if (!this.nativeService.isConnecting()) {
      this.toastCtrl.create({
        message: '未检测到网络,请连接网络',
        showCloseButton: true,
        closeButtonText: '确定'
      }).present();
    }
  }

  registerBackButtonAction() {
    if (!this.nativeService.isAndroid()) {
      return;
    } 

    this.platform.registerBackButtonAction(() => {

       if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) { 
        activePortal.dismiss();
        return;
      }
 

      let activeVC = this.nav.getActive();
 

      let tabs = activeVC.instance.tabs;

      if(tabs) {
        let activeNav = tabs.getSelected();
        return activeNav.canGoBack() ? activeNav.pop() : this.showExit();
      } else {
        //do nothing, already root
        this.showExit();
      }
      
      //this.nav.popToRoot() or this.nav.rootNav.setRoot(Tabs)

      //最小化， 不退出
      //return activeNav.canGoBack() ? activeNav.pop() : this.nativeService.minimize();
       //return activeNav.canGoBack() ? activeNav.pop() : this.showExit();

    }, 1);
  }


  backButtonPressed: boolean = false;
  //双击退出提示框
  showExit() {

    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
       
      this.nativeService.showToast('再按一次退出应用');
      this.backButtonPressed = true;
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }

  exit(){
    this.platform.exitApp();
  }




}

