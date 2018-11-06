import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPgDetailPage } from './add-pg-detail';
import { AutoCompUtilComponentModule } from '../../components/auto-comp-util/auto-comp-util.module';



@NgModule({
  declarations: [
    AddPgDetailPage,
  ],

  imports: [
    IonicPageModule.forChild(AddPgDetailPage), AutoCompUtilComponentModule
  ],
})
export class AddPgDetailPageModule {}
