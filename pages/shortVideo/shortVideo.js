//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

var user_Id = '';

// pages/shortVideo/shortVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pretty_video: '',
    user_Id: '',
    vip: '',
    avatar: '',
    Mask: false,
    privateChat: false,
    videowxChat: false,
    ViewWX: false,
    Anchorname: '',
    signature: '', //个性签名
    tags: [], //主播标签
    work_status: '',
    wx_status: '',
    wx: '',
    wx_number: false,
    wx_price: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pretty_video = options.pretty_video;
    var work_status = options.work_status;
    user_Id = options.id;
    that.setData({
      pretty_video: pretty_video,
      vip:app.globalData.VIP,
      work_status: work_status,
    })
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
          to_uid: user_Id, //对方id
        },
        success: function (res) {
          if (res.data.code == '0') {
            var wx_status = res.data.data.wx_info.wx_status;
            console.log(res);
            that.setData({
              avatar: res.data.data.avatar,
              Anchorname: res.data.data.nickname,
              signature: res.data.data.signature,
              tags: res.data.data.tags,
              price: res.data.data.price,
              wx_status: wx_status,
              wx: res.data.data.wx_info.wx,
              wx_price: res.data.data.wx_info.wx_price,
            })
          } else {
            app.httpError(res);
          }

        },
        fail: function (res) {
          app.httpError(res);
        },
        urlname: api.USERINFO
      }
    )
  },


  //跳转到聊天页
  videoNews: function(e){
    wx.navigateTo({
      url: '../chatroom/chatroom' + '?' + 'id=' + user_Id,
    })
  },

  //获取微信
  videowx: function(e){
    var that = this;
    var wx = e.currentTarget.id
    if (wx !== '' && wx !== null && wx !== 'undefined'){
      that.setData({
        wx_number: true,
        wx: wx,
      })
    } else {
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            to_uid: user_Id, //对方id
          },
          success: function (res) {
            if (res.data.code == '0') {
              that.setData({
                wx_number: true,
                wx: res.data.data.wx,
              })
            } else {
              if (res.data.code == 4006){
                that.recharge();
              } else {
                app.httpError(res);
              }
            }

          },
          fail: function (res) {
            app.httpError(res);
          },
          urlname: api.BUYWX
        }
      )
    }
  },

  //套餐充值
  recharge: function () {
    var that = this;
    //获取充值套餐
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log(res.data.data)
            var Package = res.data.data;
            for (var i = 0; i < Package.length; i++){
              if (that.data.wx_price - app.globalData.coin < Package[i].coin){
                var money = Package[i].money;
                var id = Package[i].id;
                //小程序支付
                network.GET(
                  {
                    params: {
                      uid: app.globalData.uid,
                      token: app.globalData.token,
                      money: money,
                      id: id,
                      channel: 'JSAPI',
                      //channel: 'APP'
                    },
                    success: function (res) {
                      console.log(res)
                      wx.requestPayment(
                        {
                          //'appId': res.data.data.appId,
                          'timeStamp': res.data.data.timeStamp,
                          'nonceStr': res.data.data.nonceStr,
                          'package': res.data.data.package,
                          'signType': 'MD5',
                          'paySign': res.data.data.sign,
                          'success': function (res) {
                            that.videowx();
                          },
                          'fail': function (res) {
                            console.log(res)
                          },
                          'complete': function (res) {
                            console.log(res)
                          }
                        })
                    },
                    fail: function (res) {
                      //失败后的逻辑
                    },
                    urlname: api.GETWXORDER
                  }
                )
              }
              return;
            }
          } else {
            app.httpError(res);
          }
        },
        fail: function () {
          //失败后的逻辑
          app.httpError(res);
        },
        urlname: api.GETPACKAGESV3
      }
    )
  },

  //vip充值提醒
  videoNewsNo: function(){
    this.setData({
      Mask: true,
      privateChat: true,
    })
  },

  //非vip查看微信微信
  videowxNo: function(){
    this.setData({
      Mask: true,
      videowxChat: true,
    })
  },

  //取消提示弹窗
  cancelVIP: function(){
    this.setData({
      Mask: false,
      privateChat: false,
      videowxChat: false,
      ViewWX: false,
    })
  },

  //跳转到vip开通
  OpenVIP: function(){
    this.setData({
      Mask: false,
      privateChat: false,
    })
    wx.navigateTo({
      url: '../memberCentre/memberCentre',
    })
  },

  //返回上一级
  backLastPage:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  //支付产看微信号
  PaymentWX:function(){

  },

  //发起视频请求
  videoChat: function(){
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
          to_uid: user_Id, //对方id
        },
        success: function (res) {
          if (res.data.code == '0') {
            console.log('发起成功');
            console.log(res);
          } else {
            app.httpError(res);
          }

        },
        fail: function (res) {
          app.httpError(res);
        },
        urlname: api.APPLYVIDEO
      }
    )
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
    //监听WebSocket接受到服务器的消息事件
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      if (data.uri == "message.applyVideo") {
        console.log("message.applyVideo");
        console.log(data);
        wx.navigateTo({
          url: `../../pages/videoOver/videoOver?avatar=${data.data.to_avatar}&nickname=${data.data.to_nickname}&id=${data.data.message_video_id}`
        })
      }
      console.log(res);
    })
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
  
  }
})