var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');

/***************************************************控制台*****************************************************/

/**
根据场所ID、设备code、设备类型ID统计各状态的设备数量（监控台）
classifyId	integer	是	场所分类ID
placeId	integer	是	场所ID
deviceCode	string	是	设备编码
deviceTypeId	integer	是	设备类型ID
**/
router.post('/countDevicesAsperStatusByNoteId', function(req, res, next) {
  var param = req.body;
  var noteId=param.noteId;
  var noteType=param.noteType;
  var deviceCode=param.deviceCode;
  var deviceTypeId=param.deviceTypeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countDevicesAsperStatusByNoteId', [noteId,noteType,deviceCode,deviceTypeId], {
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
监控台根据场所查询设备（编码、类型、是否告警）集合
placeId	integer	是	场所ID
**/
router.post('/selectTypeAndStatusByPlaceId', function(req, res, next) {
  var param = req.body;
  var placeId=param.placeId;
  var deviceCode=param.deviceCode;
  var deviceTypeId=param.deviceTypeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectTypeAndStatusByPlaceId', [placeId,deviceCode,deviceTypeId], {
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
监控台----设备统计
**/
router.post('/countAlertStatus4Control', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countAlertStatus4Control', [], {
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
监控台----告警日志
**/
router.post('/selectAlertDeviceCodes4Control', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAlertAPI.selectAlertDeviceCodes4Control', [], {
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
按场所分类统计各状态的设备数量（工作台）
classifyId	string	是	场所分类ID
deviceTypeId	integer	是	设备类型ID
**/
router.post('/countDeviceAsperStatusByClassify', function(req, res, next) {
  var param = req.body;
  var classifyId=param.classifyId||null;
  var deviceTypeId=param.deviceTypeId||null;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.countDeviceAsperStatusByClassify', [classifyId,deviceTypeId], {
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
根据场所、建筑查询设备信息集合（九宫格）
placeId	integer	是	场所ID
buildingId	integer	是	建筑ID
deviceCode	string	是	设备编码
deviceTypeId	integer	是	设备ID
**/
router.post('/selectDeviceByPlaceIdOrBuildingId', function(req, res, next) {
  var param = req.body;
  var placeId=param.placeId;
  var buildingId=param.buildingId;
  var deviceCode=param.deviceCode;
  var deviceTypeId=param.deviceTypeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectDeviceByPlaceIdOrBuildingId', [placeId,buildingId,deviceCode,deviceTypeId], {
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
根据分类ID统计近期设备数据状态
classifyId	string	是	场所分类ID
days	integer	是	查询天数
deviceTypeId	integer	是	设备类型ID
**/
router.post('/countByclassifyId', function(req, res, next) {
  var param = req.body;
  var classifyId=param.classifyId;
  var days=30;
  var deviceTypeId=param.deviceTypeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceDataStatusCntAPI.countByclassifyId', [classifyId,deviceTypeId,days], {
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




/*******************************************设备详情***********************************************/
/**
根据设备ID查询设备信息
**/
router.post('/selectDeviceById', function(req, res, next) {
  var param = req.body;
  var deviceId=param.deviceId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectDeviceById', [deviceId], {
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
根据设备ID获取其安装照片路径
**/
router.post('/selectInstallPhotosByDeviceId', function(req, res, next) {
  var param = req.body;
  var deviceId=param.deviceId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectInstallPhotosByDeviceId', [deviceId], {
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
    for (var i = 0; i < result.length; i++) {
      result[i].imgUrl='/photos/'+result[i].path + result[i].name;
    }
    AjaxResult.data = result;
    res.send(AjaxResult);
  });
})
/**
分页查询已处理的设备异常（历史异常处理记录）
deviceId	integer	是	设备ID
pageSize	integer	是	每页显示数
pageNo	integer	是	页码
**/
router.post('/selectTreatedDeviceAlerts', function(req, res, next) {
  var param = req.body;
  var deviceId = param.parameterList.deviceId;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAlertAPI.selectTreatedDeviceAlerts', [deviceId,pageSize, pageNo], {
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
})
/*


/**
历史DTU信号曲线图
deviceId	string	是	设备ID
count	string	是	查询次数
**/
router.post('/queryRssiByDeviceID', function(req, res, next) {
  var param = req.body;
  var deviceId=param.deviceId;
  var count=500;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceDtuAPI.queryRssiByDeviceID', [deviceId,count], {
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
告警历史曲线图
**/
router.post('/selectDeviceUploadStatusLogsByDeviceId', function(req, res, next) {
  var param = req.body;
  var deviceId=param.deviceId;
  var count=30;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAlertAPI.selectDeviceUploadStatusLogsByDeviceId', [deviceId,count], {
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
查询设备历史数据
**/
router.post('/queryHistoryData', function(req, res, next) {
  var param = req.body;
  var deviceId=param.deviceId;
  var date=param.date;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.queryHistoryData', [deviceId,date], {
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
