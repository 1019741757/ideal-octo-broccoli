<template>
<div class="visitorpie">
  <div id="news-container" style="background-color: #fff;" v-if="selectDeviceAlertLogVoList==[]">
    <ul style="padding:0;width:252px;background-color: #fff;">
      <li v-for="(liem, index) in selectDeviceAlertLogVoList" @click="deviceCodeonSubmit(liem.deviceCode);">
        <div class="news_lf"><i class="fa fa-warning fa-2x" style="font-size: 16px;padding: 5px; color:#ec4758;"></i></div>
        <div class="news_rt">
          <h4 style="font-size: 12px;line-height: 26px;margin: 0;">
            设备编号&nbsp;&nbsp;
            <span style="color:#ec4758;">【{{liem.deviceCode}}】</span>
            出现
            <!-- <span style="color:#ec4758;">{{liem.deviceExceptionType  | capitalize }}</span> -->
            告警
          </h4>
        </div>
      </li>

    </ul>
  </div>
  <div id="news-container" style="background-color: #fff;" v-else>
    <div class="widget red-bg p-xl text-center" style=" height:238px;">
                      <div class="m-b-md">
                          <i class="fa fa-bell fa-4x"></i>
                          <!-- <h1 class="m-xs">47</h1> -->
                          <h3 class="font-bold no-margins">
                            暂无告警
                          </h3>
                          <!-- <small>We detect the error.</small> -->
                      </div>
                  </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      number:5,
      selectDeviceAlertLogVoList: [], //统计系统设备数
    }
  },
  mounted() {
    var _this = this;
     axios.post('/selectAlertDeviceCodes4Control', {
       number: this.number
     }).then(function(result) {
       if (result.data.success == true) {
         var data = result.data.data;
         _this.selectDeviceAlertLogVoList = data;
         // console.log(result);
       } else {
         _this.$message.error('请求失败');
       }
     })
  },
  filters: {
    capitalize: function(value) {
      var M;
      switch (value) {
        case 1:
          M = "离线"
          break;
        case 2:
          M = "在线 "
          break;
        case 3:
          M = "震动"
          break;
        case 4:
          M = "低压"
          break;
        case 5:
          M = "断电"
          break;
        default:
          M = "无状态"
      }
      return M
    }
  },
  methods: {
   deviceCodeonSubmit:function(deviceCode){
     var _this = this.$parent;
     axios.post('/selectDeviceMonitorList', {
       orgId: null,
       deviceCode: deviceCode
     }).then(function(result) {
       // console.log(result.data.data);
       if (result.data.success == true) {
         var data = result.data.data;
         if (data != [] && data.length != 0) {
           _this.map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 16); // 初始化地图，设置中心点坐标和地图级别
         } else {
           _this.$message({
             message: '没有定位到设备',
             type: 'warning'
           });
         }
       } else {
         _this.$message.error(result.data.message);
       }
     })

   }
  },
  watch: {

  }
}
</script>

<style lang="less">
#news-container ul li {
    display: list-item;
    list-style: none;
    cursor: pointer;
    overflow: hidden;
    padding: 11px 0;
}
#news-container ul li div.news_rt {
    float: left;
    width: 86%;
}
#news-container ul li div.news_lf {
    float: left;
    width: 14%;
}
</style>
