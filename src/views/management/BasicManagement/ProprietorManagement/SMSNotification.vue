<template>
<div class="">
  <div class="wrapper animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox float-e-margins" style="margin-bottom:0">
          <el-table ref="SMSNotificationTable" :data="SMSNotificationList" tooltip-effect="dark" style="width: 100%" @selection-change="SMSNotificationChange">
            <el-table-column prop="name" label="昵称"></el-table-column>
            <el-table-column type="selection" width="55"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Vuex from 'Vuex'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'SMSNotification',
  data() {
    return {
      SMSNotificationList: [],
      SMSNotificationChangeList: [],
    }
  },
  computed: {
    ...mapState(['SMSownerId'])
  },
  created() {
    var _this = this;
    $.ajax({
      url: '/noticeModelList4User',
      type: 'POST', //GET
      async: false, //或false,是否异步
      data: {
        ownerId: this.SMSownerId
      },
      dataType: 'json', //返回的数据格式：
      success: function(result) {
        var data = result.data;
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
      this.SMSNotificationChangeList = val;
    },
    //短信通知数据提交
    SMSNotificationSubmission: function() {
      var SMSNotificationList=this.SMSNotificationList;
      var SMSlist=this.SMSNotificationChangeList;
      var noticeModelList=new Array();
      for (var i = 0; i < SMSNotificationList.length; i++) {
        SMSNotificationList[i].noticeModel=0
        for (var a = 0; a < SMSlist.length; a++) {
          if (SMSNotificationList[i].id == SMSlist[a].id) {
            SMSNotificationList[i].noticeModel=1
          }
        }
      }
      var _this = this;
      axios.post('/batchUpdateNoticeModel', {
        noticeModelList: SMSNotificationList
      }).then(function(result) {
        if (result.data.success == true) {
          _this.$emit('SMSNotificationBox');
          _this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
  }
};
</script>
