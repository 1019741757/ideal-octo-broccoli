<template>
<div class="">
  <el-form-item label="上级节点：">
    <input id="citySel" v-model="rpOrgName" autocomplete="off" type="text" class="el-input__inner" value="" @click="showMenu(); return false;" readonly="readonly" />
    <span class="el-input__suffix" style="cursor: pointer" @click="clear"><span class="el-input__suffix-inner"><i class="el-input__icon el-icon-circle-close el-input__clear"></i></span></span>
    <div id="menuContent" class="menuContent" style="display:none; position: absolute;background-color: #fff;width: 100%;">
      <ul id="Equi_zterr" class="ztree" style="margin-top:0; width:160px;"></ul>
    </div>
    <input id="Nuerout" name="pId" class="form-control required" value="" style="display: none;" maxlength="20" type="text" />
  </el-form-item>
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
  name: "InputZterr",
  data() {
    return {
      rpOrgName: null,
      regadd: false,
      boxsettingList: {},
      boxsetting: {
        view: {
          fontCss: {
            color: "#333"
          },
          dblClickExpand: true,
          showLine: true,
          selectedMulti: true
        },
        callback: {
          onClick: this.addboxzTreeOnClick
        },
        data: {
          keep: {
            leaf: false,
            parent: false
          },
          key: {
            checked: "isChecked",
            children: "nodes",
            title: "name",
            name: "name"
          },
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: '0'
          }
        },
        check: {
          enable: false
        },
      },
    };
  },
  computed: {
    ...mapState(['rpOrgname'])
  },
  mounted() {
    console.log(this.rpOrgname);
    this.rpOrgName=this.rpOrgname;
    this.getboxsetting();
  },
  methods: {
    //获取场所树 数据
    getboxsetting: function() {
      var _this = this;
      axios.post('/getClassifyTree4NoPlace').then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.boxsettingList = data;
          var ztree = $.fn.zTree.init($("#Equi_zterr"), _this.boxsetting, _this.boxsettingList).expandAll(true);
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //当input获得焦点时
    showMenu: function(index) {
      this.$nextTick(function() {

      });
      $("#menuContent").css({
        left: 0 + "px",
        top: 40 + "px"
      }).slideDown("fast");
      $("body").bind("mousedown", this.onBodyDown);
    },
    hideMenu:function() {
      $("#menuContent").fadeOut("fast");
      $("body").unbind("mousedown", this.onBodyDown);
    },
    onBodyDown:function(event) {
      if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        this.hideMenu();
      }
    },
    //新增点击组织树提交内容
    addboxzTreeOnClick: function(event, treeId, treeNode) {
      this.rpOrgName = treeNode.name;
      this.hideMenu();
      this.$emit('zTreeClick', treeNode.id);
    },
    clear: function() {
      this.rpOrgName =null;
      this.$emit('zTreeClick', null);
    }
  },
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
</style>
