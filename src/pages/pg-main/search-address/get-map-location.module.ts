import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetMapLocationPage } from './get-map-location';

 

@NgModule({
  declarations: [
    GetMapLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(GetMapLocationPage)
  ],
})
export class GetMapLocationPageModule {}
