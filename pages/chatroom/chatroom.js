//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

 
var socketOpen = false;
var socketMsgQueue = [];
var judgment = false; 
var user_Id = ''; //对方id  
var user_name = ''; //对方名称
var myid = '';
var giftid = ''; //礼物id
var page = 1; //聊天页码
var dataId = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
      sendInfo: '',
      userMessage: '',
      user_name:'',//对方名称
      news_lists: [], //接受服务端消息
      uid:'', //用户id
      second_height: '', //聊天
      judgment: '',
      giftpage: false, //礼物页面隐藏
      listgift:[], //礼物列表
      coin: '', //用户金币
      animationData: {}, //礼物动画层
      animationgift:'', //礼物
      scrollTop: 10000,
      view: true,
      toView: '',
      selectId: 0,
      showView: false, //动画层显示隐藏
      view_bot_but: true, //输入框位置
      kefu: false, //是否客服
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      //获取页面跳转传递的用户id和用户name
      user_Id = options.id;
      if (user_Id == app.globalData.custom_id){
        that.setData({
          kefu: false
        })
      } else {
        that.setData({
          kefu: true
        })
      }
      user_name = options.name;
      that.setData({
          user_name: user_name,
      })
      // 获取系统信息
      wx.getSystemInfo({
          success: function (res) {
              console.log(res);
              // 可使用窗口宽度、高度
              console.log('height=' + res.windowHeight);
              console.log('width=' + res.windowWidth);
              console.log(res.windowHeight - res.windowWidth / 750 * 228);
              that.setData({
                  second_height: res.windowHeight - res.windowWidth / 750 * 228,
              })
          }
      })
      //页面初始化获取聊天记录
      if (user_Id == 'systemId'){
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
              page: 1,
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

  
  //获取输入框文本
  bindChange: function (e) {
    var that = this;
    if (e.detail.value){
      that.setData({
        userMessage: e.detail.value
      })
    } else {
      //console.log('dsadsa');
    }
    
  },

  //发送文本
  cleanInput: function (e) {
    var that = this;
    if (that.data.userMessage){
      var setMessage = {
        sendInfo: that.data.userMessage
      }
      that.setData(setMessage)
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            to_uid: user_Id,
            text: that.data.userMessage
          },
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({
                userMessage: '', //发送成功并清空发送数据
              })
            } else {
              app.httpError(res);
            }

          },
          fail: function (res) {
            app.httpError(res);
          },
          urlname: api.SENDTEXT
        }
      )
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var that = this;
      //获取礼物列表
      if (app.globalData.giftList !== null){
        that.setData({
          listgift: app.globalData.giftList
        })
      } else {
        network.GET(
          {
            params: {
              uid: app.globalData.uid,
              token: app.globalData.token,
              type: 2
            },
            success: function (res) {
              if (res.data.code == '0') {
                console.log(res)
                if (res.data.data.length > 8) {
                  var result = split_array(res.data.data, 8);
                  console.log(result)
                  that.setData({
                    listgift: result,
                  })
                } else {
                  console.log("礼物不超过8个")
                }
              } else {
                app.httpError(res);
              }

            },
            fail: function (res) {
              //失败后的逻辑
              app.httpError(res);
            },
            urlname: api.GIFTLISTS
          }
        )
      }
      
      //数组分组 （原数组，新分数组长度）
      function split_array(arr, len) { 
          var a_len = arr.length; 
          var result = []; 
          for (var i = 0; i < a_len; i += len) { 
              result.push(arr.slice(i, i + len)); 
          } 
          return result; 
      } 
  },

  //返回上一页
  backLastPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //显示礼物列表
  showGiftUl: function () {
      var that = this;
      this.setData({
          giftpage: true,
          view_bot_but: false,
          view: false,
          toView: dataId
      })
      if (that.data.coin == ''){
        network.GET(//获取用户账户余额，佣金，魅力值
          {
            params: {
              uid: app.globalData.uid,
              token: app.globalData.token,
            },
            success: function (res) {
              if (res.data.code == '0') {
                console.log(res);
                that.setData({
                  coin: res.data.data.coin,
                })
              } else {
                app.httpError(res);
              }
            },
            fail: function (res) {
              app.httpError(res);
            },
            urlname: api.GETWALLET
          }
        )
      }
  },

  //隐藏礼物列表 
  hideGiftUl: function () {
      console.log("bbb")
      giftid = '';
      this.setData({
          giftpage: false,
          view_bot_but: true,
          view: true,
          selectId: '',
      })
  },

  //选择礼物
  clickGift: function (e) {
      console.log(e)
      giftid = e.currentTarget.id;
      this.setData({
          selectId: giftid  //把获取的自定义id赋给当前组件的id(即获取当前组件)    
      })
  },

  //用户赠送礼物
  Gift: function () {
      var that = this
      if (giftid) {
          network.GET(
              {
                  params: {
                      uid: app.globalData.uid,
                      token: app.globalData.token,
                      giftid: giftid,// 礼物ID
                      num: 1, //数量
                      to_uid: user_Id, //礼物接受人id
                  },
                  success: function (res) {
                      if (res.data.code == '0'){
                          console.log('赠送成功');
                          console.log(res);
                          that.setData({
                              coin: res.data.data.coin
                          })
                      } else {
                          app.httpError(res);
                      }
                      
                  },
                  fail: function (res) {
                      //失败后的逻辑
                      app.httpError(res);
                  },
                  urlname: api.SENDGIFT
              }
          )
      } else {
          console.log("请选择礼物")
      }
  },

  //发起视频请求
  videoChat: function(){
      network.GET(
          {
              params: {
                  uid: app.globalData.uid,
                  token: app.globalData.token,
                  to_uid: user_Id, //对方id
              },
              success: function (res) {
                  if(res.data.code=='0'){
                      console.log('发起成功');
                      console.log(res);
                  }else{
                      app.httpError(res);
                  }
                  
              },
              fail: function (res) {
                  app.httpError(res);
              },
              urlname: api.APPLYVIDEO
          }
      )
  },

  //查看主播详情
  jumpToMyPage: function (event) {
      var uid = event.currentTarget.id;
      //页面跳转并传递视频地址
      wx.navigateTo({
          url: '../details/details?' + 'uid=' + uid,
      })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var that = this;
      that.setData({
          scrollTop: that.data.scrollTop + 100
      })
      //监听WebSocket接受到服务器的消息事件
      wx.onSocketMessage(function (res) {
          var data = JSON.parse(res.data);
          if (data.uri == "message.text") {
              console.log(data)
              var datamap = data.data;
              var changeAdd = socket.pushdArray(datamap, app.globalData.uid);
              dataId = changeAdd.id;
              that.setData({
                  news_lists: that.data.news_lists.concat(changeAdd),
                  toView: dataId
              });
              //礼物动画图片赋值
              if (data.data.type == 'message.gift') {
                  that.setData({
                      animationgift: data.data.data.gift.gifticon,
                  })
                  that.giftanimat();
              }
          }
          if (data.uri == "message.applyVideo") {
              console.log("message.applyVideo");
              console.log(data);
              wx.navigateTo({
                  url: `../../pages/videoOver/videoOver?avatar=${data.data.to_avatar}&nickname=${data.data.to_nickname}&id=${data.data.message_video_id}`
              })
          }
          console.log(res);
      })
  },

  //礼物动画
  giftanimat: function(){
      var animation = wx.createAnimation({
          duration: 3000,
          timingFunction: 'ease', 
      })

      this.animation = animation;
      animation.scale(1, 1).step();//修改透明度,放大 

      this.setData({
        showView: true,
        animationData: animation.export()
      })

      setTimeout(function () {
        //animation.translate(30).step()
        animation.scale(2, 2).step();
        this.setData({
          animationData: animation.export(),
          //showView: false,
        })
      }.bind(this), 100)
      setTimeout(function () {
        this.setData({
          showView: false,
        })
      }.bind(this), 1500)
      //动画执行完成回归初始状态
      // var animationHide = wx.createAnimation({
      //     duration: 100,
      //     timingFunction: 'linear',
      // })
      // this.animation = animationHide;
      // animationHide.opacity(1).scale(1, 1).step(); 
      // this.setData({
      //     showView: false,
      //     animationData: animationHide.export()
      // })
  },

  
  //充值
  Recharge: function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../recharge/recharge' + "?" + "myGold=" + id
    })
  },


  //下拉翻页消息记录
  dropDown: function(){
      var that = this;
      console.log('下拉翻页消息记录');
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