import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeService } from '../providers/native-service';

import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Logger } from '../providers/logger';
import { GlobalData } from '../providers/global-data';
import { AppVersion } from '@ionic-native/app-version';
import { Toast } from '@ionic-native/toast';
import { Transfer } from '@ionic-native/transfer';
import { Utils } from '../providers/Utils';
import { Helper } from '../providers/helper';
import { FileService } from '../providers/FileService';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Keyboard } from '@ionic-native/keyboard';
import { CalendarModule } from '../components/ion2-calendar'
import { AutoCompleteProvider } from '../providers/autoCompleteProvider';
import { AutoCompUtilComponentModule } from '../components/auto-comp-util/auto-comp-util.module';
import { UpdatePicPageModule } from '../components/ion2-images/update-pic.module';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { Http } from '@angular/http';
import { YqHttpService } from '../providers/yq-http-service';
export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (createTranslateLoader),
			deps: [Http]
		}),
    BrowserModule,
    HttpModule,
    CalendarModule,
    AutoCompUtilComponentModule,
    //http://ionicframework.com/docs/api/config/Config/
    IonicModule.forRoot(MyApp,  {
      //backButtonText: 'Go Back',
      //iconMode: 'ios',
      tabsHideOnSubPages: 'true', 
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition',
      scrollAssist: 'false'
    }),
 
    IonicStorageModule.forRoot(),
    UpdatePicPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeService,
    Camera,
    Network,
    Logger,
    GlobalData,
    AppVersion,
    Toast,
    Transfer,

    YqHttpService,
    FileService,
    Helper,
    Utils,
    File,
    ImagePicker,
    AppMinimize,
    Diagnostic,
    Keyboard,
    AutoCompleteProvider
  ]
})
export class AppModule {}
