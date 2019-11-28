<template>
<div class="animated fadeInDown ">
    <el-form :model="ForgetthepasswordList" :rules="rules" ref="ForgetthepasswordList" label-width="150px" class="demo-ruleForm">
        <el-form-item label="请输入手机号码：" prop="phone">
            <el-input name="owerPhone" type="text" v-model="ForgetthepasswordList.phone" autoComplete="on" placeholder="请输入帐号绑定的手机号" style="width:300px;" />
        </el-form-item>
        <el-form-item label="验证：" prop="Verification">
            <con-Firm-Words @LoginconFirmWords="LoginconFirmWords"></con-Firm-Words>
        </el-form-item>
    </el-form>
    <div class="el-form-item">
        <label class="el-form-item__label" style="width: 150px;"></label>
        <div style="margin-left:150px; width:100%"><el-button @click.native.prevent="handleNextStep('ForgetthepasswordList')" type="primary" style="width:300px;">下一步</el-button></div>
    </div>
</div>
</template>
<script>
import axios from 'axios'
import conFirmWords from './confirmWords/index.vue'

export default {
  name: 'Forgetthepassword',
  data() {
    return {
      ForgetthepasswordList: {},
      confirmSuccess: false,
      rules: {
        phone: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ]
      }
    }
  },
  components: {
    conFirmWords
  },
  methods: {
    LoginconFirmWords(confirmSuccess) {
      this.confirmSuccess = confirmSuccess;
    },
    handleNextStep: function(ForgetthepasswordList) {
      this.$refs[ForgetthepasswordList].validate((valid) => {
        if (valid) {
          var _this = this;
          if (this.confirmSuccess == true) {
            this.$router.push({
              path: '/commonPassword/step2',
              query: {
                phone: _this.ForgetthepasswordList.phone
              }
            })
          } else {
            _this.$message.error("验证错误");
          }

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
