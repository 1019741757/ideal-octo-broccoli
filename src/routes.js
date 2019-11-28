import Vue from 'vue'
import Router from 'vue-router'
/*
奥弗瑞系统管理登录部分：OFRIlogin

迅优智能系统管理登录部分：XYZNlogin

先佑安防系统管理登录部分：XYZNlogin


系统管理忘记密码公共部分：commonPassword
系统管理忘记密码部分：Forgetthepassword
系统管理手机号码验证部分：phoneverification
系统管理确认密码部分：Confirmthepassword
 */
import OFRIlogin from './views/login/OFRI/index.vue'
import XYZNlogin from './views/login/XYZN/index.vue'
import XYAFlogin from './views/login/XYAF/index.vue'
import commonPassword from './views/login/commonPassword.vue'
import Forgetthepassword from './views/login/Forgetthepassword.vue'
import phoneverification from './views/login/phoneverification.vue'
import Confirmthepassword from './views/login/Confirmthepassword.vue'
/*
系统管理公共部分：Publichead
 */
import Publichead from './views/Publichead/index.vue'
/*
监控台    Monitor
概括：     Generalization
监控台：   MonitoringStation
设备异常： EquipmentAbnormality
 */
import Monitor from './views/Monitor/component/index.vue'
import Generalization from './views/Monitor/Generalization.vue'
import MonitoringStation from './views/Monitor/MonitoringStation.vue'
import EquipmentAbnormality from './views/Monitor/EquipmentAbnormality.vue'



/*                                                      管理员后台管理 management
后台管理导航公共部分：Mcomponent
-----------------------基础管理  BasicManagement-------------
分类管理：ClassificationManagement
业主管理：ProprietorManagement
角色管理：RoleManagement
**权限设置：Permissions
用户管理：userManagement
建筑楼宇:BuildingBuilding

-----------------------设备  Equipment--------------
设备管理：deviceManagement
DTU信息：DTUInformation
-----------------------报表数据  ReportData-----------
设备增长信息：growthInformation
-----------------------其他   Other ------------
排查申请：ApplicationForInvestigation
信息反馈：informationFeedback
短信通知：SMSNotification
公司信息：CompanyInformation
 */
import management from './views/management/component/index.vue'

import ClassificationManagement from './views/management/BasicManagement/ClassificationManagement.vue'
import ProprietorManagement from './views/management/BasicManagement/ProprietorManagement.vue'
import RoleManagement from './views/management/BasicManagement/RoleManagement.vue'
import Permissions from './views/management/BasicManagement/RoleManagement/Permissions.vue'
import userManagement from './views/management/BasicManagement/userManagement.vue'
import BuildingBuilding from './views/management/BasicManagement/ProprietorManagement/BuildingBuilding.vue'

import deviceManagement from './views/management/Equipment/deviceManagement.vue'
import DTUInformation from './views/management/Equipment/DTUInformation.vue'

import growthInformation from './views/management/ReportData/growthInformation.vue'

import ApplicationForInvestigation from './views/management/Other/ApplicationForInvestigation.vue'
import informationFeedback from './views/management/Other/informationFeedback.vue'
import SMSNotification from './views/management/Other/SMSNotification.vue'
import CompanyInformation from './views/management/Other/CompanyInformation.vue'


/*                                                     业主后台管理  Ownermanagement
后台管理导航公共部分： Ownermanagement
业主概括：  OwnerGeneralization
附属账号：  OwnerSubsidiaryAccount
短信通知：  OwnerSMSNotification
检修报告：  OverhaulReport
个人信息：  PersonalInformation
 */

import Ownermanagement from './views/Ownermanagement/component/index.vue'
import OwnerGeneralization from './views/Ownermanagement/OwnerGeneralization.vue'
import OwnerSubsidiaryAccount from './views/Ownermanagement/OwnerSubsidiaryAccount.vue'
import OwnerSMSNotification from './views/Ownermanagement/OwnerSMSNotification.vue'
import OverhaulReport from './views/Ownermanagement/OverhaulReport.vue'
import PersonalInformation from './views/Ownermanagement/PersonalInformation.vue'



Vue.use(Router)


export default {
  routes: [{
      path: '/OFRIlogin',
      component: OFRIlogin,
      hidden: true
    },
    {
      path: '/XYZNlogin',
      component: XYZNlogin,
      hidden: true
    },
	{
      path: '/XYAFlogin',
      component: XYAFlogin,
      hidden: true
    },
    {
      path: '/commonPassword',
      component: commonPassword,
      name: 'commonPassword',
      children: [{
          path: 'step1',
          name: '忘记密码',
          component: Forgetthepassword
        },
        {
          path: 'step2',
          name: '手机号码验证',
          component: phoneverification
        },
        {
          path: 'step3',
          name: '确认密码',
          component: Confirmthepassword
        },
      ]
    },
    {
      path: '/',
      component: Publichead,
      name: 'Publichead',
      redirect: '/Monitor/Generalization',
      children: [{
          path: '/Monitor',
          component: Monitor,
          redirect: '/Monitor/Generalization',
          name: 'Monitor',
          children: [{
              path: 'Generalization',
              name: '概括',
              component: Generalization,
              meta: {
                title: 'Generalization',
                icon: 'news'
              }
            },
            {
              path: 'OwnerGeneralization',
              name: '业主概括',
              component: OwnerGeneralization,
              meta: {
                title: 'OwnerGeneralization',
                icon: 'news'
              }
            },
            {
              path: 'MonitoringStation',
              name: '控制台',
              component: MonitoringStation,
              meta: {
                title: 'MonitoringStation',
                icon: 'news'
              }
            },
            {
              path: 'EquipmentAbnormality',
              name: '设备异常',
              component: EquipmentAbnormality,
              meta: {
                title: 'EquipmentAbnormality',
                icon: 'news'
              }
            }
          ]
        },
        {
          path: '/management',
          component: management,
          redirect: '/management/ClassificationManagement',
          name: '后台管理',
          children: [{
              path: 'ClassificationManagement',
              name: '分类管理',
              component: ClassificationManagement,
              meta: {
                title: 'ClassificationManagement',
                icon: 'news'
              }
            },
            {
              path: 'ProprietorManagement',
              name: '业主管理',
              component: ProprietorManagement,
              meta: {
                title: 'ProprietorManagement ',
                icon: 'news'
              }
            },
            {
              path: 'RoleManagement',
              name: '角色管理',
              component: RoleManagement,
              meta: {
                title: 'RoleManagement',
                icon: 'news'
              }
            },
            {
              path: 'Permissions',
              name: '权限设置',
              component: Permissions,
              meta: {
                title: 'Permissions',
                icon: 'news'
              }
            },
            {
              path: 'userManagement',
              name: '用户管理',
              component: userManagement,
              meta: {
                title: 'userManagement',
                icon: 'news'
              }
            },
            {
              path: 'BuildingBuilding',
              name: '建筑楼宇',
              component: BuildingBuilding,
              meta: {
                title: 'BuildingBuilding',
                icon: 'news'
              }
            },
            {
              path: 'deviceManagement',
              name: '设备管理',
              component: deviceManagement,
              meta: {
                title: 'deviceManagement',
                icon: 'news'
              }
            },
            {
              path: 'DTUInformation',
              name: 'DTU信息',
              component: DTUInformation,
              meta: {
                title: 'DTUInformation',
                icon: 'news'
              }
            },
            {
              path: 'growthInformation',
              name: '设备增长信息',
              component: growthInformation,
              meta: {
                title: 'growthInformation',
                icon: 'news'
              }
            },
            {
              path: 'ApplicationForInvestigation',
              name: '排查申请',
              component: ApplicationForInvestigation,
              meta: {
                title: 'ApplicationForInvestigation',
                icon: 'news'
              }
            },
            {
              path: 'informationFeedback',
              name: '信息反馈',
              component: informationFeedback,
              meta: {
                title: 'informationFeedback',
                icon: 'news'
              }
            },
            {
              path: 'informationFeedback',
              name: '信息反馈',
              component: informationFeedback,
              meta: {
                title: 'informationFeedback',
                icon: 'news'
              }
            },
            {
              path: 'SMSNotification',
              name: '短信通知',
              component: SMSNotification,
              meta: {
                title: 'SMSNotification',
                icon: 'news'
              }
            },
            {
              path: 'CompanyInformation',
              name: '公司信息',
              component: CompanyInformation,
              meta: {
                title: 'CompanyInformation',
                icon: 'news'
              }
            }
          ]
        },
        {
          path: '/Ownermanagement',
          component: Ownermanagement,
          redirect: '/Ownermanagement/OwnerSubsidiaryAccount',
          name: '业主后台管理',
          children: [{
              path: 'OwnerSubsidiaryAccount',
              name: '附属账号',
              component: OwnerSubsidiaryAccount,
              meta: {
                title: 'OwnerSubsidiaryAccount ',
                icon: 'news'
              }
            },
            {
              path: 'OwnerSMSNotification',
              name: '短信通知',
              component: OwnerSMSNotification,
              meta: {
                title: 'OwnerSMSNotification',
                icon: 'news'
              }
            },
            {
              path: 'OverhaulReport',
              name: '检修报告',
              component: OverhaulReport,
              meta: {
                title: 'OverhaulReport ',
                icon: 'news'
              }
            },
            {
              path: 'PersonalInformation',
              name: '个人信息',
              component: PersonalInformation,
              meta: {
                title: 'PersonalInformation ',
                icon: 'news'
              }
            },
          ]
        },
      ]
    }
  ]
}
