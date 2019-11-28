<template>
<div>
  <div class="control-device-details">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClickbox">
      <el-tab-pane label="设备信息" name="0">
        <span slot="label">设备信息</span>
        <div class="" id="inner-content1">
          <el-row style="margin:0;">
            <el-col :span="24" style="margin-bottom:25px;">
              <div class="grid-content bg-purple device_dl">
                <dl class="">
                  <dd>设备编码：</dd>
                  <dd>{{EquipmentInformationList.deviceCode}}</dd>
                </dl>
                <dl class="">
                  <dd>设备状态：</dd>
                  <dd v-if="EquipmentInformationList.channelDataStatus == 0">离线</dd>
                  <dd v-if="EquipmentInformationList.channelDataStatus == 1" style="color:#35CD04">正常</dd>
                  <dd v-if="EquipmentInformationList.channelDataStatus == 2" style="color:#FFC001">黄色告警</dd>
                  <dd v-if="EquipmentInformationList.channelDataStatus == 3" style="color:#FE6000">橙色告警</dd>
                  <dd v-if="EquipmentInformationList.channelDataStatus == 4" style="color:#FF0000">红色告警</dd>
                </dl>
                <dl class="">
                  <dd>状态时间：</dd>
                  <dd v-if="EquipmentInformationList.startTime4Status!=null">{{EquipmentInformationList.startTime4Status | momentc("YYYY-MM-DD HH:mm:ss")}}</dd>
                  <dd v-else></dd>
                </dl>
                <dl class="">
                  <dd>设备类型：</dd>
                  <dd>{{EquipmentInformationList.deviceTypeName}}</dd>
                </dl>
                <dl class="">
                  <dd>设备厂商：</dd>
                  <dd>{{EquipmentInformationList.vendorName}}</dd>
                </dl>
                <dl class="">
                  <dd>设备型号：</dd>
                  <dd>{{EquipmentInformationList.deviceModelName}}</dd>
                </dl>
                <dl class="">
                  <dd>业主：</dd>
                  <dd>{{EquipmentInformationList.ownerName}}</dd>
                </dl>
                <dl class="">
                  <dd>电压告警阈值(V)：</dd>
                  <dd>{{EquipmentInformationList.voltageThreshold}}</dd>
                </dl>
                <dl class="">
                  <dd>电流告警阈值(A)：</dd>
                  <dd>{{EquipmentInformationList.electricityThreshold}}</dd>
                </dl>
                <dl class="">
                  <dd>离线时间阈值(min)：</dd>
                  <dd>{{EquipmentInformationList.offlineTime}}</dd>
                </dl>
                <dl class="">
                  <dd>RSSI：</dd>
                  <dd>{{EquipmentInformationList.rssi}}</dd>
                </dl>
                <dl class="">
                  <dd>DTU：</dd>
                  <dd>{{EquipmentInformationList.dtuId}}</dd>
                </dl>
                <dl class="">
                  <dd>安装人：</dd>
                  <dd>{{EquipmentInformationList.installerName}}</dd>
                </dl>
                <dl class="">
                  <dd>安装地址：</dd>
                  <dd>{{EquipmentInformationList.placeName}}{{EquipmentInformationList.buildingName}}{{ EquipmentInformationList.floorName }}{{EquipmentInformationList.installLoc}}</dd>
                </dl>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="grid-content bg-purple-light device_dl device_tabel" v-if="EquipmentInformationList.dataList != null&&EquipmentInformationList.dataList.length>0">
                <Device-Data :deveiceList="EquipmentInformationList"></Device-Data>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="安装照片" name="1">
        <span slot="label">安装照片</span>
        <div class="" id="inner-content2">
          <div class="device_Images">
            <div class="device_louing">
              <p>安装前：</p>
              <ul class="clearfix" v-if="FrontImageList.length>0">
                <li v-for="item in FrontImageList" @click="onImges(item)">
                  <img :src="item" alt="">
                </li>
              </ul>
              <div class="auto_goure" v-else>暂无数据</div>
            </div>
            <div class="device_louing">
              <p>安装后：</p>
              <ul class="clearfix" v-if="afterImageList.length>0">
                <li v-for="item in afterImageList" @click="onImges(item)">
                  <img :src="item" alt="">
                </li>
              </ul>
              <div class="auto_goure" v-else>暂无数据</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史异常处理记录" name="2">
        <span slot="label">历史异常处理记录</span>
        <div class="" id="inner-content3">
          <div class="ibox-content" style="border:none;padding:0">
            <el-card class="box-card">
              <el-table :data="selectDeviceExceptionList" style="width: 100%">
                <el-table-column type="index" width="60" label="排序"></el-table-column>
                <el-table-column property="startCreateTime" label="最初时间" :formatter="dateFormat"></el-table-column>
                <el-table-column property="endCreateTime" label="最后时间" :formatter="dateFormat"></el-table-column>
                <el-table-column property="number" label="告警次数"></el-table-column>
                <el-table-column property="handleName" label="处理人"></el-table-column>
                <el-table-column property="handleInfo" label="处理内容"></el-table-column>
                <el-table-column property="handleTime" label="处理时间" :formatter="dateFormat"></el-table-column>
              </el-table>
              <el-row type="flex" justify="end" style="padding:20px 0; ">
                <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
              </el-row>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="告警历史曲线图" name="3">
        <span slot="label">告警历史曲线图</span>
        <div class="" id="inner-content4">
          <div class="" id="selectDeviceUploadStatusLogsByDeviceId" :style="{width:clientWidth,height:screenheight}"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史DTU信号曲线图" name="4">
        <span slot="label">历史DTU信号曲线图</span>
        <div class="" id="inner-content5">
          <div class="" id="queryRssiByDeviceID" :style="{width:clientWidth,height:screenheight}"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史数据曲线图" name="5">
        <span slot="label">历史数据曲线图</span>
        <div class="" id="inner-content6">
          <div class="routel_radio">
            <el-form ref="form" label-width="70px">
              <el-form-item label="日期：">
                <el-date-picker v-model="Datevalue" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" :clearable=false @change="chosebuildingId">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div id="DataChart"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import Vuex from 'Vuex'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
import DeviceData from '../MonitoringStation/controlCenter/DeviceData.vue' //设备通道数据

export default {
  name: 'DeviceDetails',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth * 0.78 + "px",
      screenheight: document.body.clientHeight * 0.6 + "px",
      activeName: "0",
      EquipmentInformationList: {}, //基础信息
      IFqueryRssiByDeviceID: true, //历史DTU信号曲线图
      IFselectDeviceUploadStatusLogsByDeviceId: true, //告警历史曲线图
      IFselectDeviceAlerts: true, //历史异常处理记录
      IFqueryHistoryData: true, //历史数据曲线图
      Datevalue: new Date(),
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      selectDeviceExceptionList: [], //历史异常处理记录
      pageSize: 10,
      pageNo: 1,
      total: 0,
      IFgetImageBydeviceId: true, //安装照片
      FrontImageList: [], //安装前照片
      afterImageList: [], //安装后照片
    }
  },
  computed: {
    ...mapState(['deviceId'])
  },
  components: {
    DeviceData
  },
  mounted() {
    $("#inner-content1").slimScroll({
      height: document.body.clientHeight * 0.7,
    });
    $("#inner-content2").slimScroll({
      height: document.body.clientHeight * 0.7,
      alwaysVisible: false, //是否 始终显示组件
    });
    $("#inner-content3").slimScroll({
      height: document.body.clientHeight * 0.7,
    });
    $("#inner-content4").slimScroll({
      height: document.body.clientHeight * 0.7,
    });
    $("#inner-content5").slimScroll({
      height: document.body.clientHeight * 0.7,
    });
    $("#inner-content6").slimScroll({
      height: document.body.clientHeight * 0.7,
    });
    this.EquipmentInformation();
  },
  methods: {
    //详情 计划信息数据
    handleClickbox: function(tab, event) {
      let taaindex = tab.index;
      if (taaindex == 5 && this.IFqueryHistoryData == true) {
        this.chosebuildingId();
      } else if (taaindex == 4 && this.IFqueryRssiByDeviceID == true) {
        this.queryRssiByDeviceID();
      } else if (taaindex == 3 && this.IFselectDeviceUploadStatusLogsByDeviceId == true) {
        this.selectDeviceUploadStatusLogsByDeviceId();
      } else if (taaindex == 2 && this.IFselectDeviceAlerts == true) {
        this.selectDeviceAlerts();
        this.IFselectDeviceAlerts == false;
      } else if (taaindex == 1 && this.IFgetImageBydeviceId == true) {
        this.getImageBydeviceId();
      } else {

      }
    },
    //基础信息
    EquipmentInformation: function() {
      var _this = this;
      axios.post('/selectDeviceById', {
        deviceId: this.deviceId
      }).then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.EquipmentInformationList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //历史异常处理记录
    handleCurrentChange: function(val) {
      this.pageNo = val;
      this.selectDeviceAlerts();
    },
    sizeCurrentChange: function(val) {
      this.pageSize = val;
      this.selectDeviceAlerts();
    },
    selectDeviceAlerts: function() {
      let parameterList = {
        deviceId: this.deviceId,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectTreatedDeviceAlerts', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectDeviceExceptionList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //安装照片
    getImageBydeviceId: function() {
      var _this = this;
      axios.post('/selectInstallPhotosByDeviceId', {
        deviceId: this.deviceId
      }).then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].isBefore == 1) {
              _this.FrontImageList.push(data[i].imgUrl);
            } else {
              _this.afterImageList.push(data[i].imgUrl);
            }
          }
          _this.IFgetImageBydeviceId = false;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    onImges: function(imgsrc) {

    },
    //告警历史曲线图
    selectDeviceUploadStatusLogsByDeviceId: function() {
      var _this = this;
      axios.post('/selectDeviceUploadStatusLogsByDeviceId', {
        deviceId: this.deviceId
      }).then(function(result) {
        if (result.data.success == true) {
          _this.IFselectDeviceUploadStatusLogsByDeviceId = false;
          var data = result.data.data;
          var date = new Array;
          var warnCount = new Array;
          for (var i = 0; i < data.length; i++) {
            var Casedate = data[i].countDate;
            date.push(Casedate);
            warnCount.push(data[i].alertCnt);
          }
          var myChart = echarts.init(document.getElementById('selectDeviceUploadStatusLogsByDeviceId'));
          var option = {
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: 50,
              top: 70,
              bottom: 50
            },
            xAxis: [{
              name: '年/月/日',
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#d14a61"
                }
              },
              axisPointer: {},
              data: date
            }],
            yAxis: [{
              name: '次数',
              type: 'value',
              minInterval: 1
            }],
            series: [{
              name: '告警次数',
              type: 'line',
              smooth: true,
              data: warnCount
            }]
          };
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //历史DTU信号曲线图
    queryRssiByDeviceID: function() {
      var _this = this;
      axios.post('/queryRssiByDeviceID', {
        deviceId: this.deviceId
      }).then(function(result) {
        if (result.data.success == true) {
          _this.IFqueryRssiByDeviceID = false;
          var data = result.data.data;
          var date = new Array;
          var signalValue = new Array;
          for (var i = 0; i < data.length; i++) {
            date.push(i + 1);
            signalValue.push(data[i]);
          }
          var myChart = echarts.init(document.getElementById('queryRssiByDeviceID'));
          var colors = ['#5793f3', '#d14a61', '#675bba'];
          var option = {
            tooltip: {
              trigger: 'axis'
            },

            grid: {
              left: 50,
              top: 70,
              bottom: 50
            },
            xAxis: [{
              name: '次数',
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#d14a61"
                }
              },
              axisPointer: {
                label: {
                  formatter: function(params) {
                    // return '信号值' +(params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    // alert(JSON.stringify(params));
                    if (params.seriesData.length == 0) return '信号值:' + 0;
                    if (params.seriesData[0].data == null) {
                      // return '信号值:' +0;
                    } else {
                      // return '信号值:' +(  params.seriesData[0].data );
                    }
                  }
                }
              },
              data: date
            }],
            yAxis: [{
              name: '信号值',
              type: 'value'
            }],
            series: [{
              name: '信号值',
              type: 'line',
              smooth: true,
              data: signalValue
            }]
          };
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //历史数据曲线图
    chosebuildingId: function() {
      var _this = this;
      axios.post('/queryHistoryData', {
        deviceId: this.deviceId,
        date: this.Datevalue,
      }).then(function(result) {
        if (result.data.success == true) {
          _this.IFqueryHistoryData = false;
          var HistoryData = result.data.data;
          if (HistoryData.length > 0) {
            $("#DataChart").html('');
            for (var i = 0; i < HistoryData.length; i++) {
              _this.Favourite(i, HistoryData[i]);
            }
          } else {
            // $("#DataChart").html("<div class='tab_murnvv'>"+_this.Datevalue+"&nbsp;&nbsp;暂无数据</div>");
            $("#DataChart").html("<div class='tab_murnvv'>" + "&nbsp;&nbsp;暂无数据</div>");
          }

        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    queryHistoryData: function() {

    },
    Favourite: function(index, HistoryData) {
      // var OryutArry = ["A路", "B路", "C路", "D路", "E路", "F路", "G路", "H路", "i路", "j路", "k路", "M路", "N路", "O路", "P路"];
      var HistoryDataLength = HistoryData.data.channelHisDataList;
      var nutrArry = new Array();
      var HistoryDataList = new Array();
      var maxValue = HistoryData.maxValue;
      for (var i = 0; i < HistoryDataLength.length; i++) {
        if (HistoryData.typeCode == 1 || HistoryData.typeCode == 2 || HistoryData.typeCode == 3 || HistoryData.typeCode == 5) {
          nutrArry.push(HistoryDataLength[i].name);
          HistoryDataList.push({
            name: HistoryDataLength[i].name,
            type: "line",
            data: HistoryDataLength[i].data
          })
        }
        if (HistoryData.typeCode == 17) {
          HistoryDataList.push({
            name: "电量值",
            type: "line",
            data: HistoryDataLength[i].data
          })
        }
      }
      console.log(HistoryData.typeCode);
      // console.log(maxValue);
      $("#DataChart").append("<div id='DataChart" + index + "' style='height: 500px;'></div>");
      var offsetWidth = document.body.offsetWidth * 0.8;
      $("#DataChart" + index).width(offsetWidth);
      var myChart = echarts.init(document.getElementById('DataChart' + index));
      var option = {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: nutrArry
        },
        grid: {
          left: HistoryData.typeCode == 2 ? "24px" : HistoryData.typeCode == 3 ? "38px" : "28px",
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          left: '83%',
          top: '-1%',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          name: '时间',
          type: 'category',
          boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#d14a61"
            }
          },
          data: HistoryData.data.dateList
        },
        yAxis: {
          name: HistoryData.typeName + "(" + HistoryData.unit + ")",
          type: 'value',
          max: function(value) {
            if (value.max < maxValue) {
              return maxValue
            } else {
              return value.max
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 100,
          end: 0
        }, {
          start: 0,
          end: 10,
          handleSize: '100%',
          right: '8.2%',
          bottom: '3px'
        }],
        series: HistoryDataList
      }
      myChart.setOption(option);
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {

  }
}
</script>
<style media="screen">

</style>
