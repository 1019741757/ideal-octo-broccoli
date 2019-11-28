<template>
<div class="miut">
  <div class="">
    <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom:0">
      <span><img alt="image" :src="CorporateName"></span>
      <ul class="nav navbar-top-links navbar-left" style="margin: 0;">
        <li style="margin-left:72px;" v-if="identity_type=='user'">
          <router-link to="/Monitor/Generalization">
            监控
          </router-link>
        </li>
        <li style="margin-left:72px;" v-if="identity_type=='owner'">
          <router-link to="/Monitor/OwnerGeneralization">
            监控
          </router-link>
        </li>
      </ul>
      <ul class="nav navbar-top-links navbar-right" style="margin: 0;">
        <li v-if="identity_type=='user'">
          <router-link to="/management/ProprietorManagement">
            后台管理
          </router-link>
        </li>
        <li v-if="identity_type=='owner'">
          <router-link to="/Ownermanagement/OwnerSubsidiaryAccount">
            后台管理
          </router-link>
        </li>
        <li style="color:#ffffff; margin-right:10px;">|</li>
        <li><div style="color:#ffffff;font-size:14px;">欢迎您，<a style="color:#ffffff;padding: 0;">{{username}}</a></div></li>
        <li @click="Signout">
          <a><i class="fa fa-sign-out"></i>退出</a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import {delCookie} from '../../api/cookie.js'
import axios from 'axios'
export default {
  name: 'Navhead',
  data() {
    return {
      username: null,
      identity_type:null,
      CorporateName:null
    }
  },
  created() {
    this.identity_type = this.$store.state.user.identity_type;
    var CorporateName = this.$store.state.user.CorporateName;
    this.CorporateName="images/"+CorporateName+"/logo.png"
    if (this.identity_type== 'user') {
      this.username=this.$store.state.user.information.userName;
    }else {
      this.username=this.$store.state.user.information.ownerName;
    }
  },
  methods: {
    Signout: function() {
      this.$confirm('是否退出', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var _this=this;
        axios.post('/ClearanceofPermissions').then(function(result) {
          console.log(result);
          if (result.data.success == true) {
            _this.$router.push({
              path: '/login'
            })
          }else {
           _this.$message.error(result.data.message);
          }
        });
      }).catch(() => {

      });
    }
  }
}
</script>

<style scoped>

</style>
