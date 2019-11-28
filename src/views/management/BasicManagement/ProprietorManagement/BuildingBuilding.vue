<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="" style="padding:0 0 25px">
            <el-button type="primary" size="medium" @click="addBuilding()" v-if="Jurisdiction('building:manage:add')">新增建筑</el-button>
          </div>
          <el-collapse v-model="activeName" class="el_coll_color" accordion>
            <el-collapse-item v-for="(item, index) in selectBuildingList">
              <template slot="title">
               {{item.buildingName}}
               <span class="Building_mut">
                     <i class="icon iconfont icon-xiugai"  @click.stop="editBuilding(item.buildingId)" v-if="Jurisdiction('building:manage:update')"></i>
                     <i class="icon iconfont icon-trash_fill"  @click.stop="deleteBuilding(item.buildingId)" v-if="Jurisdiction('building:manage:del')"></i>
               </span>

              </template>
              <div class="tag_iconxiugai" style="width:100%">
                <draggable v-model="item.floors" :options="{animation:800,group:'people'}" @update="datadragEnd(item.floors)" >
                  <transition-group>
                    <el-tag v-for="tag in item.floors" :key="tag.floorId" closable @close="deletefloorsList(tag.floorId)" style="cursor: move;">
                      {{tag.floorName}} <i class="icon iconfont icon-xiugai" @click="editfloorsList(tag.floorId)"></i>
                    </el-tag>
                  </transition-group>
                </draggable>
                <el-button size="small" @click="addfloorsList(item.buildingId)" style="margin: 10px 12px;">+ 添加</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
  <!--建筑新增界面-->
  <el-dialog title="新增建筑" :visible.sync="addBuildingName">
    <el-form :model="addBuildingList" :rules="rules" ref="addBuildingList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="建筑名称：" prop="buildingName">
        <el-input v-model="addBuildingList.buildingName" auto-complete="off" placeholder="请输入建筑名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addBuildingName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addBuildingSubmit('addBuildingList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--建筑修改界面-->
  <el-dialog title="新增楼层" :visible.sync="editBuildingName">
    <el-form :model="editBuildingList" :rules="rules" ref="editBuildingList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="建筑名称：" prop="buildingName">
        <el-input v-model="editBuildingList.buildingName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editBuildingName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editBuildingSubmit('editBuildingList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--楼层新增界面-->
  <el-dialog title="新增楼层" :visible.sync="addselectFloorName" @close='addcloseDialog'>
    <el-form :model="addselectFloorList" :rules="rules" ref="addselectFloorList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="单个/批量：">
        <el-switch v-model="delivery"></el-switch>
      </el-form-item>
      <el-form-item label="楼层名称：" prop="placeName" v-if="!delivery">
        <el-input v-model="addselectFloorList.placeName" auto-complete="off" placeholder="例如2层楼"></el-input>
      </el-form-item>
      <el-row v-if="delivery">
        <el-col :span="10">
          <el-form-item label="楼层名称：" prop="minplaceName" class="grid-content bg-purple">
            <el-input v-model="addselectFloorList.minplaceName" auto-complete="off" placeholder="例如0"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="line-height: 35px;text-align: center;"> 至 </el-col>
        <el-col :span="8">
          <el-form-item class="grid-content bg-purple bg_styrle" prop="maxplaceName">
            <el-input v-model="addselectFloorList.maxplaceName" auto-complete="off" placeholder="例如23"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="line-height: 35px;text-align: left;">/层</el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addselectFloorName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addselectFloorSubmit('addselectFloorList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--楼层修改界面-->
  <el-dialog title="修改楼层" :visible.sync="editselectFloorName">
    <el-form :model="editselectFloorList" :rules="rules" ref="editselectFloorList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="楼层名称：" prop="floorName">
        <el-input v-model="editselectFloorList.floorName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editselectFloorName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editselectFloorSubmit('editselectFloorList')">确 定</el-button>
    </div>
  </el-dialog>


</div>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'


export default {
  name: 'BuildingBuilding', //建筑楼宇
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      placeId: null, //场所id
      selectBuildingList: [], //建筑数据
      //建筑添加
      addBuildingList: {},
      addBuildingName: false,
      //建筑修改
      editBuildingList: {},
      editBuildingName: false,
      //楼层新增
      addselectFloorList: {},
      addselectFloorName: false,
      delivery: false,
      buildingId: null,
      //楼层修改
      editselectFloorList: {},
      editselectFloorName: false,
      floorId: null,
      activeName: '1',

      rules: {
        placeName: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        minplaceName: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '请输入数字格式',
          trigger: 'blur',
          transform(value) {
            return Number(value);
          }
        }],
        maxplaceName: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '请输入数字格式',
          trigger: 'blur',
          transform(value) {
            return Number(value);
          }
        }],
        buildingName: [{
            required: true,
            message: '请输入建筑名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
      },
    }
  },
  components: {
    draggable,
  },
  created() {
    this.placeId = this.$route.query.placeId;
    this.getUsers();
  },
  mounted() {
    //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }
  },
  methods: {
    getUsers: function() {
      var _this = this;
      axios.post('/selectBuildingsByPlaceId', {
        placeId: this.placeId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectBuildingList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增建筑
    addBuilding: function() {
      this.addBuildingName = true;
    },
    //新增建筑提交
    addBuildingSubmit: function(addBuildingList) {
      this.$refs[addBuildingList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addBuilding', {
            buildingName: this.addBuildingList.buildingName,
            placeId: this.placeId
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.addBuildingName = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[addBuildingList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //修改建筑
    editBuilding: function(buildingId) {
      this.editBuildingName = true;
      var _this = this;
      axios.post('/selectBuildingById', {
        buildingId: buildingId
      }).then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editBuildingList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      });
    },
    //修改建筑提交
    editBuildingSubmit: function(editBuildingList) {
      console.log(this.editBuildingList.buildingId, );
      this.$refs[editBuildingList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateBuilding', {
            buildingName: this.editBuildingList.buildingName,
            buildingId: this.editBuildingList.buildingId,
            placeId: this.placeId
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.editBuildingName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editBuildingList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //修改删除
    deleteBuilding: function(buildingId) {
      this.$confirm('是否删除该建筑', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delBuildingById', {
          buildingId: buildingId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //楼层添加
    addfloorsList: function(buildingId) {
      this.buildingId = buildingId;
      this.addselectFloorName = true;
    },
    //楼层添加提交
    addselectFloorSubmit: function(addselectFloorList) {
      var placeName = this.addselectFloorList.placeName;
      var minplace = parseInt(this.addselectFloorList.minplaceName);
      var maxplace = parseInt(this.addselectFloorList.maxplaceName);
      var floorNames = new Array();
      if (!this.delivery) {
        floorNames.push(placeName)
      } else {
        for (var i = minplace; i <= maxplace; i++) {
          floorNames.push(i + '层');
        }
      }
      this.$refs[addselectFloorList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addFloors', {
            floorNames: floorNames,
            buildingId: this.buildingId
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.addselectFloorName = false;
              _this.delivery = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[addselectFloorList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    addcloseDialog: function() {
      this.$refs.addselectFloorList.resetFields();
    },
    //楼层修改
    editfloorsList: function(floorId) {
      this.floorId = floorId;
      var _this = this;
      axios.post('/selectFloorById', {
        floorId: floorId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editselectFloorList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      });
      this.editselectFloorName = true;
    },
    //楼层修改提交
    editselectFloorSubmit: function(editselectFloorList) {
      this.$refs[editselectFloorList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateFloor', {
            floorName: this.editselectFloorList.floorName,
            floorId: this.editselectFloorList.floorId
          }).then(function(result) {
            if (result.data.success == true) {
              _this.getUsers();
              _this.editselectFloorName = false;
              _this.$refs[editselectFloorList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //楼层删除
    deletefloorsList: function(floorId) {
      this.$confirm('是否删除该层', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delFloorById', {
          floorId: floorId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {});
    },
    //楼层拖拽排序
    datadragEnd(list){
      console.log(list);
      var floorsList=new Array();
      for (var i = 0; i < list.length; i++) {
        floorsList.push(list[i].floorId)
      }
      console.log(floorsList);
      var _this = this;
      axios.post('/sortFloors', {
        floorsList: list
      }).then(function(result) {
        if (result.data.success == true) {
          _this.$message({
            message: '排序成功',
            type: 'success'
          });
        } else {
          _this.$message.error(result.data.message);
        }
      });
    },
  }
}
</script>
<style media="screen">

</style>
