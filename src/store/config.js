// const MENU_NAME = {
//   BOOKING: 'BOOKING',
//   STATIC: 'STATIC',
//   SETTING: 'SETTING'
// }

export default {
  topbar: true,
  navbar: true,
  header_menu: true,
  profile_sidebar: true,
  img_server: 'http://imgd.v2.yimi99.com',
  pub_server: 'http://img.v2.yimi99.com/static/',
  profile_menus: [],  // 用户个人中心顶部菜单数据, 医护个人中顶部菜单数据
  menu_item: {children: []}, //  医护个人中左侧菜单数据
  u_profile_menus: [
    {
      name: '个人中心',
      url: ''
    },
    {
      name: '我收藏的医生',
      url: ''
    },
    {
      name: '我的约床',
      url: ''
    }
  ],

  d_profile_menus: [
    {
      name: '首页',
      url: 'Work',
      children: []
    },
    {
      name: '约床',
      url: 'DoctorBooking',
      children: [
        {
          name: '帮患者预约',
          url: 'PatientBooking'
        },
        {
          name: '预约队列',
          url: 'BookingQueue'
        },
        {
          name: '分配管理组',
          url: 'AssignGroup'
        },
        {
          name: '待入住列表',
          url: 'CheckInList'
        },
        {
          name: '床位管理',
          url: 'BedManage'
        },
        {
          name: '我的患者',
          url: 'MyPatient'
        },
        {
          name: '患者列表',
          url: 'PatientList'
        },
        {
          name: '预约概况',
          url: 'Situation'
        }
      ]
    },
    {
      name: '统计',
      url: 'Statistic',
      children: [
        {
          name: '统计分析',
          url: 'StatisticAnalysis'
        },
        {
          name: '审计日志',
          url: 'OperateLog'
        }
      ]
    },
    {
      name: '设置',
      url: 'Setting',
      children: [
        {
          name: '角色权限',
          url: 'RoleManage'
        },
        {
          name: '消息模板',
          url: 'MessageModel'
        },
        {
          name: '约床设置',
          url: 'BookingSetting'
        },
        {
          name: '机构管理',
          url: 'OrignManage'
        },
        {
          name: '房间管理',
          url: 'RoomManage'
        },
        {
          name: '科室床位',
          url: 'DepartmentBed'
        },
        {
          name: '医生列表',
          url: 'DoctorList'
        },
        {
          name: '审核医生',
          url: 'DocApproval'
        }
      ]
    },
    {
      name: '个人信息',
      url: 'DoctorInfos',
      children: [
        {
          name: '个人资料',
          url: 'Personal'
        },
        {
          name: '账号设置',
          url: 'AccountSetting'
        },
        {
          name: '电子名片',
          url: 'MyCard'
        }
      ]
    }
  ]

}
