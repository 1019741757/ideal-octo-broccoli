<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px" v-if="Jurisdiction('device:look')">
              <el-form-item label="条件筛选：">
                <el-select v-model="formInline.status" placeholder="请选择设备状态" clearable @change="onSubmit">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="formInline.deviceTypeId" placeholder="请选择设备类型" clearable @change="onSubmit">
                  <el-option v-for="item in deviceTypeIdList" :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="formInline.modelId" placeholder="请选择设备型号" clearable @change="onSubmit">
                  <el-option v-for="item in modelIdList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="formInline.deviceCode" placeholder="请输入设备编码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="" style="padding: 0 19px">
              <el-button type="primary" size="medium" @click="adddeviceVoBox" v-if="Jurisdiction('device:manage:add')">新增</el-button>
            </div>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('device:look')">
              <el-card class="box-card">
                <el-table :data="deviceVoList" style="width: 100%">
                  <el-table-column type="index" width="60" label="排序"></el-table-column>
                  <el-table-column label="设备编码">
                    <template slot-scope="scope" >
                       <span class="linkstre_type" @click="deviceClick(scope.row)">{{scope.row.deviceCode}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="deviceTypeName" label="设备类型"></el-table-column>
                  <el-table-column property="deviceModelName" label="设备型号"></el-table-column>
                  <el-table-column property="status" label="设备状态" :formatter="formatSex"></el-table-column>
                  <el-table-column label="安装地址" width="260" :formatter="formatInstallLoc"></el-table-column>
                  <el-table-column property="lastUpdateTime" label="修改时间" :formatter="dateFormat"></el-table-column>
                  <el-table-column label="操作" width="300">
                    <template scope="scope">
                  <el-button size="small" v-if="scope.row.status == 9 && Jurisdiction('device:manage:install')" @click.stop="installerDevice(scope.$index, scope.row)">重新上线</el-button>
                  <el-button size="small" v-if="scope.row.status == 2 && Jurisdiction('device:manage:offline')" @click.stop="closeDevice(scope.$index, scope.row)">设备下线</el-button>
                  <el-button size="small" v-if="scope.row.status == 2 && Jurisdiction('device:manage:update')" @click.stop="replaceDeviceCode(scope.$index, scope.row)">编码更换</el-button>
                  <el-button size="small" v-if="scope.row.status == 1 && Jurisdiction('device:manage:install')" @click.stop="installerDevice(scope.$index, scope.row)">设备安装</el-button>
                  <el-button type="danger" size="small" v-if="scope.row.status == 1 &&Jurisdiction('device:manage:delete')" @click.stop="deledeviceVoDialog(scope.$index, scope.row)">删除</el-button>
               </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" style="padding:20px 0; ">
                  <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-row>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--新增设备-->
  <el-dialog title="新增设备" :visible.sync="adddeviceVoName" @close='adddeviceVoDialog'>
    <el-form :model="adddeviceVoNameList" :rules="rules" ref="adddeviceVoNameList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="设备编码" prop="code">
        <el-input v-model="adddeviceVoNameList.code" auto-complete="off" placeholder="请输入设备编码"></el-input>
      </el-form-item>
      <el-form-item label="设备类型：" prop="deviceTypeId">
        <el-select v-model="adddeviceVoNameList.deviceTypeId" clearable placeholder="请选择" @change="deviceTypeSubmit" style="width:100%">
          <el-option v-for="item in deviceTypeIdList" :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备厂商：" prop="vendorId">
        <el-select v-model="adddeviceVoNameList.vendorId" clearable placeholder="请选择" @change="choseVendorId" style="width:100%">
          <el-option v-for="item in selectVendorVosList" :key="item.vendorName" :label="item.vendorName" :value="item.vendorName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号 ：" prop="modelId">
        <el-select v-model="adddeviceVoNameList.modelId" clearable placeholder="请选择" style="width:100%">
          <el-option v-for="item in addmodelIdList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="adddeviceVoName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="adddeviceVoSubmit('adddeviceVoNameList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--设备编码更换-->
  <el-dialog title="设备编码更换" :visible.sync="replaceDeviceCodeName" @close='replaceDeviceCodeDialog'>
    <el-form :model="replaceDeviceCodeList" :rules="rules" ref="replaceDeviceCodeList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原设备编码" prop="usedcode">
        <el-input v-model="replaceDeviceCodeList.deviceCode" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="新设备编码" prop="code">
        <el-input v-model="replaceDeviceCodeList.code" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="replaceDeviceCodeName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="replaceDeviceCodeSubmit('replaceDeviceCodeList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--设备安装-->
  <el-dialog title="设备安装" :visible.sync="EquipmentinstallationName" width="70%" top="8vh">
    <Equipment-Installation v-if="EquipmentinstallationName" ref="EquipmentInstallation" @refreshList="onRefresList"></Equipment-Installation>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="EquipmentinstallationName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="EquipmentinstallationSubmit()">确 定</el-button>
    </div>
  </el-dialog>
  <!--  设备详情    -->
  <el-dialog title="设备详情" :visible.sync="detailsmodelName" width="80%" top="5vh" @touchmove.prevent>
    <Device-Details v-if="detailsmodelName"></Device-Details>
  </el-dialog>
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
import EquipmentInstallation from './deviceManagement/EquipmentInstallation.vue'
import DeviceDetails from '../../Monitor/DeviceDetails/index.vue' //设备详情

export default {
  name: 'deviceManagement', //设备管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //设备查询参数
      formInline: {
        status: null,
        deviceTypeId: null,
        modelId: null,
        deviceCode: null
      },
      pageSize: 10,
      pageNo: 1,
      total: 0,
      statusList: [{ //设备状态
          value: '1',
          name: '未安装'
        }, {
          value: '2',
          name: '已安装'
        },
        {
          value: '9',
          name: '已下线'
        }
      ],
      deviceTypeIdList: [], //设备类型
      modelIdList: [], //设备型号
      selectVendorVosList: [], //设备厂商
      //设备数据渲染
      deviceVoList: [],
      //添加设备
      adddeviceVoName: false,
      adddeviceVoNameList: {
        deviceTypeId: null,
        vendorId: null,
        modelId: null,
      },
      addmodelIdList: [], //设备型号
      //设备编码更换
      replaceDeviceCodeName: false,
      replaceDeviceCodeList: {
        deviceId: null,
      },
      //设备安装
      EquipmentinstallationName: false,
      //设备详情
      detailsmodelName: false,
      rules: {
        code: [{
            required: true,
            message: '请输入设备编码',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字或字母格式，长度在1~20字符',
            trigger: 'blur',
            transform(value) {
              if (!value) {

              }else {
                var Regx = /[\u4E00-\u9FA5]/;
                console.log(Regx.test(value));
                if (Regx.test(value)) {
                  return true;
                } else {
                  if (value.length < 20) {
                    return 1;
                  } else {
                    return true;
                  }
                }
              }
            }
          }
        ],
        vendorId: [{
          required: true,
          message: '请选择设备厂商',
          trigger: 'change'
        }],
        modelId: [{
          required: true,
          message: '请选择设备型号',
          trigger: 'change'
        }],
        deviceTypeId: [{
          required: true,
          message: '请选择设备类型',
          trigger: 'change'
        }],
      },
    }
  },
  components: {
    EquipmentInstallation,
    DeviceDetails
  },
  created() {
    this.getUsers();
    this.selectDeviceTypeVos();
    this.selectDeviceModelVos();
  },
  mounted() {},
  methods: {
    ...mapMutations(['set_deviceId', 'set_MonitoringClick']),
    //计划类型里面的值修改的时候
    onSubmit: function() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getUsers();
    },
    //页数   pageSize 改变时会触发
    handleCurrentChange: function(val) {
      this.pageNo = val;
      this.getUsers();
    },
    //页码 currentPage 改变时会触发
    sizeCurrentChange: function(val) {
      this.pageSize = val;
      this.getUsers();
    },
    //设备类型
    selectDeviceTypeVos: function() {
      var _this = this;
      axios.post('/selectDeviceTypeVos').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.deviceTypeIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备类型选择 获取设备厂商
    deviceTypeSubmit: function() {
      var deviceTypeId = this.adddeviceVoNameList.deviceTypeId;
      this.adddeviceVoNameList.vendorId = null;
      this.adddeviceVoNameList.modelId = null;
      this.addmodelIdList=[];
      var _this = this;
      axios.post('/selectVendorNamesByDeviceTypeId', {
        deviceTypeId: deviceTypeId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectVendorVosList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //选择设备厂商 获取设备型号
    choseVendorId: function() {
      var deviceTypeId = this.adddeviceVoNameList.deviceTypeId;
      var vendorId = this.adddeviceVoNameList.vendorId;
      this.adddeviceVoNameList.modelId = null;
      var _this = this;
      axios.post('/selectDeviceModelVos', {
        vendorId: vendorId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.addmodelIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备型号
    selectDeviceModelVos: function() {
      var _this = this;
      axios.post('/selectDeviceModelVos', {
        deviceTypeId:null,
        vendorId: null
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.modelIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //tabel数据获取
    getUsers: function() {
      let parameterList = {
        status: this.formInline.status,
        deviceTypeId: this.formInline.deviceTypeId,
        modelId: this.formInline.modelId,
        deviceCode: this.formInline.deviceCode,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectDevices4User', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.deviceVoList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设备新增
    adddeviceVoBox: function() {
      this.adddeviceVoName = true;
      this.selectDeviceTypeVos();
    },
    //设备新增数据提交
    adddeviceVoSubmit: function(adddeviceVoNameList) {
      console.log(this.adddeviceVoNameList);
      this.$refs[adddeviceVoNameList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addDevice', {
            adddeviceVoNameList: this.adddeviceVoNameList
          }).then(function(result) {
            if (result.data.success == true) {
              _this.getUsers();
              _this.adddeviceVoName = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[adddeviceVoNameList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //设备新增弹框关闭
    adddeviceVoDialog: function() {
      this.$refs.adddeviceVoNameList.resetFields();
    },
    //设备删除
    deledeviceVoDialog: function(index, row) {
      this.$confirm('确定删除该设备吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delDevice', {
          deviceId: row.deviceId,
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //设备下线
    closeDevice: function(index, row) {
      this.$confirm('确定要下线该设备吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/closeDevice', {
          deviceId: row.deviceId,
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '操作成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //设备编码更换
    replaceDeviceCode: function(index, row) {
      this.replaceDeviceCodeName = true;
      this.replaceDeviceCodeList.deviceCode = row.deviceCode;
      this.replaceDeviceCodeList.deviceId = row.deviceId;
    },
    //设备编码更换数据提交
    replaceDeviceCodeSubmit: function(replaceDeviceCodeList) {
      this.$refs[replaceDeviceCodeList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/replaceDeviceCode', {
            replaceDeviceCodeList: this.replaceDeviceCodeList
          }).then(function(result) {
            if (result.data.success == true) {
              _this.getUsers();
              _this.replaceDeviceCodeName = false;
              _this.$message({
                message: '更换成功',
                type: 'success'
              });
              _this.$refs[replaceDeviceCodeList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //设备编码弹框关闭
    replaceDeviceCodeDialog: function() {
      this.$refs.replaceDeviceCodeList.resetFields();
    },

    //设备安装
    installerDevice: function(index, row) {
      this.set_deviceId(row.deviceId);
      this.EquipmentinstallationName = true;
    },
    EquipmentinstallationSubmit: function() {
      this.$refs.EquipmentInstallation.addSubmit();
    },
    onRefresList: function() {
      this.getUsers();
      this.EquipmentinstallationName = false;
    },
    //设备详情
    deviceClick: function(row) {
      this.detailsmodelName = true;
      this.set_MonitoringClick(row.deviceId);
    },

    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    //表格状态过滤
    formatSex: function(row, column) {
      return row.status == 1 ? '未安装' : row.status == 2 ? '已安装' : row.status == 9 ? '已下线' : '未知';
    },
    //安装地址
    formatInstallLoc: function(row, column) {
      var placeName=row.placeName||'';
      var buildingName=row.buildingName||'';
      var floorName=row.floorName||'';
      var installLoc=row.installLoc||'';
      return placeName + buildingName + floorName + installLoc;
    },
  }
}
</script>
<style media="screen">

</style>
