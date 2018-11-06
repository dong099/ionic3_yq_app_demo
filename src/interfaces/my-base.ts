

import { IonicApp, Platform, ToastController, Keyboard, NavController } from 'ionic-angular';
import { NativeService } from '../providers/native-service';
import { Network } from '@ionic-native/network';

export abstract class MyBaseClass {

    constructor(
        public platform: Platform,
        public nativeService: NativeService,
        public toastCtrl: ToastController,
        public network: Network,
        public navCtrl: NavController) {


        platform.ready().then(() => {

            this.assertNetwork();//检测网络

        });
    }

    protected sampleClick(): void {
        console.log("button clicked");
    }

    assertNetwork() {


        // if (!this.nativeService.isConnecting()) {
        //     this.toastCtrl.create({
        //         message: '未检测到网络,请连接网络',
        //         showCloseButton: true,
        //         closeButtonText: '确定'
        //     }).present();
        // }


        // watch network for a disconnect
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
           this.nativeService.showToast('network was disconnected :-(' + this.navCtrl.name );
        });

        // stop disconnect watch
        //disconnectSubscription.unsubscribe();


        // watch network for a connection
        let connectSubscription = this.network.onConnect().subscribe(() => {
            this.nativeService.showToast('network connected!' + this.navCtrl.name);
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                if (this.network.type === 'wifi') {
                    this.nativeService.showToast('we got a wifi connection, woohoo!');
                }
            }, 3000);
        });

        // stop connect watch
        //connectSubscription.unsubscribe();


    }



}