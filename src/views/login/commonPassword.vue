<template>
<div style="overflow: hidden;"><nav class="navbar navbar-static-top" role="navigation" style="margin-bottom:0">
  <!-- <span><img alt="image" :src="CorporateName"></span> -->
  <ul class="nav nav_rouet navbar-top-links navbar-left" style="margin: 0;padding-left: 3%;">
    <li>
      <router-link to="/login"><el-button  size="small">返回登录</el-button></router-link>
    </li>
  </ul>
</nav>
  <div class="activePublic commonPassword">
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="找回密码" description=""></el-step>
      <el-step title="手机号码验证" description=""></el-step>
      <el-step title="确认密码" description=""></el-step>
    </el-steps>

    <transition name="fade">
      <div class="commonPassword_div">
        <router-view class="view"></router-view>
      </div>
    </transition>
  </div>
</div>
</template>

  <script>
    export default {
    name:'commonPassword',
    data: function () {
      return {
        nextStep: true,
        step:1,
        CorporateName:null
      }
    },
    created() {
      var path = this.$route.path;
      this.routeIFref(path);
    },
    methods: {
      handlePreview: function () {

      },
      handlePreStep: function () {

      },
      handleNextStep: function () {

      },
      handlePublish: function () {

      },
      goStep: function (n) {

      },
      routeIFref: function(path){
        switch (path) {
          case "/commonPassword/step1" :
            this.step=0;
            break;
          case "/commonPassword/step2" :
            this.step=1;
            break;
          case "/commonPassword/step3" :
            this.step=2;
           break;
        }
      }
    },
    watch:{
      '$route': function (to,from) {
        this.routeIFref(to.path)

    }
  }
}
</script>
<style>
.activePublic .router-link {
  color: #fff;
}

.activePublic .but-group .el-button {
  margin-right: 20px;
}
.nav_rouet li a {
    padding: 10px 10px;
    min-height: 50px;
}

.commonPassword {
  width: 60%;
  margin: 8% auto;
}

.commonPassword_div {
  padding: 15% 20%;
}
</style>
