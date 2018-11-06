// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule } from 'ionic-angular';

import { AutoCompUtilComponent } from './auto-comp-util';
// import { BoldPrefix } from './boldprefix.pipe';



// @NgModule({
//   imports: [
//     IonicModule, BoldPrefix
//   ],
//   declarations: [
//     AutoCompUtilComponent
//   ],
//   exports: [
//     AutoCompUtilComponent,BoldPrefix
//   ],
//   entryComponents: [
//     AutoCompUtilComponent
//   ],
//   providers: []
//   , schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class AutoCompUtilComponentModule {
// }



import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
 
// import { BoldPrefix } from './boldprefix.pipe';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    AutoCompUtilComponent,
  ],
  imports: [
    IonicPageModule.forChild(AutoCompUtilComponent), PipesModule
  ],
  exports: [
    AutoCompUtilComponent
    
  ],
  entryComponents: []
})
export class AutoCompUtilComponentModule {}