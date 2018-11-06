import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DEFAULT_AVATAR } from '../../providers/Constants';
import { ChangeDetectionStrategy } from '@angular/core';
/**
 * Generated class for the ImgLazyLoadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * 
 * http://blog.csdn.net/u010730897/article/details/73224725
 * 
 * Components.
 * 
 * https://angular.io/api/core/ChangeDetectionStrategy
 * 
 * https://angular.io/api/core/ChangeDetectorRef
 */
@Component({
  selector: 'img-lazy-load',
  templateUrl: 'img-lazy-load.html'//,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgLazyLoadComponent {

  default: string = DEFAULT_AVATAR;
  
    constructor() {
 
    }
  
    @Input() src: string //要显示的图片
    @Output() public autoClick: EventEmitter<any> = new EventEmitter<any>();
  
    ngOnInit() {
      let img = new Image();
      img.src = this.src;
      img.onload = () => {
        //这里为了达到演示效果给了两秒的延迟，实际使用中不需要延迟
      //  setTimeout(() => {
          this.default = this.src;
        //}, 1000)
      }
    }

 
  onClick() {
    this.autoClick.emit();
  }


}
