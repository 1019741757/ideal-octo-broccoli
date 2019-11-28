<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding: 0 19px">
              <el-form-item label="流量卡：">
                <el-input v-model="formInline.phone" placeholder="请输入流量卡" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              </el-form-item>
              <el-form-item class="pull-right">
                <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="" style="padding: 0 19px" v-if="Jurisdiction('dtu:manage')">
              <el-button type="primary" size="medium" icon='document' @click="ImportToExcel()" v-if="Jurisdiction('dtu:manage:import')">导入</el-button>
              <el-button type="primary" size="medium" icon='document' @click="exportToExcel()" v-if="Jurisdiction('dtu:manage:export')">导出</el-button>
              <el-button type="primary" size="medium" icon='document' @click="Allinquiries()" v-if="Jurisdiction('dtu:manage:lookAll')">全部查询</el-button>
              <el-button type="primary" size="medium" icon='document' @click="deleteBox()" v-if="Jurisdiction('dtu:manage:delAll')">删除</el-button>
            </div>
            <div class="ibox-content" style="border:none" v-if="Jurisdiction('dtu:look')">
              <el-card class="box-card">
                <el-table :data="dtuVoList" ref="dtuVoTable" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column property="dtuId" label="DTU"></el-table-column>
                  <el-table-column property="phone" label="流量卡"></el-table-column>
                  <el-table-column property="residuFlow" label="剩余流量"></el-table-column>
                  <el-table-column property="queryTime" label="查询时间" :formatter="dateFormat"></el-table-column>
                  <el-table-column label="操作" width="150">
                    <template scope="scope">
                  <el-button type="success" size="small" @click="deleSee(scope.$index, scope.row)" v-if="Jurisdiction('dtu:manage:lookFlow')">查看</el-button>
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
  <!-- 导入 -->
  <el-dialog title="导入" :visible.sync="dialogImportVisible" class="dialog-import">
    <div>
      <el-upload class="upload-demo" ref="upload" :auto-upload="false" :action="importUrl" :name="name" :limit="limit" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeUpload" :on-error="uploadFail" :on-success="uploadSuccess" :file-list="fileList"
        :with-credentials="withCredentials">
        <!-- 是否支持发送cookie信息 -->
        <el-button size="small" type="primary" :disabled="processing">{{uploadTip}}</el-button>
        <div slot="tip" class="el-upload__tip">(只能上传excel文件)</div>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogImportVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="ImportToExcelSubmit()">确 定</el-button>
    </div>

  </el-dialog>




</div>
</template>

<script>
import axios from 'axios'
var {
  export_json_to_excel
} = require('../../../api/vendor/Export2Excel');

export default {
  name: 'deviceManagement', //设备管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      //设备查询参数
      formInline: {},
      pageSize: 10,
      pageNo: 1,
      total: 0,
      dtuVoList: [],
      //删除
      multipleSelection: [],
      //导入
      ImportToExcelName: false,
      multipleSelection: [],
      importUrl: '/importDtuResiduFlow', //后台接口config.admin_url+'rest/schedule/import/'
      name: 'import',
      fileList: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      limit: 1,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  created() {
    this.getUsers();
  },
  mounted() {},
  methods: {
    //计划类型里面的值修改的时候
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
        phone: this.formInline.phone || null,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
      var _this = this;
      axios.post('/selectDtuInfos', {
        parameterList: parameterList
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var data = result.data.rows;
          _this.dtuVoList = data;
          _this.total = result.data.total
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //全部查询
    Allinquiries: function() {
      this.formInline.phone = null;
      this.getUsers();
    },
    //删除
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteBox: function() {
      var dtuIdList = [];
      this.multipleSelection.forEach(row => {
        dtuIdList.push(row.dtuId)
      });
      console.log(dtuIdList);
      if (dtuIdList.length>0) {
        var _this = this;
        axios.post('/batchDelByDtuIds', {
          dtuIds: dtuIdList
        }).then(function(result) {
          console.log(result);
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
      }else {
        this.$message.error("请先选择要删除的DTU信息");
      }

    },

    //导出
    exportToExcel: function() {
      var _this = this;
      axios.post('/exportDtuResiduFlow', {
        phone: this.formInline.phone || null
      }).then(function(result) {
        console.log(result);
        if (result.data.success == true) {
          var Exceldata = result.data.data;
          require.ensure([], () => {
            const tHeader = ['DTU', '流量卡', '剩余流量', '查询时间'];
            const filterVal = ['dtuId', 'phone', 'residuFlow', 'queryTimeStr'];
            const list = Exceldata;
            const data = _this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, 'SIM_excel');
          })
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    //导出引入方法
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //导入
    ImportToExcel: function() {
      this.dialogImportVisible = true;
      // this.$refs.upload.clearFiles();
    },
    //文件移除
    handleRemove(file, fileList) {

    },
    handlePreview(file) {
      //可以通过 file.response 拿到服务端返回数据
    },
    //上传前配置
    beforeUpload(file) {
      // this.importHeaders.cityCode='上海'//可以配置请求头
      let excelfileExtend = ".xls,.xlsx" //设置文件格式
      let fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error('文件格式错误')
        return false
      }
      this.uploadTip = '正在处理中...'
      this.processing = true
    },
    //上传
    ImportToExcelSubmit: function() {
      this.$refs.upload.submit();
    },
    //上传成功
    uploadSuccess(response, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      if (response.success === false) {
        this.errorResults = response.data
        if (this.errorResults) {
          this.importFlag = 2
        } else {
          this.dialogImportVisible = false
          this.$message.error(response.message)
        }
      } else {
        this.importFlag = 3
        this.dialogImportVisible = false
        this.$message.info('导入成功')
        this.getUsers();
        // this.doSearch()
      }
    },
    //上传错误
    uploadFail(err, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.$message.error(err)
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  }
}
</script>
<style media="screen">

</style>
