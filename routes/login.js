var express = require('express');
var request = require('request');
var router = express.Router();
router.caseSensitive = true;
var url = require('url');
var http = require('https');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

/**
管理员登录
account	string	是	账号
password	string	是	密码
**/
router.post('/findSysUser', function(req, res, next) {
  var param = req.body;
  var account = param.loginForm.username;
  var password = param.loginForm.password;
  var client = global.client;
  client.call('sysUserAPI.findSysUser', [account, password], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: '',
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    } else {
      var userId = result.userId;
      var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey,userId, 'user');
      /**** 查询当前登录用户所有权限 ***/
      client2.call('sysUserAPI.selectCurrentUserPermissions', [], {
        path: '/api/jsonRpc'
      }, function(err, resultPermission) {
        var user = {
          'agencyKey':global.agencyKey,
          'userId':userId,
          'information': result,
          'identity_type': 'user',
          'Permission': resultPermission
        };
        req.session.user = user;
        AjaxResult.success = true;
        AjaxResult.data = result;
        res.send(AjaxResult);
      })
    }
  });
});
/**
业主登录
account	string	是	账号
password	string	是	密码
**/
router.post('/findOwner', function(req, res, next) {
  var param = req.body;
  var account = param.loginForm.username;
  var password = param.loginForm.password;
  var client = global.client;
  client.call('ownerAPI.findOwner', [account, password], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: '',
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    } else {
      var ownerId = result.ownerId;
      var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey,ownerId, 'owner');
      /**** 查询当前登录用户所有权限 ***/
      client2.call('sysUserAPI.selectCurrentUserPermissions', [], {
        path: '/api/jsonRpc'
      }, function(err, resultPermission) {
        var user = {
          'agencyKey':global.agencyKey,
          'userId':ownerId,
          'information': result,
          'identity_type': 'owner',
          'Permission': resultPermission
        };
        req.session.user = user;
        AjaxResult.success = true;
        AjaxResult.data = result;
        res.send(AjaxResult);
      })
    }
  });
});

/**
前台获取用户所有资料
userId
userName
token
identity_type
Permission
**/
router.post('/AccesstoPermissions', function(req, res, next) {
  var AjaxResult = {
    success: '',
    message: '',
    CorporateName:'',
    data: ''
  };
  var CorporateName=global.company;
  var user = req.session.user;
  if (user == undefined) {
    AjaxResult.success = false;
    AjaxResult.CorporateName = CorporateName;
    res.send(AjaxResult);
  } else {
    AjaxResult.success = true;
    AjaxResult.data = user;
    AjaxResult.CorporateName = CorporateName;
    res.send(AjaxResult);
  }
});
/**
前台清除用户所有资料
userId
userName
token
identity_type
Permission
**/
router.post('/ClearanceofPermissions', function(req, res, next) {
  var AjaxResult = {
    success: '',
    message: ''
  };
  req.session.user = null;
  if (req.session.user == null) {
    AjaxResult.success = true;
    res.send(AjaxResult);
  } else {
    AjaxResult.success = false;
    res.send(AjaxResult);
  }

});

/**
发送验证码
PHONE	string	是	电话
**/
router.post('/sendIdentifyCode', function(req, res, next) {
  var param = req.body;
  var phone = param.phone;
  var client = global.client;
  client.call('systemAPI.sendIdentifyCode', [phone], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: ''
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    }
    if (result == 1) {
      AjaxResult.success = true;
    } else {
      AjaxResult.success = false;
    }
    res.send(AjaxResult);
  });
});

/**
验证手机验证码是否正确
phone	string	是	接收验证码的电话号码
identifyCode	string	是	验证码
**/
router.post('/validateIdentifyCode', function(req, res, next) {
  var param = req.body;
  var phone = param.phoneverificationList.phone;
  var identifyCode = param.phoneverificationList.Code;
  var client = global.client;
  client.call('systemAPI.validateIdentifyCode', [phone, identifyCode], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: '',
      data: ''
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    };
    AjaxResult.success = true;
    AjaxResult.data = result;
    res.send(AjaxResult);
  });
})

/**
根据账号修改用户密码
phone	string	是	电话号码
password	string	是	新密码
identifyCode	string	是	验证码
**/
router.post('/modifyPasswordByPhone', function(req, res, next) {
  var param = req.body;
  var phone = param.addUserFormData.phone;
  var password = param.addUserFormData.password;
  var identifyCode = param.addUserFormData.identifyCode
  var client = global.client;
  client.call('systemAPI.modifyPasswordByPhone', [phone, password,identifyCode], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: ''
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    }
    if (result == 1) {
      AjaxResult.success = true;
      AjaxResult.message = "发送成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "发送失败";
    }
    res.send(AjaxResult);
  });
});


module.exports = router;
