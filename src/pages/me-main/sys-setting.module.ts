import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SysSettingPage } from './sys-setting';

@NgModule({
  declarations: [
    SysSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SysSettingPage),
  ],
})
export class SysSettingPageModule {}
