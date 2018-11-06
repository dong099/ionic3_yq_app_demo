import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { AutoCompUtilComponentModule } from '../../components/auto-comp-util/auto-comp-util.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage), AutoCompUtilComponentModule,ComponentsModule,
  ],
})
export class SignupPageModule {}
