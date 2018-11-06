import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PgSearchPage } from './pg-search';

@NgModule({
  declarations: [
    PgSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PgSearchPage),
  ],
})
export class PgSearchPageModule {}
