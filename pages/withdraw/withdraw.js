//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Mask: false,
    wechart_img: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //跳转到落地页
  jumpOutside: function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "ios") {
          that.setData({
            Mask: true,
            wechart_img: app.globalData.wechart_img,
          })
        } else if (res.platform == "android") {
          if (app.globalData.app_down_url == ''){
            that.setData({
              Mask: true,
              wechart_img: app.globalData.wechart_img,
            })
          } else {
            wx.navigateTo({
              url: '../download/download'
            })
          }
        }
      }
    })
  },

  //返回上一页
  backLastPage: function(){
    wx.navigateBack({
      delta: 1
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
  
  }
})