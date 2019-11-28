var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');

/***************************************************设备增长数量******************************************************/

/**
按日期统计设备增长数量
days	integer	是	查看的天数
**/
// router.post('/countNewDeviceByDate', function(req, res, next) {
//   var param = req.body;
//   var days = 30;
//   var identity_type = req.session.user.identity_type;
//   var userId = req.session.user.userId;
//   var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
//   client2.call('deviceAPI.countNewDeviceByDate', [days], {
//     path: '/api/jsonRpc'
//   }, function(err, result) {
//     var AjaxResult = {
//       success: '',
//       message: '',
//       data: ''
//     };
//     if (err != null) {
//       AjaxResult.success = false;
//       AjaxResult.message = err.message;
//       res.send(AjaxResult);
//       return;
//     };
//     AjaxResult.success = true;
//     AjaxResult.data = result;
//     res.send(AjaxResult);
//   });
// })





module.exports = router;
