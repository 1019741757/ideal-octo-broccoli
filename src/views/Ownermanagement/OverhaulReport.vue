<template>
<div>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="" style="padding: 0 19px">
            <el-button type="primary" size="medium" @click="addApplySubmit">申请</el-button>
          </div>
          <div class="ibox-content" style="border:none">
            <el-card class="box-card">
              <el-table :data="selectCheckingApplysOwnerList" style="width: 100%">
                <el-table-column type="index" width="60" label="排序"></el-table-column>
                <el-table-column property="placeName" label="申请场所"></el-table-column>
                <el-table-column property="createdDate" label="申请时间" :formatter="dateFormat"></el-table-column>
                <el-table-column property="handleCont" label="内容"></el-table-column>
                <el-table-column property="status" label="状态" :formatter="formatSex"></el-table-column>
                <el-table-column label="操作" width="150">
                  <template scope="scope">
                  <el-button size="small" @click="Record(scope.$index, scope.row)">记录</el-button>
                  <el-button size="small" v-if="scope.row.status == 0" @click="cancel(scope.$index, scope.row)">取消</el-button>
               </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="end" style="padding:20px 0; ">
                <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-row>
            </el-card>
          </div>
          <!--排查记录-->
          <div class="" v-show="checkingApplyVoName">
            <div class="ibox-content" style="border:none">
              <el-card class="box-card">
                <el-table :data="checkingApplyVoList" style="width: 100%">
                  <el-table-column type="index" width="60" label="排序"></el-table-column>
                  <el-table-column property="content" label="记录类容"></el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--申请-->
  <el-dialog title="申请" :visible.sync="ApplyName">
    <el-form :model="ApplyList" :rules="rules" ref="ApplyList" label-width="120px" class="demo-ruleForm">
      <el-form-item label="场所名称：" prop="OverplaceId">
        <el-select v-model="ApplyList.OverplaceId" placeholder="请选择">
          <el-option v-for="item in OwnerPlaceVosList" :key="item.placeId" :label="item.placeName" :value="item.placeId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="ApplyName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="ApplySubmit('ApplyList')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OverhaulReport', //排查申请
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      //排查申请列表渲染
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectCheckingApplysOwnerList: [],
      //处理记录列表
      checkingApplyId: null,
      checkingApplyVoName: false,
      checkingApplyVoList: [],
      //申请
      ApplyName: false,
      ApplyList: {},
      OwnerPlaceVosList: {},
      rules: {
        OverplaceId: [{
          required: true,
          message: '请选择场所',
          trigger: 'change'
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
    getUsers: function() {
      let parameterList = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectCheckingApplys4CurrentOwner', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectCheckingApplysOwnerList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //申请
    addApplySubmit: function() {
      var _this = this;
      axios.post('/selectPlaceVos4CurrentOwner').then(function(result) {
        console.log(result.data.data);
        if (result.data.success == true) {
          var data = result.data.data;
          _this.OwnerPlaceVosList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
      this.ApplyName = true;
    },
    //申请提交
    ApplySubmit: function(ApplyList) {
      var placeId = this.ApplyList.OverplaceId;
      var OwnerPlaceVosList=this.OwnerPlaceVosList
      var placeName;
      for (var i = 0; i < OwnerPlaceVosList.length; i++) {
        if (OwnerPlaceVosList[i].placeId == placeId) {
          placeName = OwnerPlaceVosList[i].placeName;
        }
      };
      this.$refs[ApplyList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/applyChecking', {
            placeName: placeName,
            placeId: placeId,
          }).then(function(result) {
            if (result.data.success == true) {
              _this.getUsers();
              _this.ApplyName = false;
              _this.$message({
                message: '申请成功',
                type: 'success'
              });
              _this.$refs[ApplyList].resetFields();
            } else {
              _this.$message.error(result.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
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
    //取消
    cancel: function(index, row) {
      this.$confirm('确定取消该申请吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var _this = this;
        axios.post('/cancelCheckingApply', {
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
  }
}
</script>
<style media="screen">

</style>
