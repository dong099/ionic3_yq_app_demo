import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PgMainPage } from './pg-main';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    PgMainPage,
  ],
  imports: [
    IonicPageModule.forChild(PgMainPage),ComponentsModule
  ],
})
export class PgMainPageModule {}
