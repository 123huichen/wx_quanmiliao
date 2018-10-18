//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/callRecords/callRecords.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page: 1,
    pagecount: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取通话记录
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
          page: that.data.page,
          page_size: 10,
        },
        success: function (res) {
          if (res.data.code == '0') {
            console.log(res.data.data.data)
            that.data.pagecount = res.data.data.pageInfo.pagecount
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
        urlname: api.GETLIVELOGS
      }
    )
  },

  //返回上一页
  backLastPage: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  bottomLoad: function(){
    var that = this;
    if ((that.data.pagecount > 1) && (that.data.page < that.data.pagecount)) {
      that.data.page = that.data.page + 1;
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            page: that.data.page,
            page_size: 10,
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
          urlname: api.GETLIVELOGS
        }
      )
    } else {
      return;
    } 
  },

  //发起视频请求
  // videoChat: function () {
  //   network.GET(
  //     {
  //       params: {
  //         uid: app.globalData.uid,
  //         token: app.globalData.token,
  //         to_uid: user_Id, //对方id
  //       },
  //       success: function (res) {
  //         if (res.data.code == '0') {
  //           console.log('发起成功');
  //           console.log(res);
  //         } else {
  //           app.httpError(res);
  //         }

  //       },
  //       fail: function (res) {
  //         app.httpError(res);
  //       },
  //       urlname: api.APPLYVIDEO
  //     }
  //   )
  // },

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
   console.log(12312)
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