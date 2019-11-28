<template>
<div class="">
  <el-form-item label="场所地区"  style="width:100%">
    <el-select v-model="provincevalue" placeholder="省级地区" @change="choseProvince" style="width:33%">
      <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="cityvalue" placeholder="市级地区" @change="choseCity" style="width:33%">
      <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="areavalue" placeholder="区级地区" @change="choseBlock" style="width:33%">
      <el-option v-for="item in BlockList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>

</div>
</template>

<script>
import axios from 'axios'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'


export default {
  name: 'ProvincialUrbanArea', //省市区三级联动
  data() {
    return {
      //省
      provinceList: [],
      provincevalue: null,
      //市
      cityList: [],
      cityvalue: null,
      // 区
      BlockList: [],
      areavalue: null

    }
  },
  computed: {
    ...mapState(['provinceId', 'cityId', 'areaId'])
  },
  mounted() {
    if (this.provinceId != null && this.cityId != null && this.areaId != null) {
      this.getprovinceList(2, this.provincevalue);
      this.getprovinceList(3, this.cityvalue);
    }
    this.provincevalue = this.provinceId;
    this.cityvalue = this.cityId;
    this.areavalue = this.areaId;
    this.getprovinceList(1, null);
  },

  methods: {
    ...mapMutations(['set_choseProvince', 'set_choseCity', 'set_choseBlock']),
    //省市区数据获取
    getprovinceList: function(regionType, upperId) {
      var _this = this;
      axios.post('/selectRegions', {
        regionType: regionType,
        upperId: upperId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          if (regionType == 1) {
            _this.provinceList = data;
          } else if (regionType == 2) {
            _this.cityList = data;
          } else {
            _this.BlockList = data;
          }

        } else {
          _this.$message.error(result.data.message);
        }
      })
    },

    choseProvince: function() {
      this.getprovinceList(2, this.provincevalue);
      this.set_choseProvince(this.provincevalue);
    },
    choseCity: function() {
      this.getprovinceList(3, this.cityvalue);
      this.set_choseCity(this.cityvalue);
    },
    choseBlock: function() {
      this.set_choseBlock(this.areavalue);

    },
  }
}
</script>
<style media="screen">

</style>
