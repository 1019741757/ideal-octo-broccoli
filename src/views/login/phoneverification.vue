<template>
<div class="animated fadeInDown ">
  <el-form :model="phoneverificationList" :rules="rules" ref="phoneverificationList" label-width="150px" class="demo-ruleForm">
    <el-form-item label="手机号码：">
      <el-input name="phone" type="text" v-model="phoneverificationList.phone" autoComplete="on" :disabled="true" style="width:300px;" />
    </el-form-item>

      <el-form-item label="验证码：" prop="Code" style="width:100%">
          <el-input name="Code" type="text" v-model="phoneverificationList.Code" autoComplete="on" placeholder="请输入验证码" style="width:180px;" />
          <el-button v-show="sendAuthCode" @click="VerificationCode" type="primary" style="width:116px;">获取验证码</el-button>
          <el-button v-show="!sendAuthCode" type="primary" :disabled="true">{{"重新获取 "+time}}</el-button>
      </el-form-item>

  </el-form>
  <div class="but-group">
    <label class="el-form-item__label" style="width: 150px;"></label>
    <div style="margin-left:150px; width:100%"><el-button @click.native.prevent="handleNextStep('phoneverificationList')" type="primary" style="width:300px;">下一步</el-button></div>
  </div>
</div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'phoneverification',
  data() {
    return {
      phoneverificationList: {},
      sendAuthCode: true,
      time: 0,
      rules: {
        Code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }, ],
      }
    }
  },
  mounted: function() {
    this.phoneverificationList.phone = this.$route.query.phone;
    this.VerificationCode();
  },
  methods: {
    //获取验证码
    VerificationCode: function() {
      this.time = 60;
      var _this = this;
      axios.post('/sendIdentifyCode', {
        phone: this.phoneverificationList.phone
      }).then(function(result) {
        if (result.data.success == true) {
          _this.sendAuthCode = false;
          var auth_timetimer = setInterval(() => {
            _this.time--;
            if (_this.time <= 0) {
              _this.sendAuthCode = true;
              clearInterval(auth_timetimer);
            }
          }, 1000);
        } else {
          _this.$message.error(result.data.message);
        }
      });
    },
    //验证验证码是否正确
    handleNextStep: function(phoneverificationList) {
      console.log(phoneverificationList);
      this.$refs[phoneverificationList].validate((valid) => {
        if (valid) {
          var _this = this;
          axios.post('/validateIdentifyCode', {
            phoneverificationList: this.phoneverificationList
          }).then(function(result) {
            if (result.data.success == true) {
              var data = result.data.data;
              _this.$router.push({
                path: '/commonPassword/step3',
                query: {
                  phone:_this.$route.query.phone,
                  identifyCode:_this.phoneverificationList.Code
                }
              })
            } else {
              _this.$message.error(result.data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
