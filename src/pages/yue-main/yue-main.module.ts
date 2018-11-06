import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YueMainPage } from './yue-main';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    YueMainPage,
  ],
  imports: [
    IonicPageModule.forChild(YueMainPage),ComponentsModule
  ],
})
export class YueMainPageModule {}
