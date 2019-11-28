var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');

/***************************************************附属账号******************************************************/
/**
业主查询短附属账号列表
**/
router.post('/findONReceivers', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.findONReceivers', [], {
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
业主新增短附属账号
name	string	是	短附属账号姓名
phone	string	是	电话
loginFlag	string	是	是否可登录（0：否、1：可）
password	string	是	密码
**/
router.post('/addONReceiver', function(req, res, next) {
  var param = req.body;
  var name = param.addMessageNotificationList.name;
  var phone = param.addMessageNotificationList.phone;
  var loginFlag = param.addMessageNotificationList.loginFlag;
  var password = param.addMessageNotificationList.password;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.addONReceiver', [name,phone,loginFlag,password], {
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

/***************************************************短信通知******************************************************/
/**
业主查询短信通知方式列表
**/
router.post('/noticeModelList', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.noticeModelList', [], {
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


/***************************************************业主排查申请******************************************************/
/**
分页查询排查申请信息
pageSize	integer	是	每页显示条数
pageNo	integer	是	页码
**/
router.post('/selectCheckingApplys4CurrentOwner', function(req, res, next) {
  var param = req.body;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.selectCheckingApplys4CurrentOwner', [pageSize, pageNo], {
    path: '/api/jsonRpc'
  }, function(err, result) {
    var AjaxResult = {
      success: '',
      message: '',
      rows: '',
      total: '',
      totalPage: ''
    };
    if (err != null) {
      AjaxResult.success = false;
      AjaxResult.message = err.message;
      res.send(AjaxResult);
      return;
    }
    AjaxResult.success = true;
    AjaxResult.rows = result.checkingApplyVoList;
    AjaxResult.total = result.count;

    if (AjaxResult.total % pageSize == 0) {
      AjaxResult.totalPage = AjaxResult.total / pageSize;
    } else {
      AjaxResult.totalPage = AjaxResult.total / pageSize + 1;
    }
    res.send(AjaxResult);
  });
});

/**
业主申请排查
placeName	string	是	场所名称
placeId	integer	是	场所ID
**/
router.post('/applyChecking', function(req, res, next) {
  var param = req.body;
  var placeName = param.placeName;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.applyChecking', [placeName,placeId], {
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
      AjaxResult.message = "";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "";
    }
    res.send(AjaxResult);
  });
});

/**
业主取消排查申请
checkingApplyId	integer	是	排查申请ID
**/
router.post('/cancelCheckingApply', function(req, res, next) {
  var param = req.body;
  var checkingApplyId = param.checkingApplyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.cancelCheckingApply', [checkingApplyId], {
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
      AjaxResult.message = "";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "";
    }
    res.send(AjaxResult);
  });
});

/**
业主下的场所集合（业主申请排查—场所下拉列表）
**/
router.post('/selectPlaceVos4CurrentOwner', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectPlaceVos4CurrentOwner', [], {
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
根据业主ID查询业主信息（修改展示用）
**/
router.post('/selectCurrentOwner', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectCurrentOwner', [], {
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
根据ID查询用户信息（修改信息展示）
**/
router.post('/selectUserCompanyByUserId', function(req, res, next) {
  var param = req.body;
  var Id = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.selectUserCompanyByUserId', [Id], {
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

module.exports = router;
