<template>
<div class="animated fadeInDown ">
  <el-form :model="addUserFormData" ref="addUserFormData" :rules="rules" label-width="150px">
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model.trim="addUserFormData.password" placeholder="密码" style="width:300px;"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password_confirm">
      <el-input type="password" v-model.trim="addUserFormData.password_confirm" placeholder="确认密码" style="width:300px;"></el-input>
    </el-form-item>
  </el-form>
  <div class="but-group">
    <label class="el-form-item__label" style="width: 150px;"></label>
    <div style="margin-left:150px; width:100%"><el-button @click.native.prevent="handleNextStep('addUserFormData')" type="primary" style="width:300px;">完成</el-button></div>
  </div>
</div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Confirmthepassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addUserFormData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      addUserFormData: {
        account: null,
        password: null,
        password_confirm: null
      },
      rules: {
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password_confirm: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        }]
      }
    }
  },
  created: function() {
    this.addUserFormData.phone = this.$route.query.phone;
    this.addUserFormData.identifyCode = this.$route.query.identifyCode;
  },
  methods: {
    handleNextStep: function(addUserFormData) {
      this.$refs[addUserFormData].validate((valid) => {
        if (valid) {
          var _this = this;
          console.log(this.addUserFormData);
          axios.post('/modifyPasswordByPhone', {
            addUserFormData: this.addUserFormData
          }).then(function(result) {
            if (result.data.success == true) {
              _this.$router.push({
                path: '/login'
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
