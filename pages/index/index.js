//index.js
//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js') 
const socket = require('../../utils/socket.js')


var Num = ""; //随机生成6位数字
//var scene = '';

Page({
    data: { 
        list: [],
        Nearbylist: [], 
        goddess: true, //女神
        Mask: false, //弹窗遮罩
        Giftgold: false, //金币赠送弹窗
        successGold: false, //金币赠送成功弹窗
        oneKeylive: false, //首次登陆强制一键约爱
        bannerImg: [], //轮播图
        small_givetype_0:'', //首次登录赠送的金币数
        page: 1,
        pagecount: '',
    },

    onLoad: function (options) {
        var that = this;

        //获取轮播图
        network.GET(
          {
            params: {
              uid: app.globalData.uid,
              token: app.globalData.token,
              type: 1
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == '0') {
                that.setData({
                  bannerImg: res.data.data.lists
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
            urlname: api.GETSLIDES
          }
        )

        wx.createIntersectionObserver().relativeTo('.video-box:first').relativeToViewport().observe('.video-box::last', (res) => {
          res.intersectionRatio // 相交区域占目标节点的布局区域的比例
          res.intersectionRect // 相交区域
          res.intersectionRect.left // 相交区域的左边界坐标
          res.intersectionRect.top // 相交区域的上边界坐标
          res.intersectionRect.width // 相交区域的宽度
          res.intersectionRect.height // 相交区域的高度
        })


        //获取女神列表
        network.GET(
            {
                params: {
                    uid: app.globalData.uid,
                    token: app.globalData.token,
                    page: that.data.page,
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.code == '0'){
                        var displayData = res.data.data.data;
                        that.data.pagecount = res.data.data.pageInfo.pagecount;
                        that.setData({
                            list: that.data.list.concat(displayData)
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
                urlname: api.GETLISTS
            }
        )
        //未读消息
        //network.unreadMessage(app.globalData.uid, app.globalData.token);

    },

    //查看主播详情
    jumpToMyPage: function(event) {
      console.log(event);
      var pretty_video = event.currentTarget.id;
      var panguid = event.currentTarget.dataset.id;
      var work_status = event.currentTarget.dataset.name;
      //页面跳转并传递视频地址
      wx.navigateTo({
        url: '../shortVideo/shortVideo' + '?' + 'pretty_video=' + pretty_video + '&id=' + panguid + '&work_status=' + work_status, 
      })
    },

    //底部导航跳转
    Jumptab:function(e){
      network.tabJump(e);
    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady: function () {
      var that = this;
      //获取配置数据
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == '0') {
              //console.log(res.data.data)
              app.globalData.custom_id = res.data.data.custom_id;
              app.globalData.small_givetype_0 = res.data.data.small_givetype_0;
              app.globalData.small_givetype_2 = res.data.data.small_givetype_2;
              app.globalData.small_givetype_3 = res.data.data.small_givetype_3;
              app.globalData.invite_url = res.data.data.invite_url;
              app.globalData.app_down_url = res.data.data.app_down_url;
              app.globalData.wechart_img = res.data.data.wechart_img;

            } else {
              //异常弹窗
              app.httpError(res);
            }
          },
          fail: function (res) {
            //失败弹窗
            app.httpError(res);
          },
          urlname: api.GETCONFIG
        }
      )


      //获取礼物列表
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
              res.data.data.splice(0,1); 
              if (res.data.data.length > 8) {
                var result = split_array(res.data.data, 8);
                console.log(result)
                app.globalData.giftList = result;
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

      //数组分组 （原数组，新分数组长度）
      function split_array(arr, len) {
        var a_len = arr.length;
        var result = [];
        for (var i = 0; i < a_len; i += len) {
          result.push(arr.slice(i, i + len));
        }
        return result;
      }

      //获取弹窗
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            type: 1
          },
          success: function (res) {
            if (res.data.code == '0') {
              if (res.data.data.status == 1){
                 that.setData({
                   Mask: true,
                   Giftgold:true,
                   small_givetype_0: app.globalData.small_givetype_0,
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
          urlname: api.GETPOPSTATUS
        }
      )
    },


    //绑定手机领取金币
    getPhoneNumber: function(e){
      var that = this;
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      network.GET(
        {
          params: {
            iv: iv,
            encryptedData: encryptedData,
            uid: app.globalData.uid,
            token: app.globalData.token,
          },
          success: function (res) {
            if (res.data.code == '0') {
              console.log(res)
              //随机生成6位数字
              for (var i = 0; i < 6; i++) {
                Num += Math.floor(Math.random() * 10);
              }
              network.GET(
                {
                  params: {
                    uid: app.globalData.uid,
                    token: app.globalData.token,
                    mobile: res.data.data.mobile,
                    code: Num,
                  },
                  success: function (res) {
                    if (res.data.code == '0') {
                      that.setData({
                        Mask: true,
                        Giftgold: false,
                        successGold: true,
                      })
                    } else {
                      app.httpError(res);
                    }

                  },
                  fail: function (res) {
                    //失败后的逻辑
                    app.httpError(res);
                  },
                  urlname: api.BINDMOBILE
                }
              )
              
            } else {
              app.httpError(res);
            }

          },
          fail: function (res) {
            app.httpError(res);

          },
          urlname: api.GETWXMOBILE
        }
      )
      // network.GET(
      //   {
      //     params: {
      //       uid: app.globalData.uid,
      //       token: app.globalData.token,
      //       mobile: 13512342123,
      //       code: 123456,
      //     },
      //     success: function (res) {
      //       if (res.data.code == '0') {
      //         this.setData({
      //           Mask: true,
      //           successGold: true,
      //         })
      //       } else {
      //         network.httpError(res);
      //       }

      //     },
      //     fail: function (res) {
      //       //失败后的逻辑
      //       network.httpError(res);
      //     },
      //     urlname: api.BINDMOBILE
      //   }
      // )
    },

    //取消领取弹窗
    cancelPopUps: function(){
      this.setData({
        Mask: false,
        Giftgold: false,
      })
    },

    //取消领取成功弹窗
    cancelSuccess: function () {
      this.setData({
        Mask: true,
        successGold: false,
        oneKeylive: true
      })
    },


    //首次登陆强制一键约爱
    akeyLove: function () {
      this.setData({
        Mask: false,
        oneKeylive: false,
      })
      wx.switchTab({
        url: '../matchAnimation/matchAnimation'
      })
    },

    /**
   * 生命周期函数--监听页面显示
   */
    onShow: function () {
        //index页面监听是否有消息
        wx.onSocketMessage(function (res) {
            console.log("首页消息接收")
            var data = JSON.parse(res.data);
            if (data.uri == 'message.text') {
                network.unreadMessage(app.globalData.uid, app.globalData.token);
            } if (data.uri == 'Common.login'){
              //token失效 重新登录
              if (data.code == 401){
                app.Renewsocket();
              }
            }else {
                console.log(res);
            } 

        })
    },

    /**
  * 页面上拉触底事件的处理函数
  */
    onReachBottom: function () {
      var that = this;
      console.log('下拉事件')
      if (that.data.page == that.data.pagecount){
          return;
      } else {
        that.data.page = that.data.page + 1;
        //获取女神列表翻页
        network.GET(
          {
            params: {
              uid: app.globalData.uid,
              token: app.globalData.token,
              page: that.data.page,
              pagecount: 10
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == '0') {
                var displayData = res.data.data.data;
                that.setData({
                  list: that.data.list.concat(displayData)
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
            urlname: api.GETLISTS
          }
        )
      }
    },
    

    //活动页面跳转
    banner: function(){
      wx.navigateTo({
        url: '../download/download?id=banner'
      })
    },

});



