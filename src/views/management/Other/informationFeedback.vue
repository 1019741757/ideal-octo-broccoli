<template>
<div class="" v-if="Jurisdiction('message')">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px">
              <el-form-item label="手机号码：">
                <el-input v-model="formInline.phone" placeholder="请输入手机号码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button type="primary" size="medium" @click.native="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('message:look')">
              <el-card class="box-card">
                <el-table :data="selectMessageFeedbacksList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60">
                  </el-table-column>
                  <el-table-column property="messCont" label="反馈内容"></el-table-column>
                  <el-table-column property="phone" label="手机号码"></el-table-column>
                  <el-table-column property="status" label="处理状态" :formatter="formatSex"></el-table-column>
                  <el-table-column property="handleName" label="处理人"></el-table-column>
                  <el-table-column property="handleCont" label="处理内容"></el-table-column>
                  <el-table-column property="createdDate" label="创建时间" :formatter="dateFormat"></el-table-column>
                  <el-table-column label="操作" width="150">
                    <template scope="scope">
                <el-button type="danger" size="small" v-if="scope.row.status == 0 && Jurisdiction('message:manage:handle')" @click="HandleSubmit(scope.$index, scope.row)">处理</el-button>
              </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" style="padding:20px 0; ">
                  <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-row>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--处理-->
  <el-dialog title="处理" :visible.sync="handleMessageFeedbackName">
    <el-form :model="handleMessageFeedbackList" :rules="rules" ref="handleMessageFeedbackList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="处理人：" prop="handleName">
        <el-input v-model="handleMessageFeedbackList.handleName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="处理内容：" prop="handleCont">
        <el-input type="textarea" v-model="handleMessageFeedbackList.handleCont" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleMessageFeedbackName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="handleMessageFeedbackSubmit('handleMessageFeedbackList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'informationFeedback', //业主管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      formInline: {
        phone: null
      },
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectMessageFeedbacksList: [],
      //处理
      id: null,
      handleMessageFeedbackName: false,
      handleMessageFeedbackList: {
        messageFeedbackId: null,
      },
      rules: {
        handleName: [{
            required: true,
            message: '请输入处理人',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        handleCont: [{
            required: true,
            message: '请输入处理内容',
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
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
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
        phone: this.formInline.phone,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectMessageFeedbacks', {
        parameter: parameter
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectMessageFeedbacksList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //处理
    HandleSubmit: function(index, row) {
      this.handleMessageFeedbackList.messageFeedbackId = row.id;
      this.handleMessageFeedbackName = true;
    },
    //处理信息反馈
    handleMessageFeedbackSubmit: function(handleMessageFeedbackList) {
      this.$refs[handleMessageFeedbackList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/handleMessageFeedback', {
            handleMessageFeedbackList: this.handleMessageFeedbackList
          }).then(function(result) {
            console.log(result);
            if (result.data.success == true) {
              _this.getUsers();
              _this.handleMessageFeedbackName = false;
              _this.$message({
                message: '处理成功',
                type: 'success'
              });
              _this.$refs[handleMessageFeedbackList].resetFields();
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
      return row.status == 1 ? '已处理' : row.status == 0 ? '未处理' : '未知';
    },

  }
}
</script>
<style media="screen">

</style>
