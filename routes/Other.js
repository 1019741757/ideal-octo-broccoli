var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');

/***************************************************排查申请******************************************************/
/**
分页查询排查申请信息
ownerPhone	string	是	业主电话（查询条件）
status	integer	是	状态（查询条件）
pageSize	integer	是	每页显示条数
pageNo	integer	是	页码
**/
router.post('/selectCheckingApplys', function(req, res, next) {
  var param = req.body;
  var ownerPhone = param.parameterList.ownerPhone;
  var status = param.parameterList.status;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.selectCheckingApplys', [ownerPhone,status,pageSize, pageNo], {
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
用户操作排查申请信息
handleCont	string	是	操作内容
status	integer	是	状态（1：接受、3：已拒绝、4：已取消）
checkingApplyId	integer	是	排查申请ID
**/
router.post('/handleCheckingApply', function(req, res, next) {
  var param = req.body;
  var handleCont = param.handleCont;
  var status = param.status;
  var checkingApplyId = param.checkingApplyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.handleCheckingApply', [handleCont,status,checkingApplyId], {
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
根据排查申请ID分页查询其记录列表
checkingApplyId	integer	是	排查申请ID
pageSize	integer	是	每页显示条数
pageNo	integer	是	页码
**/
router.post('/selectCheckingApplysRecordByOwnerId', function(req, res, next) {
  var param = req.body;
  var checkingApplyId = param.checkingApplyId;
  var pageSize = 1000;
  var pageNo = 1;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.selectCheckingApplysRecordByOwnerId', [checkingApplyId,pageSize, pageNo], {
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
用户新增排查申请记录
content	string	是	记录内容
checkingApplyId	integer	是	排查申请ID
**/
router.post('/addCheckingApplyRecord', function(req, res, next) {
  var param = req.body;
  var content = param.content;
  var checkingApplyId = param.checkingApplyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.addCheckingApplyRecord', [content,checkingApplyId], {
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
用户修改排查申请记录
content	string	是	记录内容
id	integer	是	记录ID
**/
router.post('/updateCheckingApplyRecord', function(req, res, next) {
  var param = req.body;
  var content = param.content;
  var id = param.id;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.updateCheckingApplyRecord', [content,id], {
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
用户删除排查申请记录
id	integer	是	记录ID
**/
router.post('/delCheckingApplyRecord', function(req, res, next) {
  var param = req.body;
  var id = param.id;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.delCheckingApplyRecord', [id], {
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
用户按ID查询排查申请记录
id	string	是	记录ID
**/
router.post('/selectCheckingApplyRecordById', function(req, res, next) {
  var param = req.body;
  var id = param.id;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('checkingApplyAPI.selectCheckingApplyRecordById', [id], {
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

/***************************************************信息反馈*******************************************************/
/**
分页查询信息反馈列表
phone	string	是	联系电话（查询条件）
pageSize	integer	是	每页显示数
pageNo	integer	是	页码
**/
router.post('/selectMessageFeedbacks', function(req, res, next) {
  var param = req.body;
  var phone = param.parameter.phone;
  var pageSize = param.parameter.pageSize;
  var pageNo = param.parameter.pageNo;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('messageFeedbackAPI.selectMessageFeedbacks', [phone,pageSize, pageNo], {
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
    AjaxResult.rows = result.mfVoList;
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
处理信息反馈
handleCont	string	是	处理内容
handleName	string	是	处理人
messageFeedbackId	integer	是	信息反馈ID
**/
router.post('/handleMessageFeedback', function(req, res, next) {
  var param = req.body;
  var handleCont = param.handleMessageFeedbackList.handleCont;
  var handleName = param.handleMessageFeedbackList.handleName;
  var messageFeedbackId = param.handleMessageFeedbackList.messageFeedbackId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('messageFeedbackAPI.handleMessageFeedback', [handleCont,handleName,messageFeedbackId], {
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
/***************************************************短信通知******************************************************/
/**
分页查询短信记录
phone	string	是
pageSize	integer	是
pageNo	integer	是
**/
router.post('/selectSmsList', function(req, res, next) {
  var param = req.body;
  var phone	 = param.parameterList.phone;
  var pageSize = param.parameterList.pageSize;
  var pageNo = param.parameterList.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('smsAPI.selectSmsList', [phone,pageSize, pageNo], {
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
    AjaxResult.rows = result.smsList;
    AjaxResult.total = result.count;

    if (AjaxResult.total % pageSize == 0) {
      AjaxResult.totalPage = AjaxResult.total / pageSize;
    } else {
      AjaxResult.totalPage = AjaxResult.total / pageSize + 1;
    }
    res.send(AjaxResult);
  });
});

/***************************************************公司信息*******************************************************/
/**
查询公司信息
**/
router.post('/findCurrentAgency', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('agencyAPI.findCurrentAgency', [], {
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
