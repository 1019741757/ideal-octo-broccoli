<template>
<div class="">
  <div class=" wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-lg-12">
        <div class="ibox ibox_baouer float-e-margins" :style="{minHeight:clientHeight}">
          <div class="" >
            <div class="col-lg-6">
              <div class="ibox float-e-margins">
                <div class="ibox-content ibox-heading">
                  <h5>业主信息</h5>
                </div>
                <div class="ibox-content inspinia-timeline">

                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-user"></i>
                      </div>
                      <div class="col-xs-7 content no-top-border">
                        <h3 class="m-b-xs"><strong>名称：</strong></h3>
                        <p>{{selectOwnerByIdList.ownerName}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-phone-square"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>绑定电话：</strong></h3>
                        <p>{{selectOwnerByIdList.ownerPhone}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-reddit"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>上级业主：</strong></h3>
                        <p>{{selectOwnerByIdList.pOwnerName}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-suitcase"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>行业属性：</strong></h3>
                        <p>{{selectOwnerByIdList.businessNature==1?"国企单位":selectOwnerByIdList.businessNature==2?"事业单位":selectOwnerByIdList.businessNature==3?"私营企业":''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-cogs"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>单位：</strong></h3>
                        <p>{{selectOwnerByIdList.company}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-home"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>地址：</strong></h3>
                        <p>{{selectOwnerByIdList.address}}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <div class="col-lg-6" v-if="selectSysUserByIdList != null">
              <div class="ibox float-e-margins">
                <div class="ibox-content ibox-heading">
                  <h5>管理员信息</h5>
                </div>
                <div class="ibox-content inspinia-timeline">
                  <div class="timeline-item customer_item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-briefcase"></i>
                      </div>
                      <div class="col-xs-7 content no-top-border">
                        <h3 class="m-b-xs"><strong>公司名称：</strong></h3>
                        <p>{{selectSysUserByIdList.name}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-phone"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>联系方式：</strong></h3>
                        <p>{{selectSysUserByIdList.landlineNo}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-coffee"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>公司邮箱：</strong></h3>
                        <p>{{selectSysUserByIdList.email}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-envelope"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>公司邮编：</strong></h3>
                        <p>{{selectSysUserByIdList.postcode}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-send"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>传真号码：</strong></h3>
                        <p>{{selectSysUserByIdList.faxNo}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="row">
                      <div class="col-xs-3 date">
                        <i class="fa fa-home"></i>
                      </div>
                      <div class="col-xs-7 content">
                        <h3 class="m-b-xs"><strong>公司地址：</strong></h3>
                        <p>
                          {{selectSysUserByIdList.address}}
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
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DTUInformation', //DTU信息
  data() {
    return {
      clientHeight: document.body.clientHeight - 150 + "px",
      selectOwnerByIdList: [],
      selectSysUserByIdList: [],
    }
  },
  created() {
    this.getOwner();
  },
  mounted() {},
  methods: {
    getOwner: function() {
      var _this = this;
      axios.post('/selectCurrentOwner', {
        placeId: this.placeId
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.getUsers(data.createdBy);
          _this.selectOwnerByIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
    getUsers: function(createdBy) {
      var _this = this;
      axios.post('/selectUserCompanyByUserId', {
        userId: createdBy
      }).then(function(result) {
        if (result.data.success == true) {
          var data = result.data.data;
          _this.selectSysUserByIdList = data;
        } else {
          _this.$message.error(result.data.message);
        }
      })
    },
  }
}
</script>
<style media="screen">

</style>
