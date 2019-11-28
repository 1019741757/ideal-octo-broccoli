<template>
<div>
  <div class="wrapper wrapper-content animated fadeInRight" id="inner-content1">
    <el-row :gutter="25" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane1">
          <!-- <div class="card-panel-icon-wrapper icon-people">
         <svg-icon icon-class="peoples" class-name="card-panel-icon" />
       </div> -->
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.red" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">红色告警设备数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane2">
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.orange" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">橙色告警设备数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane3">
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.yellow" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">黄色告警设备数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane4">
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.offline" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">离线设备数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane5">
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.nomal" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">正常设备数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card_pane card-pane6">
          <div class="card-panel-description">
            <count-to :startVal="0" :endVal="EquipmentStatisticsList.total" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">所有设备数</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <Equipment-Body></Equipment-Body>
    <Equipment-Header></Equipment-Header>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import echarts from 'echarts'
import CountTo from 'vue-count-to'
import EquipmentBody from './Generalization/EquipmentBody.vue'
import EquipmentHeader from './Generalization/EquipmentHeader.vue' //设备详情


export default {
  name: 'Generalization',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      EquipmentStatisticsList: {},
    }

  },
  components: {
    EquipmentBody,
    EquipmentHeader,
    CountTo
  },
  mounted() {
    $("#inner-content1").slimScroll({
      height: document.body.clientHeight - 120,
    });
    this.EquipmentStatistics();

  },
  methods: {
    EquipmentStatistics: function() {
      var _this = this;
      axios.post('/countAlertStatus4Control').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.EquipmentStatisticsList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
  }
}
</script>
<style media="screen">

</style>
