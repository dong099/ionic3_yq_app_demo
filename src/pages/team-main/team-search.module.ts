import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamSearchPage } from './team-search';

@NgModule({
  declarations: [
    TeamSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(TeamSearchPage),
  ],
})
export class TeamSearchPageModule {}
