<template>
<div class="login-box">
  <div class="login-content">
    <div class="login-content-logo">
      <a><img src="images/OFRI/logoin.png" alt=""> </a>
      <span>奥弗瑞电气火灾预警平台</span>
    </div>
    <div class="login-content-form login-container animated fadeInDown ">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="el-tabs__nav-scroll">
          <div role="tablist" class="el-tabs__nav" style="transform: translateX(62px);">
            <div id="tab-first" class="el-tabs__item is-top" @click="translateBox(1)">管理员登录</div>
            <div id="tab-second" class="el-tabs__item is-top" @click="translateBox(2)">业主登录</div>
            <transition name="el-fade-in-linear">
              <div v-if="transhow" class="el-tabs__active-bar is-top" style="width: 75px;transform: translateX(18px);"></div>
            </transition>
            <transition name="el-fade-in-linear">
              <div v-if="beceshow" class="el-tabs__active-bar is-top" style="width: 85px;transform: translateX(118px);"></div>
            </transition>
          </div>
        </div>
        <div class="input-box-input" style="margin-top: 15%;">
          <span class="svg-container" style="font-size:18px;"><i class="fa fa-user"></i></span>
          <el-form-item prop="username">
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" :placeholder="placeholder" />
          </el-form-item>
          <div class="clearfix"></div>
        </div>
        <div class="input-box-input">
          <span class="svg-container" style="font-size:20px;"><i class="fa fa-lock" style="font-size: 22px;"></i></span>
          <el-form-item prop="password">
            <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
          </el-form-item>
          <div class="clearfix"></div>
        </div>
        <div class="tips">
          <span style="margin-right:20px;"><el-checkbox v-model="checked"></el-checkbox>记住密码</span>
          <span style="float:right;cursor: pointer; color:#1CB248" v-show="logointype != 1" @click="Forgetthepassword"> 忘记密码？</span>
        </div>
        <el-form-item style="margin-top:22px;">
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import {
  getCookie,
  setCookie,
  delCookie
} from '../../../api/cookie.js'
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'

export default {
  name: 'OFRIlogin',
  data() {
    return {
      transhow: true,
      beceshow: false,
      placeholder: "登录账号",
      logointype: 1,
      checked: true,
      loginForm: {
        username: null,
        password: null
      },
      loading: false,
      pointArryList: {},
      loginRules: {
        username: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.loginForm.username = getCookie('username');
    this.loginForm.password = getCookie('password');
  },
  methods: {
    handleLogin() {
      if (this.logointype == 1) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            var _this = this;
            axios.post('/findSysUser', {
              loginForm: this.loginForm
            }).then(function(result) {
              if (result.data.success == true) {
                _this.cookieRoe('username', 'password');
                setTimeout(() => {
                  _this.loading = false;
                  _this.$router.push({
                    path: '/Monitor/Generalization'
                  })
                }, 1000);
              } else {
                _this.loading = false;
                _this.$message.error(result.data.message);
              }
            });
          } else {
            return false;
          }
        });
      } else {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            var _this = this;
            axios.post('/findOwner', {
              loginForm: this.loginForm
            }).then(function(result) {
              if (result.data.success == true) {
                _this.cookieRoe('Ownerusername', 'Ownerpassword');
                setTimeout(() => {
                  _this.loading = false;
                  _this.$router.push({
                    path: '/Monitor/OwnerGeneralization'
                  })
                }, 1000);
              } else {
                _this.loading = false;
                _this.$message.error(result.data.message);
              }
            });
          } else {
            return false;
          }
        });
      }

    },
    cookieRoe: function(name, pass) {
      if (!this.checked) {
        delCookie(name);
        delCookie(pass);
      } else {
        setCookie(name, this.loginForm.username, 1);
        setCookie(pass, this.loginForm.password, 1);
      }
    },
    Forgetthepassword: function() {
      this.$router.push({
        path: '/commonPassword/step1'
      })
    },
    translateBox: function(i) {
      this.logointype = i;
      this.loading = false;
      this.loginForm.username = null;
      this.loginForm.password = null;
      if (i == 1) {
        this.loginForm.username = getCookie('username');
        this.loginForm.password = getCookie('password');
        this.transhow = true;
        this.beceshow = false;
        $("#tab-first").addClass("is-active");
        $("#tab-second").removeClass("is-active");
        this.placeholder = "登录账号"
      } else {
        this.loginForm.username = getCookie('Ownerusername');
        this.loginForm.password = getCookie('Ownerpassword');
        this.transhow = false;
        this.beceshow = true;
        $("#tab-second").addClass("is-active");
        $("#tab-first").removeClass("is-active");
        this.placeholder = "业主手机号码"
      }
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
