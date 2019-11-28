var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');

/***************************************************设备异常******************************************************/

/**
deviceId	integer	是	设备ID
deviceCode	string	是	设备编码
pageSize	integer	是	每页显示数
pageNo	integer	是	页码
**/
router.post('/selectDeviceAlerts', function(req, res, next) {
  var param = req.body;
  var deviceId = param.parameterList.deviceId;
  var deviceCode = param.parameterList.deviceCode;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAlertAPI.selectDeviceAlerts', [deviceId,deviceCode, pageSize, pageNo], {
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
    AjaxResult.rows = result.deviceAlertVoList;
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
用户处理设备异常
handleInfo	string	是	处理内容
deviceAlertId	integer	是	设备异常信息ID
**/
router.post('/handleDeviceAlert', function(req, res, next) {
  var param = req.body;
  var handleInfo = param.HandleboxList.handleInfo;
  var deviceAlertId = param.HandleboxList.deviceAlertId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAlertAPI.handleDeviceAlert', [handleInfo, deviceAlertId], {
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




module.exports = router;
