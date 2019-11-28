<template>
<div class="">
  <div class="wrapper animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox float-e-margins" style="margin-bottom:0">
          <el-table ref="multipleTable" :data="DistributionRoleList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleName" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Vuex from 'Vuex'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'Permissions',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      DistributionRoleList: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {
    var _this = this;
    $.ajax({
      url: '/showSysUserRoleByUserId',
      type: 'POST', //GET
      async: false, //或false,是否异步
      data: {
        userId: this.userId
      },
      dataType: 'json', //返回的数据格式：
      success: function(result) {
        var data = result.data;
        _this.DistributionRoleList = Object.assign([], data);
      },
    })
  },
  mounted() {
    this.toggleSelection(this.DistributionRoleList);
  },
  methods: {
    toggleSelection(rows) {
      rows.forEach(row => {
        if (row.checked == 1) {
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    DistributionRoleSubmission() {
      var roleIds=[];
      this.multipleSelection.forEach(row => {
        roleIds.push(row.roleId)
      });
      if (roleIds.length == 0) {
        this.$confirm('该用户没有分配任何权限，无法登陆该系统', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
        this.setUserRole(roleIds);
        }).catch(() => {});
      }else {
        this.$confirm('确认要分配这些角色吗？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
        this.setUserRole(roleIds);
        }).catch(() => {});
      }

    },
    setUserRole:function(roleIds){
      console.log(roleIds);
      var _this = this;
      axios.post('/setUserRole', {
        userId:this.userId,
        roleIds: roleIds
      }).then(function(result) {
        if (result.data.success == true) {
          _this.$emit('DistributionRoleBox');
          _this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          _this.$message.error(result.data.message);
        }
      })
    }
  }
};
</script>
