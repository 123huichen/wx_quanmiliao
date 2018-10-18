//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/match/match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //一键约爱
  akeyLove: function () {
      network.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
              },
              success: function (res) {
                  console.log('一键约爱');
                  //跳转到匹配动画页
                  wx.navigateTo({
                      url: '../matchAnimation/matchAnimation'
                  })
              },
              fail: function () {
                  //失败后的逻辑
                  app.httpError(res);
              },
              urlname: api.NEARBYPEOPLE
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