<template>
<div class="" v-if="Jurisdiction('checkingApply:look')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px">
              <el-form-item label="申请状态：">
                <el-select v-model="formInline.status" placeholder="请选择" clearable @change="onSubmit">
                  <el-option v-for="item in planTypeList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              &nbsp;&nbsp;&nbsp;
              <el-form-item label="手机号码：">
                <el-input v-model="formInline.ownerPhone" placeholder="手机号码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('checkingApply:look')">
              <el-card class="box-card">
                <el-table :data="selectCheckingApplysList" style="width: 100%">
                  <el-table-column type="index" width="60" label="排序"></el-table-column>
                  <el-table-column property="ownerName" label="业主名称"></el-table-column>
                  <el-table-column property="ownerPhone" label="手机号码"></el-table-column>
                  <el-table-column property="placeName" label="检修场所"></el-table-column>
                  <el-table-column property="createdDate" label="申请时间" :formatter="dateFormat"></el-table-column>
                  <el-table-column property="status" label="状态" :formatter="formatSex"></el-table-column>
                  <el-table-column property="handleCont" label="内容" :formatter="formatCont"></el-table-column>
                  <el-table-column label="操作" width="350" v-if="Jurisdiction('checkingApply:manage')">
                    <template scope="scope">
                   <el-button size="small" v-if="Jurisdiction('checkingApply:manage:record')" @click="Record(scope.$index, scope.row)">记录</el-button>
                   <el-button size="small" v-if="scope.row.status == 1 && Jurisdiction('checkingApply:manage:finish')" @click="complete(scope.$index, scope.row)">完成</el-button>
                   <el-button size="small" v-if="scope.row.status == 0 || scope.row.status == 1 && Jurisdiction('checkingApply:manage:refuse') " @click="cancel(scope.$index, scope.row)">取消</el-button>
                   <el-button size="small" v-if="scope.row.status == 0 && Jurisdiction('checkingApply:manage:receive')" @click="accept(scope.$index, scope.row)">接受</el-button>
                   <el-button size="small" v-if="scope.row.status == 0 && Jurisdiction('checkingApply:manage:refuse')" @click="refuse(scope.$index, scope.row)">拒绝</el-button>
                </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" style="padding:20px 0; ">
                  <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-row>
              </el-card>
            </div>
            <!--排查记录-->
            <div class="" v-show="checkingApplyVoName">
              <div class="" style="padding: 0 19px">
                <el-button type="primary" size="medium" @click="addrefuseName=true">新增</el-button>
              </div>
              <div class="ibox-content" style="border:none">
                <el-card class="box-card">
                  <el-table :data="checkingApplyVoList" style="width: 100%">
                    <el-table-column type="index" width="60" label="排序"></el-table-column>
                    <el-table-column property="content" label="记录内容"></el-table-column>
                    <el-table-column label="操作" width="150">
                      <template scope="scope">
                        <el-button size="small" @click="editcheckingApplyVo(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="delecheckingApplyVo(scope.$index, scope.row)">删除</el-button>
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

  <!--拒绝-->
  <el-dialog title="拒绝" :visible.sync="refuseName">
    <el-form :model="refuseList" :rules="rules" ref="refuseList" label-position="left" label-width="100px" class="demo-ruleForm">
      <el-form-item label="拒绝内容:" prop="Refusing">
        <el-input type="textarea" v-model="refuseList.Refusing" auto-complete="off" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="refuseName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="refuseSubmit('refuseList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--取消-->
  <el-dialog title="取消" :visible.sync="cancelName">
    <el-form :model="cancelList" :rules="rules" ref="cancelList" label-width="80px" class="demo-ruleForm">
      <el-form-item label="取消内容:" prop="handleCont">
        <el-input type="textarea" v-model="cancelList.handleCont" auto-complete="off" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancelName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="cancelSubmit('cancelList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--新增记录-->
  <el-dialog title="新增记录" :visible.sync="addrefuseName">
    <el-form :model="addrefuseList" :rules="rules" ref="addrefuseList" label-width="80px" class="demo-ruleForm">
      <el-form-item label="记录内容:" prop="content">
        <el-input type="textarea" v-model="addrefuseList.content" auto-complete="off" :autosize="{ minRows: 6, maxRows: 6}" style="min-height:200px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addrefuseName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addrefuseSubmit('addrefuseList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑记录-->
  <el-dialog title="编辑记录" :visible.sync="editrefuseName">
    <el-form :model="editrefuseList" :rules="rules" ref="editrefuseList" label-width="80px" class="demo-ruleForm">
      <el-form-item label="记录内容:" prop="content">
        <el-input type="textarea" v-model="editrefuseList.content" auto-complete="off" :autosize="{ minRows: 6, maxRows: 6}" style="min-height:200px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editrefuseName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="editrefuseSubmit('editrefuseList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProprietorManagement', //业主管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //排查申请列表渲染
      formInline: {
        ownerPhone: null,
        status: null
      },
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectCheckingApplysList: [],
      //拒绝
      refuseName: false,
      refuseList: {
        id: null,
      },
      //取消
      cancelName: false,
      cancelList: {
        id: null,
      },
      //处理记录列表
      checkingApplyId: null,
      checkingApplyVoName: false,
      checkingApplyVoList: [],
      //新增处理记录列表
      addrefuseName: false,
      addrefuseList: {},
      //编辑处理记录列表
      editrefuseName: false,
      editrefuseList: {},
      //申请状态
      planTypeList: [{
          value: '0',
          name: '未处理'
        }, {
          value: '1',
          name: '已接受'
        },
        {
          value: '2',
          name: '已完成'
        },
        {
          value: '3',
          name: '已拒绝'
        },
        {
          value: '4',
          name: '已取消'
        }
      ],
      rules: {
        Refusing: [{
            required: true,
            message: '请输入拒绝内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        handleCont: [{
            required: false,
            message: '请输入处理内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        content: [{
            required: false,
            message: '请输入记录内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
      },
    }
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    //计划类型里面的值修改的时候
    changeplanType: function() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getUsers();
    },
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
      let parameterList = {
        ownerPhone: this.formInline.ownerPhone,
        status: this.formInline.status,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectCheckingApplys', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectCheckingApplysList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //记录
    Record: function(index, row) {
      if (row) {
        this.checkingApplyId = row.id;
      }
      var _this = this;
      axios.post('/selectCheckingApplysRecordByOwnerId', {
        checkingApplyId: this.checkingApplyId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.checkingApplyVoList = data;
          _this.checkingApplyVoName = true;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //新增处理记录
    addrefuseSubmit: function(addrefuseList) {
      this.$refs[addrefuseList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/addCheckingApplyRecord', {
            content: this.addrefuseList.content,
            checkingApplyId: this.checkingApplyId,
          }).then(function(result) {
            if (result.data.success == true) {
              _this.Record();
              _this.getUsers();
              _this.addrefuseName = false;
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.$refs[addrefuseList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //编辑处理记录
    editcheckingApplyVo: function(index, row) {
      var _this = this;
      axios.post('/selectCheckingApplyRecordById', {
        id: row.id
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.editrefuseList = data;
          _this.editrefuseName = true;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //编辑处理记录
    editrefuseSubmit: function(editrefuseList) {
      this.$refs[editrefuseList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/updateCheckingApplyRecord', {
            content: this.editrefuseList.content,
            id: this.editrefuseList.id,
          }).then(function(result) {
            if (result.data.success == true) {
              _this.Record();
              _this.getUsers();
              _this.editrefuseName = false;
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.$refs[editrefuseList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //删除处理记录
    delecheckingApplyVo: function(index, row) {
      this.$confirm('确定删除该记录吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/delCheckingApplyRecord', {
          id: row.id,
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.Record();
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
    },
    //完成
    complete: function(index, row) {
      this.$confirm('确定已完成申请吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/handleCheckingApply', {
          handleCont: null,
          status: 2,
          checkingApplyId: row.id,
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '处理成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //取消
    cancel: function(index, row) {
      this.cancelName = true;
      this.cancelList.id = row.id;
    },
    //取消提交
    cancelSubmit: function(cancelList) {
      this.$refs[cancelList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/handleCheckingApply', {
            handleCont: this.cancelList.handleCont,
            status: 4,
            checkingApplyId: this.cancelList.id,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.cancelName = false;
              _this.$message({
                message: '处理成功',
                type: 'success'
              });
              _this.$refs[cancelList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    //接受
    accept: function(index, row) {
      this.$confirm('确定接受申请吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/handleCheckingApply', {
          handleCont: null,
          status: 1,
          checkingApplyId: row.id,
        }).then(function(result) {
          console.log(result.data);
          if (result.data.success == true) {
            _this.getUsers();
            _this.$message({
              message: '处理成功',
              type: 'success'
            });
          } else {
            _this.$message.error(result.data.message);
          }
        })
      }).catch(() => {

      });
    },
    //拒绝
    refuse: function(index, row) {
      this.refuseName = true;
      this.refuseList.id = row.id;
    },
    //拒绝提交
    refuseSubmit: function(refuseList) {
      this.$refs[refuseList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/handleCheckingApply', {
            handleCont: this.refuseList.Refusing,
            status: 3,
            checkingApplyId: this.refuseList.id,
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.refuseName = false;
              _this.$message({
                message: '处理成功',
                type: 'success'
              });
              _this.$refs[refuseList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
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
      return row.status == 0 ? '未处理' : row.status == 1 ? '已接受' : row.status == 2 ? '已完成' : row.status == 3 ? '已拒绝' : row.status == 4 ? '已取消' : '未知';
    },
    //记录内容
    formatCont: function(row, column) {
      var handleCont = row.handleCont;
      var handleConttext;
      if (handleCont == undefined || handleCont == null) {
        return "";
      } else {
        if (handleCont.length > 10) {
          handleConttext = handleCont.substring(0, 10) + '...';
        }else {
          handleConttext = handleCont.substring(0, 10);
        }
      }
      return handleConttext;
    },
  }
}
</script>
<style media="screen">

</style>
