export const IS_DEBUG = true;//是否开发(调试)模式

export const HAS_LOGGED_IN = 'hasLoggedIn';
export const HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
export const LOGGED_USER = 'LOGGED_YQ_USER';
export const CURR_CITY = 'currCity';




export const SUCCESS_BANG = "SUCCESS_BANG";
export const ERROR_BANG = "ERROR_BANG";

export const WX_SHARE_URL = "http://www.51yueqiu.site/";

/*----------------------------------------后台Api地址----------------------------------------*/
//export const APP_SERVE_URL = 'http://116.196.88.1:28080/yq-service-mgr/webapi/';
export const WWW_IMGS_URL = 'http://CN-8C7BHC2:48080/yq-server/imgs/';
export const APP_SERVE_URL = 'http://CN-8C7BHC2:48080/yq-server/';

/*----------------------------------------文件服务器地址----------------------------------------*/
export const FILE_SERVE_URL = 'http://172.16.19.86/kit_file_server/';//文件服务:测试环境


export const REQUEST_TIMEOUT = 10000;//请求超时时间,单位为毫秒


export const APK_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/ionic2_tabs.apk';//android apk下载完整地址,用于android本地升级
export const APP_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/download.html';//app网页下载地址,用于ios升级或android本地升级失败

export const ENABLE_FUNDEBUG = false;//是否启用fundebug日志监控
export const DEFAULT_AVATAR = 'assets/imgs/avatar.png';//用户默认头像
/*----------------------------------------app版本升级服务地址----------------------------------------*/
export const APP_VERSION_SERVE_URL = 'http://172.16.19.86:8111/api/';//app版本升级服务;测试环境,查询app最新版本号,更新日志等信息.

export const PAGE_SIZE = 10;//默认分页大小
export const IMAGE_SIZE = 1024;//拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 100;//图像压缩质量，范围为0 - 100

export const calOptions = {
    
     title: '请选择日期',
     canBackwardsSelected: false, //
     color: 'cal-color',
     monthFormat: 'yyyy 年 MM 月 ',
     weekdays: ['天', '一', '二', '三', '四', '五', '六'],
     //weekStart: 1,
     //color: 'light',
     disableWeeks: [0, 6],
     format: 'MM-DD-YYYY',
     pickMode: 'single', //	'multi', 'range', 'single'
     //doneIcon: true,
     closeIcon: true,
     defaultSubtitle: ''
   };

   /**
    * 
    http://127.0.0.1:48080/yq-server/getData/yq_playground/0
    YqCmnController.java ,  getData/{listName}/{id}
    */

   export const YUEMAINFORM = {
      //"oidIndex": -1,
      "versionId": 0,
      "lastUpdTime": null,
      "yueUid": {
        "oidIndex": -1,      
        "username": ""
      },
      "yuePid": { 
        "oidIndex": -1,   
        "name": ""
      },
      "yueTid": null,
      "dateFrom": "",
      "dateTo": "",
      "timeSpan": "",
      "activityCat": "",
      "title": "",
      "description": "",
      "yinUid":null,
      "yinTid": null,
      "yinTime": "",
      "thumbNum": 0,
      "commentsNum": 0,
      "datePub": ""
   };

   export const USER = {
    //"oidIndex": -1,
    "versionId": 0,
    "lastUpdTime": null,
    "username": "",
    "openid": "",
    "nickName": "",
    "sex": null,
    "language": "CN",
    "city": "",
    "province": "",
    "country": "",
    "headImgUrl": "",
    "subscribeDate": "",
    "telNo": "",
    "briefDesc": "",
    "email": "",
    "ip": "",
    "bsDetail": "",
    "password": ""
}

export const TEAM = {
  //"oidIndex": -1,
  "versionId": 0,
  "lastUpdTime": null,
  "teamName": "",
  "maxPplNum": 0,
  "currPplNum": 0,
  "slogan": "",
  "breifly": "",
  "description": "",
  "leader": null
}


export const PG = {
  //"oidIndex": -1,
  "versionId": 0,
  "lastUpdTime": null,
  "name": "",
  "addr": "",
  "tel": "",
  "city": "",
  "district": "",
  "geoPoint": "",
  "shortDesc": "",
  "pgImgUrl": "",
  "description": "",
  "thumbNum": 0,
  "commentsNum": 0,
  "createdBy": null,
  "createdDate": null
}