<template>
<div class="" v-if="Jurisdiction('dataReport:deviceGrowReoprtLook')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <div class="ibox-content" style="border:none">
              <div class="growthInformation_echarts" id="countNewDeviceByDate"> </div>
              <el-card class="box-card">
                <el-table :data="countNewDeviceByDateList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60"></el-table-column>
                  <el-table-column property="date" label="日期"></el-table-column>
                  <el-table-column property="cnt" label="增长数量"></el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'growthInformation', //设备增长信息
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      countNewDeviceByDateList: [],
    }
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    //tabel数据获取
    getUsers: function() {
      var _this = this;
      axios.post('/countNewDeviceByDate').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.countNewDeviceByDateList = data;
          var date = new Array;
          var warnCount = new Array;
          for (var i = 0; i < data.length; i++) {
            // var _date = _this.$moment(data[i].date).format("MM-DD");
            date.push(data[i].date)
            warnCount.push(data[i].cnt);
          }
          var myChart = echarts.init(document.getElementById('countNewDeviceByDate'));
          var option = {
            title: {
              text: '设备增长曲线（近一个月）',
              x: 'center',
              align: 'right'
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: 20,
              top: 70,
              bottom: 20
            },
            xAxis: [{
              name: '月/日',
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
              name: '数量',
              type: 'value',
              minInterval: 1
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
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD");
    },
  }
}
</script>
<style media="screen">

</style>
