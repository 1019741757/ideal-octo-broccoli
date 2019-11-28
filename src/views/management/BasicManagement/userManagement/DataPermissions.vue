<template>
<div class="">
  <div class="wrapper animated fadeInRight" style="padding:0">
    <el-row :gutter="20">
      <el-col :span="15">
        <div class="grid-content bg-purple user_left" >
          <h5>选择权限</h5>
          <div class="" id="mangs_house">
            <div id="ztree" ref="myComponent" class="ztree"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple user_right" id="mangs_house">
          <h5>已选权限</h5>
          <div class="" id="mangs_vuer">
            <el-tag v-for="item in UserPlaceByList" closable :disable-transitions="false" @close="handleClose(item)">
              <i class="icon iconfont icon-changsuo" style="color:#000" v-if="item.nodeType == 2"></i>
              <i class="fa fa-th-large" v-else></i> {{item.name}}
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
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
  name: 'DataPermissions',
  data() {
    return {
      UserPlaceByList: [], //数据权限树
      //关联的权限数组
      placeIds: [],
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
        callback: {
          onClick: this.zTreeOnClick
        },
        data: {
          keep: {
            leaf: false,
            parent: false
          },
          key: {
            checked: "checked",
            children: "nodes",
            title: "name",
            name: "name",
            nodeType: "nodeType",
          },
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: '0'
          }
        },
      },
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {

  },
  mounted() {
    $("#mangs_house").slimScroll({
      height: document.body.clientHeight/2,
    });
    $("#mangs_vuer").slimScroll({
      height: document.body.clientHeight/2,
    });
    this.getZtree();
  },
  methods: {
    getZtree: function() {
      var _this = this;
      axios.post('/showUserPlaceByUserId', {
        userId: this.userId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            if (data[i].nodeType == 1) {
              data[i].icon = 'images/ztree/1.png'
            } else {
              data[i].icon = 'images/ztree/2.png'
            }
            if (data[i].checked == 1) {
              _this.UserPlaceByList.push(data[i]);
            }
          }
          $.fn.zTree.init($("#ztree"), _this.setting, data).expandAll(true);
        } else {
          _this.$message.error(result.data.message);
        }
      }).catch(function(err) {});
    },
    //分类树子节点点击
    zTreeOnClick: function(event, treeId, treeNode) {
      console.log(treeNode);
      var IS = true;
      for (var i = 0; i < this.UserPlaceByList.length; i++) {
        if (this.UserPlaceByList[i].id == treeNode.id) {
          IS = false
          break;
        } else {
          IS = true;
        }
      }
      if (IS) {
        this.UserPlaceByList.push(treeNode)
      }
    },
    //标签点击删除
    handleClose(tag) {
        this.UserPlaceByList.splice(this.UserPlaceByList.indexOf(tag), 1);
    },
    //确认提交
    DataPermissionsSubmission: function() {
      var placeIds=[];
      this.UserPlaceByList.forEach(function(item) {
        placeIds.push(item.id);
      });
      console.log(placeIds);
      let _this = this;
      axios.post('/setUserPlace', {
        userId: this.userId,
        placeIds: placeIds
      }).then(function(result) {
        if (result.data.success == true) {
          console.log(result.data);
          _this.$message({
            message: '设置成功',
            type: 'success'
          });
        } else {
          _this.$message.error(result.data.message);
        }
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
};
</script>
