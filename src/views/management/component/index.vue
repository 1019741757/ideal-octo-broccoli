<template>
<div>
  <el-container class="main main_cur">
    <!-- <div @click="isClossTabFun()" style="position: absolute;left: 100%;">
        <i class="fa fa-bars" style="font-size:24px;cursor: pointer;"></i>
      </div> -->
    <div class="backColor">
      <el-menu :default-active="routesClass" class="el-menu-vertical-demo" :collapse="isCollapse" router id="Clot-content">
        <el-submenu index="1">
          <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">基础管理</span>
                  </template>
          <el-menu-item-group v-if="Jurisdiction('classify')">
            <el-menu-item index="/management/ClassificationManagement">分组管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('owner')">
            <el-menu-item index="/management/ProprietorManagement">业主管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('role')">
            <el-menu-item index="/management/RoleManagement">角色管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('user')">
            <el-menu-item index="/management/userManagement">用户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">设备</span>
              </template>
          <el-menu-item-group v-if="Jurisdiction('device')">
            <el-menu-item index="/management/deviceManagement">设备管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('dtu')">
            <el-menu-item index="/management/DTUInformation">DTU信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3" v-if="Jurisdiction('dataReport')">
          <template slot="title">
                  <i class="el-icon-document"></i>
                  <span slot="title">报表数据</span>
              </template>
          <el-menu-item-group>
            <el-menu-item index="/management/growthInformation">设备增长信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title">其他</span>
              </template>
          <el-menu-item-group v-if="Jurisdiction('checkingApply')">
            <el-menu-item index="/management/ApplicationForInvestigation">排查申请</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('message')">
            <el-menu-item index="/management/informationFeedback">信息反馈</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="Jurisdiction('noticeMode')">
            <el-menu-item index="/management/SMSNotification">短信信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="/management/CompanyInformation">公司信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <el-container>
      <el-main style="padding:0">
        <div id="inner_cmuot" style="padding: 15px 15px 8px;">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>

</div>
</template>

<script>
export default {
  name: 'management',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      isCollapse: false,
      routesClass: null,
      screenheight: document.body.clientHeight - 55 + "px",
    };
  },
  created() {
    var routeValue = this.$route.path
    if (routeValue == "/management/BuildingBuilding") {
      this.routesClass = "/management/ProprietorManagement"
    } else {
      this.routesClass = this.$route.path;
    }

  },
  mounted() {
    $("#inner_cmuot").slimScroll({
      height: document.body.clientHeight - 58,
    });
    const that = this;
    $("#Clot-content").slimScroll({
      height: document.body.clientHeight - 55,
      size: '3px', //滚动条宽度，即组件宽度
      color: '#676a6c', //滚动条颜色
    });
    window.onresize = function temp() {
      that.screenheight = document.body.clientHeight - 55 + "px";
    }
  },
  methods: {
    isClossTabFun() {
      this.isCollapse = this.isCollapse == false ? true : false;
    },
  },
  watch: {
    $route(to, from) {
      if (to.path == "/management/BuildingBuilding") {
        this.routesClass = "/management/ProprietorManagement"
      } else {
        this.routesClass = to.path;
      }

    }
  }
}
</script>
<style media="screen">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-submenu .el-menu {
  background: rgba(245, 251, 245, 1)
}

.main_cur .el-menu-item.is-active {
  background-color: #dbf9e3;
}

.el-menu {
  border: none;
}

.el-submenu {
  min-width: 200px;
}
</style>
