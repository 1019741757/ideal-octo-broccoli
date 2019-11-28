<template>
<div class="">
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="ibox-content" style="border:none">
            <div class="" style="padding-bottom:20px;">
              <el-button type="success" size="medium" @click="addMessageNotificationName = true;">新增</el-button>
            </div>
            <el-card class="box-card">
              <el-table :data="MessageNotificationList" style="width: 100%">
                <el-table-column type="index" label="排序" width="60">
                </el-table-column>
                <el-table-column property="name" label="昵称"></el-table-column>
                <el-table-column property="phone" label="手机号码"></el-table-column>
                <el-table-column property="loginFlag" label="是否允许登入小程序" :formatter="formatSex"></el-table-column>
                <el-table-column label="操作" width="150">
                  <template scope="scope">
                 <el-button size="small" @click="editMessageNotification(scope.$index, scope.row)">编辑</el-button>
                 <el-button type="danger" size="small" @click="deleteMessageNotification(scope.$index, scope.row)">删除</el-button>
               </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!--新增附属账号-->
  <el-dialog title="添加附属账号" :visible.sync="addMessageNotificationName">
    <el-form :model="addMessageNotificationList" :rules="rules" ref="addMessageNotificationList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="昵称：" prop="name">
        <el-input v-model="addMessageNotificationList.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="addMessageNotificationList.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否允许登入小程序：" prop="loginFlag">
        <el-radio-group v-model="addMessageNotificationList.loginFlag" style="padding-top:5px;">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="addMessageNotificationList.loginFlag == 1">
        <el-input type="password" v-model="addMessageNotificationList.password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addMessageNotificationName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addMessageNotificationSubmit('addMessageNotificationList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑附属账号-->
  <el-dialog title="编辑附属账号" :visible.sync="editMessageNotificationName">
    <el-form :model="editMessageNotificationList" :rules="rules" ref="editMessageNotificationList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="昵称：" prop="name">
        <el-input v-model="editMessageNotificationList.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="editMessageNotificationList.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否允许登入小程序：" prop="loginFlag">
        <el-radio-group v-model="editMessageNotificationList.loginFlag" style="padding-top:5px;">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="editMessageNotificationList.loginFlag == 1">
        <el-input type="password" v-model="editMessageNotificationList.password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editMessageNotificationName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editMessageNotificationSubmit('editMessageNotificationList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OwnerSubsidiaryAccount', //附属账号
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      //附属账号联系人
      MessageNotificationName: false,
      MessageNotificationList: [],
      //新增附属账号
      addMessageNotificationName: false,
      addMessageNotificationList: {},
      //编辑附属账号
      editMessageNotificationName: false,
      editMessageNotificationList: {},

      rules: {
        name: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        ownerName: [{
            required: true,
            message: '请输入业主名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        phone: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ],
        ownerPhone: [{
            required: true,
            message: '请输入业主电话',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        classifyId: [{
          required: true,
          message: '请选择分类',
          trigger: 'change'
        }],
        businessNature: [{
          required: true,
          message: '请选择行业属性',
          trigger: 'change'
        }],
        ProvincialUrbanArea: [{
          required: true,
          message: '请选择省市区',
          trigger: 'blur'
        }],
        company: [{
          required: true,
          message: '请输入业主单位',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请输入业主单位',
          trigger: 'blur'
        }],
        placeName: [{
          required: true,
          message: '请输入场所名称',
          trigger: 'blur'
        }],
        loginFlag: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }]
      },
    }
  },
  created() {
    this.getUsers();
  },
  mounted() {

  },
  methods: {
    //根据业主ID查询附属账号列表
    getUsers: function() {
      var _this = this;
      axios.post('/findONReceivers').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.MessageNotificationList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增附属账号数据提交
    addMessageNotificationSubmit: function(addMessageNotificationList) {
      this.$refs[addMessageNotificationList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addONReceiver', {
            addMessageNotificationList: this.addMessageNotificationList,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.addMessageNotificationName = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[addMessageNotificationList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //编辑附属账号弹框
    editMessageNotification: function(index, row) {
      var _this = this;
      axios.post('/selectONReceiverById', {
        onReceiverId: row.id,
        ownerId: row.ownerId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editMessageNotificationList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      });
      this.editMessageNotificationName = true;
    },
    //编辑附属账号数据提交
    editMessageNotificationSubmit: function(editMessageNotificationList) {
      this.$refs[editMessageNotificationList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateONReceiver', {
            editMessageNotificationList: this.editMessageNotificationList,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.editMessageNotificationName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editMessageNotificationList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //删除附属账号
    deleteMessageNotification: function(index, row) {
      this.$confirm('是否删除该附属账号', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delONReceiver', {
          onReceiverId: row.id,
          ownerId: row.ownerId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            _this.$message.error('删除失败');
          }
        })
      }).catch(() => {

      });
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
      return row.loginFlag == 1 ? '是' : row.loginFlag == 0 ? '否' : '未知';
    },
  }
}
</script>
<style media="screen">

</style>
