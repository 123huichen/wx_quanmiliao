//接口地址
//var API_URL = 'https://2.baiwujie.com/apipro/?s=';  //正式
var API_URL = 'https://2.baiwujie.com/api/?s=';  //测试

var LOGIN = 'app/small.User/login'; //微信登录
var MOMENTS = 'app/usigns/moments'; //分享
//var GETLISTS = 'app/Category/getusers'; //获取分类用户列表
//var NEARBYPEOPLE = 'app/Nearbypeople/getlists'; //附近的人列表
var GETLISTS = 'app/small.user/getSmallCategoryusers'; //获取小程序分类用户列表
var GETSLIDES = 'app/slides/getslides'; //获取轮播图
var GETWXORDER = 'app/Recharge/getWxOrder'; //微信支付
var GETWALLET = 'app/wallet/getwallet'; //获取用户账户余额，佣金，魅力值
var USERINFO = 'app/User/userinfo'; //获取主播详情信息
var SENDTEXT = 'app/Message/sendText'; //发送文字消息
var GETLOGSUNREAD = 'app/contactuser/unread'; //获取未读消息数
var LISTS = 'app/Contactuser/lists'; //联系人列表
var GETLOGS = 'app/Message/getLogs'; //获取与指定用户消息列表
var GETPACKAGES = 'app/Recharge/getPackages'; //充值套餐
var GETPACKAGESV3 = 'app/Recharge/getPackagesV3'; //充值套餐（v3.2+）
var GIFTLISTS = 'app/Connectlogs/giftLists'; //礼物列表
var SENDGIFT = 'app/Wallet/sendGift'; //用户赠送礼物
var APPLY = 'app/Connectlogs/apply'; //直播申请匹配
var CANCELAPPLY = 'app/Connectlogs/cancelApply'; //取消匹配
var CLOSE = 'app/Connectlogs/close'; //关闭直播
var APPLYVIDEO = 'app/Message/applyVideo'; //申请视频
var CANCELVIDEO = 'app/Message/cancelVideo'; //取消视频聊天
var JOINROOM = 'app/Connectlogs/joinRoom'; //客户端进入房间连麦成功后通知服务器
var GETPOPSTATUS = 'app/small.Common/getPopStatus'; //获取弹窗状态
var GETWXMOBILE = 'app/small.User/getwxmobile'; //获取用户微信绑定手机号
var GETCODE = 'app/user/getcode'; //发送短信验证码
var BINDMOBILE = 'app/small.User/bindmobile'; //绑定手机号领取奖励
var GETBUYVIP = 'app/Userinfo/getBuyVip'; //新增获取平台vip充值记录
var VIP_PRIVILEGE = 'app/Userinfo/vip_privilege'; //VIP特权
var VIP_PACKAGE = 'app/Userinfo/vip_package'; //VIP套餐
var GETCONFIG = 'app/small.common/getConfig'; //配置数据
var GETDATA = 'app/Activityinvite/getdata'; //获取自己推广数据
var PEOPLES = 'app/Activityinvite/peoples'; //我邀请的人列表
var INCOMEDETAIL = 'app/Activityinvite/getDetail'; //收入明细
var SYSTEMGETLOGS = 'app/Notify/getlogs'; //获取系统消息列表
var GETLIVELOGS = 'app/Connectlogs/getlivelogs'; //获取通话记录
var GETINVITECODE = 'app/small.user/getinvitecode'; //获取用户小程序推广码
var INFO = 'app/User/info'; //获取用户信息
var GETINVITEVIPSTATUS = 'app/small.common/getinvitevipstatus'; //获取邀请vip状态
var BUYWX = 'app/Userinfo/buyWx'; //购买微信


module.exports = {
    API_URL: API_URL,
    LOGIN: LOGIN,
    GETLISTS: GETLISTS,
    MOMENTS: MOMENTS,
    GETWXORDER: GETWXORDER,
    GETWALLET: GETWALLET,
    USERINFO: USERINFO,
    SENDTEXT: SENDTEXT,
    GETLOGSUNREAD: GETLOGSUNREAD,
    GETLOGS: GETLOGS,
    LISTS: LISTS,
    GETPACKAGES: GETPACKAGES,
    GETPACKAGESV3: GETPACKAGESV3,
    GIFTLISTS: GIFTLISTS,
    SENDGIFT: SENDGIFT,
    APPLY: APPLY,
    CANCELAPPLY: CANCELAPPLY,
    APPLYVIDEO: APPLYVIDEO,
    CANCELVIDEO: CANCELVIDEO,
    JOINROOM: JOINROOM,
    GETPOPSTATUS: GETPOPSTATUS,
    GETCODE: GETCODE,
    BINDMOBILE: BINDMOBILE,
    GETWXMOBILE: GETWXMOBILE,
    GETBUYVIP: GETBUYVIP,
    VIP_PRIVILEGE: VIP_PRIVILEGE,
    VIP_PACKAGE: VIP_PACKAGE,
    GETSLIDES: GETSLIDES,
    GETCONFIG: GETCONFIG,
    GETDATA: GETDATA,
    PEOPLES: PEOPLES,
    INCOMEDETAIL: INCOMEDETAIL,
    SYSTEMGETLOGS: SYSTEMGETLOGS,
    GETLIVELOGS: GETLIVELOGS,
    GETINVITECODE: GETINVITECODE,
    INFO: INFO,
    GETINVITEVIPSTATUS: GETINVITEVIPSTATUS,
    BUYWX: BUYWX
}