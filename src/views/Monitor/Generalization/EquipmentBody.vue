<template>
<div>
  <el-row :gutter="15" style="margin-top:1%">
    <el-col :xs="24" :sm="9" :lg="5">
      <div class="chart-wrapper chart_bodyColrcv">
        <div id="Equipmentstate" style="width: 100%;height:300px;"></div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="9" :lg="14">
      <div class="chart-wrapper chart_bodyColrcv">
        <div class="Gener_echarts_f el_boxColor" id="countAlertByDate"> </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="9" :lg="5">
      <div class="chart-wrapper chart_bodyColrcv">
        <div id="AlarmType" style="width: 100%;height:300px;"></div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'EquipmentBody',
  data() {
    return {
      myChart: null,
      EquipmentstateList: {}, //设备状态占比
      AlarmTypeList: {}, //告警类型占比
    }
  },
  mounted() {
    this.Equipmentstate();
    this.AlarmType();
    this.countAlertByDate(); //设备告警次数
  },
  methods: {
    //设备状态占比
    Equipmentstate: function() {
      var _this = this;
      axios.post('/countAlertStatusRate').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var myChart = echarts.init(document.getElementById('Equipmentstate'));
          var option = {
            title: {
              text: '设备状态占比',
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
            color: ['#35cd03', '#9c9c9c', '#ffc000', '#fe6000', '#ff0000'],
            legend: {
              bottom: '4%',
              left: 'center',
              itemGap:13,
              itemWidth: 15,
              data: ['正常', '离线', '黄色告警', '橙色告警', '红色告警']
            },

            series: [{
              name: '状态占比',
              type: 'pie',
              radius: ['50%', '60%'],
              center: ['50%', '43%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [{
                  value: data.nomal,
                  name: '正常'
                },
                {
                  value: data.offline,
                  name: '离线'
                },
                {
                  value: data.yellow,
                  name: '黄色告警'
                },
                {
                  value: data.orange,
                  name: '橙色告警'
                },
                {
                  value: data.red,
                  name: '红色告警'
                }
              ],
            }]
          };
          myChart.setOption(option);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //告警类型占比
    AlarmType: function() {
      var _this = this;
      axios.post('/countAlertTypeRate').then(function(result) {
        // console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var data = result.data.data;
          var myChart = echarts.init(document.getElementById('AlarmType'));
          var option = {
            title: {
              text: '告警类型占比',
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
            color: ['#69ECC5', '#39C2C9', '#FFCE00', '#FFA71A', '#F866B9'],
            legend: {
              bottom: '4%',
              left: 'center',
              itemGap: 20,
              itemWidth: 15,
              data: ['漏电流', '电流', '温度', '电压', '电量']
            },
            series: [{
              name: '类型占比',
              type: 'pie',
              radius: '59%',
              center: ['50%', '43%'],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                }
              },
              data: [{
                  value: data.leakElectricity,
                  name: '漏电流'
                },
                {
                  value: data.electricity,
                  name: '电流'
                },
                {
                  value: data.temperature,
                  name: '温度'
                },
                {
                  value: data.voltage,
                  name: '电压'
                },
                {
                  value: data.electricQuantity,
                  name: '电量'
                }
              ],
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
    },
    //设备告警曲线
    countAlertByDate: function() {
      var _this = this;
      axios.post('/countAlertByDay').then(function(result) {
        // console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          var date = new Array;
          var warnCount = new Array;
          for (var i = 0; i < data.length; i++) {
            date.push(data[i].date)
            warnCount.push(data[i].cnt);
          }
          var myChart = echarts.init(document.getElementById('countAlertByDate'));
          var option = {
            title: {
              text: '设备告警曲线',
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
            color: '#ff0000',
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
              name: '告警数量',
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
  },
  watch: {

  }
}
</script>
<style media="screen">

</style>
