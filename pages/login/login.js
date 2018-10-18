// pages/login/login.js
//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

var codedata = null;
var scene= '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
      showModel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('登录')
      var that = this;
      scene = decodeURIComponent(options.scene)
      if (scene == 'undefined' || scene == '' || scene == null){
        scene='';
        wx.showToast({
          title: 'scene为空',
          icon: 'none',
          duration: 1500,
        })
      }
      // 登录
      wx.login({
          success: res => {
              //发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log(res)
              if (res.code) {
                  codedata = res.code;
                  console.log('code值' + codedata);
                  //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
                  //app.globalData.userInfo = wx.getStorageSync('userInfo')
                  wx.getSetting({
                      success: (res) => {
                          //判断用户没有授权需要弹框
                          if (!res.authSetting['scope.userInfo']) {
                              console.log('没授权')
                              that.setData({
                                  showModel: true
                              })
                          } else {//已经授权。不需要弹框
                              console.log('已授权')
                              that.setData({
                                  showModel: false
                              })
                              wx.showLoading({
                                  title: '加载中...'
                              })
                              wx.getUserInfo({
                                  success: function (res) {
                                      that.getOP(res);
                                  },
                                  fail: function(res){
                                    wx.showToast({
                                      title: '获取用户信息失败 重新获取',
                                      icon: 'none',
                                      duration: 1500,
                                    })
                                    // wx.getUserInfo({
                                    //   success: function (res) {
                                    //     that.getOP(res);
                                    //   }
                                    // })
                                  }
                              })
                              
                          }
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

  //获取用户信息新接口
  agreeGetUser: function (e) {
      //设置用户信息本地存储
      try {
          if (e.detail.errMsg == 'getUserInfo:fail auth deny'){ //用户授权失败
              wx.showToast({
                  title: '用户授权失败，请重新授权登录',
                  icon: 'none',
                  duration: 1500,
              })
             return;
          } else {
              wx.setStorageSync('userInfo', e.detail)
          }
          
      } catch (e) {
          wx.showToast({
              title: '系统提示:网络错误',
              icon: 'none',
              duration: 1500,
          })
      }
      wx.showLoading({
          title: '加载中...'
      })
      let that = this
      that.setData({
          showModel: false
      })
      that.getOP(e.detail)
  },

  getOP: function (res) {//提交用户信息 获取用户id
      let that = this
      let userInfo = res
      app.globalData.userInfo = res;
      //解析用户信息并发送到后台
      var encryptedData = userInfo.encryptedData
      var iv = userInfo.iv
      var signature = userInfo.signature
      var rawData = userInfo.rawData
      app.globalData.userInfo = userInfo
      wx.request({
          url: api.API_URL + api.LOGIN,
          data: {
              sign_id: codedata,
              type: 4,
              encryptedData: encryptedData,
              iv: iv,
              signature: signature,
              rawData: rawData,
              invite_uid: scene
          },
          header: {
            'channel': 'wechat_small'
          },
          method: 'GET',
          success: function (res) {
              if (res.data.code == 0){
                  console.log(res.data.data.token + ' login成功获取token');
                  console.log(res.data.data.id + ' login成功获取uid');
                  app.globalData.token = res.data.data.token; //全局 权限token
                  app.globalData.uid = res.data.data.id; //全局 用户id
                  app.globalData.avatar = res.data.data.avatar; //全局 头像
                  app.globalData.nickname = res.data.data.nickname; //全局 用户名
                  app.globalData.ID = res.data.data.id; //全局 请求id
                  app.globalData.ShowID = res.data.data.idnum; //全局 显示id
                  app.globalData.VIP = res.data.data.is_vip; //是否是vip
                  app.globalData.vip_surplus_day = res.data.data.vip_surplus_day; //vip天数
                  app.globalData.coin = res.data.data.coin; //用户金币
                  //创建websocket
                  socket.talkSocket(app.globalData.uid, app.globalData.token);
                  wx.switchTab({
                      url: '../index/index'
                  })
              } else{
                  wx.showToast({
                      title: `登录失败请重新登录`,
                      icon: 'none',
                      duration: 2000
                  })
                  app.httpError(res);
              }
              
          },
          fail: function (res) {
            app.httpError(res);
            wx.showToast({
                title: `登录出错: ${res.errMsg}`,
                icon: 'none',
                duration: 2000
            })
          },
          complete: function () {
              // complete
          }
      })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // title: ,
    // desc: ,
    // path: 
  }
})