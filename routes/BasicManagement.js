var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var qs = require('querystring');
var rpc = require('../rpc/json-rpc2');

var session = require('express-session');
var cookieParser = require('cookie-parser');


/**************************************************分类管理*******************************************************/
/**
场所分类组织树
**/
router.post('/getPlaceTree', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey,userId, identity_type);
  client2.call('placeAPI.getPlaceTree', [], {
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
分类组织树(所有场所分类)
**/
router.post('/selectAllClassify', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.selectAllClassify', [], {
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
分类组织树(分类下有场所)
**/
router.post('/getClassifyTree4NoPlace', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.getClassifyTree4NoPlace', [], {
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
场所分类组织树排序
orgList	string	是	组织机构list
**/
router.post('/updateOrgByOrgSort', function(req, res, next) {
  var param = req.body;
  var StorgList = param.orgList;
  var orgList = JSON.parse(StorgList);
  console.log(orgList);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('orgAPI.updateOrgByOrgSort', [orgList], {
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
      AjaxResult.message = "排序成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "排序失败";
    }
    res.send(AjaxResult);
  });
});
/**
新增场所分类
pId	integer	是	父级ID（不选则为NULL）
classifyName	string	是	场所分类名称
**/
router.post('/addPlaceClassify', function(req, res, next) {
  var param = req.body;
  var pId = param.addPlaceClassifyList.id;
  var classifyName = param.addPlaceClassifyList.classifyName;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.addPlaceClassify', [pId, classifyName], {
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
      AjaxResult.message = "新增成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "新增失败";
    }
    res.send(AjaxResult);
  });
});

/**
修改场所分类信息
pId	integer	是	父级ID
classifyName	string	是	场所分类名称
classifyId	integer	是	场所分类ID
**/
router.post('/upatePlaceClassify', function(req, res, next) {
  var param = req.body;
  var pId = param.editPlaceClassifyList.pId;
  var classifyName = param.editPlaceClassifyList.classifyName;
  var classifyId = param.editPlaceClassifyList.classifyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.upatePlaceClassify', [classifyName,pId,classifyId], {
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
      AjaxResult.message = "排序成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "修改失败";
    }
    console.log(result);
    res.send(AjaxResult);
  });
});


/**
根据ID删除组织结构
classifyId	integer	是	场所分类ID
**/
router.post('/delPlaceClassifyById', function(req, res, next) {
  var param = req.body;
  var classifyId = param.classifyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.delPlaceClassifyById', [classifyId], {
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
      AjaxResult.message = "删除成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "删除失败";
    }
    res.send(AjaxResult);
  });
});
/**
根据ID查询场所分类信息
classifyId	integer	是	场所分
**/
router.post('/selectPlaceClassifyById', function(req, res, next) {
  var param = req.body;
  var classifyId = param.classifyId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.selectPlaceClassifyById', [classifyId], {
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

/***************************************************业主管理*******************************************************/
/**
查询业主信息列表
ownerName	string	是	业主名称（页面查询条件）
pageSize	integer	是	每页显示条数
pageNo	integer	是	页码
**/
router.post('/selectOwners', function(req, res, next) {
  var param = req.body;
  var ownerName = param.parameter.ownerName;
  var pageSize = param.parameter.pageSize;
  var pageNo = param.parameter.pageNo;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectOwners', [ownerName, pageSize, pageNo], {
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
    AjaxResult.rows = result.ownerVoList;
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
新增业主
ownerName	string	是	业主名
ownerPhone	string	是	业主电话
password	string	是	密码
businessNature	integer	是	行业属性ID		1：国企单位、2：事业单位、3：私营企业
company	string	是	业主单位
address	string	是	业主地址
pOwnerId	integer	是	上级业主ID
**/
router.post('/addOwner', function(req, res, next) {
  var param = req.body;
  var ownerName = param.addSysOwnerList.ownerName;
  var ownerPhone = param.addSysOwnerList.ownerPhone;
  var password = param.addSysOwnerList.password;
  var businessNature = param.addSysOwnerList.businessNature;
  var company = param.addSysOwnerList.company;
  var address = param.addSysOwnerList.address;
  var pOwnerId = param.addSysOwnerList.pOwnerId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.addOwner', [ownerName, ownerPhone, password, businessNature, company, address, pOwnerId], {
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
      AjaxResult.message = "新增成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "新增失败";
    }
    res.send(AjaxResult);
  });
});

/**
修改业主信息
ownerName	string	是	业主名
ownerPhone	string	是	业主电话
password	string	是	密码
businessNature	integer	是	行业属性ID		1：国企单位、2：事业单位、3：私营企业
company	string	是	业主单位
address	string	是	业主地址
pOwnerId	integer	是	上级业主ID
**/
router.post('/updateOwner', function(req, res, next) {
  var param = req.body;
  var ownerName = param.editSysOwnerList.ownerName;
  var ownerPhone = param.editSysOwnerList.ownerPhone;
  var password = param.editSysOwnerList.password;
  var businessNature = param.editSysOwnerList.businessNature;
  var company = param.editSysOwnerList.company;
  var address = param.editSysOwnerList.address;
  var pOwnerId = param.editSysOwnerList.pOwnerId;
  var ownerId = param.editSysOwnerList.ownerId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.updateOwner', [ownerName, ownerPhone, password, businessNature, company, address, pOwnerId, ownerId], {
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
根据业主ID删除业主
ownerId	integer	是	业主ID
**/
router.post('/delOwnerById', function(req, res, next) {
  var param = req.body;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.delOwnerById', [ownerId], {
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
查询所有业主信息
**/
router.post('/selectAllOwners', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectAllOwners', [], {
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
根据业主ID查询业主信息
ownerId	integer	是	业主ID
**/
router.post('/selectOwnerById', function(req, res, next) {
  var param = req.body;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectOwnerById', [ownerId], {
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
根据业主ID查询附属账号列表
ownerId	integer	是	业主ID
**/
router.post('/findONReceiversByOwnerId', function(req, res, next) {
  var param = req.body;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.findONReceiversByOwnerId', [ownerId], {
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
新增附属账号
name	string	是	附属账号姓名
phone	string	是	电话
loginFlag	integer	是	是否可登录（0：否、1：可）
password	string	是	密码
ownerId	integer	是	业主ID
**/
router.post('/addONReceiverByOwnerId', function(req, res, next) {
  var param = req.body;
  console.log(param);
  var name = param.addONReceiverByOwnerIdList.name;
  var phone = param.addONReceiverByOwnerIdList.phone;
  var loginFlag = param.addONReceiverByOwnerIdList.loginFlag;
  var password = param.addONReceiverByOwnerIdList.password;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.addONReceiverByOwnerId', [name, phone, loginFlag, password, ownerId], {
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
修改附属账号
name	string	是	附属账号姓名
phone	string	是	电话
loginFlag	integer	是	是否可登录（0：否、1：可）
password	string	是	密码
onReceiverId	integer	是	附属账号ID
ownerId	string	是	业主ID
**/
router.post('/updateONReceiver', function(req, res, next) {
  var param = req.body;
  var name = param.editSubsidiaryAccountList.name;
  var phone = param.editSubsidiaryAccountList.phone;
  var loginFlag = param.editSubsidiaryAccountList.loginFlag;
  var password = param.editSubsidiaryAccountList.password;
  var onReceiverId = param.editSubsidiaryAccountList.id;
  var ownerId = param.editSubsidiaryAccountList.ownerId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.updateONReceiver', [name, phone, loginFlag, password, onReceiverId, ownerId], {
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
删除附属账号
onReceiverId	integer	是	附属账号ID
ownerId	string	是	业主ID
**/
router.post('/delONReceiver', function(req, res, next) {
  var param = req.body;
  var onReceiverId = param.onReceiverId;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.delONReceiver', [onReceiverId, ownerId], {
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
根据ID查询附属账号
onReceiverId	string	是	附属账号ID
ownerId	string	是	业主ID
**/
router.post('/selectONReceiverById', function(req, res, next) {
  var param = req.body;
  var onReceiverId = param.onReceiverId;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.selectONReceiverById', [onReceiverId, ownerId], {
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
/********* 业主短信通知 ********/
/**
根据业主ID查询短信通知方式列表
ownerId	integer	是	业主ID
**/
router.post('/noticeModelList4User', function(req, res, next) {
  var param = req.body;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.noticeModelList4User', [ownerId], {
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
批量修改短信通知方式
noticeModelList	array	是	短信通知方式集合
OwnerNoticeReceiverVo属性说明：
id：附属账号ID（列表首位为业主，此时ID为NULL）
ownerId：业主ID
noticeModel：短信通知方式（0：不接收、1：接收）
**/
router.post('/batchUpdateNoticeModel', function(req, res, next) {
  var param = req.body;
  var noticeModelList = param.noticeModelList;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerNoticeReceiverAPI.batchUpdateNoticeModel', [noticeModelList], {
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
})




/********* 业主场所管理 ********/

/**
根据业主ID查询其下的场所
ownerId	integer	是	业主ID
**/
router.post('/selectPlaceInfoByOwnerId', function(req, res, next) {
  var param = req.body;
  var ownerId = param.ownerId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('ownerAPI.selectPlaceInfoByOwnerId', [ownerId], {
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
新增场所
classifyId	integer	是	分类ID
placeName	string	是	场所名称
provinceId	integer	是	省ID
cityId	integer	是	市ID
areaId	integer	是	区ID
longitude	double	是	经度
latitude	double	是	纬度
ownerId	integer	是	业主ID
**/
router.post('/addPlace', function(req, res, next) {
  var param = req.body;
  var classifyId = param.addselectPlaceInfoList.classifyId;
  var placeName = param.addselectPlaceInfoList.placeName;
  var provinceId = param.provinceId;
  var cityId = param.cityId;
  var areaId = param.areaId;
  var longitude = param.addselectPlaceInfoList.longitude;
  var latitude = param.addselectPlaceInfoList.latitude;
  var ownerId = param.ownerId;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.addPlace', [classifyId, placeName, provinceId, cityId, areaId, longitude, latitude, ownerId], {
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
修改场所
classifyId	integer	是	分类ID
placeName	string	是	场所名称
provinceId	integer	是	省ID
cityId	integer	是	市ID
areaId	integer	是	区ID
longitude	double	是	经度
latitude	double	是	纬度
ownerId	integer	是	业主ID
**/
router.post('/upatePlace', function(req, res, next) {
  var param = req.body;
  var classifyId = param.editselectPlaceInfoList.classifyId;
  var placeName = param.editselectPlaceInfoList.placeName;
  var provinceId = param.provinceId;
  var cityId = param.cityId;
  var areaId = param.areaId;
  var longitude = param.editselectPlaceInfoList.longitude;
  var latitude = param.editselectPlaceInfoList.latitude;
  var placeId = param.editselectPlaceInfoList.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.upatePlace', [classifyId, placeName, provinceId, cityId, areaId, longitude, latitude, placeId], {
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
删除场所
placeId	integer	是	场所ID
**/
router.post('/delPlaceById', function(req, res, next) {
  var param = req.body;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.delPlaceById', [placeId], {
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
根据ID查询场所
placeId	integer	是	场所ID
**/
router.post('/selectPlaceById', function(req, res, next) {
  var param = req.body;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.selectPlaceById', [placeId], {
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
查询所有场所分类
**/
router.post('/selectBottonClassifies', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.selectBottonClassifies', [], {
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
获取行政区域集合
regionType	integer	是	行政区域类型（1：省、2：市、3：区）
upperId	integer	是	上级行政单位ID
**/
router.post('/selectRegions', function(req, res, next) {
  var param = req.body;
  var regionType = param.regionType;
  var upperId = param.upperId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('systemAPI.selectRegions', [regionType,upperId], {
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
查询所有场所
**/
router.post('/selectAllPlace', function(req, res, next) {
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.selectAllPlace', [], {
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
根据建筑ID查询其下楼层
placeId	integer	是	场所ID
**/
router.post('/selectBuildingListByPlaceId', function(req, res, next) {
  var param = req.body;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.selectBuildingListByPlaceId', [placeId], {
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
根据场所ID查询其下建筑
buildingId	integer	是	建筑ID
**/
router.post('/selectFloorsByBuildingId', function(req, res, next) {
  var param = req.body;
  var buildingId = param.buildingId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.selectFloorsByBuildingId', [buildingId], {
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



/********* 建筑管理 ********/
/**
根据场所ID查询建筑
placeId	integer	是	场所ID
**/
router.post('/selectBuildingsByPlaceId', function(req, res, next) {
  var param = req.body;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.selectBuildingsByPlaceId', [placeId], {
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
根据建筑ID查询建筑信息
buildingId	integer	是	建筑ID
**/
router.post('/selectBuildingById', function(req, res, next) {
  var param = req.body;
  var buildingId = param.buildingId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.selectBuildingById', [buildingId], {
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
新增建筑
buildingName	string	是	建筑名称
placeId	integer	是	场所ID
**/
router.post('/addBuilding', function(req, res, next) {
  var param = req.body;
  var buildingName = param.buildingName;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.addBuilding', [buildingName, placeId], {
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
修改建筑
buildingName	string	是	建筑名称
buildingId	integer	是	建筑ID
placeId	integer	是	场所ID
**/
router.post('/updateBuilding', function(req, res, next) {
  var param = req.body;
  var buildingName = param.buildingName;
  var buildingId = param.buildingId;
  var placeId = param.placeId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.updateBuilding', [buildingName, buildingId, placeId], {
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
删除建筑
buildingId	integer	是	建筑ID
**/
router.post('/delBuildingById', function(req, res, next) {
  var param = req.body;
  var buildingId = param.buildingId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.delBuildingById', [buildingId], {
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
新增楼层
floorNames	array	是	楼层名称数组
buildingId	integer	是	建筑ID
**/
router.post('/addFloors', function(req, res, next) {
  var param = req.body;
  var floorNames = param.floorNames;
  var buildingId = param.buildingId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.addFloors', [floorNames, buildingId], {
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
修改楼层
floorName	string	是	楼层名称
floorId	integer	是	楼层ID
**/
router.post('/updateFloor', function(req, res, next) {
  var param = req.body;
  var floorName = param.floorName;
  var floorId = param.floorId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.updateFloor', [floorName, floorId], {
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
删除楼层
floorId	integer	是	楼层ID
**/
router.post('/delFloorById', function(req, res, next) {
  var param = req.body;
  var floorId = param.floorId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.delFloorById', [floorId], {
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
根据ID查询楼层
floorId	integer	是	楼层ID
**/
router.post('/selectFloorById', function(req, res, next) {
  var param = req.body;
  var floorId = param.floorId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.selectFloorById', [floorId], {
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
新增楼层
参数名	类型	必需	描述	枚举值	示例 e.g.
floors	array	是	楼层数组
**/
router.post('/sortFloors', function(req, res, next) {
  var param = req.body;
  var floorsList = param.floorsList;
  var dataList = new Array();
  for (var i = 0; i < floorsList.length; i++) {
    dataList.push(floorsList[i].floorId);
  };
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('buildingAPI.sortFloors', [dataList], {
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

/***************************************************角色管理*******************************************************/
/**
查询角色信息列表
pageSize	string	是	每页数
pageNo	string	是	页码
**/
router.post('/selectSysRoleList', function(req, res, next) {
  var param = req.body;
  var pageSize = param.page.pageSize;
  var pageNo = param.page.pageNo;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.selectSysRoleList', [pageSize, pageNo], {
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
    AjaxResult.rows = result.sysRoleVoList;
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
新增一个设备型号
modelName	string	是	型号名称
**/
router.post('/addSysRole', function(req, res, next) {
  var param = req.body;
  var roleName = param.addSysRoleList.roleName;
  var description = param.addSysRoleList.description;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.addSysRole', [roleName, description], {
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
      AjaxResult.message = "新增成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "新增失败";
    }
    res.send(AjaxResult);
  });
});

/**
根据角色ID修改系统角色
name	string	是	名称
description	string	是	描述
id	string	是	角色ID
**/
router.post('/updateSysRoleById', function(req, res, next) {
  var param = req.body;
  var roleName = param.editSysRoleList.roleName;
  var description = param.editSysRoleList.description;
  var roleId = param.editSysRoleList.roleId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.updateSysRoleById', [roleName, description, roleId], {
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
      AjaxResult.message = "修改成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "修改失败";
    }
    res.send(AjaxResult);
  });
});


/**
根据角色ID删除系统角色
id	string	是	角色ID
**/
router.post('/deleteSysRoleById', function(req, res, next) {
  var param = req.body;
  var roleId = param.roleId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.deleteSysRoleById', [roleId], {
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
      AjaxResult.message = "删除成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "删除失败";
    }
    res.send(AjaxResult);
  });
});


/**
根据角色ID查询角色信息
id	string	是	角色ID
**/
router.post('/querySysRoleById', function(req, res, next) {
  var param = req.body;
  var roleId = param.roleId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.querySysRoleById', [roleId], {
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
查询系统角色权限列表及角色已关联的权限
roleId	string	是	角色ID
**/
router.post('/showSysRolePermissionByRoleId', function(req, res, next) {
  var param = req.body;
  var roleId = param.roleId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.showSysRolePermissionByRoleId', [roleId], {
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
批量新增角色权限关联
roleId	string	是	角色ID
permissionIds	string	是	权限IDs
**/
router.post('/setSysRolePermission', function(req, res, next) {
  var param = req.body;
  var roleId = param.roleId;
  var Permissionslist = param.Permissionslist;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.setSysRolePermission', [roleId, Permissionslist], {
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
 ******查询所有角色信息
 **/
router.post('/selectSysRole', function(req, res, next) {
  var param = req.body;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysRoleAPI.selectSysRole', [], {
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





/***************************************************用户管理列表*******************************************************/
/**
查询用户管理列表
account	string	是	账号
phone	string	是	电话
pageSize	string	是	每页数
pageNo	string	是	页码
**/
router.post('/selectSysUserList', function(req, res, next) {
  var param = req.body;
  var account = param.page.account;
  var phone = param.page.phone;
  var pageSize = param.page.pageSize;
  var pageNo = param.page.pageNo;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.selectSysUserList', [account, phone, pageSize, pageNo], {
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
    AjaxResult.rows = result.sysUserVoList;
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
新增用户
参数名	类型	必需	描述	枚举值	示例 e.g.
account	string	是	账号
userName	string	是	用户名
password	string	是	密码
phone	string	是	电话
**/
router.post('/addSysUser', function(req, res, next) {
  var param = req.body;
  var account = param.addSysUserList.account;
  var password = param.addSysUserList.password;
  var userName = param.addSysUserList.userName;
  var phone = param.addSysUserList.phone;
  console.log(param);
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.addSysUser', [account,userName,password,phone], {
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
      AjaxResult.message = "新增成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "新增失败";
    }
    res.send(AjaxResult);
  });
});

/**
根据用户ID修改用户信息
userName	string	是	用户名
password	string	是	密码
phone	string	是	电话
userId	integer	是	用户ID
**/
router.post('/updateSysUser', function(req, res, next) {
  var param = req.body;
  var userName = param.editboxList.userName;
  var password = param.editboxList.password;
  var phone = param.editboxList.phone;
  var userid = param.editboxList.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.updateSysUser', [userName, password, phone, userid], {
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
      AjaxResult.message = "修改成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "修改失败";
    }
    res.send(AjaxResult);
  });
});

/**
用户激活
userId	string	是	用户ID
**/
router.post('/activateSysUser', function(req, res, next) {
  var param = req.body;
  var id = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.activateSysUser', [id], {
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
根据用户ID删除用户信息
userId	string	是	用户ID
**/
router.post('/delSysUser', function(req, res, next) {
  var param = req.body;
  var Id = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.delSysUser', [Id], {
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
      AjaxResult.message = "删除成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "删除失败";
    }
    res.send(AjaxResult);
  });
});
/**
根据用户ID查询用户信息
id	string	是	用户ID
**/
router.post('/selectSysUserById', function(req, res, next) {
  var param = req.body;
  var userid = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.selectSysUserById', [userid], {
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
通过用户ID查询用户分配角色列表
userId	string	是	用户Id
**/
router.post('/showSysUserRoleByUserId', function(req, res, next) {
  var param = req.body;
  var userid = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.showSysUserRoleByUserId', [userid], {
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
设置用户角色关联关系
userId	integer	是	用户ID
roleIds	array	是	选中的角色ID数组
**/

router.post('/setUserRole', function(req, res, next) {
  var param = req.body;
  var userid = param.userId;
  var roleIds = param.roleIds;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.setUserRole', [userid, roleIds], {
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
数据权限：用户设置场所组织树
userId	string	是	用户Id
**/
router.post('/showUserPlaceByUserId', function(req, res, next) {
  var param = req.body;
  var userid = param.userId;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('placeAPI.showUserPlaceByUserId', [userid], {
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
设置用户场所关联关系
userId	integer	是	用户ID
placeIds	array	是	场所ID数组
**/

router.post('/setUserPlace', function(req, res, next) {
  var param = req.body;
  var userid = param.userId;
  var placeIds = param.placeIds;
  var identity_type = req.session.user.identity_type;
  var userId = req.session.user.userId;
  var client2 = rpc.Client.$create(global.port, global.host,global.agencyKey, userId, identity_type);
  client2.call('sysUserAPI.setUserPlace', [userid, placeIds], {
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
      AjaxResult.message = "设置成功";
    } else {
      AjaxResult.success = false;
      AjaxResult.message = "设置失败";
    }
    res.send(AjaxResult);
  });
});



module.exports = router;
