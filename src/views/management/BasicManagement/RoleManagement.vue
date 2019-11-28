<template>
<div class="" v-if="Jurisdiction('role:look')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <div class="" style="padding: 0 19px" v-if="Jurisdiction('role:manage:add')">
              <el-button type="primary" size="medium" @click="addmodelName=true">新增</el-button>
            </div>
            <div class="ibox-content" style="border:none">
              <el-card class="box-card">
                <el-table :data="RolelList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60">
                  </el-table-column>
                  <el-table-column property="roleName" label="角色名称"></el-table-column>
                  <el-table-column property="isSys" label="是否系统自带" :formatter="formatSex"></el-table-column>
                  <el-table-column property="description" label="备注"></el-table-column>
                  <el-table-column property="createdDate" :formatter="dateFormat" label="创建时间"></el-table-column>
                  <el-table-column label="操作" width="250">
                    <template scope="scope">
                 <el-button type="success" size="small" @click="Permissionsbox(scope.$index, scope.row)" v-if="Jurisdiction('role:manage')">权限</el-button>
                 <el-button size="small" @click="Editbox(scope.$index, scope.row)" v-if="Jurisdiction('role:manage:update')">编辑</el-button>
                 <el-button type="danger" size="small" @click="deletebox(scope.$index, scope.row)"  v-if="Jurisdiction('role:manage:del')">删除</el-button>
               </template>
                  </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="padding-top:20px; ">
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
  <el-dialog title="新增角色" :visible.sync="addmodelName" @close='closeDialog'>
    <el-form :model="addSysRoleList" :rules="rules" ref="addSysRoleList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="addSysRoleList.roleName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：" prop="description">
        <el-input v-model="addSysRoleList.description" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addmodelName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addSubmit('addSysRoleList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑界面-->
  <el-dialog title="编辑角色" :visible.sync="editmodelName">
    <el-form :model="editSysRoleList" :rules="rules" ref="editSysRoleList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="editSysRoleList.roleName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：" prop="description">
        <el-input v-model="editSysRoleList.description" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editmodelName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editSubmit('editSysRoleList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RoleManagement', //角色管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //查询角色信息列表
      pageSize: 10,
      pageNo: 1,
      total: 0,
      RolelList: [],
      //添加界面数据
      addmodelName: false,
      addSysRoleList: {},
      //编辑界面数据
      editmodelName: false,
      editSysRoleList: {},
      rules: {
        roleName: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        description: [{
          min: 1,
          max: 130,
          message: '长度在 1 到 150 个字符',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
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
    getUsers() {
      let page = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectSysRoleList', {
        page: page
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.RolelList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增系统角色
    addSubmit: function(addSysRoleList) {
      this.$refs[addSysRoleList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addSysRole', {
            addSysRoleList: this.addSysRoleList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.$message({
                message: '创建成功',
                type: 'success'
              });
              _this.getUsers();
              _this.addmodelName = false;
              _this.$refs[addSysRoleList].resetFields();
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
    Editbox: function(index, row) {
      this.editSysRoleList = Object.assign({}, row);
      this.editmodelName = true;
    },
    //编辑提交、
    editSubmit: function(editSysRoleList) {
      this.$refs[editSysRoleList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateSysRoleById', {
            editSysRoleList: this.editSysRoleList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.editmodelName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editSysRoleList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //删除
    deletebox: function(index, row) {
      this.$confirm('是否删除角色', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/deleteSysRoleById', {
          roleId: row.roleId
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
    //角色关联的权限
    Permissionsbox: function(index, row) {
      var roleId = row.roleId;
      this.$router.push({
        path: '/management/Permissions',
        query: {
          roleId: roleId
        }
      })
    },
    //关闭弹框的事件
    closeDialog() {
      this.addSysRoleList.name = '';
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
  }
}
</script>
<style media="screen">

</style>
