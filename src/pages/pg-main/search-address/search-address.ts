import {Component, ViewChild} from '@angular/core';
import {IonicPage, ViewController, NavParams, Searchbar} from 'ionic-angular';
import {Subject} from "rxjs";
 
import {Storage} from '@ionic/storage';
import { NativeService } from '../../../providers/native-service';
declare var AMap;
/**
 * Generated class for the SearchAddress page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-address',
  templateUrl: 'search-address.html',
})
export class SearchAddress {

  @ViewChild('searchBar') searchBar: Searchbar;
  address: any = '';
  // searchQuery: string = '';
  items: any[] = [];
  placeSearch;
  searchTextStream: Subject<string> = new Subject<string>();

  constructor(private storage: Storage,
              public viewCtrl: ViewController,
              private navParams: NavParams,
              private nativeService: NativeService,) {
                
    this.address = this.navParams.get('address');
    //http://lbs.amap.com/api/javascript-api/reference/search#m_AMap.PlaceSearch
    AMap.service('AMap.PlaceSearch', () => {//地点查询插件
      this.placeSearch = new AMap.PlaceSearch({
        pageSize: 10,
        pageIndex: 1,
        city: ''
      });
    });
    this.storage.get('MapSearchHistory').then(items => {
      this.items = (items || []).reverse();
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus();
    });
  }

  ngAfterContentInit() {
    this.searchTextStream.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(value => {
        this.getSearchData(value).then(list => this.items = <[any]>list);
      });
    // this.searchTextStream.next(this.address);
  }

  getItems($event) {
    this.searchTextStream.next($event.target.value);
  }

  selectItem(item) {
    this.storage.get('MapSearchHistory').then(items => {
      if (items) {
        let isExist = false;
        for (let value of items) {
          if (value.id === item.id) {
            isExist = true;
          }
        }
        if (!isExist) {
          items.push(item);
        }
      } else {
        items = [item]
      }
      this.storage.set('MapSearchHistory', items);
    });
    this.viewCtrl.dismiss(item);
  }

  clearHistory() {
    this.storage.remove('MapSearchHistory');
    this.items = [];
  }

  private getSearchData(val) {
    return new Promise((resolve) => {
      if (val && val.trim() != '') {
        this.placeSearch.search(val, (status, result) => {
          if (status == 'complete') {
            resolve(result.poiList.pois);
          } else if (status == 'no_data') {
            this.nativeService.showToast('没有找到匹配结果,请精确查询条件')
          } else {
            this.nativeService.showToast('地图查询失败,稍后再试.'+result)
          }
        });
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
