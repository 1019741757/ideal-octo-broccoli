<template>
<div class="">
  <div class="suggestId_dv">
    <div class="demo-input-suffix">
      <!-- <label for="deviceNumber" class="el-form-item__label" style="width: 100px;">输入地点：</label> -->
      <div class="el-form-item__content">
        <div class="el-input">
          <el-input placeholder="请输入地点" prefix-icon="el-icon-location" v-model="baiduVla" id="suggestIdw"></el-input>
        </div>
      </div>

    </div>
    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
    <div style=" margin:22px auto -10px;width:100%;height:300px; border:1px solid #dcdfe6;border-radius: 4px;" id="container"></div>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  data() {
    return {
      baiduVla: null,
      map: null
    };
  },
  computed: {
    ...mapState(['Placelongitude', 'Placelatitude'])
  },
  mounted() {
    this.baiduMap();
  },
  methods: {
    //激活百度地图
    baiduMap: function(type) {
      var _this = this;
      this.$nextTick(function() {
        var th = this
        if (this.Placelongitude == null && this.Placelatitude == null) {
          _this.map = new BMap.Map("container");
          var point = new BMap.Point(112.97935279, 28.21347823);
          _this.map.centerAndZoom(point, 6); // 初始化地图,设置城市和地图级别。
        } else {
          _this.map = new BMap.Map("container");
          var point = new BMap.Point(this.Placelongitude, this.Placelatitude);
          _this.map.centerAndZoom(point, 18); // 初始化地图,设置城市和地图级别。
          _this.map.addOverlay(new BMap.Marker(point));
        }
        _this.map.enableScrollWheelZoom();
        _this.map.setDefaultCursor("crosshair");
        _this.map.addEventListener("click", function(e) {
          if (e.overlay) {
            _this.$emit('increment', e.point.lng, e.point.lat);
          } else {
            _this.map.clearOverlays();
            _this.$emit('increment', e.point.lng, e.point.lat);
            var pt = new BMap.Point(e.point.lng, e.point.lat);
            _this.map.addOverlay(new BMap.Marker(pt)); //添加标注
          }
        });
        var ac = new BMap.Autocomplete( //建立一个自动完成的对象
          {
            "input": "suggestIdw",
            "location": this.map
          })
        var myValue
        ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
          this.baiduVla = myValue
          setPlace();
        });

        function setPlace() {
          _this.map.clearOverlays(); //清除地图上所有覆盖物
          function myFun() {
            th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            _this.map.centerAndZoom(th.userlocation, 18);
            _this.map.addOverlay(new BMap.Marker(th.userlocation)); //添加标注
          }

          var local = new BMap.LocalSearch(_this.map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);
        }
      });
    }
  }
}
</script>
<style media="screen">

</style>
