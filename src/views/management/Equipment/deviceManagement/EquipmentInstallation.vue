<template>
<div class="" >
  <div class="" id="inner_deviceEq">
    <el-form :model="EquipmentInstallationList" :rules="rules" ref="EquipmentInstallationList" label-width="200px" class="demo-ruleForm">
      <el-form-item label="场所：" prop="placeId">
        <el-select v-model="EquipmentInstallationList.placeId" clearable placeholder="请选择" @change="choseplaceId" style="width:36%">
          <el-option v-for="item in placeIdList" :key="item.placeId" :label="item.placeName" :value="item.placeId">
          </el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <el-form-item label="建筑：" prop="buildingId" class="El_radio" v-if="buildingIdList.length>0">
          <el-radio-group v-model="EquipmentInstallationList.buildingId" size="medium" @change="chosebuildingId">
            <el-radio border v-for="item in buildingIdList" :label="item.buildingId">{{item.buildingName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </transition>
      <transition name="el-zoom-in-top">
        <el-form-item label="层数：" prop="floorId" class="El_radio" v-if="floorIdList.length>0&&buildingIdList.length>0">
          <el-radio-group v-model="EquipmentInstallationList.floorId" size="medium">
            <el-radio border v-for="item in floorIdList" :label="item.floorId">{{item.floorName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </transition>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装地址：" prop="installLoc">
            <el-input v-model="EquipmentInstallationList.installLoc" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="电流告警阀值（A）：" prop="thresholdA">
            <el-input v-model="EquipmentInstallationList.thresholdA" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电压告警阀值（V）：" prop="thresholdV">
            <el-input v-model="EquipmentInstallationList.thresholdV" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="离线时间阀值（min）：" prop="offlineTime">
            <el-input v-model="EquipmentInstallationList.offlineTime" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="安装前照片：">
        <el-upload action="/generateDeviceInstallImage" accept="image/png, image/jpeg" :disabled="frontIFdisabled" ref="Frontupload" :data="FrontData" enctype="multipart/form-data" :auto-upload="false" :limit="limitis" list-type="picture-card" :on-exceed="Filerestriction"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="frontChange">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :modal='false' top="1vh">
          <img width="100%" height="600px" :src="dialogImageUrl" alt="">
        </el-dialog>
        <p style="color:rgba(255, 0, 0, 1)" v-if="frontIFdisabled">最多只能上传五张照片！</p>
      </el-form-item>
      <el-form-item label="安装后照片：">
        <el-upload action="/generateDeviceInstallImage" accept="image/png, image/jpeg" :disabled="afterIFdisabled" ref="afterupload" :data="afterData" enctype="multipart/form-data" :auto-upload="false" :limit="limitis" list-type="picture-card" :on-exceed="Filerestriction"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="afterChange">
          <i class="el-icon-plus"></i>
        </el-upload>
        <p style="color:rgba(255, 0, 0, 1)" v-if="afterIFdisabled">最多只能上传五张照片！</p>
      </el-form-item>
    </el-form>
  </div>

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
  name: 'EquipmentInstallation', //设备安装
  data() {
    return {
      EquipmentInstallationList: {
        placeId: null,
        buildingId: null,
        floorId: null,
      },
      placeIdList: [], //场所
      buildingIdList: [], //建筑
      floorIdList: [], //楼层

      dialogImageUrl: '',
      dialogVisible: false,
      limitis: 5, //上传限制
      frontIFdisabled: false,
      afterIFdisabled: false,
      FrontData: {
        deviceId: null,
        isBefore: 1
      },
      afterData: {
        deviceId: null,
        isBefore: 0
      },
      rules: {
        thresholdA: [{
          required: false,
          message: '请输入电流告警阀值',
          trigger: 'blur'
        },{
          type: 'number',
          message: '请输入数字格式(1~8位)',
          trigger: 'blur',
          transform(value) {
            if (value!=null) {
              if (value.length<=8) {
                return Number(value);
              }else {
                return false
              }
            }else {
              return 1;
            }
          }
        }
      ],
        thresholdV: [{
          required: false,
          message: '请输入电压告警阀值',
          trigger: 'blur'
        },{
          type: 'number',
          message: '请输入数字格式(1~8位)',
          trigger: 'blur',
          transform(value) {
            if (value!=null) {
              if (value.length<=8) {
                return Number(value);
              }else {
                return false
              }
            }else {
              return 1;
            }
          }
        }],
        offlineTime: [{
          required: false,
          message: '请输入离线时间阀值',
          trigger: 'blur'
        },{
          type: 'number',
          message: '请输入数字格式(1~8位)',
          trigger: 'blur',
          transform(value) {
            if (value!=null) {
              if (value.length<=8) {
                return Number(value);
              }else {
                return false
              }
            }else {
              return 1;
            }
          }
        }],
        placeId: [{
          required: true,
          message: '请选择场所',
          trigger: 'change'
        }],
        buildingId: [{
          required: true,
          message: '请选择建筑',
          trigger: 'change'
        }],
        floorId: [{
          required: true,
          message: '请选择层数',
          trigger: 'change'
        }],
        modelId: [{
          required: true,
          message: '请选择设备型号',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '请选择设备类型',
          trigger: 'change'
        }],
        installLoc:[{
          required: false,
          message: '请输入离线时间',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {
    ...mapState(['deviceId'])
  },
  mounted() {
    $("#inner_deviceEq").slimScroll({
      height: document.body.clientHeight * 0.65,
    });
    this.selectAllPlace();
    this.FrontData.deviceId = this.deviceId;
    this.afterData.deviceId = this.deviceId;
  },

  methods: {
    //场所
    selectAllPlace: function() {
      var _this = this;
      axios.post('/selectAllPlace').then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.placeIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //建筑
    choseplaceId: function() {
      this.floorIdList = [];
      this.EquipmentInstallationList.floorId = null
      this.EquipmentInstallationList.buildingId = null
      var placeId = this.EquipmentInstallationList.placeId;
      var _this = this;
      axios.post('/selectBuildingListByPlaceId', {
        placeId: placeId || null
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.buildingIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //建筑
    chosebuildingId: function() {
      this.EquipmentInstallationList.floorId = null
      var buildingId = this.EquipmentInstallationList.buildingId;
      var _this = this;
      axios.post('/selectFloorsByBuildingId', {
        buildingId: buildingId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.floorIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增
    addSubmit: function(EquipmentInstallationList) {
      this.$refs.EquipmentInstallationList.validate((valid) => {
        if (valid) {
          this.submitUpload();
          var _this = this;
          axios.post('/installerDevice', {
            InstallationList: this.EquipmentInstallationList,
            deviceId: this.deviceId
          }).then(function(result) {
            if (result.data.success == true) {
              _this.$emit('refreshList');
              _this.$message({
                message: '安装成功',
                type: 'success'
              });
              _this.$refs.EquipmentInstallationList.resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //文件删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    //添加文件、上传成功和上传失败时都会被调用
    frontChange: function(file, fileList) {
      if (fileList.length >= 5) {
        this.frontIFdisabled = true
      } else {
        this.frontIFdisabled = false
      }
    },
    afterChange: function(file, fileList) {
      if (fileList.length >= 5) {
        this.afterIFdisabled = true
      } else {
        this.afterIFdisabled = false
      }
    },
    //文件限制
    Filerestriction(file, fileList) {
      this.$message.error("最多只能上传五张");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传提交
    submitUpload() {
      this.$refs.Frontupload.submit();
      this.$refs.afterupload.submit();
    },
  }
}
</script>
<style media="screen">

</style>
