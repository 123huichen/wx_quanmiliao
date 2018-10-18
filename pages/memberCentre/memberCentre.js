//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')


var vipid = '';
var Vipmoney = '';
// pages/memberCentre/memberCentre.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    getBuyVip:[],
    listVip:[],
    Mask: false, //遮罩层 
    nickname: '', //用户名称
    timeday:'',//会员到期天数
    Vipmoney:'', //vip价格
    selectId: '',//选择vip套餐
    originalPrice: '', //vip原价
  },

  /**      
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      nickname: app.globalData.nickname,
      timeday: app.globalData.vip_surplus_day,
    })
    //vip特权
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0){
            that.setData({
              list: that.data.list.concat(res.data.data.data),
            })
          }else{
            //异常弹窗
            app.httpError(res);
          }
        },
        fail: function () {
          //失败弹窗
          app.httpError(res);
        },
        urlname: api.VIP_PRIVILEGE
      }
    )
  },

  //返回上一页
  backLastPage: function(){
      //返回上一页
      wx.navigateBack({
          delta: 1
      })
  },

  //会员套餐列表
  Member: function(){
    var that = this;
    //加载vip套餐
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            that.setData({
              Mask: true,
              listVip: res.data.data.data,
              selectId: res.data.data.data[0].id,
              Vipmoney: res.data.data.data[0].price,
              originalPrice: res.data.data.data[0].origin_price,
            })
          } else {
            //异常弹窗
            app.httpError(res);
          }
        },
        fail: function () {
          //失败弹窗
          app.httpError(res);
        },
        urlname: api.VIP_PACKAGE
      }
    )
  },

  //选择vip套餐
  clickVIP: function(e){
    vipid = e.currentTarget.id;
    Vipmoney = e.currentTarget.dataset.id;
    var originalPrice = e.currentTarget.dataset.name;
    this.setData({
      selectId: vipid,   
      Vipmoney: Vipmoney,
      originalPrice: originalPrice
    })
  },

  //立刻充值
  rechargeImmediately: function () {
    //小程序支付
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
          money: Vipmoney,
          type: 'vip',
          id: vipid,
          channel: 'JSAPI',
        },
        success: function (res) {
          console.log(res)
          wx.requestPayment(
            {
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.sign,
              'success': function (res) {
                console.log(res)
              },
              'fail': function (res) {
                console.log(res)
              },
              'complete': function (res) {
                console.log(res)
              }
            })
        },
        fail: function () {
          //失败后的逻辑
        },
        urlname: api.GETWXORDER
      }
    )
  },

  //关闭弹窗
  memberClear: function(){
    this.setData({
      Mask: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            that.setData({
              getBuyVip: that.data.getBuyVip.concat(res.data.data.data),
            })
          } else {
            //异常弹窗
            app.httpError(res);
          }
        },
        fail: function () {
          //失败弹窗
          app.httpError(res);
        },
        urlname: api.GETBUYVIP
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取用户信息
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            that.setData({
              timeday: res.data.data.vip_surplus_day
            })
          } else {
            //异常弹窗
            app.httpError(res);
          }
        },
        fail: function () {
          //失败弹窗
          app.httpError(res);
        },
        urlname: api.INFO
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