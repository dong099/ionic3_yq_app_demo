import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

//import { ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the DisableControlDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 * e.g.
 * 
 * <input [formControl]="formControl" [disableControl]="disable">
 * <button (click)="disable = true">Disable</button>
 * <button (click)="disable = false">Enable</button>
 */
@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {
  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  
  constructor( private ngControl : NgControl ) {
  }

  // constructor(el: ElementRef, renderer: Renderer) {
  //   // Use renderer to render the element with styles
  //     renderer.setElementStyle(el.nativeElement, 'display', 'none');
  //  }

}
 