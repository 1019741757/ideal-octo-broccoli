<template>
<div>
  <div class="row Gener_body " style="margin:0">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="14" :lg="14">
        <div class="chart-wrapper chart_bodyroute">
          <div class="Gener_echarts_t el_boxColor" id="countNewDeviceByDate" style="height:370px;"> </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="5" :lg="5">
        <div class="chart-wrapper chart_bodyroute">
          <div class="Gener_echarts_t el_boxColor information_text" style="height:370px;">
            <div class="information_title">
              <small class="pull-right text-muted">
                <router-link to="/Monitor/EquipmentAbnormality">
                  更多
                </router-link>
              </small> 告警信息
            </div>
            <div class="information_content">
              <ul>
                <li v-for="(item,index) in DeviceAlertsList">
                  <div class="information_Tnue">
                    <span>{{item.endCreateTime | momentc("YYYY-MM-DD")}}</span>
                  </div>
                  <div class="information_unbt">
                    {{item.placeName}}{{item.buildingName}}{{item.floorName}}的{{item.deviceCode}}({{item.deviceTypeName}})出现<span>{{item.alertType==1?"电流":item.alertType==2?"电压":item.alertType==3?"漏电流":item.alertType==4?"温度":""}}异常</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="5" :lg="5">
        <div class="chart-wrapper chart_bodyroute">
          <div id="EquipmentType" class="Gener_echarts_t el_boxColor" style="height:370px;"></div>
        </div>
      </el-col>
    </el-row>

  </div>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'EquipmentHeader',
  data() {
    return {
      DeviceAlertsList: [],
      EquipmentTypeList: {} //设备类型占比
    }
  },
  mounted() {
    this.countNewDeviceByDate(); //设备状态曲线
    this.selectUntreatedDeviceAlerts(); //告警信息栏
    this.EquipmentType(); //设备类型占比
  },
  methods: {
    countNewDeviceByDate: function() {
      var _this = this;
      axios.post('/countDeviceByStatus4OwnerAndSons').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var ownerNameList = new Array;
          var nomalList = new Array;
          var offlineList = new Array;
          var yellowList = new Array;
          var orangeList = new Array;
          var redList = new Array;
          for (var i = 0; i < data.length; i++) {
            ownerNameList.push(data[i].ownerName);
            nomalList.push(data[i].nomal);
            offlineList.push(data[i].offline);
            yellowList.push(data[i].yellow);
            orangeList.push(data[i].orange);
            redList.push(data[i].red);
          }
          console.log(nomalList);
          var myChart = echarts.init(document.getElementById('countNewDeviceByDate'));
          var option = {
            title: {
              text: '设备状态曲线',
              x: 'left',
              left: '8px',
              top: '8px',
              textStyle: {
                color: 'rgba(51,51,51,1)',
                fontWeight: 'bold',
                fontSize: '15',
                fontStyle: 'normal'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            color: ['#35cd03', '#9c9c9c', '#ffc000', '#fe6000', '#ff0000'],
            legend: {
              top:'10px',
              data: ['正常', '离线', '黄色告警', '橙色告警','红色告警']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              minInterval: 1
            },
            yAxis: {
              type: 'category',
              data: ownerNameList
            },
            series: [{
                name: '正常',
                type: 'bar',
                barMaxWidth:30,//最大宽度
                stack: '总量',
                data: nomalList
              },
              {
                name: '离线',
                type: 'bar',
                barMaxWidth:30,//最大宽度
                stack: '总量',
                data: offlineList
              },
              {
                name: '黄色告警',
                type: 'bar',
                barMaxWidth:30,//最大宽度
                stack: '总量',
                data: yellowList
              },
              {
                name: '橙色告警',
                type: 'bar',
                barMaxWidth:30,//最大宽度
                stack: '总量',
                data: orangeList
              },
              {
                name: '红色告警',
                type: 'bar',
                barMaxWidth:30,//最大宽度
                stack: '总量',
                data: redList
              }
            ]
          };
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    selectUntreatedDeviceAlerts: function() {
      var _this = this;
      axios.post('/selectUntreatedDeviceAlerts').then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.DeviceAlertsList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备类型占比
    EquipmentType: function() {
      var _this = this;
      axios.post('/countAllInstalledDeviceTypeRate').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var Typedata = new Array;
          var EquipmentData = new Array;
          data.forEach(function(item, index) {
            Typedata.push(item.name);
            EquipmentData.push({
              value: item.cnt,
              name: item.name
            })
          })
          var myChart = echarts.init(document.getElementById('EquipmentType'));
          var option = {
            title: {
              text: '设备类型占比',
              x: 'left',
              left: '8px',
              top: '8px',
              textStyle: {
                color: 'rgba(51,51,51,1)',
                fontWeight: 'bold',
                fontSize: '15',
                fontStyle: 'normal'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: ['#12CBF6', '#028BFF', '#FFCE00', '#FFA71A', '#F866B9'],
            legend: {
              bottom: '4%',
              left: 'center',
              itemGap: 20,
              itemWidth: 15,
              data: Typedata
            },
            series: [{
              name: '设备类型占比',
              type: 'pie',
              radius: '46%',
              center: ['50%', '48%'],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                }
              },
              data: EquipmentData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          };
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    }
  },
}
</script>
<style media="screen">

</style>
