const network = require('utils/network.js')
const api = require('utils/api.js')
const socket = require('utils/socket.js')
//const chatroom = require('../chatroom/chatroom.js')

var Path = '';

//app.js
App({
    //小程序初始化
    onLaunch: function () {
        var _this = this
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        //监听WebSocket关闭
        wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！')
            var socketOpen = false;
            //断开重连
            socket.talkSocket(_this.globalData.uid, _this.globalData.token);
        })
        
        //监听WebSocket错误
        wx.onSocketError(function (res) {
          //断开重连
          socket.talkSocket(_this.globalData.uid, _this.globalData.token);
        })

        //监听WebSocket接受到服务器的消息事件
        // wx.onSocketMessage(function (res) {
        //     var data = JSON.parse(res.data);
        //     if (data.uri == "connect.text"){ //聊天室返回数据处理
        //         console.log(data);
        //         _this.globalData.chatWithData = res.data.data
        //         //chatroom.log1.jieshouceshi(data);
        //     } 
        //     if (data.uri == "connect.match") { //用户匹配结果
        //         console.log('用户匹配结果');
        //         console.log(data);
        //     }
        //     if (data.uri == "message.applyVideo"){
        //         console.log("message.applyVideo");
        //         console.log(data);
        //         wx.navigateTo({
        //             url: `../../pages/videoOver/videoOver?avatar=${data.data.to_avatar}&nickname=${data.data.to_nickname}&id=${data.data.message_video_id}`
        //         })
        //     }
        //     if (data.uri == "message.acceptVideo") {
        //         console.log("message.acceptVideo");
        //         console.log(data);
        //         wx.navigateTo({
        //             url: `../../pages/meeting/meeting?connect_id=${data.data.connect_id}&connect_token=${data.data.connect_token}&from_nickname=${data.data.from_nickname}&from_uid=${data.data.from_uid}`
        //         })
        //     }
        //     console.log(res.data);
        //     network.unreadMessage(_this.globalData.uid, _this.globalData.token);
        // })
    },

    //错误处理
    httpError: function (status) {
      if (status.data.code == 401) {
        wx.showToast({
          title: 'token过期,重新登录',
          icon: `none`,
          duration: 2000
        })
        //token过期重新登录
        this.Renewsocket();
      } else if (status.data.code == 403) {
        wx.showToast({
          title: '账户禁用',
          icon: `none`,
          duration: 2000
        })
      } else if (status.data.code == 404) {
        wx.showToast({
          title: '签名验证失败,重新登录',
          icon: `none`,
          duration: 2000
        })
        //签名验证失败重新登录
        //this.Renewsocket();
      } else if (status.data.code == 499) {
        wx.showToast({
          title: '服务器错误',
          icon: `none`,
          duration: 2000
        })
      } else if (status.data.code == 400) {
        wx.showToast({
          title: status.data.msg,
          icon: `none`,
          duration: 2000
        })
      } else if (status.data.code == 4006) {
        wx.showToast({
          title: '金币不足',
          icon: `none`,
          duration: 2000
        })
      } else if (status.data.code == 4011) {
        wx.showToast({
          title: 'VIP过期',
          icon: `none`,
          duration: 2000
        })
      } else if (status.data.code == 4012) {
        wx.showToast({
          title: '访问频繁',
          icon: `none`,
          duration: 2000
        })
      }
    },

    //socket登录失败重连/token过期重新登录
    Renewsocket: function(){
      console.log('重新登录')
      var that = this;
      wx.login({
        success: res => {
          if (res.code) {
            var codedata = res.code;
            wx.getSetting({
              success: (res) => {
                wx.getUserInfo({
                  success: function (res) {
                    let userInfo = res
                    //解析用户信息并发送到后台
                    var encryptedData = userInfo.encryptedData
                    var iv = userInfo.iv
                    var signature = userInfo.signature
                    var rawData = userInfo.rawData
                    that.globalData.userInfo = userInfo
                    wx.request({
                      url: api.API_URL + api.LOGIN,
                      data: {
                        sign_id: codedata,
                        type: 4,
                        encryptedData: encryptedData,
                        iv: iv,
                        signature: signature,
                        rawData: rawData
                      },
                      header: {
                        'channel': 'wechat_small'
                      },
                      method: 'GET',
                      success: function (res) {
                        if (res.data.code == 0) {
                          that.globalData.token = res.data.data.token; //全局 权限token
                          that.globalData.uid = res.data.data.id; //全局 用户id
                          that.globalData.avatar = res.data.data.avatar; //全局 头像
                          that.globalData.nickname = res.data.data.nickname; //全局 用户名
                          that.globalData.ID = res.data.data.id; //全局 请求id
                          that.globalData.ShowID = res.data.data.idnum; //全局 显示id
                          //创建websocket
                          socket.talkSocket(that.globalData.uid, that.globalData.token);
                        } else {
                          wx.showToast({
                            title: `登录失败请重新登录`,
                            icon: 'none',
                            duration: 2000
                          })
                        }

                      },
                      fail: function (res) {
                        console.log(res.errMsg)
                        wx.showToast({
                          title: `登录出错: ${res.errMsg}`,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    })
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              },
              fail: function () {
                wx.showToast({
                  title: '系统提示:网络错误',
                  icon: 'warn',
                  duration: 1500,
                })
              }
            })

          } else {
            wx.showToast({
              title: `用户登录失败`,
              icon: `none`,
              duration: 5000
            });
          }
        }
      })
    },



  //全局数据
  globalData: {
    userInfo: null,
    token: null, //用户token
    uid: null, //用户id
    avatar: null, //头像
    nickname: null, //用户名
    ID: null,  //用户请求id
    uID: null,
    listData: null,
    chatWithData: null, //聊天时时动态消息
    heart: false,
    ShowID: null, //用户展示id
    giftList: null, 
    VIP: null, //判断是否是vip
    custom_id:null,//客服id
    small_givetype_0:null,	//首页弹窗赠送
    small_givetype_2:null,	//下载app赠送
    small_givetype_3:null,	//每日分享奖励
    invite_url:null,	//推广地址
    commission: null, //用户佣金
    oneKey: 0, //一键约爱入口
    vip_surplus_day: null, //vip天数
    coin: null, //用户金币
    app_down_url: null, 
    wechart_img: null,
  }
})