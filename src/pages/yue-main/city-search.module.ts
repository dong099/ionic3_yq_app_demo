import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitySearchPage } from './city-search';
import { AutoCompUtilComponentModule } from '../../components/auto-comp-util/auto-comp-util.module';

@NgModule({
  declarations: [
    CitySearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CitySearchPage), AutoCompUtilComponentModule
  ],
})
export class CitySearchPageModule {}
