<template>
<div class="" v-if="Jurisdiction('classify')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <div class="" style="padding: 0 19px">
              <el-button type="primary" size="medium" @click="addmodelNamebox()" v-if="Jurisdiction('classify:manage:add')">新增</el-button>
              <!-- <el-button type="primary" @click="addmodelNamebox()">新增</el-button> -->
            </div>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('classify:look')">
              <el-card class="box-card" style="position: relative;">
                <div class="layer">
                  <div id="tableMain">
                    <ul id="treeDemo" class="ztree ztree_CreateGroup"></ul>
                  </div>

                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--新增分组-->
  <el-dialog title="新增" :visible.sync="addPlaceClassifyName" @close='addcloseDialog'>
    <el-form :model="addPlaceClassifyList" :rules="rules" ref="addPlaceClassifyList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分组名称：" prop="classifyName">
        <el-input v-model="addPlaceClassifyList.classifyName" auto-complete="off"></el-input>
      </el-form-item>
      <Input-Zterr v-if="addPlaceClassifyName" @zTreeClick="addzTreeClick"></Input-Zterr>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addPlaceClassifyName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="addSubmit('addPlaceClassifyList')">确 定</el-button>
    </div>
  </el-dialog>

  <!--编辑分类-->
  <el-dialog title="编辑" :visible.sync="editPlaceClassifyName" @close='editcloseDialog'>
    <el-form :model="editPlaceClassifyList" :rules="rules" ref="editPlaceClassifyList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分组名称：" prop="classifyName">
        <el-input v-model="editPlaceClassifyList.classifyName" auto-complete="off"></el-input>
      </el-form-item>
      <Input-Zterr v-if="editPlaceClassifyName" @zTreeClick="editzTreeClick"></Input-Zterr>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editPlaceClassifyName = false">取 消</el-button>
      <el-button size="small" type="primary" @click.native="editSubmit('editPlaceClassifyList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
import InputZterr from './ClassificationManagement/InputZterr.vue'

export default {
  name: 'ClassificationManagement', //分类管理
  data() {
    return {
      clientHeight: document.body.clientHeight-84+'px',
      postZtrreList: null,
      //新增组织树
      addPlaceClassifyName: false,
      addPlaceClassifyList: {},
      //修改组织树
      editPlaceClassifyName: false,
      editPlaceClassifyList: {},
      setting: {
        edit: {
          // enable: true,
          // showRemoveBtn: false,
          // showRenameBtn: false
        },
        handleEdit: this.handleEdit,
        view: {
          fontCss: {
            color: "#333"
          },
          addDiyDom: this.addDiyDom,
          dblClickExpand: true,
          showLine: true,
          selectedMulti: true
        },
        callback: {
          onClick: this.zTreeOnClick,
          onDrop: this.zTreeOnDrop, //用于捕获节点拖拽操作结束的事件回调函数
        },
        data: {
          keep: {
            leaf: false,
            parent: false
          },
          key: {
            checked: "isChecked",
            children: "nodes",
            title: "classifyName",
            name: "classifyName"
          },
          simpleData: {
            enable: true,
            idKey: "classifyId",
            pIdKey: "pId",
            rootPId: '0'
          }
        },
        check: {
          enable: false
        },
      },
      //表单验证
      rules: {
        classifyName: [{
            required: true,
            message: '请输入分组名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        Dailyplan: [{
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
        ]
      },
    }
  },
  components: {
    InputZterr
  },
  created() {},
  mounted() {
    this.refreshTree();

  },
  methods: {
    ...mapMutations(['set_rpOrgname']),
    //获取组数据
    refreshTree: function() {
      var _this = this;
      axios.post('/selectAllClassify').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectDeviceList = data;
          var ztree = $.fn.zTree.init($("#treeDemo"), _this.setting, data).expandAll(true);
          var li_head = ' <li class="head"><a><div class="diy_head" style="text-align:left; width:39%">分组名称</div><div class="diy_head" style="text-align:left; width:46%"></div>' +
            '<div class="diy_head" style="text-align:left; width:15%">操作</div></a></li>';
          var rows = $("#treeDemo").find('li');
          if (rows.length > 0) {
            rows.eq(0).before(li_head);
          } else {
            $("#treeDemo").append(li_head);
            $("#treeDemo").append('<li ><div style="text-align: center;line-height: 30px; font-family:微软雅黑" >暂无组结构</div></li>')
          }

        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //设置节点后面显示一个按钮
    addDiyDom: function(treeId, treeNode) {
      var aObj = $("#" + treeNode.tId + "_a");
      var MyComponent = Vue.extend({  
        template: '<a><div class="diy"><span></span></div>' +
          '<div class="icon_div"><button size="small" style="font-family:微软雅黑" class="el-button el-button--default el-button--small" @click="edit(classifyId)"  v-if="' + this.Jurisdiction('classify:manage:update') +
          '" plain>编辑</button><button style="font-family:微软雅黑" type="danger" size="small" class="el-button el-button--danger el-button--small" @click="del(classifyId)" v-if="' + this.Jurisdiction('classify:manage:del') + '">删除</button></div></a>',
        data() {
          return {}
        },
         methods: {    
          edit: function(id) {
            this.$parent.editmodelNamebox(id);     
          },
          del: function(id) {
            console.log(id);
            this.$parent.deleteSubmit(id);
          }
        }
      });
      var component = new MyComponent();
      component.$parent = this;
      component.classifyId= treeNode.classifyId;
      aObj.append(component.$mount().$el);
    },
    //组织树页面排序
    zTreeOnDrop: function(event, treeId, treeNodes, targetNode, moveType) {
      let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      let node = treeObj.getNodes();
      let nodes = treeObj.transformToArray(node);
      let orgListArry = [];
      nodes.forEach(function(item) {
        var _pId;
        if (item.pId == 0) {
          _pId = 0;
        } else {
          _pId = item.pId;
        }
        orgListArry.push({
          id: item.orgId,
          pId: _pId
        });
      });
      let orgList = JSON.stringify(orgListArry, null, 4);
      console.log(orgList);
      // let _this = this;
      // axios.post("/updateOrgByOrgSort", {
      //   orgList: orgList
      // }, {
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // }).then(function(result) {
      //   console.log(result);
      //   if (result.data.success == true) {
      //     _this.$message({
      //       message: '排序成功',
      //       type: 'success'
      //     });
      //   } else {
      //     _this.$message.error(result.data.message);
      //   }
      // });
    },
    //新增弹框数组配置
    addmodelNamebox: function() {
      this.addPlaceClassifyName = true;
    },
    //上级节点点击
    addzTreeClick: function(id) {
      this.addPlaceClassifyList.id = id;
    },
    //新增弹框数据提交
    addSubmit: function(addPlaceClassifyList) {
      this.addPlaceClassifyName = false;
      this.$refs[addPlaceClassifyList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addPlaceClassify', {
            addPlaceClassifyList: this.addPlaceClassifyList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.refreshTree();
              _this.addPlaceClassifyName = false;
              _this.$refs[addPlaceClassifyList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //新增弹框关闭
    addcloseDialog: function() {
      this.$refs.addPlaceClassifyList.resetFields();
    },
    //编辑弹框数组配置
    editmodelNamebox: function(id) {
      var _this = this;
      axios.post('/selectPlaceClassifyById', {
        classifyId: id
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editPlaceClassifyList = Object.assign({}, data);
          _this.set_rpOrgname(data.pName);
          _this.editPlaceClassifyName = true;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //上级节点点击
    editzTreeClick: function(id) {
      this.editPlaceClassifyList.pId = id;
    },
    //编辑弹框数据提交
    editSubmit: function(editPlaceClassifyList) {
      this.$refs[editPlaceClassifyList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/upatePlaceClassify', {
            editPlaceClassifyList: this.editPlaceClassifyList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.refreshTree();
              _this.editPlaceClassifyName = false;
              _this.$refs[editPlaceClassifyList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
      this.addPlaceClassifyName = false;
    },
    //编辑弹框关闭
    editcloseDialog: function() {
      this.$refs.editPlaceClassifyList.resetFields();
      this.set_rpOrgname(null);
    },
    //删除弹框数组配置
    deleteSubmit: function(id) {
      this.$confirm('是否删除该分组', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delPlaceClassifyById', {
          classifyId: id
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.refreshTree();
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
    }
  }
}
</script>
<style media="screen">
.reg_add {
  transform-origin: center top 0px;
  z-index: 2014;
  width: 100%;
  position: absolute;
  top: 30px;
  left: 0px;
  max-height: 280px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.form-right .el-form-item {
  width: 50%;
  float: left;
}

.tabel_h5 {
  padding: 10px 0;
  text-align: right;
  color: red;
  font-weight: normal;
}
</style>
