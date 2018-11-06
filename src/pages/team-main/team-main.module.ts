import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamMainPage } from './team-main';

@NgModule({
  declarations: [
    TeamMainPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamMainPage),
  ],
})
export class TeamMainPageModule {}
