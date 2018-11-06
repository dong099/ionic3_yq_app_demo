import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeMainPage } from './me-main';

@NgModule({
  declarations: [
    MeMainPage,
  ],
  imports: [
    IonicPageModule.forChild(MeMainPage),
  ],
})
export class MeMainPageModule {}
