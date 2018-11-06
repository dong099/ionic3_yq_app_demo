import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { NativeService } from '../../../providers/native-service';
import { SearchAddress } from '../search-address/search-address';

import { Keyboard } from '@ionic-native/keyboard';


declare var AMap;


/**
 * Generated class for the GetMapLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-get-map-location',
  templateUrl: 'get-map-location.html',
})
export class GetMapLocationPage {

  //tying to hide tabs bar
  tabBarElement: any;

  map: any;//地图对象
  mapIsComplete: boolean = false;//地图是否加载完成
  isPositioning: boolean = false;//是否正在定位
  marker: any;//标注
  showIonFab: boolean = false;//是否显示导航按钮
  @Input()
  params = {
    draggable: true,//标注是否可以拖拽;
    click: false,//地图是否点击改变标注的位置
    searchBar: true,//是否显示搜索框
    navigation: true,
    address: '',//主页面传过来的地址
    position: {
      lng: null,
      lat: null
    },//主页面传过来的坐标
    lnglatXY: {}
  };
  callback: any;


  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public nativeService: NativeService,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public keyboard: Keyboard) {

    this.params.address = this.navParams.get('address');
    let geoPoint:string = this.navParams.get('geoPoint');
    if(geoPoint&&geoPoint.indexOf(",")>0) {
      let geo = geoPoint.split(",");
      this.params.position.lng=geo[0];
      this.params.position.lat=geo[1];
    }
    //this.callback = this.navParams.get('callback');
 
  }

 


  onSearch(event) {
    // this.renderer.invokeElementMethod(event.target, 'blur');
    this.keyboard.close();
  }


  confirmBack() {
    //this.callback(this.params).then(() => { this.navCtrl.pop() });
    this.viewCtrl.dismiss(this.params);
  }



  ngAfterContentInit() {

  }

  ionViewDidLoad() {
    this.loadMap();
    this.showCityInfo();
    setTimeout(() => {
      if (!this.map) {
        this.loadMap();
      }
    }, 3000);
  }


  showCityInfo() {
    //加载城市查询插件 
    //http://lbs.amap.com/api/javascript-api/reference/location/#m_AMap.CitySearch
    let that = this;
    AMap.service(["AMap.CitySearch"], function () {
      //实例化城市查询类 
      var citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市 
      citysearch.getLocalCity(function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            var cityinfo = result.city;
            //var citybounds = result.bounds; 
             that.nativeService.showToast("您当前所在城市：" + cityinfo);
          }
        } else {
          that.nativeService.showToast("您当前所在城市：" + result.info + "");
        }
      });
    });
  }




  //加载地图
  private loadMap() {
    let that = this;
    try {
      that.map = new AMap.Map('map-share', {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 16, //设置地图缩放级别  http://lbs.amap.com/api/javascript-api/reference/map
          rotateEnable: true,
          showBuildingBlock: true
          //,baseRender: 'd'
        })
      });

      that.map.on('complete', function () {
        that.mapIsComplete = true;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {//添加工具条和比例尺
          that.map.addControl(new AMap.ToolBar({ position: 'RT', locate: 'true' }));
          //http://lbs.amap.com/api/javascript-api/reference/map-control
        });
 
        if (that.params.position && that.params.position.lat && that.params.position.lng) { //判断主页面传过来的是坐标就直接描点标注
          that.drawMarker(that.params.position);
        } else if (!(that.params.position.lat && that.params.position.lng) && that.params.address) {
          //判断主页面传过来的是地址就跳转到地址搜索地址页面,返回确定的地址
          that.locationSearch();
        } else {
          //主页面不传address和position就直接定位到当前位置
 
          that.mapLocation();
        }

        //判断是否可以点击地图改变标注位置
        if (that.params.click) {
          that.map.on('click', function (e) {
            let position = {
              lng: e.lnglat.getLng(),
              lat: e.lnglat.getLat()
            };
            that.drawMarker(position);
          });
        }

      });
      window['HomeAMap'] = this.map;
    } catch (err) {
      that.mapIsComplete = false;
      that.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }
  }


  //跳转到地址查询搜索页面,并返回一个地址对象(经纬坐标+中文地址)
  private locationSearch() {
    let that = this;
    let locationSearchModal = that.modalCtrl.create("SearchAddress", { address: that.params.address });
    locationSearchModal.present();
    locationSearchModal.onDidDismiss(item => {
      if (item) {
        this.params.position = item.location;
        this.params.address = item.name;
        this.drawMarker(item.location, item.name);
      }
    })
  }



  //定位当前地址
  mapLocation() {
    let that = this;
    that.isPositioning = true;
    that.nativeService.getUserLocation().subscribe(position => {
      that.params.position = position;
      that.drawMarker(position);
      that.isPositioning = false;
    }, () => {
      that.isPositioning = false;
    });
  }


  //根据经纬坐标获取对应的地址
  private geocoder(position) {
    let that = this;
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(position, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        //获得了有效的地址信息:
        let addressComponent = result.regeocode.addressComponent;
        that.params.address = addressComponent.district + addressComponent.township +
          addressComponent.street + addressComponent.streetNumber;
      } else {
        that.params.address = '';
        that.nativeService.showToast(status + ',' + result + ',' + position);
      }
    });
  }

  //描点标注
  private drawMarker(position, addressName: string = '') {
    let that = this;
    that.params.lnglatXY = new AMap.LngLat(position.lng, position.lat);
    that.map.clearMap();

    //配置需要显示搜索框就根据传进来的position参数给搜索框赋值
    if (that.params.searchBar) {
      if (addressName) {
        that.params.address = addressName;
      } else {
        that.geocoder(that.params.lnglatXY);
      }
    }


    that.marker = new AMap.Marker({
      map: that.map,
      draggable: that.params.draggable,//控制标注是否可以拖拽
      position: that.params.lnglatXY,
    });

    //配置需要搜索框才执行
    if (that.params.navigation) {
      if (that.marker) {
        that.showIonFab = true;
      }
    }

    //拖拽标注
    that.marker.on('dragend', function (e) {
      let position = {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
      };
      that.params.position = position;
      that.drawMarker(position);
    });
    that.map.setFitView();
  }


 
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
