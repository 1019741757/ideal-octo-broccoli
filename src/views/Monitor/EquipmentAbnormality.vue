<template>
<div class="">
  <div class="wrapper wrapper-content animated fadeInRight" id="inner-content">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="ibox-content" style="border:none;padding-top:0">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="设备编码：">
                  <el-input v-model="formInline.deviceCode" placeholder="设备编码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
                </el-form-item>
                <el-form-item class="pull-right">
                  <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
            <el-card class="box-card">
              <el-table :data="selectDeviceExceptionList" style="width: 100%">
                <el-table-column type="index" width="60" label="排序"></el-table-column>
                <el-table-column label="设备编码">
                  <template slot-scope="scope">
                             <span class="linkstre_type" @click="deviceClick(scope.row)">{{scope.row.deviceCode}}</span>
                          </template>
                </el-table-column>
                <el-table-column property="startCreateTime" label="最初时间" :formatter="dateFormat"></el-table-column>
                <el-table-column property="endCreateTime" label="最后时间" :formatter="dateFormat"></el-table-column>
                <el-table-column property="number" label="告警次数"></el-table-column>
                <el-table-column property="handleName" label="处理人"></el-table-column>
                <el-table-column property="handleInfo" label="处理内容"></el-table-column>
                <el-table-column property="handleTime" label="处理时间" :formatter="dateFormat"></el-table-column>
                <el-table-column label="操作" width="150" v-if="user.identity_type == 'user' && Jurisdiction('deviceException:manage')">
                  <template scope="scope">
                              <el-button type="warning" size="small" v-if="scope.row.handleStatus == 1 && Jurisdiction('deviceException:manage:handle')" @click="handleabnormality(scope.$index, scope.row)" >处理</el-button>
                          </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="end" style="padding:20px 0; ">
                <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
              </el-row>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--异常处理-->
  <el-dialog title="处理" :visible.sync="HandlemodelName">
    <el-form :model="HandleboxList" :rules="rules" ref="HandleboxList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="异常处理：" prop="handleInfo">
        <el-input type="textarea" v-model="HandleboxList.handleInfo" auto-complete="off" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="HandlemodelName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="HandleSubmit('HandleboxList')">确 定</el-button>
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
import DeviceDetails from './DeviceDetails/index.vue' //设备详情

export default {
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      //设备异常列表渲染
      formInline: {},
      orgId: '',
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectDeviceExceptionList: [],
      //设备型号数据
      selectDeviceModelList: [],
      //处理异常界面数据
      HandlemodelName: false,
      HandleboxList: {},
      //设备详情
      detailsmodelName: false,
      //输入验证
      rules: {
        handleInfo: [{
            required: false,
            message: '请输入处理内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    DeviceDetails
  },
  created() {
    this.getUsers();
  },
  mounted() {
    var _this = this;
    window.onresize = function temp() {
      _this.clientHeight = document.body.clientHeight - 160 + "px";
    }
    $("#inner-content").slimScroll({
      height: document.body.clientHeight - 120,
    });
  },
  methods: {
    ...mapMutations(['set_MonitoringClick']),
    changeplanType: function() {
      this.getUsers();
    },
    onSubmit: function() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getUsers();
    },
    //页数   pageSize 改变时会触发
    handleCurrentChange: function(val) {
      console.log("页数" + val);
      this.pageNo = val;
      this.getUsers();
    },
    //页码 currentPage 改变时会触发
    sizeCurrentChange: function(val) {
      console.log("页吗" + val);
      this.pageSize = val;
      this.getUsers();
    },
    //tabel数据获取
    getUsers: function() {
      let parameterList = {
        deviceId: null,
        deviceCode: this.formInline.deviceCode || null,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectDeviceAlerts', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectDeviceExceptionList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //处理异常
    handleabnormality: function(index, row) {
      this.HandleboxList.deviceAlertId = row.deviceId;
      this.HandlemodelName = true;
    },
    //处理异常
    HandleSubmit: function(HandleboxList) {
      console.log(HandleboxList);
      this.$refs[HandleboxList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/handleDeviceAlert', {
            HandleboxList: this.HandleboxList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.HandlemodelName = false;
              _this.$refs[HandleboxList].resetFields();
              _this.$message({
                message: "处理成功",
                type: 'success'
              });
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
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
    }

  }
}
</script>
<style type="text/css" scoped>

</style>
