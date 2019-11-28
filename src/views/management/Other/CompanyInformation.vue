<template>
<div class="">
  <div class="animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class=" backColor">
          <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
            <div class="timeline_companyln">
              <div class="timeline-item customer_item">
                <div class="row">
                  <div class="col-xs-3 date">
                    <i class="fa fa-briefcase"></i>

                    <!-- <br> -->
                    <!-- <small class="text-navy">总公司</small> -->
                  </div>
                  <div class="col-xs-7 content no-top-border">
                    <h3 class="m-b-xs"><strong>公司名称：</strong></h3>

                    <p>{{CompanyInformationList.agencyName}}</p>

                  </div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="row">
                  <div class="col-xs-3 date">
                    <i class="fa fa-phone"></i>
                  </div>
                  <div class="col-xs-7 content">
                    <h3 class="m-b-xs"><strong>电话：</strong></h3>
                    <p>{{CompanyInformationList.phone}}</p>
                  </div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="row">
                  <div class="col-xs-3 date">
                    <i class="fa fa-coffee"></i>
                  </div>
                  <div class="col-xs-7 content">
                    <h3 class="m-b-xs"><strong>邮箱：</strong></h3>
                    <p>{{CompanyInformationList.email}}</p>
                  </div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="row">
                  <div class="col-xs-3 date">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="col-xs-7 content">
                    <h3 class="m-b-xs"><strong>邮编：</strong></h3>
                    <p>{{CompanyInformationList.postcode}}</p>
                  </div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="row">
                  <div class="col-xs-3 date">
                    <i class="fa fa-map-marker"></i>
                  </div>
                  <div class="col-xs-7 content">
                    <h3 class="m-b-xs"><strong>地址：</strong></h3>
                    <p>
                      {{CompanyInformationList.address}}
                    </p>
                  </div>
                </div>
              </div>
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
  name: 'CompanyInformation', //业主管理
  data() {
    return {
      clientHeight: document.body.clientHeight - 84 + 'px',
      CompanyInformationList: []
    }
  },
  created() {
    var _this = this;
    axios.post('/findCurrentAgency').then(function(result) {
      console.log(result.data.data);
      if (result.data.success == true) {
        var data = result.data.data;
        _this.CompanyInformationList = data;
      } else {
        _this.$message.error(result.data.message);
      }
    })
  },
  mounted() {},
  methods: {

  }
}
</script>
<style media="screen">

</style>
