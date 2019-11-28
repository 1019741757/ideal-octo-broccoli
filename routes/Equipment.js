var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');
var formidable = require('formidable');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require("fs");
var XLSX = require('xlsx');
var Busboy = require('busboy');
var sd = require('silly-datetime');

/***************************************************设备管理******************************************************/
/**
用户分页查询设备集合\
status	integer	是	状态
deviceTypeId	integer	是	设备类型ID
modelId	integer	是	设备型号ID
deviceCode	string	是	设备编号
pageSize	integer	是	每页显示数
pageNo	integer	是	页码
**/
router.post('/selectDevices4User', function(req, res, next) {
  var param = req.body;
  var status = param.parameterList.status;
  var deviceTypeId = param.parameterList.deviceTypeId;
  var modelId = param.parameterList.modelId;
  var deviceCode = param.parameterList.deviceCode;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectDevices4User', [status, deviceTypeId, modelId, deviceCode, pageSize, pageNo], {
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
    AjaxResult.rows = result.deviceVoList;
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
新增设备
code	string	是	设备编号
typeId	integer	是	设备类型ID
vendorName	string	是	厂商名称
modelId	integer	是	设备型号ID
**/
router.post('/addDevice', function(req, res, next) {
  var param = req.body;
  var code = param.adddeviceVoNameList.code;
  var deviceTypeId = param.adddeviceVoNameList.deviceTypeId;
  var vendorId = param.adddeviceVoNameList.vendorId;
  var modelId = param.adddeviceVoNameList.modelId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.addDevice', [code, deviceTypeId, vendorId, modelId], {
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
安装设备
placeId	integer	是	场所ID
buildingId	integer	是	建筑ID
floorId	integer	是	楼层ID
installLoc	string	是	安装位置描述
threshold	string	是	阀值
offlineTime	integer	是	离线时间
deviceId	integer	是	设备ID
**/
router.post('/installerDevice', function(req, res, next) {
  var param = req.body;
  var placeId = param.InstallationList.placeId;
  var buildingId = param.InstallationList.buildingId;
  var floorId = param.InstallationList.floorId;
  var installLoc = param.InstallationList.installLoc;
  var thresholdA = param.InstallationList.thresholdA;
  var thresholdV = param.InstallationList.thresholdV;
  var offlineTime = param.InstallationList.offlineTime;
  var deviceId = param.deviceId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.installerDevice', [placeId, buildingId, floorId, installLoc, thresholdA, thresholdV, offlineTime, deviceId], {
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
删除设备
deviceId	integer	是	设备ID
**/
router.post('/delDevice', function(req, res, next) {
  var param = req.body;
  var deviceId = param.deviceId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.delDevice', [deviceId], {
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
编码更换
code	string	是	新编码
deviceId	integer	是	设备ID
**/
router.post('/replaceDeviceCode', function(req, res, next) {
  var param = req.body;
  var code = param.replaceDeviceCodeList.code;
  var deviceId = param.replaceDeviceCodeList.deviceId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.replaceDeviceCode', [code, deviceId], {
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
设备下线
deviceId	integer	是	设备ID
**/
router.post('/closeDevice', function(req, res, next) {
  var param = req.body;
  var deviceId = param.deviceId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.closeDevice', [deviceId], {
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
查询设备类型集合
**/
router.post('/selectDeviceTypeVos', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectDeviceTypeVos', [], {
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
查询厂商集合
deviceTypeId	integer	是	设备类型ID
**/
router.post('/selectVendorNamesByDeviceTypeId', function(req, res, next) {
  var param = req.body;
  var deviceTypeId = param.deviceTypeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectVendorNamesByDeviceTypeId', [deviceTypeId], {
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
查询设备型号集合
deviceTypeId	integer	是	设备类型ID
vendorId	integer	是	厂商ID
**/
router.post('/selectDeviceModelVos', function(req, res, next) {
  var param = req.body;
  var deviceTypeId = param.deviceTypeId;
  var vendorId = param.vendorId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceAPI.selectDeviceModelVos', [vendorId,deviceTypeId], {
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
图片上传
**/
router.post('/generateDeviceInstallImage', function(req, res, next) {
  var imagesArray = new Array();
  var deviceId;
  var isBefore;
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8'; //设置编辑
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //设置单文件大小限制
  form.parse(req, function(err, fields, files) {
    deviceId=fields.deviceId;
    isBefore=fields.isBefore;
    var imageBuf = fs.readFileSync(files.file.path);
    var imagebase = imageBuf.toString("base64");
    imagesArray.push({
      imgName: files.file.name,
      imgStr: imagebase,
    });
  })
  form.on('end', function() {
    console.log(deviceId);
    var identity_type = req.session.user.identity_type;
    var userId = req.session.user.userId;
    var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
    client2.call('deviceAPI.generateDeviceInstallImage', [imagesArray,deviceId,isBefore], {
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
  });


  // console.log(imagesArray);
  // res.send('1');
  // res.send('1');
  // var param = req.body;
  // var imgStr = param.parameterList.imgStr;
  // var imgName = param.parameterList.imgName;
  // var deviceId = param.parameterList.deviceId;
  // var identity_type = req.session.user.identity_type;
  // var userId = req.session.user.userId;
  // var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  // client2.call('deviceAPI.generateDeviceInstallImage', [imagesArray], {
  //   path: '/api/jsonRpc'
  // }, function(err, result) {
  //   var AjaxResult = {
  //     success: '',
  //     message: '',
  //     data: ''
  //   };
  //   if (err != null) {
  //     AjaxResult.success = false;
  //     AjaxResult.message = err.message;
  //     res.send(AjaxResult);
  //     return;
  //   };
  //   AjaxResult.success = true;
  //   AjaxResult.data = result;
  //   res.send(AjaxResult);
  // });
})


/***************************************************DTU信息******************************************************/
/**
分页查询DTU信息
phone	string	是	手机号码
pageSize	integer	是	每页显示数
pageNo	integer	是	页码
**/
router.post('/selectDtuInfos', function(req, res, next) {
  var param = req.body;
  var phone = param.parameterList.phone;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceDtuAPI.selectDtuInfos', [phone, pageSize, pageNo], {
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
    AjaxResult.rows = result.dtuVoList;
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
根据ID集合批量删除
dtuIds	array	是	DTUID数组
**/
router.post('/batchDelByDtuIds', function(req, res, next) {
  var param = req.body;
  var dtuIds = param.dtuIds;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceDtuAPI.batchDelByDtuIds', [dtuIds], {
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
导出DTU信息
phone	string	是	手机号码
**/
router.post('/exportDtuResiduFlow', function(req, res, next) {
  var param = req.body;
  var phone = param.phone;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('deviceDtuAPI.exportDtuResiduFlow', [phone], {
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
});


/**
导入DTU信息
phone	string	是	手机号码
**/
router.post('/importDtuResiduFlow', function(req, res, next) {
  var busboy = new Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: 5000000000
    }
  });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    // console.log("filename:"+fieldname);
    // console.log("encoding:"+encoding);
    file.on('limit', function() {
      res.json(Result.FAIL('To large'));
      return
    });
    var flag = true;
    var chunks = [];
    var size = 0;

    file.on("data", function(chunk) {
      chunks.push(chunk);
      size += chunk.length;
    });

    file.on('end', function() {
      var data = null;
      data = new Buffer(size);

      for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
        var chunk = chunks[i];
        chunk.copy(data, pos);
        pos += chunk.length;
      }

      try {
        var workbook = XLSX.read(data);
        var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2',……]
        var worksheet = workbook.Sheets[sheetNames[0]]; // 获取excel的第一个表格
        var ref = worksheet['!ref']; //获取excel列的有效范围,比如A1:F20
        var reg = /[a-zA-Z]/g;
        ref = ref.replace(reg, "");
        var line = parseInt(ref.split(':')[1]); // 获取excel的有效行数
        // console.log("line:"+line);
        console.log(worksheet);
        var list = [];
        for (var i = 2; i <= line; i++) {
          if (!worksheet['A' + i] && !worksheet['B' + i]) {
            line = i - 1;
          }
        };
      } catch (e) {
        // console.log(e);
        // if(!flag) return;
        flag = false;
        var AjaxResult = {
          success: '',
          message: ''
        };
        AjaxResult.success = false;
        AjaxResult.message = "导入错误,请稍候重试";
        res.send(AjaxResult);
        return;
      }
      if (!flag) return;
      var AjaxResult = {
        success: '',
        message: ''
      };
      if (line == 1) {
        AjaxResult.success = false;
        AjaxResult.message = "模板为空";
        res.send(AjaxResult);
        return;
      }
      if (worksheet['A' + 1].v != "DTU" || worksheet['B' + 1].v != "流量卡") {
        AjaxResult.success = false;
        AjaxResult.message = "非DTU模板不能导入";
        res.send(AjaxResult);
        return;
      }
      //校验模板是否有空白和数字格式
      for (var i = 2; i <= line; i++) {
        if (!worksheet['A' + i] && worksheet['B' + i] || worksheet['A' + i] && !worksheet['B' + i]) {
          var AjaxResult = {
            success: '',
            message: ''
          };
          AjaxResult.success = false;
          AjaxResult.message = "DTU和手机号码不能为空,请重新导入";
          res.send(AjaxResult);
          return;
        };
        if (!(/^[A-Za-z0-9]+$/.test(worksheet['A' + i].v)) || (worksheet['A' + i].v.toString().length != 11)) {
          var kk = worksheet['A' + i].v.toString().length;
          AjaxResult.success = false;
          AjaxResult.message = "DTU(" + worksheet['A' + i].v + ")应为11位数字、英文，请核对后重新导入";
          res.send(AjaxResult);
          return;
        };
        if (!(/^\d{11}$/.test(worksheet['B' + i].v))) {
          AjaxResult.success = false;
          AjaxResult.message = "手机号码(" + worksheet['B' + i].v + ")应为13位数字，请核对后重新导入";
          res.send(AjaxResult);
          return;
        };
      }
      //循环读出每一行，然后处理
      for (var i = 2; i <= line; i++) { // header ['dtu','手机号','剩余流量','查询时间','']
        var obj = {
          dtuId: '',
          phone: '',
          residuFlow: '',
          queryTime: ''
        }; //一个obj代表
        obj.dtuId = worksheet['A' + i].v || '';
        obj.phone = worksheet['B' + i].v || '';
        obj.residuFlow = null;
        obj.queryTime = null;
        obj.dtuVendorCode = null;
        obj.sortVersion = null;
        list.push(obj);
      }
      console.log(list);
      client.call('deviceDtuAPI.importDtuResiduFlow', [list], {
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
          AjaxResult.message = "导入成功";
        } else {
          AjaxResult.success = false;
          AjaxResult.message = "导入失败";
        }
        res.send(AjaxResult);
      });
    });
  })
  return req.pipe(busboy);
});

module.exports = router;
