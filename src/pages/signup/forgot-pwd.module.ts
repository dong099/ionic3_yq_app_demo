import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPwdPage } from './forgot-pwd';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    ForgotPwdPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPwdPage),DirectivesModule,
  ],
})
export class ForgotPwdPageModule {}
