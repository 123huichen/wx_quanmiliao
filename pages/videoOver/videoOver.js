//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

var connect_id = ''; //取消视频id


// pages/videoOver/videoOver.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      to_avatar: null,
      to_nickname: null,
      countDownSecond: 0, //秒数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      connect_id = options.id;
      console.log(options);
      that.setData({
          to_avatar: options.avatar,
          to_nickname: options.nickname,
      })

      //监听WebSocket接受到服务器的消息事件 
      wx.onSocketMessage(function (res) {
          var data = JSON.parse(res.data);
          if (data.uri == "message.acceptVideo") {
                console.log("message.acceptVideo");
                console.log(data);
                // network.GET(
                //     {
                //         params: {
                //             uid: app.globalData.uid,
                //             token: app.globalData.token,
                //             id: data.data.connect_id,
                //         },
                //         success: function (res) {
                //             console.log('加入房间前发送' + res);
                //             console.log(res);
                //             // wx.navigateTo({
                //             //     url: `../../pages/meeting/meeting?connect_id=${data.data.connect_id}&connect_token=${data.data.connect_token}&from_nickname=${data.data.from_nickname}&from_uid=${data.data.from_uid}`
                //             // })
                //         },
                //         fail: function () {
                //             //失败后的逻辑
                //         },
                //         urlname: api.JOINROOM
                //     }
                // )
                wx.redirectTo({
                    url: `../../pages/meeting/meeting?connect_id=${data.data.connect_id}&connect_token=${data.data.connect_token}&from_nickname=${data.data.from_nickname}&from_uid=${data.data.from_uid}`
                })
          } if (data.uri == "message.rejectVideo") {
            wx.navigateBack({
              delta: 1
            })
          }   
          console.log(res);
      })
  },

  //取消视频聊天
  cancelVideo: function(){
      network.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
                  id: connect_id,
              },
              success: function (res) {
                if (res.data.code == '0') {
                  //返回上一页
                  wx.navigateBack({
                    delta: 1
                  })
                } else{
                  app.httpError(res);
                }
              },
              fail: function () {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.CANCELVIDEO
          }
      )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //   var totalSecond = 1505540080 - Date.parse(new Date()) / 1000;

    //   var interval = setInterval(function () {
    //       // 秒数  
    //       var second = totalSecond;


    //       // 秒位  
    //       var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
    //       var secStr = sec.toString();
    //       if (secStr.length == 1) secStr = '0' + secStr;

    //       this.setData({
    //           countDownSecond: secStr,
    //       });
    //       totalSecond--;
    //       if (totalSecond < 0) {
    //           clearInterval(interval);
    //           wx.showToast({
    //               title: '活动已结束',
    //           });
    //           this.setData({
    //               countDownSecond: '00',
    //           });
    //       }
    //   }.bind(this), 1000); 
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