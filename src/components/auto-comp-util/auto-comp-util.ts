import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs/util/noop';
import {Observable, Subject} from 'rxjs';

// searchbar default options
const defaultOpts = {
  cancelButtonText: 'Cancel',
  showCancelButton: false,
  debounce: 250,
  placeholder: '',
  autocomplete: 'off',
  autocorrect: 'off',
  spellcheck: 'off',
  type: 'search',
  value: '',
  noItems: '',
  clearOnEdit: false,
  clearInput: false
};

/**
 * Generated class for the AutoCompUtilComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'auto-comp-util',
  templateUrl: 'auto-comp-util.html'
})
export class AutoCompUtilComponent {

  @Input() public dataProvider: any;
  @Input() public options: any;
  @Input() public disabled: any;
  @Input() public keyword: string;
  @Input() public required: boolean;
  @Input() public showResultsFirst: boolean;
  @Input() public alwaysShowList: boolean;
  @Input() public hideListOnSelection: boolean = true;
  @Input() public template: TemplateRef<any>;
  @Input() public useIonInput: boolean;
  @Input() public placeholder: string;

  @Output() public autoFocus: EventEmitter<any>;
  @Output() public autoBlur: EventEmitter<any>;
  @Output() public itemSelected:  EventEmitter<any>;
  @Output() public itemsShown:  EventEmitter<any>;
  @Output() public itemsHidden:  EventEmitter<any>;
  @Output() public ionAutoInput:  EventEmitter<string>;
  @ViewChild('searchbarElem') searchbarElem;
  @ViewChild('inputElem') inputElem;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  public suggestions:  string[];

  public get showList(): boolean {
    return this._showList;
  }
  public set showList(value: boolean) {
    if (this._showList === value) {
      return;
    }

    this._showList = value;
    this.showListChanged = true;
  }
  private _showList: boolean;

  private defaultOpts:  any;
  private selection: any;
  private showListChanged: boolean = false;

  /**
   * create a new instace
   */
  public constructor() {
    this.keyword = '';
    this.suggestions = [];
    this._showList = false;
    this.itemSelected = new EventEmitter<any>();
    this.itemsShown = new EventEmitter<any>();
    this.itemsHidden = new EventEmitter<any>();
    this.ionAutoInput = new EventEmitter<string>();
    this.autoFocus = new EventEmitter<any>();
    this.autoBlur = new EventEmitter<any>();
    this.options = {};

    // set default options
    this.defaultOpts = defaultOpts;
  }

  public writeValue(value: any) {
    if (value !== this.keyword) {
      let parsedValue;
      if (value) {
        const { labelAttribute } = this.dataProvider;
        parsedValue = this.dataProvider.labelAttribute && typeof value === 'object' ? value[labelAttribute] : value;
        this.selection = value || null;
      }

      this.keyword = parsedValue || '';
    }
  }

  public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public updateModel() {
    this.onChangeCallback(this.keyword);
  }

  ngAfterViewChecked() {
    if (this.showListChanged) {
      this.showListChanged = false;
      this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
    }
  }

  /**
   * get items for auto-complete
   */
  public getItems() {

      let result;

      if (this.showResultsFirst && this.keyword.trim() === '') {
          this.keyword = '';
      } else if (this.keyword.trim() === '') {
          this.suggestions = [];
          return;
      }

      if (typeof this.dataProvider === 'function') {
          result = this.dataProvider(this.keyword);
      } else {
          result = this.dataProvider.getResults(this.keyword);
      }

      // if result is instanceof Subject, use it asObservable
      if (result instanceof Subject) {
          result = result.asObservable();
      }

      // if query is async
      if (result instanceof Observable) {
          result
              .subscribe(
                  (results: any) => {
                      this.suggestions = results;
                      this.showItemList();
                  },
                  (error: any) => console.error(error)
              )
          ;
      } else {
          this.suggestions = result;
          this.showItemList();
      }

      // emit event
      this.ionAutoInput.emit(this.keyword);
  }

  /**
   * show item list
   */
  public showItemList(): void {
    this.showList = true;
  }

  /**
   * hide item list
   */
  public hideItemList(): void {
    this.showList = this.alwaysShowList;
  }

  /**
   * select item from list
   *
   * @param event
   * @param selection
   **/
  public select(selection: any): void {

    this.keyword = this.dataProvider.labelAttribute == null || selection[this.dataProvider.labelAttribute] == null 
      ? selection : selection[this.dataProvider.labelAttribute];
    this.hideItemList();

    // emit selection event
    this.updateModel();

    if(this.hideListOnSelection) {
      this.hideItemList();
    }

    // emit selection event
    this.itemSelected.emit(selection);
    this.selection = selection;
  }

  /**
   * get current selection
   * @returns {any}
   */
  public getSelection(): any {
    return this.selection;
  }

  /**
   * get current input value
   * @returns {string}
   */
  public getValue() {
    return this.keyword;
  }

  /**
   * set current input value
   */
  public setValue(value: string) {
    this.keyword = value || '';
    return;
  }

  /**

   /**
   * clear current input value
   */
  public clearValue(hideItemList: boolean = false) {
    this.keyword = '';
    this.selection = null;

    if (hideItemList) {
      this.hideItemList();
    }

    return;
  }

  /**
   * set focus of searchbar
   */
  public setFocus() {
    if (this.searchbarElem) {
      this.searchbarElem.setFocus();
    }
  }

  /**
   * fired when the input focused
   */
  onFocus() {
    this.autoFocus.emit();
  }

  /**
   * fired when the input focused
   */
  onBlur() {
    this.autoBlur.emit();
  }

  /**
   * handle document click
   * @param event
   */
  @HostListener('document:click', ['$event'])
  private documentClickHandler(event) {
    if ((this.searchbarElem
      && this.searchbarElem._elementRef.nativeElement.contains(event.target))
      ||
      (this.inputElem && this.inputElem._elementRef.nativeElement.contains(event.target))
    ) {
      this.hideItemList();
    }
  }

}
