//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')


// pages/news/news.js
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
    //获取好友消息列表
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == '0') {
            console.log(res.data.data.data)
            that.setData({
              list: that.data.list.concat(res.data.data.data)
            })
          } else {
            //异常弹窗
            app.httpError(res);
          }

        },
        fail: function (res) {
          //失败弹窗
          app.httpError(res);
        },
        urlname: api.LISTS
      }
    )
    //network.unreadMessage(app.globalData.uid, app.globalData.token);
  },

  //跳转到聊天窗口
  chatWindow: function(e){
      var id = e.currentTarget.id;
      console.log(id);
      var name = e.currentTarget.dataset.name
      console.log(name);
      wx.navigateTo({
          url: '../chatroom/chatroom' + '?' + 'id=' + id + '&' + 'name=' + name,
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var that = this;
      
  },

  //底部导航跳转
  Jumptab: function (e) {
    network.tabJump(e);
  },

  //获取通话记录
  callRecords: function(){
    wx.navigateTo({
      url: '../callRecords/callRecords',
    })
  },

  //获取系统消息
  system: function(){
    wx.navigateTo({
      url: '../systemNews/systemNews' + '?' + 'id=systemId' + '&' + 'name=系统消息',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that = this;
      //好友列表监听是否有好友消息消息
      wx.onSocketMessage(function (res) {
          console.log("好友列表消息接收")
          var data = JSON.parse(res.data);
          console.log(res)
          if (data.uri == 'message.text') {
              that.setData({
                  list: [] //好友列表先制空
              })
              network.GET(
                  {
                      params: {
                          uid: app.globalData.uid,
                          token: app.globalData.token,
                      },
                      success: function (res) {
                        if (res.data.code == 0) {
                          console.log(res.data.data.data)
                          that.setData({
                            list: that.data.list.concat(res.data.data.data)
                          })
                        } else{
                          app.httpError(res);
                        }
                      },
                      fail: function () {
                        //失败后的逻辑
                        app.httpError(res);
                      },
                      urlname: api.LISTS
                  }
              )
              network.unreadMessage(app.globalData.uid, app.globalData.token);
          }
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      // this.setData({
      //     list: [],
      // })
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