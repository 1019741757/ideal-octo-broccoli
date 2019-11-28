<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins">
          <div class="" style="padding: 0 19px">
            <el-button type="primary" size="medium" icon="el-icon-arrow-left" @click=" $router.go(-1)">返回</el-button>
          </div>
          <div class="ibox-content" style="border:none;padding-bottom:0">
            <div class="el-card" style="border:none">
              <div class="Equip_header">
                <h5>权限设置</h5>
              </div>
              <div class="Equi_scroll" style="padding:15px 20px 70px;" id="inner-content">
                <div id="ztree" ref="myComponent" class="ztree"></div>
                <div style="width: 97%;position: absolute;bottom:0px;">
                  <el-button size="medium" type="primary" @click="onSubmit" class="pull-right">确定</el-button>
                  <el-button size="medium" class="pull-right" style="margin-right:15px;" @click=" $router.go(-1)">取消</el-button>
                </div>
              </div>
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

export default {
  name: 'Permissions',
  data() {
    return {
      //关联的权限数组
      Permissionslist: [],
      //角色ID
      roleId: '',
      //组织树配置
      setting: {
        view: {
          fontCss: {
            color: "#333"
          },
          dblClickExpand: true,
          showLine: true,
          selectedMulti: true
        },
        callback: {},
        data: {
          keep: {
            leaf: false,
            parent: false
          },
          key: {
            checked: "checked",
            children: "nodes",
            title: "permissionName",
            name: "permissionName"
          },
          simpleData: {
            enable: true,
            idKey: "permissionId",
            pIdKey: "pId",
            rootPId: '0'
          }
        },
        check: {
          enable: true,
          chkboxType: { "Y" : "ps", "N" : "ps" }
        },
      },
    }
  },
  created() {
    this.roleId = this.$route.query.roleId;
  },
  mounted() {
    this.getUsers();
    $("#inner-content").slimScroll({
      height: document.body.clientHeight - 240,
    });
  },
  methods: {
    getUsers: function() {
      var _this = this;
      axios.post('/showSysRolePermissionByRoleId', {
        roleId: this.roleId
      }).then(function(result) {
        if (result.data.success == true) {
          console.log(result.data);
          var data = result.data.data;
          $.fn.zTree.init($("#ztree"), _this.setting, data).expandAll(true);
        }
      }).catch(function(err) {
        console.log(err);
      });
    },
    onSubmit: function() {
      let zTree = $.fn.zTree.getZTreeObj("ztree");
      let checkedNodes = zTree.getCheckedNodes();
      let _this = this;
      checkedNodes.forEach(function(item) {
        _this.Permissionslist.push(item.permissionId);
      });
      axios.post('/setSysRolePermission', {
        roleId: this.roleId,
        Permissionslist: this.Permissionslist
      }).then(function(result) {
        if (result.data.success == true) {
          console.log(result.data);
          _this.$message({
            message: '设置成功',
            type: 'success'
          });
          _this.$router.push({
            path: '/management/RoleManagement'
          })
        } else {
          _this.$message.error(result.data.message);
        }
      }).catch(function(err) {
        console.log(err);
      });
    },
    setpaadtuiloagin: function() {
      let _this = this;
      axios.post('/ClearanceofPermissions').then(function(result) {
        if (result.data.success == true) {
          _this.$router.push({
            path: '/login'
          })
        } else {
          _this.$message.error(result.data.message);
        }
      });
    }

  }
};
</script>
