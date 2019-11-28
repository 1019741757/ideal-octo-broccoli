<template>
<div class="">
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="ibox-content" style="border:none">
            <el-card class="box-card">
              <el-table ref="SMSNotificationTable" :data="SMSNotificationList" tooltip-effect="dark" style="width: 100%" @selection-change="SMSNotificationChange">
                <el-table-column prop="name" label="昵称"></el-table-column>
                <el-table-column type="selection" width="55"></el-table-column>
              </el-table>
            </el-card>
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
  name: 'OwnerSMSNotification', //DTU信息
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      SMSNotificationList: [],
      SMSNotificationChangeList: [],
    }
  },
  created() {
    var _this = this;
    $.ajax({
      url: '/noticeModelList',
      type: 'POST', //GET
      async: false, //或false,是否异步
      data: {},
      dataType: 'json', //返回的数据格式：
      success: function(result) {
        var data = result.data;
        for (var i = 0; i < data.length; i++) {
          data[i].Index=i+1
        }
        _this.SMSNotificationList = Object.assign([], data);
      },
    })
  },
  mounted() {
    this.toggleSelection(this.SMSNotificationList);
  },
  methods: {
    //短信通知全选
    toggleSelection: function(rows) {
      rows.forEach(row => {
        if (row.checked == 1) {
          this.$refs.SMSNotificationTable.toggleRowSelection(row);
        }
      });
    },
    //短信通知选择
    SMSNotificationChange: function(val) {
      var SMSNotificationList=this.SMSNotificationList;
      var SMSlist=val;
      var noticeModelList=new Array();
      for (var i = 0; i < SMSNotificationList.length; i++) {
        SMSNotificationList[i].noticeModel=0
        for (var a = 0; a < SMSlist.length; a++) {
          if (SMSNotificationList[i].Index == SMSlist[a].Index) {
            SMSNotificationList[i].noticeModel=1
          }
        }
      }
      var _this = this;
      axios.post('/batchUpdateNoticeModel', {
        noticeModelList: SMSNotificationList
      }).then(function(result) {
        if (result.data.success == true) {
          // _this.$message({
          //   message: '修改成功',
          //   type: 'success'
          // });
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //短信通知数据提交
    SMSNotificationSubmission: function() {

    },
  }
}
</script>
<style media="screen">

</style>
