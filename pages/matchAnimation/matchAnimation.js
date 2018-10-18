//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')

// pages/matchAnimation/matchAnimation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      avatar: '', //头像
      animationData: {},
      Mask: false,
      onmatch: false,
      beatTimer:'',
      text: '',
      match: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        avatar: app.globalData.avatar,
        text: '正在寻找…',
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
      var that = this;
      var time = 0;
      Timing(); //计时器开始      

      //监听WebSocket接受到服务器的消息事件
      wx.onSocketMessage(function (res) {
        var data = JSON.parse(res.data);
        if (data.uri == "connect.match") {
          app.globalData.oneKey = 1;
          console.log("connect.match");
          wx.navigateTo({
            url: `../../pages/meeting/meeting?connect_id=${data.data.connect_id}&connect_token=${data.data.connect_token}&from_nickname=${data.data.from_nickname}&from_uid=${data.data.from_uid}`
          })
        }
        console.log(data);
      })


      function Timing() {
        that.data.beatTimer = setInterval(function () {
          time++;
          console.log('申请匹配度秒' + time);
          if (time == 3) {
            that.setData({
              match: true,
            })
            
          } if (time == 20){
            that.cancellive(time);
            that.setData({
              Mask: true,
              onmatch: true,
            })
          }
        }, 1000);
      }
  }, 

  //立即前往一键约爱
  goImmediately: function(){
    var that = this;
    //申请匹配
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
          match_type: 0,
        },
        success: function (res) {
          console.log(res);
          if (res.data.data.txt) {
            that.setData({
              text: res.data.data.txt,
              match: false
            })
          }
        },
        fail: function () {
          //失败后的逻辑
          network.httpError(res);
        },
        urlname: api.APPLY
      }
    )        
  },


  //取消一键约爱
  cancellive: function (time){
    console.log('取消一键约爱')
    //清除计时器
    clearTimeout(this.data.beatTimer);
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == '0') {
            if (time == 20){
               return;
            } else{
              wx.switchTab({
                url: '../index/index'
              })
            }
            
          } else {
            app.httpError(res);
          }
        },
        fail: function (res) {
          //失败后的逻辑
          app.httpError(res);
        },
        urlname: api.CANCELAPPLY
      }
    )
  },

  //取消弹窗
  canceWithdraw: function () {
    this.setData({
      Mask: false,
      onmatch: false,
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  //跳转到下载页
  withdraw: function(){
    wx.navigateTo({
      url: '../download/download'
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //清除计时器
    clearTimeout(this.data.beatTimer);
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