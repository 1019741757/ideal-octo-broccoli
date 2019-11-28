//百度地图操作类
export function ComplexCustomOverlay(vueThis, point, backImg, placeId, total, normal, alert, offline, lng, lat){
  // placeId 场所ID
  // longitude经度
  // latitue纬度
  // total 总数
  // normal 正常数
  // alert 告警数
  // offline  离线数
  this._vueThis=vueThis;
  this._point = point;
  this._backImg = backImg;
  this._placeId = placeId;
  this._total = total;
  this._normal = normal;
  this._alert = alert;
  this._offline = offline;
  this._lng = lng;
  this._lat = lat;
}

ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map) {
  this._map = map;
  var vueThis=this._vueThis;
  var placeId = this._placeId;
  var total = this._total;
  var normal = this._normal;
  var alert = this._alert;
  var offline = this._offline;
  var longitude = this._lng;
  var latitude = this._lat;
  var div = this._div = document.createElement("div");
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  div.style.background = "url(" + this._backImg + ") no-repeat center center";
  div.style.MozUserSelect = "none";
  $(div).css({
    "position": "absolute",
    "z-index": "1",
    "cursor": "pointer",
    "height": "45",
    "width": "45",
    "white-space": "nowrap",
    "margin": "0",
    "padding": "0",
    "color": "#fff",
    "font-size": "14px"
  });
  $(div).attr({
    "num": this._num,
    "class": "pointD"
  });
  //  滑过显示盒子
  var onediv = document.createElement("div");
  $(onediv).css({"height":"30","width":"30","white-space":"nowrap","margin":"0","padding":"0","color":"#fff","text-align":"center","line-height":"30px"});
  $(div).append('<div class="disNCz">'+
                 '<span>总数:&nbsp;'+total+'</span><span>正常:&nbsp;<a style="color:#31C708">'+normal+'</a></span><span>离线:&nbsp;<a style="color:#8A8A8A">'+offline+'</a></span><span>告警:&nbsp;<a style="color:#FB0007">'+alert+'</a></span>'+
                '<div></div></div>'
   );
  div.appendChild(onediv);
  //  滑到显示
  $(div).on("mousemove", function() {
    // map.disableDragging();
    $(this).css("z-index", "999999");
    $(this).children(".disNCz").css("display", "block");
  });
  //  滑过隐藏
  $(div).on("mouseout", function() {
    map.enableDragging();
    $(this).css("z-index", "0");
    $(this).children(".disNCz").css("display", "none");
  });
  // 鼠标点击给多个点添加信息窗口
  $(div).on("click",{vueThis,placeId},function(e){
    vueThis.baiduClick(placeId);
  })
  // 鼠标点击给多个点添加信息窗口
  map.getPanes().labelPane.appendChild(div);
  return div;
};
ComplexCustomOverlay.prototype.draw = function() {
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  this._div.style.left = pixel.x - 22 + "px";
  this._div.style.top = pixel.y - 22 + "px";
};
