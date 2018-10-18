//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')


var myGold;//金币

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      avatar: '',  //用户头像
      nickname: '', //用户名称
      myGold: '', //金币
      ID: '', //用户 展示id
      //showModal: false, //弹窗
      //vip_level: '', //Vip等级
      VIP: '', //是否是vip
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var avatar = app.globalData.avatar;
      var nickname = app.globalData.nickname;
      var ShowID = app.globalData.ShowID;
      that.setData({
          avatar: avatar,
          nickname: nickname,
          ID: ShowID,
          VIP: app.globalData.VIP
      })
      //添加加载动画
    //   wx.showLoading({
    //       title: '加载中',
    //       mask: true
    //   })
      network.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
              },
              success: function (res) {
                if (res.data.code == 0){
                  console.log(res)
                  myGold = res.data.data.coin;
                  app.globalData.commission = res.data.data.commission;
                  that.setData({
                    myGold: myGold,
                  })
                }else{
                  app.httpError(res);
                }
              },
              fail: function () {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.GETWALLET
          }
      )
  },
  

  //跳转到充值页面
  jumpToRecharge: function(){
      wx.navigateTo({
          url: '../recharge/recharge' + "?" + "myGold=" + myGold
      })
  },


  //跳转到会员中心
  jumpToVip: function(){
      wx.navigateTo({
          url: '../memberCentre/memberCentre'
      })
  },

  //底部导航跳转
  Jumptab: function (e) {
    network.tabJump(e);
  },

  //在线客服
  onlineService: function(){
    wx.navigateTo({
      url: '../chatroom/chatroom' + '?' + 'id=' + app.globalData.custom_id + '&' + 'name=在线客服',
    })
  },

  //弹窗
  showDialogBtn: function () {
    wx.navigateTo({
      url: '../share/share',
    })
  },

  //跳转到下载页
  withdraw: function () {
    wx.navigateTo({
      url: '../download/download'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var that = this;
      //获取用户信息
      network.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
              },
              success: function (res) {
                  if (res.data.code == 0){
                      that.setData({
                          vip_level: res.data.data.vip_level,
                      })
                  } else {
                    app.httpError(res);
                  }
                  
              },
              fail: function (res) {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.USERINFO
          }
      )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
     var that = this;
     if (myGold !== app.globalData.myGold){
       that.setData({
         myGold: app.globalData.myGold,
       })
     }
    //  network.GET(
    //      {
    //          params: {
    //              uid: app.globalData.uid,
    //              token: app.globalData.token,
    //          },
    //          success: function (res) {
    //            if (res.data.code == 0) {
    //              console.log(res)
    //              app.globalData.myGold = res.data.data.coin;
    //              myGold = res.data.data.coin;
    //              that.setData({
    //                myGold: myGold,
    //              })
    //            } else {
    //              app.httpError(res);
    //            }
    //          },
    //          fail: function () {
    //            //失败后的逻辑
    //            app.httpError(res);
    //          },
    //          urlname: api.GETWALLET
    //      }
    //  )
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
      return {
          title: '一对一视频交友，你喜欢的我们都有',
          path: '',
          imageUrl: 'http://static.yygo.tv/Fakemedia/o_1cd4q9cv74611mqf1n7cs0oecba.png',
          success: function (res) {
              // 转发成功
          },
          fail: function (res) {
              // 转发失败
          }
      }
  }
})