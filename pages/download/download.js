//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

// pages/download/download.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if (id = "banner"){
      this.setData({
        url: 'https://qiniu.pdvzo.cn/devqiniu/activity/index.html'
      })
    } else {
      this.setData({
        //url: "https://www.pdvzo.cn/miaoai.apk",
        //url: "https://www.pdvzo.cn/?invite_uid=" + app.globalData.uid
        url: app.globalData.app_down_url
      })
    }
    
  },

  bindmessage: function (e){
    console.log(e.detail);
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