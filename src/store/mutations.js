const mutations = {
  //用户信息
  setUsers(state, users) {
    state.user = users
  },
  //监控台数据传值
  set_orgId(state, orgId) {
    state.orgId = orgId;
  },
  set_nodeType(state, nodeType) {
    state.nodeType = nodeType;
  },
  set_deviceTypeId(state, deviceTypeId) {
    state.deviceTypeId = deviceTypeId;
  },
  set_deviceCode(state, deviceCode) {
    state.deviceCode = deviceCode;
  },
  //设备详情deviceId
  set_MonitoringClick(state, deviceId) {
    state.deviceId = deviceId;
  },
  //监控台数据传值
  // set_parametersList(state, parametersList) {
  //   state.parametersList = parametersList;
  // },
  //用户分配角色userId
  set_userId(state, userId) {
    state.userId = userId;
  },
  //省市区三级联动
  set_choseProvince(state, provinceId) {
    state.provinceId = provinceId;
  },
  set_choseCity(state, cityId) {
    state.cityId = cityId;
  },
  set_choseBlock(state, areaId) {
    state.areaId = areaId;
  },
  //场所分类上级节点名称
  set_rpOrgname(state, rpOrgname) {
    state.rpOrgname = rpOrgname;
  },
  //设备管理设备安装deviceld
  set_deviceId(state, deviceId) {
    state.deviceId = deviceId;
  },
  //业主管理 短信通知
  set_SMSownerId(state, SMSownerId) {
    state.SMSownerId = SMSownerId;
  },
  //新增场所 经度
  set_longitude(state, longitude) {
    state.Placelongitude = longitude;
  },
  //新增场所 纬度
  set_latitude(state, latitude) {
    state.Placelatitude = latitude;
  },
}

export default mutations
