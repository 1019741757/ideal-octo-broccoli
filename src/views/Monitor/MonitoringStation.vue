<template>
<div class="baidu">
  <div class="wrapper wrapper-content animated fadeInRight rrt" :style="{height:screenheight}">
    <split-pane v-on:resize="resize" :min-percent='18' :max-percent='15' :default-percent='18' split="vertical">
      <!-- 左框架 -->
      <template slot="paneL">
        <div class="" style="box-shadow: 0px 0px 8px 0px rgba(180, 180, 180, 0.5)">
          <div class="devicemanage-left" style="overflow: hidden;background-color: #fff;padding: 0;" :style="{height:ztreeheight}">
              <div style="overflow: hidden;max-width: 350px;">
                <div class="nomert_div">
                  <div class="nomert_div_m">
                    <el-input placeholder="分组名称、场所名称、设备编码" v-model="deviceCode" clearable @clear="deviceCodeonSubmit"></el-input>
                  </div>
                  <p class=" nomert_but" @click="deviceCodeonSubmit"><i class="icon iconfont icon-search" type="button"></i></p>
                </div>
              </div>
              <div class="ibox-content" style="padding-right: 0;border:none" id="inner_Station" >
                <div class="Equi_scroll">
                  <div id="Equi_excv" ref="myComponent" class="ztree" style="padding-bottom:30px;"></div>
                </div>
              </div>
              <div class="select_dropdown">
                <el-select v-model="deviceTypeId"  clearable placeholder="选择设备类型" @change="handleCommand">
                  <el-option v-for="item in deviceTypeIdList"  :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId"> </el-option>
               </el-select>
              </div>
              <!-- <el-dropdown class="monit_dropdown" @command="handleCommand">
                <span class="el-dropdown-link">
                  选择设备类型<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in deviceTypeIdList" :command="item.deviceTypeId" >{{item.deviceTypeName}}</el-dropdown-item>
                  </el-dropdown-menu>
             </el-dropdown> -->
          </div>
        </div>
      </template>
      <!-- 右框架 -->
      <template slot="paneR">
        <div id="inner-content" style="background-color:#fff;box-shadow:0px 0px 8px 0px rgba(180,180,180,0.5);">
          <div class="Monitor_icon">
            <a :class="dituClass" @click="toggleactiveColor(1)"><span>地图</span></a>
            <a class="ui">|</a>
            <a :class="jiuClass" @click="toggleactiveColor(2)"><span>横图</span></a>
          </div>
            <Monitoring-Center v-if="Istoggle == 1" @MonitoringClick="MonitoringClick"></Monitoring-Center>
            <Control-Center v-if="Istoggle == 2" @MonitoringClick="MonitoringClick" @zTreeChange="zTreeChange"></Control-Center>
        </div>
     </template>
    </split-pane>
  </div>
  <!--  设备详情    -->
  <el-dialog title="设备详情" :visible.sync="detailsmodelName" width="80%" top="5vh">
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
import SplitPane from 'vue-splitpane'
import ControlCenter from './MonitoringStation/controlCenter.vue'
import MonitoringCenter from './MonitoringStation/monitoringCenter.vue'
import DeviceDetails from './DeviceDetails/index.vue' //设备详情

export default {
  name: 'MonitoringStation',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      screenheight: document.body.clientHeight - 118 + "px",
      ztreeheight: document.body.clientHeight - 150 + "px",
      Istoggle: 1, //地图 设备切换
      dituClass: 'Color', //地图class
      jiuClass: null, //设备class
      deviceCode: null, //设备  区域 搜索
      deviceTypeId: null, //设备类型id
      detailsmodelName: false, //设备详情
      deviceTypeIdList: [],
      settimer:null,//分类组织树刷新定时器
      settimeInterval:5000,//时间间隔
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
    }

  },
  components: {
    SplitPane,
    ControlCenter,
    MonitoringCenter,
    DeviceDetails
  },
  mounted() {
    $("#inner_Station").slimScroll({
      height: document.body.clientHeight - 192,
    });
    this.refreshTree();　
    this.selectDeviceTypeVos();
    var _this = this;
    this.settimer=setInterval(function() {
      _this.zTreeChange();
    }, this.settimeInterval);
  },

  methods: {
    ...mapMutations(['set_orgId', 'set_nodeType', 'set_deviceTypeId', 'set_deviceCode', 'set_MonitoringClick']),
    //组织树数据获取
    refreshTree() {
      var _this = this;
      axios.post('/getPlaceTree').then(function(result) {
        console.log(result.data);
        if (result.data.success == true) {
          var data = result.data.data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].nodeType == 1) {
              data[i].icon = 'images/ztree/1.png'
            } else {
              data[i].icon = 'images/ztree/2.png'
            }
          }
          var ztree = $.fn.zTree.init($("#Equi_excv"), _this.setting, data).expandAll(true);
          var treeObj = $.fn.zTree.getZTreeObj("Equi_excv");
          for (var i = 0; i < data.length; i++) {
            var alarmNum = data[i].alarmNum || 0;
            if (alarmNum != 0) {
              var node = treeObj.getNodeByParam("id", data[i].id);
              if (node == null) continue;
              var str = node.name.split("(");
              node.name = str[0] + "(" + alarmNum + ")";
              treeObj.setting.view.fontCss = _this.zTreegetFont();
              treeObj.updateNode(node);
            }
          }
        } else {
          _this.$message.error(result.data.message);
        }

      })
    },
    //z组织树点击事件
    zTreeOnClick: function(event, treeId, treeNode) {
      // this.parametersList.orgId=treeNode.orgId;
      // this.parametersList.planType=treeNode.planType;
      this.set_orgId(treeNode.id);
      this.set_nodeType(treeNode.nodeType);
    },
    //区域树渲染告警
    zTreegetFont: function(treeId, treeNode, alarmNum) {
      return alarmNum == 0 ? {
        color: "#333333"
      } : {
        color: "red"
      };
    },
    //区域树渲染告警
    zTreeChange: function() {
      var _this = this;
      axios.post('/getPlaceTree').then(function(result) {
        console.log(result.data);
        if (result.data.success == true) {
          var data = result.data.data;
          for (var i = 0; i < data.length; i++) {
            if (data[i].nodeType == 1) {
              data[i].icon = 'images/ztree/1.png'
            } else {
              data[i].icon = 'images/ztree/2.png'
            }
          }
          var treeObj = $.fn.zTree.getZTreeObj("Equi_excv");
          for (var i = 0; i < data.length; i++) {
            var alarmNum = data[i].alarmNum || 0;
            if (alarmNum !== 0) {
              var node = treeObj.getNodeByParam("id", data[i].id);
              if (node == null) continue;
              var str = node.name.split("(");
              node.name = str[0] + "(" + alarmNum + ")";
              treeObj.setting.view.fontCss = _this.zTreegetFont(data[i].id, node, alarmNum);
              // treeObj.setting.view.fontCss["color"]="red";
              treeObj.updateNode(node);
            } else {
              var node = treeObj.getNodeByParam("id", data[i].id);
              if (node == null) continue;
              var str = node.name.split("(");
              node.name = str[0];
              treeObj.setting.view.fontCss = _this.zTreegetFont(data[i].id, node, alarmNum);
              // treeObj.setting.view.fontCss["color"]="#999";
              treeObj.updateNode(node);
            }
          }
        } else {
          _this.$message.error(result.data.message);
        }

      })
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
    //设备类型选择
    handleCommand: function(command) {
      this.set_deviceTypeId(command);
    },
    //设备编码搜索
    deviceCodeonSubmit: function() {
      var Regx = /^[A-Za-z0-9]*$/;
      var devicValue = this.deviceCode;
      if (devicValue == null || devicValue == '') {
        this.set_deviceCode(this.deviceCode);
        this.fuzzySearch('Equi_excv', null, false); //初始化模糊搜索方法
      } else if (Regx.test(devicValue)) {
        this.set_deviceCode(this.deviceCode);
      } else {
        this.fuzzySearch('Equi_excv', null, false); //初始化模糊搜索方法
      }
    },

    //地图 设备切换函数
    toggleactiveColor: function(index) {
      if (index == 1) {
        this.dituClass = 'Color';
        this.jiuClass = '';
        this.Istoggle = index;
      } else {
        this.dituClass = '';
        this.jiuClass = 'Color';
        this.Istoggle = index;
        $("#inner-content").slimScroll({
          height: document.body.clientHeight - 150,
        });
      }
    },
    //设备详情页面
    MonitoringClick: function(deviceId) {
      this.detailsmodelName = true;
      this.set_MonitoringClick(deviceId);
    },
    //页面切割函数
    resize: function() {
      // console.log(this.min)
    },
    //区域树搜索
    fuzzySearch: function(zTreeId, isHighLight, isExpand) {
      var _this = this;
      var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId); //get the ztree object by ztree id
      if (!zTreeObj) {
        alter("fail to get ztree object");
      }
      var nameKey = zTreeObj.setting.data.key.name; //get the key of the node name
      isHighLight = isHighLight === false ? false : true; //default true, only use false to disable highlight
      isExpand = isExpand ? true : false; // not to expand in default
      zTreeObj.setting.view.nameIsHTML = isHighLight; //allow use html in node name for highlight use
      var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js meta characters
      var rexMeta = new RegExp(metaChar, 'gi'); //regular expression to match meta characters
      // keywords filter function
      function ztreeFilter(zTreeObj, _keywords, callBackFunc) {
        if (!_keywords) {
          _keywords = ''; //default blank for _keywords
        }
        // function to find the matching node
        function filterFunc(node) {
          if (node && node.oldname && node.oldname.length > 0) {
            node[nameKey] = node.oldname; //recover oldname of the node if exist
          }
          // zTreeObj.updateNode(node); //update node to for modifications take effect
          var alarmNum = node.alarmNum || 0;
          zTreeObj.setting.view.fontCss = _this.zTreegetFont(node.idKey, node, alarmNum);
          // zTreeObj.updateNode(node);
          // _this.zTreeChange();
          if (_keywords.length == 0) {
            //return true to show all nodes if the keyword is blank
            zTreeObj.showNode(node);
            // zTreeObj.expandNode(node,isExpand);
            return true;
          }
          //transform node name and keywords to lowercase
          if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
            if (isHighLight) { //highlight process
              //a new variable 'newKeywords' created to store the keywords information
              //keep the parameter '_keywords' as initial and it will be used in next node
              //process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
              var newKeywords = _keywords.replace(rexMeta, function(matchStr) {
                //add escape character before meta characters
                return '\\' + matchStr;
              });
              node.oldname = node[nameKey]; //store the old name
              var rexGlobal = new RegExp(newKeywords, 'gi'); //'g' for global,'i' for ignore case
              //use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
              node[nameKey] = node.oldname.replace(rexGlobal, function(originalText) {
                //highlight the matching words in node name
                // var highLightText =
                // 	'<span style="color: whitesmoke;background-color: darkred;">'
                // 	+ originalText
                // 	+'</span>';
                var highLightText =originalText ;
                return highLightText;
              });
              zTreeObj.updateNode(node); //update node for modifications take effect
            }
            zTreeObj.showNode(node); //show node with matching keywords
            return true; //return true and show this node
          }

          zTreeObj.hideNode(node); // hide node that not matched
          return false; //return false for node not matched
        }
        var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
        processShowNodes(nodesShow, _keywords); //nodes should be reprocessed to show correctly
      }
      /**
       * reprocess of nodes before showing
       */
      function processShowNodes(nodesShow, _keywords) {
        if (nodesShow && nodesShow.length > 0) {
          //process the ancient nodes if _keywords is not blank
          if (_keywords.length > 0) {
            $.each(nodesShow, function(n, obj) {
              var pathOfOne = obj.getPath(); //get all the ancient nodes including current node
              if (pathOfOne && pathOfOne.length > 0) {
                //i < pathOfOne.length-1 process every node in path except self
                for (var i = 0; i < pathOfOne.length - 1; i++) {
                  zTreeObj.showNode(pathOfOne[i]); //show node
                  zTreeObj.expandNode(pathOfOne[i], true); //expand node
                }
              }
            });
          } else { //show all nodes when _keywords is blank and expand the root nodes
            var rootNodes = zTreeObj.getNodesByParam('level', '0'); //get all root nodes
            $.each(rootNodes, function(n, obj) {
              zTreeObj.expandNode(obj, true); //expand all root nodes
            });
          }
        }
      }
      //listen to change in input element
      // $(searchField).bind('input propertychange', function() {
      //   var _keywords = $(this).val();
      //   searchNodeLazy(_keywords); //call lazy load
      // });
      var timeoutId = null;
      // excute lazy load once after input change, the last pending task will be cancled
      function searchNodeLazy(_keywords) {
        var _keywords = _this.deviceCode;
        console.log(_keywords);
        if (timeoutId) {
          //clear pending task
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function() {
          ztreeFilter(zTreeObj, _keywords); //lazy load ztreeFilter function
        }, 500);
      }
      searchNodeLazy();
    }
  },
  destroyed: function() {
    clearInterval(this.settimer);
    this.set_orgId(null);
    this.set_nodeType(null);
    this.set_deviceTypeId(null);
    this.set_deviceCode(null);
  },
}
</script>
<style media="screen">
.rrt{
  animation-fill-mode: backwards;
}
</style>
