var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');
var session = require('express-session');
var cookieParser = require('cookie-parser');


/****************************用户概括********************************************/
/**
用户根据状态统计设备数量
**/
router.post('/countDeviceByStatus4Owner', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countDeviceByStatus4Owner', [], {
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
统计当前业主及其下级的在线设备类型占比（概括）
**/
router.post('/countAllInstalledDeviceTypeRate', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countAllInstalledDeviceTypeRate', [], {
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
查询当前业主及其下级的场所集合（概括））
**/
router.post('/selectPlaceVos4CurrentOwnerAndLower', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectPlaceVos4CurrentOwnerAndLower', [], {
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
按日期统计业主及其下级的告警的设备个数（概括）
**/
router.post('/countAlertDevicesByDate', function(req, res, next) {
  var days=30;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countAlertDevicesByDate', [days], {
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
按日期统计业主及其下级的告警的设备个数（概括）
**/
router.post('/countDeviceByStatus4OwnerAndSons', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countDeviceByStatus4OwnerAndSons', [], {
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
