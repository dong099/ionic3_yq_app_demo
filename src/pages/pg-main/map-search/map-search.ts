import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from '../../../providers/native-service';
import { Utils } from '../../../providers/Utils';

declare var AMap;

/**
 * Generated class for the MapSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-search',
  templateUrl: 'map-search.html',
})
export class MapSearchPage {
  @ViewChild('mapDiv') mapDiv: ElementRef;
  map: any;//地图对象
  isPositioning: boolean = false;//是否正在定位
  mapIsComplete: boolean = false;//地图是否加载完成

  marker: any;//标注

  currPos: any = {
    lng: '',
    lat: ''
  };
  callback: any;
  records: any; //pg records including geos
 

  constructor(public navCtrl: NavController,
    public nativeService: NativeService,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    this.callback = this.navParams.get('callback');
    this.records = this.navParams.get('data');
 

  }

  confirmBack() {

    this.callback('fakeData').then(() => { this.navCtrl.pop() });

  }

  ionViewDidLoad() {
    this.loadMap();
    console.log(this.records);

  }




  //加载地图
  private loadMap() {
    let that = this;
    try {
      that.map = new AMap.Map(this.mapDiv.nativeElement, {
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
          that.map.addControl(new AMap.Scale({ position: 'RB' }));

          //http://lbs.amap.com/api/javascript-api/reference/map-control
        });

        //user location
        //that.mapLocation();

        //param location
        that.mapGeoPoint();


      });
      window['HomeAMap'] = this.map;
    } catch (err) {
      that.mapIsComplete = false;
      that.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }
  }

  mapGeoPoint(){
    let that = this;
    if(that.records) {
      
      for (let index = 0; index < that.records.length; index++) {
        const element = that.records[index];
        
        var content = [];
        content.push("<b>"+element.name+"</b>");
        content.push(element.addr);
        content.push("<a href='#'>详细信息</a>");


        that.drawMarker( Utils.convertGeo(element.geoPoint), content );
      }
    }
  }

  //定位当前地址
  mapLocation() {
    let that = this;
    that.isPositioning = true;
    that.nativeService.getUserLocation().subscribe(position => {
      that.currPos = position;
      that.drawMarker(position);
      that.isPositioning = false;
    }, msg => {
      that.isPositioning = false;
      that.nativeService.showToast("GPS信号弱：" + msg + "");
    });
  }


  //描点标注
  private drawMarker(position, infoItems?: string[]) {
    let that = this;
    let lnglatXY = new AMap.LngLat(position.lng, position.lat);
    that.map.clearMap();

    that.marker = new AMap.Marker({
      map: that.map,
      draggable: false,
      position: lnglatXY,
    });


    //实例化信息窗体 http://lbs.amap.com/api/javascript-api/guide/draw-on-map/infowindow
    if (infoItems) {

      var infoWindow = new AMap.InfoWindow({
        //isCustom: true,  //使用自定义窗体
        content: infoItems.join("<br>"),
        //offset: new AMap.Pixel(16, -45)
      });

      AMap.event.addListener(that.marker, 'click', function () {
        infoWindow.open(that.map, that.marker.getPosition());
      });
    }


    that.map.setFitView();
  }

}
