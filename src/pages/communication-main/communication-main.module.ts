import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationMainPage } from './communication-main';

@NgModule({
  declarations: [
    CommunicationMainPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationMainPage),
  ],
})
export class CommunicationMainPageModule {}
