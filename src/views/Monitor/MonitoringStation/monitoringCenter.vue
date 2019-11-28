<template>
<div>
  <div class="boss_page" :style="{width:screenWidth}">
    <!-- 地图api -->
    <div id="container" :style="{height:screenheight}"></div>
    <!-- 设备统计&&&&告警日志 -->
    <!-- <div class="clients-list BER_taoub">
      <div class="tab-content" style="background-color: #fff;">
        <div id="tab-1" class="tab-pane active">
          <Echarts-Table></Echarts-Table>
        </div>
        <div id="tab-2" class="tab-pane">
          <Alarm-Log-Table></Alarm-Log-Table>
        </div>
      </div>
      <ul class="nav nav-tabs nav_housr">
        <li class="active">
          <a data-toggle="tab" href="#tab-1" aria-expanded="true">设备统计</a></li>
        <li class="">
          <a data-toggle="tab" href="#tab-2" aria-expanded="false" class="attwo_red" style="width: 100%;">告警日志</a></li>
      </ul>
    </div> -->
    <!--  场所下设备列表  -->
    <div class="row Monitoring_baidu">
      <el-collapse-transition>
        <div class="col-lg-12" v-if="show && tableDataList.length>0">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>{{tableDataList[0].placeName}} </h5>
              <div class="ibox-tools">
                <a class="collapse-link" @click="show = !show">
                  <i class="icon iconfont icon-delete_fill"></i>
                </a>
              </div>
            </div>
            <div class="ibox-content" style="padding:0" id="inner_bontent">
              <el-table :data="tableDataList" @row-click="MonitoringClick" style="width: 100%" class="mc_tabel">
                <el-table-column prop="deviceCode" width="100" label="编码">
                </el-table-column>
                <el-table-column prop="deviceTypeName" label="类型">
                </el-table-column>
                <el-table-column prop="channelDataStatus" width="60" :formatter="formatSex" label="状态" color="red">
                  <template scope="scope">
                      <span v-if="scope.row.channelDataStatus == 1" style="color:#35cd03">正常</span>
                      <span v-if="scope.row.channelDataStatus >= 2" style="color:#fe0000">告警</span>
                      <span v-if="scope.row.channelDataStatus == 0" style="color:#9c9c9c">离线</span>
                 </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>

</div>
</template>
<script>
import axios from 'axios'
import Vuex from 'Vuex'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
import AlarmLogTable from './monitoringCenter/AlarmLogTable.vue' //告警日志
import EchartsTable from './monitoringCenter/EchartsTable.vue' //设备统计

import {
  ComplexCustomOverlay
} from '../../../api/baidu.js'


export default {
  name: 'MonitoringStation',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      screenWidth: document.body.clientWidth * 0.797 + "px",
      screenheight: document.body.clientHeight - 150 + "px",
      show: true,
      map: null, //百度api
      queryDevicedeviceNumber: null, //设备总数
      queryDeviceCountVoList: [], //统计系统设备数
      number: 5, //告警日志数量
      selectDeviceAlertLogVoList: [], //告警日志数组
      tableDataList: []
    }
  },
  components: {
    AlarmLogTable,
    EchartsTable
  },
  computed: {
    ...mapState(['orgId', 'nodeType', 'deviceTypeId', 'deviceCode'])
  },
  mounted() {
    // console.log(this.orgId);
    this.map = new BMap.Map("container", {
      minZoom: 5,
      maxZoom: 19,
      enableMapClick: false
    });
    this.map.enableScrollWheelZoom();
    this.map.enableKeyboard();
    this.map.enableDragging();
    this.map.enableDoubleClickZoom(); //开启鼠标滚轮缩放
    this.getUsers();
    var _this = this;
    window.onresize = function temp() {
      _this.screenheight = document.body.clientHeight - 150 + "px";
    }
  },
  methods: {
    //地图设备点数据获取
    getUsers: function() {
      var _this = this;
      axios.post('/countDevicesAsperStatusByNoteId', {
        noteType: this.nodeType || null,
        noteId: this.orgId || null,
        deviceCode: this.deviceCode || null,
        deviceTypeId: this.deviceTypeId || null
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          if (data != [] && data.length != 0) {
            if (data.length == 1) {
              _this.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 18); // 初始化地图，设置中心点坐标和地图级别
            } else {
              _this.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 14); // 初始化地图，设置中心点坐标和地图级别
            }
            var markers = new Array();
            for (var i = 0; i < data.length; i++) {
              var put = {
                content: '',
                title: '',
                placeId: data[i].placeId,
                total: data[i].total,
                normal: data[i].normal,
                alert: data[i].alert,
                offline: data[i].offline,
                position: {
                  lat: data[i].latitude,
                  lng: data[i].longitude
                }
              };
              markers.push(put);
            }
            _this.addMapOverlay(markers);
          } else {
            _this.getUserstwo(); // 初始化地图，设置中心点坐标和地图级别
            _this.$message({
              message: '没有查询到设备',
              type: 'warning'
            });
          }
        } else {
          _this.map.centerAndZoom(new BMap.Point(112.945465, 28.235017), 12); // 初始化地图，设置中心点坐标和地图级别
          _this.$message.error(result.data.message);
        }
      })
    },
    getUserstwo: function() {
      var _this = this;
      axios.post('/countDevicesAsperStatusByNoteId', {
        noteType: null,
        noteId: null,
        deviceCode: null,
        deviceTypeId: null
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          if (data != [] && data.length != 0) {
            if (data.length == 1) {
              _this.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 18); // 初始化地图，设置中心点坐标和地图级别
            } else {
              _this.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 14); // 初始化地图，设置中心点坐标和地图级别
            }
            var markers = new Array();
            for (var i = 0; i < data.length; i++) {
              var put = {
                content: '',
                title: '',
                placeId: data[i].placeId,
                total: data[i].total,
                normal: data[i].normal,
                alert: data[i].alert,
                offline: data[i].offline,
                position: {
                  lat: data[i].latitude,
                  lng: data[i].longitude
                }
              };
              markers.push(put);
            }
            _this.addMapOverlay(markers);
          } else {
            _this.map.centerAndZoom(new BMap.Point(112.945465, 28.235017), 12); // 初始化地图，设置中心点坐标和地图级别
            _this.$message({
              message: '没有查询到设备',
              type: 'warning'
            });
          }
        } else {
          _this.map.centerAndZoom(new BMap.Point(112.945465, 28.235017), 12); // 初始化地图，设置中心点坐标和地图级别
          _this.$message.error(result.data.message);
        }
      })
    },
    //添加地区图标
    addMapOverlay: function(markers) {
      for (var index = 0; index < markers.length; index++) {
        var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
        // 设备实时状态( 1：离线 2：在线 3：震动 4：低压 5：断电）
        // var backImg = "images/baidu/1.png";
        if (markers[index].normal == 0 && markers[index].offline == 0 && markers[index].alert == 0) { // 正常
          var backImg = "images/baidu/2.png";
        }
        if (markers[index].normal > 0 && markers[index].offline == 0 && markers[index].alert == 0) { // 正常
          var backImg = "images/baidu/1.png";
        }
        if (markers[index].normal == 0 && markers[index].offline > 0 && markers[index].alert == 0) { // 离线
          var backImg = "images/baidu/2.png";
        }
        if (markers[index].normal == 0 && markers[index].offline == 0 && markers[index].alert > 0) { // 告警
          var backImg = "images/baidu/3.png";
        }
        if (markers[index].normal > 0 && markers[index].offline > 0 && markers[index].alert == 0) { // 正常 离线
          var backImg = "images/baidu/4.gif";
        }
        if (markers[index].normal > 0 && markers[index].offline == 0 && markers[index].alert > 0) { // 正常 告警
          var backImg = "images/baidu/5.gif";
        }
        if (markers[index].normal == 0 && markers[index].offline > 0 && markers[index].alert > 0) { // 离线 告警
          var backImg = "images/baidu/6.gif";
        }
        if (markers[index].normal > 0 && markers[index].offline > 0 && markers[index].alert > 0) { // 正常 离线 告警
          var backImg = "images/baidu/7.gif";
        }
        // placeId 场所ID
        // longitude经度
        // latitue纬度
        // total 总数
        // normal 正常数
        // alert 告警数
        // offline  离线数
        var placeId = markers[index].placeId;
        var lng = markers[index].position.lng;
        var lat = markers[index].position.lat;
        var total = markers[index].total;
        var normal = markers[index].normal;
        var alert = markers[index].alert;
        var offline = markers[index].offline;
        var vueThis = this;
        var myCompOverlayveh = new ComplexCustomOverlay(vueThis, point, backImg, placeId, total, normal, alert, offline, lng, lat);
        this.map.addOverlay(myCompOverlayveh);
      };
    },
    //地图点 点击查询设备
    baiduClick: function(placeId) {
      this.tableDataList = [];
      var _this = this;
      axios.post('/selectTypeAndStatusByPlaceId', {
        placeId: placeId,
        deviceCode: this.deviceCode,
        deviceTypeId: this.deviceTypeId
      }).then(function(result) {
        // console.log(result.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.tableDataList = data;
          _this.show = true;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备详情点击
    MonitoringClick: function(row, event, column) {
      this.$emit('MonitoringClick', row.deviceId);
    },
    //表格状态过滤
    formatSex: function(row, column) {
      return row.channelDataStatus == 1 ? '正常' : row.channelDataStatus >= 2 ? '告警' : row.channelDataStatus == 0 ? '离线' : '未知';
    },

  },
  updated: function () {
    if (this.tableDataList.length>5) {
      $("#inner_bontent").slimScroll({
        height: document.body.clientHeight*0.5,
      });
    }

  },
  watch: {
    orgId: function() {
      this.getUsers();
      this.tableDataList = [];
    },
    nodeType: function() {
      // this.getUsers();
    },
    deviceTypeId: function() {
      this.map.clearOverlays();
      this.getUsers();
      this.tableDataList = [];
    },
    deviceCode: function() {
      this.map.clearOverlays();
      this.getUsers();
    },
    deep: true
  }
}
</script>
<style media="screen">

</style>
