<template>
<div class="" v-if="Jurisdiction('owner')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px">
              <el-form-item label="业主名称：">
                <el-input v-model="formInline.ownerName" placeholder="业主名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button type="primary" size="medium" @click.native="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="" style="padding: 0 19px" v-if="Jurisdiction('owner:manage:add')">
              <el-button type="primary" size="medium" @click="addmodelNamebox()">新增</el-button>
            </div>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('owner:look')">
              <el-card class="box-card">
                <el-table :data="SysOwnerList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60">
                  </el-table-column>
                  <el-table-column property="ownerName" label="业主名称"></el-table-column>
                  <el-table-column property="company" label="业主单位"></el-table-column>
                  <el-table-column property="address" label="业主地址"></el-table-column>
                  <el-table-column property="businessNature" label="行业属性" :formatter="formatSexbusinessNature"></el-table-column>
                  <el-table-column property="ownerPhone" label="业主电话"></el-table-column>
                  <el-table-column property="pOwnerName" label="上级业主"></el-table-column>
                  <el-table-column property="createdDate" label="创建时间" :formatter="dateFormat"></el-table-column>
                  <el-table-column label="操作" width="420">
                    <template scope="scope">
                   <el-button size="small" type="primary" @click="SubsidiaryAccount(scope.$index, scope.row)" v-if="Jurisdiction('noticeReceiver')">附属账号</el-button>
                   <el-button size="small" @click="SMSNotification(scope.$index, scope.row)" v-if="Jurisdiction('noticeReceiver:look')">短信接收</el-button>
                   <el-button type="success" size="small" @click="selectPlaceInfoBox(scope.$index, scope.row)" v-if="Jurisdiction('place')">场所</el-button>
                   <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="Jurisdiction('owner:manage:update')">编辑</el-button>
                   <el-button type="danger" size="small" @click="deleteSubmit(scope.$index, scope.row)" v-if="Jurisdiction('owner:manage:del')">删除</el-button>
                 </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" style="padding:20px 0; ">
                  <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-row>
              </el-card>
            </div>
            <div v-show="selectPlaceInfoName ">
              <div class="" style="padding: 0 19px">
                <el-button type="primary" size="medium" @click="addselectPlaceInfobox()" v-if="Jurisdiction('place:manage:add')">新增场所</el-button>
              </div>
              <div class="ibox-content" style="border:none" v-if="Jurisdiction('place:look')">
                <el-card class="box-card">
                  <el-table :data="selectPlaceInfoList" style="width: 100%">
                    <el-table-column type="index" label="排序" width="60">
                    </el-table-column>
                    <el-table-column property="placeName" label="场所名称"></el-table-column>
                    <el-table-column property="buildingCnt" label="建筑数"></el-table-column>
                    <el-table-column property="floorCnt" label="层数"></el-table-column>
                    <el-table-column label="操作" width="350" v-if="Jurisdiction('place:manage')">
                      <template scope="scope">
                     <el-button type="success" size="small" @click="BuildingBuilding(scope.$index, scope.row)" v-if="Jurisdiction('building:look')">建筑</el-button>
                     <el-button size="small" @click="editselectPlaceInfobox(scope.$index, scope.row)"  v-if="Jurisdiction('place:manage:update')">编辑</el-button>
                     <el-button type="danger" size="small" @click="deleteselectPlaceInfo(scope.$index, scope.row)" v-if="Jurisdiction('place:manage:del')">删除</el-button>
                   </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--业主新增界面-->
  <el-dialog title="新增业主" :visible.sync="addSysOwnerName" @close='addcloseDialog'>
    <el-form :model="addSysOwnerList" :rules="rules" ref="addSysOwnerList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="业主名称" prop="ownerName">
        <el-input v-model="addSysOwnerList.ownerName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="业主电话" prop="ownerPhone">
        <el-input v-model="addSysOwnerList.ownerPhone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addSysOwnerList.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="行业属性：" prop="businessNature">
        <el-select v-model="addSysOwnerList.businessNature" placeholder="请选择" style="width:100%">
          <el-option v-for="item in businessNatureList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业主单位" prop="company">
        <el-input v-model="addSysOwnerList.company" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="业主地址" prop="address">
        <el-input v-model="addSysOwnerList.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="上级业主：" prop="pOwnerId">
        <el-select v-model="addSysOwnerList.pOwnerId" clearable placeholder="请选择" style="width:100%">
          <el-option v-for="item in pOwnerIdList" :key="item.ownerId" :label="item.ownerName" :value="item.ownerId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addSysOwnerName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addSubmit('addSysOwnerList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--业主编辑界面-->
  <el-dialog title="修改业主信息" :visible.sync="editSysOwnerName" @close='editcloseDialog'>
    <el-form :model="editSysOwnerList" :rules="rules" ref="editSysOwnerList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="业主名称" prop="ownerName">
        <el-input v-model="editSysOwnerList.ownerName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="业主电话" prop="ownerPhone">
        <el-input v-model="editSysOwnerList.ownerPhone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="editSysOwnerList.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="行业属性：" prop="businessNature">
        <el-select v-model="editSysOwnerList.businessNature" placeholder="请选择" style="width:100%">
          <el-option v-for="item in businessNatureList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业主单位" prop="company">
        <el-input v-model="editSysOwnerList.company" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="业主地址" prop="address">
        <el-input v-model="editSysOwnerList.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="上级用户：" prop="pOwnerId">
        <el-select v-model="editSysOwnerList.pOwnerId" clearable placeholder="请选择上级业主" style="width:100%">
          <el-option v-for="item in pOwnerIdList" :key="item.ownerId" :label="item.ownerName" :value="item.ownerId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editSysOwnerName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editSubmit('editSysOwnerList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--附属账号-->
  <el-dialog title="附属账号" :visible.sync="SubsidiaryAccountName" class="el_tabel_bcv" width="70%">
    <div class="" style="padding-bottom:20px;">
      <el-button type="success" size="small" @click="addSubsidiaryAccountName = true;" v-if="Jurisdiction('noticeReceiver:manage:add')" v-show="ISaddSubsidiaryAccount">新增</el-button>
    </div>
    <el-card class="box-card" v-if="Jurisdiction('noticeReceiver:look')">
      <el-table :data="SubsidiaryAccountList" style="width: 100%">
        <el-table-column type="index" label="排序" width="60"></el-table-column>
        <el-table-column property="name" label="昵称"></el-table-column>
        <el-table-column property="phone" label="手机号码"></el-table-column>
        <el-table-column property="loginFlag" label="是否允许登入小程序" :formatter="formatSex"></el-table-column>
        <el-table-column label="操作" width="150" v-if="Jurisdiction('noticeReceiver:manage')">
          <template scope="scope">
         <el-button size="small" @click="editSubsidiaryAccount(scope.$index, scope.row)" v-if="Jurisdiction('noticeReceiver:manage:update')">编辑</el-button>
         <el-button type="danger" size="small" @click="deleteSubsidiaryAccount(scope.$index, scope.row)" v-if="Jurisdiction('noticeReceiver:manage:del')">删除</el-button>
       </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-dialog>

  <!--新增附属账号-->
  <el-dialog title="新增附属账号" :visible.sync="addSubsidiaryAccountName" @close='addSubsidiaryAccountDialog'>
    <el-form :model="addONReceiverByOwnerIdList" :rules="rules" ref="addONReceiverByOwnerIdList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="昵称：" prop="name">
        <el-input v-model="addONReceiverByOwnerIdList.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="addONReceiverByOwnerIdList.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否允许登入小程序：" prop="loginFlag">
        <el-radio-group v-model="addONReceiverByOwnerIdList.loginFlag" style="padding-top:5px;">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="addONReceiverByOwnerIdList.loginFlag == 1">
        <el-input type="password" v-model="addONReceiverByOwnerIdList.password" auto-complete="off"></el-input>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addSubsidiaryAccountName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addSubsidiaryAccountSubmit('addONReceiverByOwnerIdList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑附属账号-->
  <el-dialog title="编辑附属账号" :visible.sync="editSubsidiaryAccountName">
    <el-form :model="editSubsidiaryAccountList" :rules="rules" ref="editSubsidiaryAccountList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="昵称：" prop="name">
        <el-input v-model="editSubsidiaryAccountList.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="editSubsidiaryAccountList.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否允许登入小程序：" prop="loginFlag">
        <el-radio-group v-model="editSubsidiaryAccountList.loginFlag" style="padding-top:5px;">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="editSubsidiaryAccountList.loginFlag == 1">
        <el-input type="password" v-model="editSubsidiaryAccountList.password" auto-complete="off"></el-input>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editSubsidiaryAccountName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editSubsidiaryAccountSubmit('editSubsidiaryAccountList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--短信接收-->
  <el-dialog title="短信接收" :visible.sync="SMSNotificationName" class="el_tabel_bcv" width="70%">
    <el-card class="box-card">
      <Sms-Notification ref="SMSNotificationRoleClao" v-if="SMSNotificationName == true" @SMSNotificationBox="SMSNotificationBox"></Sms-Notification>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SMSNotificationName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SMSNotificationSubmit()" v-if="Jurisdiction('messNotice:manage:update')">确 定</el-button>
    </div>
  </el-dialog>
  <!--场所新增界面-->
  <el-dialog title="新增场所" :visible.sync="addselectPlaceInfoName" @close='addPlaceDialog' width="70%" top="3vh">
    <el-form :model="addselectPlaceInfoList" :rules="rules" ref="addselectPlaceInfoList" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="分组名称：" prop="classifyId">
            <el-select v-model="addselectPlaceInfoList.classifyId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in ClassificationOfPlacesList" :key="item.classifyId" :label="item.classifyName" :value="item.classifyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场所名称：" prop="placeName">
            <el-input v-model="addselectPlaceInfoList.placeName" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 省市区三级联动 -->
          <!-- <Provincial-Urban-Area v-if="addselectPlaceInfoName"></Provincial-Urban-Area> -->
          <el-form-item label="经度：" prop="longitude" class="grid-content bg-purple">
            <el-input v-model="addselectPlaceInfoList.longitude" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="纬度：" prop="latitude" class="grid-content bg-purple">
            <el-input v-model="addselectPlaceInfoList.latitude" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <!-- 百度地图搜索插件 -->
          <Baidu-Map :type="1" @increment="addIncrement" v-if="addselectPlaceInfoName"></Baidu-Map>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addselectPlaceInfoName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addselectPlaceInfoSubmit('addselectPlaceInfoList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--场所编辑界面-->
  <el-dialog title="编辑场所" :visible.sync="editselectPlaceInfoName" @close='editPlaceDialog' width="70%" top="3vh">
    <el-form :model="editselectPlaceInfoList" :rules="rules" ref="editselectPlaceInfoList" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="分组名称：" prop="classifyId">
            <el-select v-model="editselectPlaceInfoList.classifyId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in ClassificationOfPlacesList" :key="item.classifyId" :label="item.classifyName" :value="item.classifyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场所名称：" prop="placeName">
            <el-input v-model="editselectPlaceInfoList.placeName" auto-complete="off"></el-input>
          </el-form-item>
          <!-- 省市区三级联动 -->
          <!-- <Provincial-Urban-Area v-if="editselectPlaceInfoName"></Provincial-Urban-Area> -->
          <el-form-item label="经度：" prop="longitude" class="grid-content bg-purple">
            <el-input v-model="editselectPlaceInfoList.longitude" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="纬度：" prop="latitude" class="grid-content bg-purple">
            <el-input v-model="editselectPlaceInfoList.latitude" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <!-- 百度地图搜索插件 -->
          <Baidu-Map :type="1" @increment="editIncrement" v-if="editselectPlaceInfoName"></Baidu-Map>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editselectPlaceInfoName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editselectPlaceInfoSubmit('editselectPlaceInfoList')">确 定</el-button>
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
import BaiduMap from './ProprietorManagement/baiduMap.vue'
import ProvincialUrbanArea from './ProprietorManagement/ProvincialUrbanArea.vue'
import SmsNotification from './ProprietorManagement/SMSNotification.vue'

export default {
  name: 'ProprietorManagement', //业主管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //业主信息
      //设备型号列表渲染
      formInline: {
        ownerName: null
      },
      pageSize: 10,
      pageNo: 1,
      total: 0,
      SysOwnerList: [],
      //新增业主
      addSysOwnerName: false,
      addSysOwnerList: {},
      //编辑业主
      editSysOwnerName: false,
      editSysOwnerList: {},
      //附属账号联系人
      ISaddSubsidiaryAccount: true,
      MessageownerId: null,
      SubsidiaryAccountName: false,
      SubsidiaryAccountList: [],
      //新增附属账号
      addSubsidiaryAccountName: false,
      addONReceiverByOwnerIdList: {},
      //编辑附属账号
      editSubsidiaryAccountName: false,
      editSubsidiaryAccountList: {},
      //短信接收
      SMSNotificationName: false,
      //查询行业属性
      businessNatureList: [{
        "id": 1,
        "name": "国企单位"
      }, {
        "id": 2,
        "name": "事业单位"
      }, {
        "id": 3,
        "name": "私营企业"
      }],
      //查询上级用户
      pOwnerIdList: {},
      //场所信息列表
      selectPlaceInfoName: false,
      PlaceownerId: null,
      selectPlaceInfoList: [],
      //场所新增
      addselectPlaceInfoName: false,
      addselectPlaceInfoList: {
        longitude: '',
        latitude: ''
      },
      //场所新增
      editselectPlaceInfoName: false,
      editselectPlaceInfoList: {
        longitude: '',
        latitude: ''
      },
      ClassificationOfPlacesList: {}, //所有场所分类

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
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
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
          },
          {
            min: 1,
            max: 150,
            message: '长度在 1 到 150 个字符',
            trigger: 'blur'
          }
        ],
        address: [{
          required: true,
          message: '请输入业主地址',
          trigger: 'blur'
        }, {
          min: 1,
          max: 150,
          message: '长度在 1 到 150 个字符',
          trigger: 'blur'
        }],
        placeName: [{
            required: true,
            message: '请输入场所名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        longitude: [{
          required: true,
          message: '请输入经度',
          trigger: 'blur'
        }],
        latitude: [{
          required: true,
          message: '请输入纬度',
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
  components: {
    BaiduMap,
    ProvincialUrbanArea,
    SmsNotification
  },
  computed: {
    ...mapState(['provinceId', 'cityId', 'areaId'])
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    ...mapMutations(['set_choseProvince', 'set_choseCity', 'set_choseBlock', 'set_SMSownerId', 'set_longitude', 'set_latitude']),
    //查询
    onSubmit: function() {
      this.pageNo = 1;
      this.pageSize = 10;
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
      let parameter = {
        ownerName: this.formInline.ownerName,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectOwners', {
        parameter: parameter
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.SysOwnerList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //添加业主弹窗
    addmodelNamebox: function() {
      this.addSysOwnerName = true;
      this.getpOwnerIdList();
    },
    //添加业主数据提交
    addSubmit: function(addSysOwnerList) {
      console.log(this.addSysOwnerList);
      // console.log(this.roleId);
      this.$refs[addSysOwnerList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addOwner', {
            addSysOwnerList: this.addSysOwnerList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.$message({
                message: '业主添加成功',
                type: 'success'
              });
              _this.getUsers();
              _this.addSysOwnerName = false;
              _this.$refs[addSysOwnerList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //添加业主弹框关闭
    addcloseDialog: function() {
      this.$refs.addSysOwnerList.resetFields();
    },
    //编辑业主信息
    handleEdit: function(index, row) {
      var _this = this;
      axios.post('/selectOwnerById', {
        ownerId: row.ownerId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editSysOwnerList = Object.assign({}, data);
        } else {
          _this.$message.error(result.data.message);
        }
      })
      this.editSysOwnerName = true;
      this.getpOwnerIdList();
    },
    //编辑业主数据提交
    editSubmit: function(editSysOwnerList) {
      this.$refs[editSysOwnerList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateOwner', {
            editSysOwnerList: this.editSysOwnerList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.editSysOwnerName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editSysOwnerList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //编辑业主弹框关闭
    editcloseDialog: function() {
      this.$refs.editSysOwnerList.resetFields();
    },
    //删除业主
    deleteSubmit: function(index, row) {
      if (row.deviceCnt > 0) {
        this.$message.error("该业主下场所有设备，不能删除");
      } else {
        this.$confirm('是否删除业主', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          var _this = this;
          axios.post('/delOwnerById', {
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
              _this.$message.error(result.data.message);
            }
          })
        }).catch(() => {

        });
      }

    },
    //获取上级业主
    getpOwnerIdList: function() {
      var _this = this;
      axios.post('/selectAllOwners').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.pOwnerIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //根据业主ID查询附属账号列表
    SubsidiaryAccount: function(index, row) {
      if (row) {
        this.MessageownerId = row.ownerId;
      }
      var _this = this;
      axios.post('/findONReceiversByOwnerId', {
        ownerId: this.MessageownerId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.SubsidiaryAccountList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
      this.SubsidiaryAccountName = true;
    },
    //新增附属账号数据提交
    addSubsidiaryAccountSubmit: function(addONReceiverByOwnerIdList) {
      this.$refs[addONReceiverByOwnerIdList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addONReceiverByOwnerId', {
            addONReceiverByOwnerIdList: this.addONReceiverByOwnerIdList,
            ownerId: this.MessageownerId
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.SubsidiaryAccount();
              _this.addSubsidiaryAccountName = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[addONReceiverByOwnerIdList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //新增附属账号弹框关闭
    addSubsidiaryAccountDialog: function() {
      this.$refs.addONReceiverByOwnerIdList.resetFields();
    },
    //编辑附属账号弹框
    editSubsidiaryAccount: function(index, row) {
      var _this = this;
      axios.post('/selectONReceiverById', {
        onReceiverId: row.id,
        ownerId: row.ownerId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editSubsidiaryAccountList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      });
      this.editSubsidiaryAccountName = true;
    },
    //编辑附属账号数据提交
    editSubsidiaryAccountSubmit: function(editSubsidiaryAccountList) {
      this.$refs[editSubsidiaryAccountList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateONReceiver', {
            editSubsidiaryAccountList: this.editSubsidiaryAccountList,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.SubsidiaryAccount();
              _this.editSubsidiaryAccountName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editSubsidiaryAccountList].resetFields();
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
    deleteSubsidiaryAccount: function(index, row) {
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
            _this.SubsidiaryAccount();
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
    //根据业主ID查询短信接收列表
    SMSNotification: function(index, row) {
      var SMSownerId = row.ownerId;
      this.set_SMSownerId(SMSownerId);
      this.SMSNotificationName = true;
    },
    //短信接收数据提交
    SMSNotificationSubmit: function() {
      this.$refs.SMSNotificationRoleClao.SMSNotificationSubmission();
    },
    SMSNotificationBox: function() {
      this.SMSNotificationName = false;
    },
    //场所列表信息获取
    selectPlaceInfoBox: function(index, row) {
      if (row) {
        this.PlaceownerId = row.ownerId;
      }
      this.selectPlaceInfoName = true;
      var _this = this;
      axios.post('/selectPlaceInfoByOwnerId', {
        ownerId: this.PlaceownerId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectPlaceInfoList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增场所列表弹框
    addselectPlaceInfobox: function() {
      this.addselectPlaceInfoName = true;
      this.selectPlaceClassifies();
    },
    //新增场所数据提交
    addselectPlaceInfoSubmit: function(addselectPlaceInfoList) {
      this.$refs[addselectPlaceInfoList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addPlace', {
            addselectPlaceInfoList: this.addselectPlaceInfoList,
            provinceId: this.provinceId,
            cityId: this.cityId,
            areaId: this.areaId,
            ownerId: this.PlaceownerId,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.selectPlaceInfoBox();
              _this.addselectPlaceInfoName = false;
              _this.$message({
                message: '场所添加成功',
                type: 'success'
              });
              _this.$refs[addselectPlaceInfoList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //新增场所 激活地图组件 处理函数
    addIncrement: function(lng, lat) {
      this.addselectPlaceInfoList.longitude = lng;
      this.addselectPlaceInfoList.latitude = lat;
    },
    //新增场所弹框关闭
    addPlaceDialog: function() {
      this.$refs.addselectPlaceInfoList.resetFields();
      this.set_choseProvince(null);
      this.set_choseCity(null);
      this.set_choseBlock(null);
    },
    //修改场所列表弹框
    editselectPlaceInfobox: function(index, row) {
      var _this = this;
      axios.post('/selectPlaceById', {
        placeId: row.placeId
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editselectPlaceInfoList = data;
          _this.editselectPlaceInfoList.longitude = data.longitude;
          _this.set_longitude(data.longitude);
          _this.editselectPlaceInfoList.latitude = data.latitude;
          _this.set_latitude(data.latitude);
          _this.set_choseProvince(data.provinceId);
          _this.set_choseCity(data.cityId);
          _this.set_choseBlock(data.areaId);
          _this.editselectPlaceInfoName = true;
          _this.selectPlaceClassifies();
        } else {
          _this.$message.error(result.data.message);
        }
      });

    },
    //修改场所数据提交
    editselectPlaceInfoSubmit: function(editselectPlaceInfoList) {
      this.$refs[editselectPlaceInfoList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/upatePlace', {
            editselectPlaceInfoList: this.editselectPlaceInfoList,
            provinceId: this.provinceId,
            cityId: this.cityId,
            areaId: this.areaId,
            ownerId: this.PlaceownerId,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.selectPlaceInfoBox();
              _this.editselectPlaceInfoName = false;
              _this.$message({
                message: '场所修改成功',
                type: 'success'
              });
              _this.$refs[editselectPlaceInfoList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //修改场所弹框关闭
    editPlaceDialog: function() {
      this.$refs.editselectPlaceInfoList.resetFields();
      this.set_longitude(null);
      this.set_latitude(null);
      this.set_choseProvince(null);
      this.set_choseCity(null);
      this.set_choseBlock(null);
    },
    //修改场所 激活地图组件 处理函数
    editIncrement: function(lng, lat) {
      this.editselectPlaceInfoList.longitude = lng;
      this.editselectPlaceInfoList.latitude = lat;
    },
    //删除场所
    deleteselectPlaceInfo: function(index, row) {
      this.$confirm('是否删除该场所', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delPlaceById', {
          placeId: row.placeId
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.selectPlaceInfoBox();
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
    //查询所有场所分类
    selectPlaceClassifies: function() {
      var _this = this;
      axios.post('/selectBottonClassifies').then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.ClassificationOfPlacesList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //建筑
    BuildingBuilding: function(index, row) {
      var placeId = row.placeId;
      console.log(placeId);
      this.$router.push({
        path: '/management/BuildingBuilding',
        query: {
          placeId: placeId
        }
      })
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
    formatSexbusinessNature: function(row, column) {
      return row.businessNature == 1 ? '国企单位' : row.businessNature == 2 ? '事业单位' : row.businessNature == 3 ? '私营企业' : '未知';
    },
  },
  watch: {
    SubsidiaryAccountList: function(val) {
      if (val.length >= 5) {
        this.ISaddSubsidiaryAccount = false;
      } else {
        this.ISaddSubsidiaryAccount = true;
      }
    },
  }
}
</script>
<style media="screen">

</style>
