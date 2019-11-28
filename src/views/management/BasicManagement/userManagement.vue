<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px">
            <el-form-item label="帐号：">
             <el-input v-model="formInline.account" placeholder="帐号" @keyup.enter.native="onSubmit"></el-input>
           </el-form-item>
           <el-form-item label="手机号码：">
             <el-input v-model="formInline.phone" placeholder="手机号码" @keyup.enter.native="onSubmit"></el-input>
           </el-form-item>
           <el-form-item class="pull-right">
             <el-button type="primary" @click.native="onSubmit" >查询</el-button>
           </el-form-item>
          </el-form> -->
            <div class="" style="padding: 0 19px">
              <el-button type="primary" size="medium" @click="addmodelNamebox()" v-if="Jurisdiction('user:manage:add')">新增</el-button>
            </div>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('user:look')">
              <el-card class="box-card">
                <el-table :data="SysUserList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60">
                  </el-table-column>
                  <el-table-column property="account" label="登录账号"></el-table-column>
                  <el-table-column property="userName" label="用户名"></el-table-column>
                  <el-table-column property="phone" label="手机号码"></el-table-column>
                  <el-table-column property="userRoleNames" label="角色" :formatter="nameFormat"></el-table-column>
                  <el-table-column property="isSys" label="是否系统自带" :formatter="formatSex"></el-table-column>
                  <el-table-column property="createdDate" label="创建日期" :formatter="dateFormat"></el-table-column>
                  <el-table-column label="操作" width="350" show-overflow-tooltip v-if="Jurisdiction('user:manage')">
                    <template scope="scope">
                 <el-button size="small" @click="DistributionRole(scope.$index, scope.row)" v-if="scope.row.status==1 && Jurisdiction('user:manage:role')">分配角色</el-button>
                 <el-button size="small" @click="DataPermissions(scope.$index, scope.row)" v-if="scope.row.status==1 && Jurisdiction('user:manage:data')">数据权限</el-button>
                 <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.status==1 && Jurisdiction('user:manage:update')">编辑</el-button>
                 <el-button type="danger" size="small" @click="deleteSubmit(scope.$index, scope.row)" v-if="scope.row.status==1 && Jurisdiction('user:manage:del')">禁用</el-button>
                 <el-button type="primary" size="small" @click="activationSubmit(scope.$index, scope.row)" v-if="scope.row.status==0 && Jurisdiction('user:manage:activate')">激活</el-button>
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

  <!--新增界面-->
  <el-dialog title="新增" :visible.sync="addmodelName" @close='closeDialog'>
    <el-form :model="addboxList" :rules="rules" ref="addboxList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="帐号：" prop="account">
        <el-input v-model="addboxList.account" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="addboxList.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="addboxList.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="password_confirm">
        <el-input type="password" v-model="addboxList.password_confirm" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="addboxList.phone" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addmodelName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="addSubmit('addboxList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑界面-->
  <el-dialog title="编辑" :visible.sync="editmodelName" @close='editcloseDialog'>
    <el-form :model="editboxList" :rules="rules" ref="editboxList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="帐号：" prop="account">
        <el-input v-model="editboxList.account" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="editboxList.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="editboxList.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="password_confirm">
        <el-input type="password" v-model="editboxList.password_confirm" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="editboxList.phone" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editmodelName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="editSubmit('editboxList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--用户分配角色-->
  <el-dialog title="分配角色" :visible.sync="DistributionRoleName">
    <Distribution-Role ref="DistributionRoleClao" v-if="DistributionRoleName == true" @DistributionRoleBox="DistributionRoleBox"></Distribution-Role>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="DistributionRoleName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="DistributionRoleSubmit()">确 定</el-button>
    </div>
  </el-dialog>
  <!--用户数据权限-->
  <el-dialog title="数据权限" :visible.sync="DataPermissionsName" width="70%">
    <Data-Permissions ref="DataPermissionsClao" v-if="DataPermissionsName == true"></Data-Permissions>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="DataPermissionsName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="DataPermissionsSubmit()">确 定</el-button>
    </div>
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
import DistributionRole from './userManagement/DistributionRole.vue'
import DataPermissions from './userManagement/DataPermissions.vue'

export default {
  name: 'userManagement', //用户管理
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addboxList.password && value !== this.editboxList.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //设备型号列表渲染
      formInline: {
        account: '',
        phone: ''
      },
      pageSize: 10,
      pageNo: 1,
      total: 0,
      SysUserList: [],
      //添加界面数据
      addmodelName: false,
      addboxList: {},
      //编辑界面数据
      editmodelName: false,
      editboxList: {},
      //分配角色
      DistributionRoleName: false,
      //数据权限
      DataPermissionsName: false,
      rules: {
        account: [{
            required: true,
            message: '请输入登录帐号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password_confirm: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        }],
        userName: [{
            required: true,
            message: '请输入用户名',
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
        roleId: [{
          required: true,
          message: '请选择角色',
          trigger: 'blur'
        }]
      },
    }
  },
  components: {
    DistributionRole,
    DataPermissions
  },
  created() {
    this.getUsers();
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['set_userId']),
    onSubmit: function() {
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
    //tabel数据获取
    getUsers: function() {
      let page = {
        account: this.formInline.account,
        phone: this.formInline.phone,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectSysUserList', {
        page: page
      }).then(function(result) {
        console.log(result.data.rows);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.SysUserList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //添加用户弹窗
    addmodelNamebox: function() {
      this.addmodelName = true;
    },
    //添加用户
    addSubmit: function(addboxList) {
      console.log(this.addboxList);
      this.$refs[addboxList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addSysUser', {
            addSysUserList: this.addboxList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.getUsers();
              _this.addmodelName = false;
              _this.$refs[addboxList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //编辑
    handleEdit: function(index, row) {
      var userId = row.userId;
      var _this = this;
      axios.post('/selectSysUserById', {
        userId: userId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          _this.editboxList = Object.assign({}, result.data.data);
          _this.editboxList.password_confirm = result.data.data.password;
        } else {
          _this.$message.error('请求失败');
        }
      });
      this.editmodelName = true;
    },
    //编辑提交、
    editSubmit: function(editboxList) {
      console.log(this.editboxList);
      this.$refs[editboxList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateSysUser', {
            editboxList: this.editboxList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.editmodelName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editboxList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //禁用
    deleteSubmit: function(index, row) {
      console.log(row.userId);
      this.$confirm('是否禁用该用户', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delSysUser', {
          userId: row.userId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '禁用成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //激活
    activationSubmit: function(index, row) {
      this.$confirm('是否激活该用户', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/activateSysUser', {
          userId: row.userId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '激活成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //用户分配角色
    DistributionRole: function(index, row) {
      var userId = row.userId;
      this.set_userId(userId);
      this.DistributionRoleName = true;
    },
    //用户分配角色提交
    DistributionRoleSubmit: function() {
      this.$refs.DistributionRoleClao.DistributionRoleSubmission();
    },
    DistributionRoleBox: function() {
      this.getUsers();
      this.DistributionRoleName = false;
    },
    //用户数据权限
    DataPermissions: function(index, row) {
      var userId = row.userId;
      this.set_userId(userId);
      this.DataPermissionsName = true;
    },
    //用户数据权限提交
    DataPermissionsSubmit: function() {
      this.$refs.DataPermissionsClao.DataPermissionsSubmission();
      this.DataPermissionsName = false;
    },
    //添加关闭弹框的事件
    closeDialog() {
      this.$refs.addboxList.resetFields();
    },
    //编辑关闭弹框的事件
    editcloseDialog() {
      this.$refs.editboxList.resetFields();
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
      return row.isSys == 1 ? '是' : row.isSys == 0 ? '否' : '未知';
    },
    //角色筛选
    nameFormat: function(row, column) {
      return row.userRoleNames.join(' | ');
    }
  }
}
</script>
<style media="screen">

</style>
