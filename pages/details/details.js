//获取应用实例
const app = getApp();
const util = require('../../utils/network.js')
const api = require('../../utils/api.js')


var uid = '';//对方id

// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
     showModal: false, //弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      uid = options.uid;
      util.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
                  to_uid: uid
              },
              success: function (res) {
                  if (res.data.code == '0'){
                    console.log(res);
                    that.setData({
                      list: that.data.list.concat(res.data.data)
                    })
                  } else {
                    app.httpError(res);
                  }
              },
              fail: function () {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.USERINFO
          }
      )       
  },

  //返回上一页
  ComeBack: function() {
      wx.switchTab({
          url: "../index/index"
      })
  },
  
  //跳转到聊天窗口
  chatWindow: function (e) {
      var id = e.currentTarget.id;
      console.log(id);
      var name = e.currentTarget.dataset.name
      console.log(name);
      wx.navigateTo({
          url: '../chatroom/chatroom' + '?' + 'id=' + id + '&' + 'name=' + name,
      })
  },

  //发起视频请求
  videoChat: function () {
      util.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
                  to_uid: uid, //对方id
              },
              success: function (res) {
                if (res.data.code == '0') {
                  console.log('发起成功');
                  console.log(res);
                } else {
                  app.httpError(res);
                }
              },
              fail: function () {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.APPLYVIDEO
          }
      )
  },

  //弹窗
  showDialogBtn: function () {
      wx.showModal({
          title: 'APP内方可查看详情',
          content: '下载APP',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定')
              } else if (res.cancel) {
                  console.log('用户点击取消')
              }
          }
      })
    //   this.setData({
    //       showModal: true
    //   })
  },

//   //隐藏模态对话框
//   hideModal: function () {
//       this.setData({
//           showModal: false
//       });
//   },

//   //取消弹窗
//   onCancel: function () {
//       console.log("弹窗消失了")
//       this.hideModal();
//   },

//   //确认弹窗
//   onConfirm: function () {
//       console.log("点击确认了")
//       this.hideModal();
//   },

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