<template>
<div class="" v-if="Jurisdiction('noticeMode')">
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
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('noticeMode:look')">
              <el-card class="box-card">
                <el-table :data="selectSmsList" style="width: 100%">
                  <el-table-column type="index" label="排序" width="60"></el-table-column>
                  <el-table-column property="platfrom" label="发送平台"></el-table-column>
                  <el-table-column property="phone" label="发送号码"></el-table-column>
                  <el-table-column property="content" label="短信内容" width="500px" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column property="sendState" label="发送状态" :formatter="Stateformat"></el-table-column>
                  <el-table-column property="sendDate" label="发送时间" :formatter="dateFormat"></el-table-column>
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
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SMSNotification', //短信信息
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      formInline: {},
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectSmsList: [],
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
      var parameterList = {
        phone: this.formInline.phone||null,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectSmsList', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.selectSmsList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
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
    //发送状态过滤
    Stateformat: function(row, column) {
      return row.sendState == 0 ? '待发送 ' : row.sendState == 1 ? '发送到平台 ' : row.sendState == 2 ? '平台发送到用户 ' : '错误';
    },

  }
}
</script>
<style media="screen">

</style>
