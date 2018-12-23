// show: meta.label -> name
// name: component name
// meta.label: display label
// lazy loading Components
// https://github.com/vuejs/vue-router/blob/dev/examples/lazy-loading/app.js#L8
// const lazyLoading = (name, index = false) => () => System.import(`views/${name}${index ? '/index' : ''}.vue`)
const lazyLoading = (name, index = false) => () => System.import(`views/${name}${index ? '/index' : ''}.vue`)
export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    meta: {
      icon: 'fa-tachometer'
    },
    component: lazyLoading('dashboard', true)
  },
  {
    name: 'Main',
    path: '/main',
    component: lazyLoading('Main', true),
    children: [
      {   // 首页
        name: 'Home',
        path: 'home',
        component: lazyLoading('Home', true)
      },
      {   // 提醒
        name: 'Remind',
        path: 'remind',
        component: lazyLoading('Home/Remind/MyRemind')
      },
      {   // 我的
        name: 'User',
        path: 'user',
        meta: {auth: 'user'},
        component: lazyLoading('Main/User', true)
      },
      { // 扫码进入定制科室主页
        name: 'SpecialDeptMain',
        path: 'special-dept/:id',
        component: lazyLoading('SpecialDept/index')
      }
    ]
  },
  {  // 推荐医生
    name: 'RecomDoctor',
    path: '/home/recom-doc',
    component: lazyLoading('Home/RecomDoctor')
  },
  {
    name: 'SearchResult',
    path: '/search-result',
    component: lazyLoading('Home/SearchResult')
  },
  {
    name: 'Booking',
    path: '/booking',
    component: lazyLoading('Booking', true)
  },
  { // 扫医生二维码约床
    name: 'DoctorBooking',
    path: '/qrcode/doctor/:id',
    component: lazyLoading('QRcode', true)
  },
  { // 扫科室二维码约床
    name: 'DeptBooking',
    path: '/qrcode/hospital/dept/:id',
    component: lazyLoading('QRcode', true)
  },
  { // 扫医院二维码约床
    name: 'HospBooking',
    path: '/qrcode/hospital/:id',
    component: lazyLoading('QRcode', true)
  },
  {
    name: 'BookingResult',
    path: '/bookingResult',
    component: lazyLoading('Booking/BookingResult')
  },
  {
    name: 'HospitalMain',
    path: '/hospital-main/:hosId',
    component: lazyLoading('Home/HospitalMain')
  },
  // 扫码医院主页
  {
    name: 'HospitalMainHome',
    path: '/hospital-main-home/:hosId',
    component: lazyLoading('Home/HospitalMain')
  },
  {   // 科室主页
    name: 'DeptMain',
    path: '/dept-main/:deptId',
    component: lazyLoading('Home/DeptMain')
  },
  {   // 扫码跳转，科室主页
    name: 'QRCodeDeptMain',
    path: '/qrcode-dept-main/:deptId',
    component: lazyLoading('Home/DeptMain')
  },
  {
    name: 'DocDetail',
    path: '/doctor-detail/:docId',
    component: lazyLoading('Home/DoctorDetail')
  },
  {
    name: 'SearchResultMore',
    path: '/search-result-more/:type',
    component: lazyLoading('Home/SearchResultMore')
  },
  {
    name: 'AboutUs',
    path: '/aboutus',
    component: lazyLoading('ForApp/Aboutus')
  },
  {
    name: 'HelpCenter',
    path: '/help-center',
    component: lazyLoading('ForApp/HelpCenter')
  },
  {
    name: 'HelpCenterDetailForApp',
    path: '/help-center-detail/:id',
    component: lazyLoading('ForApp/HelpCenterDetail')
  },
  { // 就诊记录
    name: 'VisitDocRecord',
    path: '/user/visit-doc-record',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/VisitDocRecord')
  },
  { // 孕检记录
    name: 'PrenatalRecord',
    path: '/user/prenatal-record',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/PrenatalRecord')
  },

  {  // 约床详情
    name: 'BookingDetail',
    path: '/user/my-booking/detail/:id',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/BookingDetail')
  },
  {  // 转诊详情
    name: 'TransDetail',
    path: '/user/my-transfer/detail/:id/:type',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/TransDetail')
  },
  {  // 添加病历图片
    name: 'AddCaseImg',
    path: '/user/add-case-img/:id/:type',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/AddCaseImg')
  },
  {
    name: 'UserAgreement',
    path: '/user-agreement',
    component: lazyLoading('ForApp/UserAgreement')
  },
  {
    name: 'Suggest',
    path: '/suggest/:phone',
    component: lazyLoading('ForApp/Suggest')
  },
  // 用户个人中心
  {
    name: 'UserInformation',
    path: '/user/information',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/UserInformation')
  },
  {
    name: 'ModifyInfo',
    path: '/user/modifyInfo/:type',
    component: lazyLoading('Main/User/ModifyInfo')
  },
  {  // 不需要评论的文章，例如帮助中心，关于我们
    name: 'CommonContent',
    path: '/commonContent/:type',
    component: lazyLoading('Main/User/CommonContent')
  },
  {  // 可以评论的文章，例如孕期咨询，健康咨询
    name: 'CommentsArticle',
    path: '/comments-article/:type',
    component: lazyLoading('Main/User/CommentArticle')
  },
  {
    name: 'HelpCenterDetailUser',
    path: '/commonContent/helpCenterDetail/:id',
    component: lazyLoading('Main/User/HelpCenterDetail')
  },
  { // 健康档案
    name: 'HealthRecords',
    path: '/user/case-his/healthRecords',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/HealthRecords')
  },
  { // 新建档案
    name: 'NewCase',
    path: '/user/case-his/new-case/:id',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/NewCase')
  },
  { // 基础健康信息
    name: 'CaseInfo',
    path: '/user/case-his/case-info',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/CaseInfo')
  },
  { // 病历详情
    name: 'CaseDetail',
    path: '/user/case-his/case-detail/:id',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/CaseDetail')
  },
  { // 搜索医院
    name: 'SearchHos',
    path: '/user/case-his/search-hos/:areaId',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/SearchHospital')
  },
  { // 搜索科室
    name: 'SearchDept',
    path: '/user/case-his/search-dept/:hospId',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/CaseHistory/SearchDept')
  },
  {
    name: 'Login',
    path: '/login',
    component: lazyLoading('Login/Login')
  },
  {
    name: 'Register',
    path: '/register',
    component: lazyLoading('Login/Register')
  },
  {
    name: 'ForgetPassword',
    path: '/forgetPassword',
    component: lazyLoading('Login/ForgetPassword')
  },
  {
    name: 'CheckPhone',
    path: '/checkPhone',
    component: lazyLoading('Login/CheckPhone')
  },
  {   // 设置
    name: 'Setting',
    path: '/user/setting',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/Setting')
  },
  {   // 修改密码
    name: 'ChangePassword',
    path: '/user/changePassword',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/ChangePassword')
  },
  { // 我的钱包
    name: 'Wallet',
    path: '/user/wallet',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/Wallet')
  },
  { // 收支记录
    name: 'TradeRecord',
    path: '/user/trade-record',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/TradeRecord')
  },
  { // 充值余额
    name: 'Recharge',
    path: '/user/recharge',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/Recharge')
  },
  { // 确认订单
    name: 'ConfirmOrder',
    path: '/user/confirm-order',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/ConfirmOrder')
  },
  { // 支付和支付结果
    name: 'Pay',
    path: '/user/pay',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/Pay')
  },
  { // 我的消息
    name: 'Message',
    path: '/user/message',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/Message')
  },
  {
    // 保险在线
    name: 'InsuranceList',
    path: '/insurance/list',
    // meta: {auth: 'user'},
    component: lazyLoading('Home/InsuranceList')
  },
  // {
  //   // 保险介绍
  //   name: 'InsuranceIntroduce',
  //   path: '/insurance/introduce',
  //   // meta: {auth: 'user'},
  //   component: lazyLoading('Home/Insurance/InsuranceIntroduce')
  // },
  {
    // 保险申请
    name: 'InsuranceApply',
    path: '/insurance/apply/:id',
    // meta: {auth: 'user'},
    component: lazyLoading('Home/InsuranceApply')
  },
  {
    // 保险介绍
    name: 'InsuranceIntroduce',
    path: '/insurance/introduce/:id',
    // meta: {auth: 'user'},
    component: lazyLoading('Home/InsuranceIntroduce')
  },
  {
    // 我的收藏
    name: 'MyFollow',
    path: '/user/follow',
    // meta: {auth: 'user'},
    component: lazyLoading('Main/User/MyFollow')
  },
  {
    // 医秘客服
    name: 'YimiService',
    path: '/home/yimi-service',
    component: lazyLoading('Home/YimiService')
  },
  {
    name: 'ChatDetail',
    path: '/home/yimi-service/chat',
    component: lazyLoading('Home/ChatDetail')
  },
  {
    // 文章详情
    name: 'ArticleDetail',
    path: '/user/article-detail/:id',
    component: lazyLoading('Main/User/ArticleDetail')
  },
  {
    //  选择城市
    name: 'SelectLocation',
    path: '/home/select-location',
    component: lazyLoading('Home/SelectLocation')
  },
  {
    //  就医指导
    name: 'DeptGuideDetail',
    path: '/home/dept/guide-detail/:id/:deptId/:size',
    component: lazyLoading('Home/DeptGuideDetail')
  },
  {
    //  提醒详情
    name: 'RemindDetail',
    path: '/main/remind-detail/:id',
    component: lazyLoading('Main/Remind/RemindDetail')
  },
  {
    //  我的提醒
    name: 'MyRemind',
    path: '/home/my-remind',
    component: lazyLoading('Main/Remind', true)
  },
  {
    //  复诊提醒
    name: 'EditReturnRemind',
    path: '/home/return-remind',
    component: lazyLoading('Home/Remind/EditReturnRemind')
  },
  {
    //  用药提醒
    name: 'EditMedicineRemind',
    path: '/home/medicine-remind',
    component: lazyLoading('Home/Remind/EditMedicineRemind')
  },
  {
    //  其他提醒
    name: 'EditOtherRemind',
    path: '/home/other-remind',
    component: lazyLoading('Home/Remind/EditOtherRemind')
  },
  {
    //  提醒管理
    name: 'RemindManager',
    path: '/home/remind-manager',
    component: lazyLoading('Home/Remind/RemindManager')
  },
  { // 产检申请
    name: 'PrenatalCareApply',
    path: '/user/prenatal-care-apply',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/PrenatalCareApply')
  },
  { // 产检详情
    name: 'PrenatalDetail',
    path: '/user/prenatal-detail/:id',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/PrenatalDetail')
  },
  { // 科室预约二维码扫码后选择界面（约床或者产检）
    name: 'DeptServiceType',
    path: '/dept-main/:deptId/service-type',
    component: lazyLoading('QRcode/DeptServiceType')
  },
  {
    //  我的保单列表
    name: 'MyInsuList',
    path: '/user/my-insur-list',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/MyInsuList')
  },
  {
    //  保单详情
    name: 'InsuranceDetail',
    path: '/user/my-insur-list/detail/:id',
    meta: {auth: 'user'},
    component: lazyLoading('Main/User/InsuranceDetail')
  },
  { // 扫医生二维码跳转购买保险
    name: 'QRcodeInsurDoc',
    path: '/qr-insur/doc/:id',
    component: lazyLoading('Home/QRcodeInsur')
  },
  { // 扫业务员二维码跳转购买保险
    name: 'QRcodeInsurSale',
    path: '/qr-insur/sale/:insurId/:saleAccount',
    component: lazyLoading('Home/QRcodeInsur')
  },
  { // 保险购买成功
    name: 'InsuranceSuccess',
    path: '/insur-success',
    component: lazyLoading('Home/InsuranceSuccess')
  },
  { // 专家咨询
    name: 'ExpertConsult',
    path: '/special/expert-cons',
    component: lazyLoading('SpecialDept/ExpertConsult')
  },
  { // 专家咨询
    name: 'ConsultDetail',
    path: '/special/consult-detail/:docId/:docName',
    component: lazyLoading('SpecialDept/ConsultDetail')
  },
  { // 宝妈圈
    name: 'MamGroup',
    path: '/special/mom-group',
    component: lazyLoading('SpecialDept/MamGroup')
  },
  { // 宝妈圈,群聊
    name: 'GroupChat',
    path: '/special/group-chat/:groupId',
    component: lazyLoading('SpecialDept/GroupChat')
  },
  { // 孕妈成员
    name: 'GroupInfo',
    path: '/special/group-info/:groupId',
    component: lazyLoading('SpecialDept/GroupInfo')
  },
  { // 孕妇学校
    name: 'PregnaSchool',
    path: '/special/pregna-school',
    component: lazyLoading('SpecialDept/PregnaSchool')
  },
  { // 我的课程
    name: 'MyCourse',
    path: '/special/mycourse',
    component: lazyLoading('SpecialDept/MyCourse')
  },
  { // 日间病房预约
    name: 'DayWard',
    path: '/special/day-ward',
    component: lazyLoading('SpecialDept/DayWard')
  },
  { // 新生儿游泳
    name: 'BabySwiming',
    path: '/special/baby-swim',
    component: lazyLoading('SpecialDept/BabySwiming')
  },
  { // 课程详情
    name: 'CourseDetail',
    path: '/special/pregna-school/detail/:id',
    component: lazyLoading('SpecialDept/CourseDetail')
  },
  { // 高危自评
    name: 'SafetyEvaluation',
    path: '/special/safe-eval',
    component: lazyLoading('SpecialDept/SafetyEvaluation')
  },
  { // 高危自评详情
    name: 'EvaluatDetail',
    path: '/special/safe-eval/detail',
    component: lazyLoading('SpecialDept/EvaluatDetail')
  },
  { // 设置孕周
    name: 'GestationalWeeks',
    path: '/special/gest-week',
    component: lazyLoading('SpecialDept/GestationalWeeks')
  },
  { // 科室预约
    name: 'SepcialDeptBooking',
    path: '/special/dept-booking',
    component: lazyLoading('SpecialDept/SepcialDeptBooking')
  }
]
