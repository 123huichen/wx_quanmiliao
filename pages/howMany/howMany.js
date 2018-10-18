//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/howMany/howMany.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      //收入明细
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            page: 1,
            pageSize: 10
          },
          success: function (res) {
            if (res.data.code == '0') {
              var many = pushdArray(res.data.data.data);
              that.setData({
                list: that.data.list.concat(many),
              })
            } else {
              app.httpError(res);
            }
          },
          fail: function () {
            //失败后的逻辑
            app.httpError(res);
          },
          urlname: api.INCOMEDETAIL
        }
      )

      function pushdArray(arr) {
        if (arr.length) {
          for (var i = 0; i < arr.length; i++) {
            arr[i].create_at = that.formatDateTime(arr[i].create_at);
          }
        }
        return arr;
      }
  },

  //时间戳转yyyy - mm - dd
  formatDateTime: function (timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
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