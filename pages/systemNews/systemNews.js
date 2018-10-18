//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

// pages/systemNews/systemNews.js
var user_Id = ''; //对方id  
var user_name = ''; //对方名称
var myid = '';
var page = 1; //聊天页码
var dataId = '';

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
    var that = this;
    //获取页面跳转传递的用户id和用户name
    user_Id = options.id;
    user_name = options.name;
    that.setData({
      user_name: user_name,
    })
    //页面初始化获取聊天记录
    if (user_Id == 'systemId') {
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            page: page,
            page_size: 20,
          },
          success: function (res) {
            if (res.data.code == '0') {
              console.log(res.data.data.data)
              if (res.data.data.data.length !== 0) {
                myid = app.globalData.uid
                page++;
                //修改数组  添加数组对象元素 判断对话来源
                var datamap = res.data.data.data;
                var changeAdd = socket.pushdArray(datamap, myid);
                //获取最后一个数组的id
                dataId = changeAdd[changeAdd.length - 1].id;
                console.log(changeAdd);
                that.setData({
                  news_lists: that.data.news_lists.concat(changeAdd),
                  toView: dataId
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
          urlname: api.SYSTEMGETLOGS
        }
      )
    } else {
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            to_uid: user_Id,
            page: page,
            page_size: 20,
          },
          success: function (res) {
            if (res.data.code == '0') {
              console.log(res.data.data.data)
              if (res.data.data.data.length !== 0) {
                myid = app.globalData.uid
                page++;
                //修改数组  添加数组对象元素 判断对话来源
                var datamap = res.data.data.data;
                var changeAdd = socket.pushdArray(datamap, myid);
                //获取最后一个数组的id
                dataId = changeAdd[changeAdd.length - 1].id;
                console.log(changeAdd);
                that.setData({
                  news_lists: that.data.news_lists.concat(changeAdd),
                  toView: dataId
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
          urlname: api.GETLOGS
        }
      )
    }
  },

  //返回上一页
  backLastPage: function () {
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