<template>
<div>
  <div id="inner-content" class="full-height-scroll">
    <!---             设备统计         -->
    <div class="EquipmentStatistics" v-if="nodeType == 1 || nodeType == null">
      <div class="EquipmentStatistics_talout">
        <el-row :gutter="20">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple EquipmentStatistics_Group1">
              <span class="eq_span">所有设备告警数</span>
              <p><count-to class="card-panel-num" :startVal="0" :endVal="DeviceAsperStatusList.alert" :duration="2600"></count-to></p>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple EquipmentStatistics_Group2">
              <span class="eq_span">所有设备离线数</span>
              <p><count-to class="card-panel-num" :startVal="0" :endVal="DeviceAsperStatusList.offline" :duration="2600"></count-to></p>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple EquipmentStatistics_Group3">
              <span class="eq_span">所有设备正常数</span>
              <p><count-to class="card-panel-num" :startVal="0" :endVal="DeviceAsperStatusList.normal" :duration="2600"></count-to></p>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple EquipmentStatistics_Group4">
              <span class="eq_span">所有设备总数</span>
              <p><count-to class="card-panel-num" :startVal="0" :endVal="DeviceAsperStatusList.total" :duration="2600"></count-to></p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:5%">
        <div class="EquipmentStatistics_echarts" id="Equipment_echarts"></div>
      </div>

    </div>
    <!---             设备列表         -->
    <div class="Devicelist" v-else>
      <!-- 查询表单 -->
      <div class="mail-box-header" style="position: relative;border:none;padding-bottom: 0;border-bottom: 8px solid #f3f3f4;">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px; margin-left: 12%;">
          <el-form-item label="建筑：">
            <el-select v-model="formInline.buildingId" placeholder="请选择" clearable @change="onSubmit()">
              <el-option v-for="item in selectBuildingList" :key="item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 缩略图标 -->
      <!-- <div id="deviceDiv_fath" class="col-md-12 deviceDiv_fath">
        <label class="col-lg-1 control-label">板式:</label>
        <div class="forum-icon"><i class="fa fa-th oprt" style="font-size:23px"></i></div>
        <div class="forum-icon"><i class="fa fa-th-large"></i></div>
      </div> -->
      <!-- 设备列表、五种状态 -->
      <div class="mail-box clearfix" id="deviceDivBox" style="border:none">

        <div class="deviceDiv" v-for="(item,index) in DeviceByList">

          <div :class="item.Colorname">
            <!--设备状态-->
            <div class="deviceDiv_header clearfix">
              <div align="left" class="col-lg-3 col-md-3 col-xs-3 deviceDiv_lt">{{item.deviceCode}}</div>
              <div align="right" class="col-lg-9 col-md-8 col-xs-8 deviceDiv_rt">{{item.deviceTypeName}}</div>
            </div>
            <!--安装位置-->
            <div class="deviceDiv_installLoc">
              <div :title="item.installLoc" class="deviceDiv_text">{{item.placeName}}{{item.buildingName}}{{ item.floorName }}{{item.installLoc}}</div>
            </div>
          </div>
          <!--通道数据-->
          <div class="deviceDiv_body">
            <Device-Data :deveiceList="item"></Device-Data>
            <div class="text-center deviceDiv_button">
              <el-button size="mini" @click.stop.prevent="MonitoringClick(item.deviceId)">详细信息</el-button>
              <el-button size="mini" type="danger" @click.stop.prevent="handleabnormality(item.deviceId)" v-if="item.alertHandleStatus == 1">异常处理</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--异常处理-->
  <el-dialog title="处理" :visible.sync="HandlemodelName" style="z-index:3000">
    <el-form :model="HandleboxList" :rules="rules" ref="HandleboxList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="异常处理：" prop="handleInfo">
        <el-input type="textarea" v-model="HandleboxList.handleInfo" auto-complete="off" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="HandlemodelName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="HandleSubmit('HandleboxList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import CountTo from 'vue-count-to'
import Vuex from 'Vuex'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

import DeviceData from './controlCenter/DeviceData.vue' //设备通道数据


export default {
  name: 'controlCenter',
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      //设备型号列表渲染
      formInline: {},
      //设备统计 设备数量
      DeviceAsperStatusList: [],
      //建筑查询
      selectBuildingList: [],
      //设备集合
      DeviceByList: [],
      //s设备刷新定时器
      timer: null,
      timeInterval:5000,
      //设备详情
      detailsmodelName: false,
      //处理异常界面数据
      HandlemodelName: false,
      HandleboxList: {},
      rules: {
        handleInfo: [{
            required: false,
            message: '请输入处理内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  computed: {
    ...mapState(['orgId', 'nodeType', 'deviceTypeId', 'deviceCode'])
  },
  components: {
    DeviceData,
    CountTo
  },
  mounted() {
    var _this=this;
    window.onresize = function temp() {
      _this.clientHeight = document.body.clientHeight - 150 + "px";
    }
    $("#inner-content").slimScroll({
      height: document.body.clientHeight - 150,
    });
    if (this.nodeType == null || this.nodeType == 1) {
      this.countDeviceAsperStatusByClassify(); //设备统计 设备数量
      this.countAlertByDate(); //设备告警曲线
    } else {
      this.selectBuilding();
      this.DeviceByPlaceIdOrBuildingId(); //设备查询
      clearInterval(this.timer);
      var _this = this;
      this.timer=setInterval(function() {
        _this.DeviceByPlaceIdOrBuildingId();
      }, this.timeInterval);
    }
  },
  methods: {
    ...mapMutations(['set_MonitoringClick']),
    onSubmit: function() {
      this.DeviceByPlaceIdOrBuildingId();
    },
    //设备统计 设备数量
    countDeviceAsperStatusByClassify: function() {
      var _this = this;
      axios.post('/countDeviceAsperStatusByClassify', {
        classifyId: this.orgId,
        deviceTypeId:this.deviceTypeId
      }).then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.DeviceAsperStatusList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备统计 设备告警曲线
    countAlertByDate: function() {
      var _this = this;
      axios.post('/countByclassifyId', {
        classifyId: this.orgId,
        deviceTypeId:this.deviceTypeId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          var date = new Array;
          var totalArray = new Array;
          var normalArray = new Array;
          var offlineArray = new Array;
          var alertArray = new Array;
          for (var i = 0; i < data.length; i++) {
            // date.push(_this.$moment(data[i].createdDate).format("MM-DD"))
            date.push(data[i].createdDate);
            totalArray.push(data[i].total || 0);
            normalArray.push(data[i].normal || 0);
            offlineArray.push(data[i].offline || 0);
            alertArray.push(data[i].alert || 0);
          }
          var myChart = echarts.init(document.getElementById('Equipment_echarts'));
          var option = {
            title: {
              // text: '历史告警曲线图'
            },
            tooltip: {
              trigger: 'axis'
            },
            color: ['#1B83F9', '#48D11B', '#9C9C9C', '#FE0000'],
            legend: {
              data: ['设备总数', '设备正常', '设备离线', '设备告警']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                // saveAsImage: {}
              }
            },
            xAxis: {
              name: '日期',
              type: 'category',
              data: date
            },
            yAxis: {
              name: '数量',
              type: 'value',
              minInterval : 1,
            },
            series: [{
                name: '设备总数',
                type: 'line',
                data: totalArray
              },
              {
                name: '设备正常',
                type: 'line',
                data: normalArray
              },
              {
                name: '设备离线',
                type: 'line',
                data: offlineArray
              },
              {
                name: '设备告警',
                type: 'line',
                data: alertArray
              }
            ]
          }
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //建筑查询
    selectBuilding: function() {
      var _this = this;
      axios.post('/selectBuildingListByPlaceId', {
        placeId: this.orgId
      }).then(function(result) {
        // console.log(result.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectBuildingList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备列表查询
    DeviceByPlaceIdOrBuildingId: function() {
      var _this = this;
      axios.post('/selectDeviceByPlaceIdOrBuildingId', {
        placeId: this.orgId,
        buildingId: this.formInline.buildingId,
        deviceCode: this.deviceCode,
        deviceTypeId: this.deviceTypeId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          for (var i = 0; i < data.length; i++) {
            data[i].Colorname=data[i].channelDataStatus==0?"ColorB":data[i].channelDataStatus==1?"ColorA":data[i].channelDataStatus==2?"ColorC":data[i].channelDataStatus==3?"ColorD":data[i].channelDataStatus==4?"ColorE":'ColorB';
          }
          _this.DeviceByList = [];
          // console.log(_this.DeviceByList);
          _this.DeviceByList = data;
          console.log(_this.DeviceByList);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备详情点击
    MonitoringClick: function(deviceId) {
      this.$emit('MonitoringClick', deviceId);
    },
    //处理异常
    handleabnormality: function(deviceId) {
      this.HandleboxList.deviceAlertId = deviceId;
      this.HandlemodelName = true;
    },
    //处理异常
    HandleSubmit: function(HandleboxList) {
      this.$refs[HandleboxList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/handleDeviceAlert', {
            HandleboxList: this.HandleboxList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.DeviceByPlaceIdOrBuildingId();
              _this.$emit('zTreeChange');
              _this.HandlemodelName = false;
              _this.$refs[HandleboxList].resetFields();
              _this.$message({
                message: "处理成功",
                type: 'success'
              });
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
  },
  watch: {
    orgId: function() {
      this.formInline.buildingId=null;
      if (this.nodeType == null || this.nodeType == 1) {
        clearInterval(this.timer);
        this.countDeviceAsperStatusByClassify();
        this.countAlertByDate(); //设备告警曲线
      } else {
        this.DeviceByPlaceIdOrBuildingId();
        this.selectBuilding();
        clearInterval(this.timer);
        var _this = this;
        this.timer=setInterval(function() {
          _this.DeviceByPlaceIdOrBuildingId();
        }, this.timeInterval);
      }
    },
    nodeType: function() {},
    deviceTypeId: function() {
      if (this.nodeType == null || this.nodeType == 1) {
        this.countDeviceAsperStatusByClassify();
        this.countAlertByDate(); //设备告警曲线
      } else {
        this.DeviceByPlaceIdOrBuildingId();
        clearInterval(this.timer);
        var _this = this;
        this.timer=setInterval(function() {
          _this.DeviceByPlaceIdOrBuildingId();
        }, this.timeInterval);
      }
    },
    deviceCode: function() {
      if (this.nodeType == null || this.nodeType == 1) {} else {
        this.DeviceByPlaceIdOrBuildingId();
        clearInterval(this.timer);
        var _this = this;
        this.timer=setInterval(function() {
          _this.DeviceByPlaceIdOrBuildingId();
        }, this.timeInterval);
      }
    },
    deep: true
  },
  destroyed: function () {
    console.group('destroyed 销毁完成状态===============》');
      clearInterval(this.timer);
  }
}
</script>
<style media="screen">

</style>
