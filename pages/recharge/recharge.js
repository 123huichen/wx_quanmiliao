//获取应用实例
const app = getApp();
const util = require('../../utils/network.js')
const api = require('../../utils/api.js')

var money;  //充值金额
var id; //vip id

// pages/recharge/recharge.js 
Page({

  /**
   * 页面的初始数据
   */
  data: {
      myGold:'', 
      list:[],
      tabArr: {
          curHdIndex: 10,
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var myGold = options.myGold;
      that.setData({
          myGold: myGold
      })
      util.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
              },
              success: function (res) {
                if (res.data.code == 0) {
                  console.log(res.data.data)
                  that.setData({
                    list: that.data.list.concat(res.data.data),
                  })
                } else {
                  app.httpError(res);
                }
                  
              },
              fail: function () {
                //失败后的逻辑
                app.httpError(res);
              },
              urlname: api.GETPACKAGESV3
          }
      )
  },
  
  //充值金额选择
  // chooseLocation: function (e) {
  //     var _datasetId = e.target.dataset.id;
  //     console.log("----" + _datasetId + "----");
  //     var _obj = {};
  //     if (_datasetId !== undefined){
  //         _obj.curHdIndex = _datasetId;
  //         _obj.curBdIndex = _datasetId;
  //         this.setData({
  //             tabArr: _obj,
  //             money: _datasetId
  //         });
  //     }
  // },
    
    //返回上一页
    backLastPage: function () {
      wx.navigateBack({
          delta: 1
      })
    },


  //选择套餐
  chooseLocation: function(e){
      console.log(e);
      money = e.currentTarget.id;
      id = e.currentTarget.dataset.id;
      //id = e.currentTarget.dataset.id,
      this.setData({
        selectId: e.currentTarget.dataset.id,
      });
  },

  //立刻充值
  rechargeImmediately: function(){
    //小程序支付
      util.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
                  money: money,
                  id: id,
                  channel: 'JSAPI',
                  //channel: 'APP'
              },
              success: function (res) {
                  console.log(res)
                  wx.requestPayment(
                    {
                          //'appId': res.data.data.appId,
                          'timeStamp': res.data.data.timeStamp,
                          'nonceStr': res.data.data.nonceStr,
                          'package': res.data.data.package,
                          'signType': 'MD5',
                          'paySign': res.data.data.sign,
                          'success': function (res){
                              console.log(res)
                          },
                          'fail': function (res){
                              console.log(res)
                          },
                          'complete': function (res){
                              console.log(res)
                          }
                      })
              },
              fail: function (res) {
                  //失败后的逻辑
              },
              urlname: api.GETWXORDER
          }
      )
  },

  //弹窗
  showDialogBtn: function () {
    //   wx.showModal({
    //       title: 'APP内方可查看详情',
    //       content: '下载APP',
    //       success: function (res) {
    //           if (res.confirm) {
    //               console.log('用户点击确定')
    //           } else if (res.cancel) {
    //               console.log('用户点击取消')
    //           }
    //       }
    //   })
    this.setData({
        showModal: true
    })
  },

  //隐藏模态对话框
  hideModal: function () {
      this.setData({
          showModal: false
      });
  },

  //取消弹窗
  onCancel: function () {
      console.log("弹窗消失了")
      this.hideModal();
  },

  //确认弹窗
  onConfirm: function () {
      console.log("点击确认了")
      this.hideModal();
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
     var that= this;
     console.log("支付取消")
     util.GET(
         {
             params: {
                 uid: app.globalData.uid,
                 token: app.globalData.token,
             },
             success: function (res) {
                 console.log(res)
                 app.globalData.myGold = res.data.data.coin;
                 var myGold = res.data.data.coin;
                 that.setData({
                     myGold: myGold,
                 })
             },
             fail: function () {
                 //失败后的逻辑

             },
             urlname: api.GETWALLET
         }
     )
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