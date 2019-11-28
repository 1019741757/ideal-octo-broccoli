<template>
<div class="visitorpie">
  <div id="visitorpie" class="" style="width: 100%;height:248px;"></div>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  data() {
    return {
      myChart:null,
      queryDevicedeviceNumber: null, //设备总数
      queryDeviceCountVoList: [], //统计系统设备数
      page: {
       orgId: null,
       deviceCode: null,
       realTimeStatus: null
     },
    }
  },
  mounted() {
      var _this = this;
       axios.post('/countAlertStatus4Control', {
         page: this.page
       }).then(function(result) {
         if (result.data.success == true) {
           var data = result.data.data;
           _this.queryDevicedeviceNumber = data.total || 0;
           _this.queryDeviceCountVoList = [data.nomal, data.offline, data.yellow, data.orange, data.red];
           _this.myChart = echarts.init(document.getElementById('visitorpie'));
           _this.initData();
           // console.log(result);
         } else {
           _this.$message.error('请求失败');
         }
       });

  },
  methods: {
    initData() {
      const option = {
        title: {
             text: '设备总数：'+ this.queryDevicedeviceNumber,
             left : '30%',
             top : 0,
             textStyle: {
               color : '#1CB248',
               fontWeight : '600',
               fontSize : 12
             }
         },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          top: '15%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['正常', '离线', '黄', '橙', '红'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
        }],
        series: [{
          name: '数量',
          type: 'bar',
          barWidth: '80%',
          data: this.queryDeviceCountVoList,
          itemStyle: {
            normal: {
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                  '#35cd03', '#9c9c9c', '#ffc000', '#fe6000', '#ff0000'
                ];
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',

              }
            }
          }
        }]
      };
      this.myChart.setOption(option);
    }
  }
}
</script>

<style lang="less">

</style>
