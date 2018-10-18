//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

var status = '';

// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commission: '', //用户佣金
    num: '', //分享人数
    peoples: '', //邀请的人列表
    Mask: false, //弹窗遮罩
    member_succ: false, //会员领取成功弹窗
    withdraw: false, //提现弹窗
    status: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      commission: app.globalData.commission,
    })
    //获取自己推广数据
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == '0') {
            that.setData({
              num: res.data.data.num,
            })
          } else {
            app.httpError(res);
          }
        },
        fail: function () {
          //失败后的逻辑
          app.httpError(res);
        },
        urlname: api.GETDATA
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    //邀请人列表
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == '0') {
            that.setData({
              peoples: res.data.data.data,
            })
          } else {
            app.httpError(res);
          }
        },
        fail: function () {
          //失败后的逻辑
          app.httpError(res);
        },
        urlname: api.PEOPLES
      }
    )
  },


  //收益明细
  howMany: function(){
    wx.navigateTo({
      url: '../howMany/howMany',
    })
  },

  //取消领取会员成功弹窗
  cancelSuccBut: function(){
    this.setData({
      Mask: false,
      member_succ: false,
    })
  },

  //提现弹窗
  rechargeBut:function(){
    this.setData({
      Mask: true,
      withdraw: true,
    })
  },
  
  //取消提现弹窗
  canceWithdraw: function(){
    this.setData({
      Mask: false,
      withdraw: false,
    })
  },

  //跳转到提现页面
  withdraw: function(){
    this.setData({
      Mask: false,
      withdraw: false,
    })
    wx.navigateTo({
      url: '../withdraw/withdraw',
    })
  },

  //返回上一页
  backLastPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //保存相册分享到朋友圈
  savePhotos: function(){
    wx.navigateTo({
      url: '../Invite/Invite',
    })
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取邀请vip状态
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token,
        },
        success: function (res) {
          if (res.data.code == '0') {
            status = res.data.data.status;
            if (status == 0 || status == 2){
              that.setData({
                status: true,
              })
            }else {
              that.setData({
                status: false,
              })
            }
            
          } else {
            app.httpError(res);
          }
        },
        fail: function () {
          //失败后的逻辑
          app.httpError(res);
        },
        urlname: api.GETINVITEVIPSTATUS
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