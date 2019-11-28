<template>
<div>
    <!-- <h5 v-if="!topVaule">空开状态：</span>{{topVaule}}</span></h5> -->
    <p v-if="deveiceList.startTime4Status != null" id="deveice_p_text" :class="deveiceColorName">{{deveiceStatusName}}时间<span>{{startTime4Status | momentc("YYYY-MM-DD HH:mm:ss")}}</span></p>
    <el-progress type="circle" :percentage="ElectricQuantity" color="#8e71c7" v-if="ElectricQuantity != null"></el-progress>
    <table v-if="mutLength.length>0">
      <tbody>
        <tr>
          <th style="width:20%"></th>
          <th v-if="lcurrentArry.length != 0 " style="width:40%">漏电流(mA)</th>
          <th v-if="temperatureArry.length != 0 " style="width:40%">温度(℃)</th>
        </tr>
        <tr v-for="(items, index) in mutLength">
          <td>{{index+1}}路</td>
          <td v-if="lcurrentArry[index] !=null " :class="lcurrentArry[index].status == 1? 'REDcolor':''"> {{lcurrentArry[index].value}} </td>
          <td v-else></td>
          <td v-if="temperatureArry[index] != null" :class="temperatureArry[index].status == 1? 'REDcolor':''"> {{temperatureArry[index].value}} </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
    <table v-if="futLength.length>0">
      <tbody>
        <tr>
          <th style="width:20%"></th>
          <th v-if="EcurrentArry.length != 0 " style="width:40%">电流(A)</th>
          <th v-if="VoltageArry.length != 0 " style="width:40%">电压(V)</th>
        </tr>
        <tr v-for="(items, index) in futLength">
          <td>{{OryutArry[index]}}路</td>
          <td v-if="EcurrentArry[index] !=null " :class="EcurrentArry[index].status == 1? 'REDcolor':''"> {{EcurrentArry[index].value}} </td>
          <td v-else></td>
          <td v-if="VoltageArry[index] !=null " :class="VoltageArry[index].status == 1? 'REDcolor':''"> {{VoltageArry[index].value}} </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      startTime4Status: null,//状态时间
      deveiceStatusName:null,//状态名称
      deveiceColorName:null,//状态颜色
      temperatureArry: [], //温度
      lcurrentArry: [], //漏电流
      EcurrentArry: [], //电流
      VoltageArry: [], //电压
      ElectricQuantity: null,
      mutLength: [],
      futLength: [],
      OryutArry: ["A", "B", "C", "D", "E", "F", "G"],
    }
  },
  props: ['deveiceList'],
  mounted() {
    this.Refreshprocessing(this.deveiceList);
  },
  methods: {
    Refreshprocessing: function(Revalue) {
      console.log(this.deveiceList);
      this.startTime4Status=this.deveiceList.startTime4Status;
      this.deveiceColorName=this.deveiceList.channelDataStatus==0?"ColorB":this.deveiceList.channelDataStatus==1?"ColorA":this.deveiceList.channelDataStatus==2?"ColorC":this.deveiceList.channelDataStatus==3?"ColorD":this.deveiceList.channelDataStatus==4?"ColorE":'ColorB';
      this.deveiceStatusName=this.deveiceList.channelDataStatus==0?"离线":this.deveiceList.channelDataStatus==1?"正常":this.deveiceList.channelDataStatus==2?"告警":this.deveiceList.channelDataStatus==3?"告警":this.deveiceList.channelDataStatus==4?"告警":'';
      var item = this.deveiceList.dataList;
      for (var i = 0; i < item.length; i++) {
        if (item[i].type == 1) {
          var temperatureVaule = item[i] || null;
          this.temperatureArry.push(temperatureVaule);
        }
        if (item[i].type == 2) {
          var lcurrentVaule = item[i] || null;
          this.lcurrentArry.push(lcurrentVaule);
        }
        if (item[i].type == 3) {
          var EcurrentVaule = item[i] || null;
          this.EcurrentArry.push(EcurrentVaule);
        }
        if (item[i].type == 5) {
          var VoltageVaule = item[i] || null;
          this.VoltageArry.push(VoltageVaule);
        }
        if (item[i].type == 19) {
          this.ElectricQuantity = item[i] || null;
        }
      }
      this.mutLength = this.temperatureArry.length > this.lcurrentArry.length ? this.temperatureArry : this.lcurrentArry;
      this.futLength = this.EcurrentArry.length > this.VoltageArry.length ? this.EcurrentArry : this.VoltageArry;
    }
  },
  watch: {　　
    deveiceList: {　　　　
      handler(newValue, oldValue) {　
        this.startTime4Status=null;//状态时间
        this.deveiceStatusName=null;//状态名称
        this.deveiceColorName=null;//状态颜色
        this.temperatureArry=[]; //温度
        this.lcurrentArry=[]; //漏电流
        this.EcurrentArry=[]; //电流
        this.VoltageArry=[]; //电压
        this.ElectricQuantity= null;
        this.mutLength=[];
        this.futLength= [];
        this.Refreshprocessing(newValue);
      },
      deep: true　　
    }
  },


}
</script>

<style lang="less">

</style>
