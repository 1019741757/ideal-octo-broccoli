<template>
<div class="home_Monitor">
  <el-menu :default-active="activeIndex" class="el-menu-demo home_Monitor" mode="horizontal">
    <el-menu-item index="1" @click="goFirst(1)" v-if="identity_type=='user'">概括</el-menu-item>
    <el-menu-item index="1" @click="goFirst(2)" v-if="identity_type=='owner'">概括</el-menu-item>
    <el-menu-item index="2" @click="goFirst(3)">监控台</el-menu-item>
    <el-menu-item index="3" @click="goFirst(4)">设备异常</el-menu-item>
  </el-menu>
  <div class="boss_page">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'project',
  data() {
    return {
      //项目select数组
      activeIndex: '1',
      identity_type: null,
    }
  },
  created() {
    this.identity_type = this.$store.state.user.identity_type;
    var routename = this.$route.path
    this.isRouteneme(routename);
  },
  mounted() {},
  methods: {
    goFirst: function(index) {
      switch (index) {
        case 1:
          this.$router.push('/Monitor/Generalization');
          break;
        case 2:
          this.$router.push('/Monitor/OwnerGeneralization');
          break;
        case 3:
          this.$router.push('/Monitor/MonitoringStation')
          break;
        case 4:
          this.$router.push('/Monitor/EquipmentAbnormality')
          break;
      }
    },
    isRouteneme: function(name) {
      switch (name) {
        case '/Monitor/Generalization':
          this.activeIndex = '1';
          break;
        case '/Monitor/OwnerGeneralization':
          this.activeIndex = '1';
          break;
        case '/Monitor/MonitoringStation':
          this.activeIndex = '2';
          break;
        case '/Monitor/EquipmentAbnormality':
          this.activeIndex = '3';
          break;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.isRouteneme(to.path);
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
