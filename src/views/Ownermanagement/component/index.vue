<template>
<div class="home_Monitor">
  <el-menu :default-active="activeIndex" class="el-menu-demo home_Monitor" mode="horizontal">
    <el-menu-item index="1" @click="goFirst(1)">附属账号</el-menu-item>
    <el-menu-item index="2" @click="goFirst(2)">短信通知</el-menu-item>
    <el-menu-item index="3" @click="goFirst(3)">排查申请</el-menu-item>
    <el-menu-item index="4" @click="goFirst(4)">个人信息</el-menu-item>
  </el-menu>
  <div class="boss_page">
    <div class="" id="inner_ocercenter">
        <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Ownermanagement',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      //项目select数组
      activeIndex: '1',
    }
  },
  created() {
    var routename = this.$route.path
    this.isRouteneme(routename);
  },
  mounted() {
    $("#inner_ocercenter").slimScroll({
      height: document.body.clientHeight - 120,
    });
  },
  methods: {
    goFirst: function(index) {
      switch (index) {
        case 1:
          this.$router.push('/Ownermanagement/OwnerSubsidiaryAccount');
          break;
        case 2:
          this.$router.push('/Ownermanagement/OwnerSMSNotification');
          break;
        case 3:
          this.$router.push('/Ownermanagement/OverhaulReport')
          break;
        case 4:
          this.$router.push('/Ownermanagement/PersonalInformation')
          break;
      }
    },
    isRouteneme: function(name) {
      switch (name) {
        case '/Ownermanagement/OwnerSubsidiaryAccount':
          this.activeIndex = '1';
          break;
        case '/Ownermanagement/OwnerSMSNotification':
          this.activeIndex = '2';
          break;
        case '/Ownermanagement/OverhaulReport':
          this.activeIndex = '3';
          break;
        case '/Ownermanagement/PersonalInformation':
          this.activeIndex = '4';
          break;
      }
    }
  }
}
</script>
<style media="screen">
.float-div-right {
  position: absolute;
  right: 0;
  top: 80px;
}

.component_selevt {
  float: left;
  line-height: 60px;
  margin: 0 10px;
}

.component_selevt .el-select {
  z-index: 5
}
</style>
