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
                    <span>{{item.endCreateTime | momentc("YYYY-MM-DD hh:mm")}}</span>
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
          <div class="Gener_echarts_t el_boxColor information_text" style="height:370px;">
            <div class="information_title">
              <small class="pull-right text-muted">
                <router-link to="/management/ApplicationForInvestigation">
                  更多
                </router-link>
              </small> 排查申请
            </div>
            <div class="information_content">
              <ul>
                <li v-for="(item,index) in selectCheckingApplysList">
                  <div class="information_rcvx">
                    <span>{{item.createdDate | momentc("YYYY-MM-DD")}}</span>
                    <a size="mini" round class="stpe0" v-if="item.status==0">未处理</a>
                    <a size="mini" round class="stpe1" v-if="item.status==1">已接受</a>
                    <a size="mini" round class="stpe2" v-if="item.status==2">已完成</a>
                    <a size="mini" round class="stpe3" v-if="item.status==3">已拒绝</a>
                    <a size="mini" round class="stpe4" v-if="item.status==4">已取消</a>
                  </div>
                  <div class="information_vcie">
                    {{item.ownerName}}<span>请求检修</span>{{item.placeName}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
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
      selectCheckingApplysList: []
    }
  },
  mounted() {
    this.countNewDeviceByDate(); //设备增长数量
    this.selectUntreatedDeviceAlerts(); //告警信息栏
    this.selectCheckingApplys(); //排查申请
  },
  methods: {
    countNewDeviceByDate: function() {
      var _this = this;
      axios.post('/countNewDeviceByDate').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var date = new Array;
          var warnCount = new Array;
          for (var i = 0; i < data.length; i++) {
            date.push(data[i].date)
            warnCount.push(data[i].cnt);
          }
          var myChart = echarts.init(document.getElementById('countNewDeviceByDate'));
          var option = {
            title: {
              text: '设备增长曲线',
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
              trigger: 'axis'
            },
            grid: {
              left: 50,
              right: 55,
              top: 70,
              bottom: 50
            },
            color: '#1CB248',
            xAxis: [{
              name: '月/日',
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#ccc"
                }
              },
              axisPointer: {},
              data: date
            }],
            yAxis: [{
              name: '数量',
              type: 'value',
              minInterval: 1,
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#ccc"
                }
              },
            }],
            series: [{
              name: '增长数量',
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
    selectCheckingApplys: function() {
      var parameterList = {
        ownerPhone: null,
        status: null,
        pageSize: 4,
        pageNo: 1
      }
      var _this = this;
      axios.post('/selectCheckingApplys', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result.data.rows);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectCheckingApplysList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
  },
}
</script>
<style media="screen">

</style>
