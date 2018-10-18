// pages/meeting/meeting.js
const app = getApp()
// const AgoraSDK = require('../../js/mini-app-sdk-production.js');
const Utils = require('../../utils/util.js')
const socket = require('../../utils/socket.js')
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const AgoraMiniappSDK = require("../../utils/mini-app-sdk-production.js");
const max_user = 6;
const Layouter = require("../../utils/layout.js");
const APPID = require("../../utils/config.js").APPID;


var heartbeatId = '';
var giftid = '';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pushUrl: "",
        playUrls: [],
        muted: false,
        makeup: false,
        pushWidth: 0,
        pushHeight: 0,
        totalUser: 1,
        pushing: true, 
        listgift: [], //礼物列表
        giftBox: false,
        coin: '',
        showView: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let manager = this;
        heartbeatId = options.connect_id; //直播房间心跳id
        this.channel = options.connect_id; //房间号
        this.connect_token = options.connect_token; //房间key
        this.uid = options.from_uid; //主播id
        this.name = options.from_nickname; //主播昵称
        // this.channel = options.channel;
        //this.uid = Utils.getUid();
        this.ts = new Date().getTime();
        this.containerSize = { width: 0, height: 0 };
        this.client = null;
        this.layouter = null;
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        network.GET(
            {
                params: {
                    uid: app.globalData.uid,
                    token: app.globalData.token,
                    id: options.connect_id,
                },
                success: function (res) {
                    console.log('加入房间前发送' + res);
                    console.log(res);
                },
                fail: function () {
                    //失败后的逻辑
                },
                urlname: api.JOINROOM
            }
        )
        
 
        Utils.log('onLoad');

        //保持屏幕常亮
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
        Utils.getUserInfo(app, () => { });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let channel = this.connect_token;
        //房间频道
        console.log('房间频道' + channel);
        let uid = this.uid;
        Utils.log('onReady'); 

        Promise.all([this.requestPermissions(), this.requestContainerSize(), this.initAgoraChannel(uid, channel)]).then(values => {
            let url = values[2];

            Utils.log(`channel: ${channel}, uid: ${uid}`);
            Utils.log(`pushing ${url}`);
            let size = this.layouter.adaptPusherSize(1);
            this.setData({
                pushUrl: url,
                pushWidth: size.width,
                pushHeight: size.height,
                totalUser: 1
            });
        }).catch(e => {
            wx.showToast({
                title: `初始化失败: ${e.code} ${e.reason}`,
                icon: `none`,
                duration: 20000
            });
        });
    },

    stopPlayers: function (users) {
        Utils.log(`stop players: ${JSON.stringify(users)}`);
        let uid = this.uid;
        users.forEach(user => {
            if (`${user.uid}` === `${uid}`) {
                return;
            }
            Utils.log(`stop player ${user.uid}`);
            let context = wx.createLivePlayerContext(`player-${user.uid}`, this);
            context.stop();
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        Utils.log('restart pushing...');
        const context = wx.createLivePusherContext();
        context && context.start();

        Utils.log('re-register listeners...');

        //监听WebSocket接受到服务器的消息事件
        wx.onSocketMessage(function (res) {
            var data = JSON.parse(res.data);
            //退出直播室
            if (data.uri == "connect.close") {
                console.log(data);
                var oneKey = app.globalData.oneKey;
                if (oneKey){
                  app.globalData.oneKey = 0;
                  wx.redirectTo({
                    url: `../../pages/index/index`
                  })
                } else {
                  wx.redirectTo({
                    url: `../../pages/chatroom/chatroom?id=${that.uid}&name=${that.name}`
                  })
                }
            } if (data.uri == 'Connect.heart') {
              //token失效 重新登录
              if (data.code == 401) {
                app.Renewsocket();
              }
            } if (data.uri == 'connect.sendgift') {
              wx.showToast({
                title: '给主播赠送成功',
                icon: `none`,
                duration: 2000
              })
              that.setData({
                animationgift: data.data.gifticon,
              })
              that.giftanimat();
            } else {
              console.log(res);
            } 
        })
    },

    //礼物动画
    giftanimat: function () {
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
        })
      }.bind(this), 100)
      setTimeout(function () {
        this.setData({
          showView: false,
        })
      }.bind(this), 1500)
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
      Utils.log('onUnload');
      const context = wx.createLivePusherContext();
      context && context.stop();
      if (this.reconnectTimer) {
          Utils.log('clear timeout');
          clearTimeout(this.reconnectTimer);
      }
      this.reconnectTimer = null;
      this.stopPlayers(this.data.playUrls);
      try {
          this.client && this.client.unpublish();
      } catch (e) {
          Utils.log('unpublish failed');
      };
      this.client && this.client.leave();

      //清除直播间心跳计时器
      clearTimeout(this.heartbeatTimer);
    },
    
    //直播间心跳
    headTime: function (uid, token, heartbeatId){
      var that = this;
      that.heartbeatTimer = setTimeout(function () {
        console.log('直播心跳定时')
        var mapdata = {
          'uid': uid,
          'token': token,
          'id': heartbeatId,
        };
        var msgData = {
          "uri": "Connect.heart",
          "msg_id": 1,
          "data": mapdata,
        }
        var data = JSON.stringify(msgData)
        console.log('直播间心跳发送' + data)
        wx.sendSocketMessage({
          data: data,
        })
        that.headTime(uid, token, heartbeatId);
      }, 5000);  
      //this.headTime(uid, token, heartbeatId);
    },

    //关闭一对一聊天
    onLeave: function () { 
      var that = this;
      network.GET(
        {
          params: {
            uid: app.globalData.uid,
            token: app.globalData.token,
            id: that.connect_token,
          },
          success: function (res) {
            if (res.data.code == '0') {
              console.log(res);
              wx.redirectTo({
                url: `../../pages/chatroom/chatroom?id=${this.uid}&name=${this.name}`,
              });
            } else {
              app.httpError(res);
            }
          },
          fail: function (res) {
            app.httpError(res);
          },
          urlname: api.CLOSE
        }
      )
    },

    //点击礼物按钮
    ongiftList: function(){
      var that = this;
      //获取礼物列表
      if (app.globalData.giftList !== null) {
        that.setData({
          giftBox: true,
          listgift: app.globalData.giftList[0]
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

    //选择礼物
    clickGift: function(e){
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
              connect_id: that.channel,
              giftid: giftid,// 礼物ID
              num: 1, //数量
              to_uid: that.uid, //礼物接受人id
            },
            success: function (res) {
              if (res.data.code == '0') {
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

    //收起礼物列表
    collapsegift: function(){
      console.log('点击事件')
      this.setData({
        giftBox: false
      })
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

    },

    recorderInfo: function (info) {
        Utils.log(`live-pusher info: ${JSON.stringify(info)}`);
    },

    /**
     * 推流状态更新回调
     */
    recorderStateChange: function (e) {
        Utils.log(`live-pusher code: ${e.detail.code}`)
        if (e.detail.code === -1307) {
            //re-push
            Utils.log('live-pusher stopped, try to restart...', "error")
            const context = wx.createLivePusherContext();
            context && context.start();
        }
        if (e.detail.code === 1008 && this.data.pushing) {
            //started
            Utils.log('live-pusher started');
            this.refreshPlayers({
                pushing: false
            })
        }
    },

    /**
     * 播放器状态更新回调
     */
    playerStateChange: function (e) {
        Utils.log(`live-player id: ${e.target.id}, code: ${e.detail.code}`)
        let uid = parseInt(e.target.id.split("-")[1]);
        if (e.detail.code === 2004) {
            Utils.log(`live-player ${uid} started playing`);
            this.updatePlayer(uid, { loading: false });
            this.refreshPlayers();
        } else if (e.detail.code === -2301) {
            Utils.log(`live-player ${uid} stopped`, "error");
        }
    },

    /**
     * 根据uid更新流属性
     */
    updatePlayer(uid, options) {
        for (let i = 0; i < this.data.playUrls.length; i++) {
            let urlObj = this.data.playUrls[i];
            if (`${urlObj.uid}` === `${uid}`) {
                urlObj = Object.assign(urlObj, options);
                this.data.playUrls[i] = urlObj;
            }
        }
    },

    /**
     * 根据playUrls的内容更新播放器
     */
    refreshPlayers: function (options) {
        let urls = this.data.playUrls;
        urls = urls.slice(0, max_user);
        Utils.log(`playing: ${JSON.stringify(urls)}`);

        urls = this.layouter.adaptPlayerSize(urls);
        let size = this.layouter.adaptPusherSize(1 + urls.length);
        let data = Object.assign({
            playUrls: urls,
            totalUser: urls.length + 1,
            pushWidth: size.width,
            pushHeight: size.height
        }, options);

        this.setData(data);
    },

    /**
     * 静音回调
     */
    onMute: function () {
        this.setData({
            muted: !this.data.muted
        })
    },

    /**
     * 摄像头方向切换回调
     */
    onSwitchCamera: function () {
        Utils.log('switching camera');
        const context = wx.createLivePusherContext();
        context && context.switchCamera();
    },

    /**
     * 美颜回调
     */
    onMakeup: function () {
        this.setData({
            makeup: !this.data.makeup
        })
    },

    /**
     * 上传日志
     */
    uploadLogs: function () {
        // let logs = Utils.
        wx.request({
            url: 'https://webdemo.agora.io/miniapps/restful/v1/logs',
            method: 'post',
            data: {
                logs: Utils.getLogs(),
                channel: this.channel
            },
            success: function (res) {
                wx.showToast({
                    title: '上传成功',
                    icon: 'none',
                    duration: 2000
                })
            },
            fail: function (e) {
                wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    /**
     * 上传日志回调
     */
    onSubmitLog: function () {
        let page = this;
        wx.showModal({
            title: '遇到使用问题?',
            content: '点击确定可以上传日志，帮助我们了解您在使用过程中的问题',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    page.uploadLogs();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    /**
     * 获取屏幕尺寸以用于之后的视窗计算
     */
    requestContainerSize: function () {
        let page = this;
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select('#main').boundingClientRect(function (rect) {
                page.containerSize = {
                    width: rect.width,
                    height: rect.height
                };
                page.layouter = new Layouter(rect.width, rect.height - 64);
                Utils.log(`container size: ${JSON.stringify(page.containerSize)}`);
                resolve();
            }).exec()
        });
    },

    /** 
     * request Wechat permission
     */
    requestPermissions: function () {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success(res) {
                    console.log(res.authSetting)
                    if (!res.authSetting['scope.record']) {
                        console.log('录音权限开启')
                        wx.authorize({
                            scope: 'scope.record',
                            success() {
                                wx.startRecord()
                                resolve();
                            },
                            fail(e) {
                                reject('获取摄像头失败')
                            }
                        })
                    } else {
                        resolve();
                    }
                }
            })
        });
    },

    /**
     * 初始化sdk推流
     */
    initAgoraChannel: function ( uid, channel) {
        var that = this;
        return new Promise((resolve, reject) => {
            let client = new AgoraMiniappSDK.Client();
            //注册流事件
            this.subscribeEvents(client);
            AgoraMiniappSDK.LOG.onLog = (text) => {
                Utils.log(text);
            };
            AgoraMiniappSDK.LOG.setLogLevel(-1);
            this.client = client;
            //初始化客户端对象
            client.init(APPID, () => {
                Utils.log('client init success');
                console.log('初始化客户端成功');
                //加入频道
                client.join(null, channel, uid, () => {
                    Utils.log('client join channel success');
                    console.log('加入频道成功');
                    //直播间心跳定时器
                    //app.globalData.heart = true; //判断页面关闭从而关闭直播间心跳
                    that.headTime(app.globalData.uid, app.globalData.token, heartbeatId, app.globalData.heart);
                    // that.heartbeatTimer = setTimeout(() => {
                    //   that.headTime(app.globalData.uid, app.globalData.token, heartbeatId, app.globalData.heart);
                    // }, 5000);
                    //and get my stream publish url
                    client.publish(url => {
                        Utils.log('client publish success');
                        resolve(url);
                    }, e => {
                        Utils.log(`client publish failed: ${e.code} ${e.reason}`);
                        reject(e)
                    });
                }, e => {
                    Utils.log(`client join channel failed: ${e.code} ${e.reason}`);
                    reject(e)
                })
            }, e => {
                Utils.log(`client init failed: ${e.code} ${e.reason}`);
                reject(e);
            });
        });
    },
    /**
     * 注册stream事件
     */
    subscribeEvents: function (client) {
        client.on("stream-added", uid => {
            Utils.log(`stream ${uid} added`);
            client.subscribe(uid, url => {
                Utils.log('stream subscribed successful');
                this.data.playUrls.push({ key: uid, uid: uid, src: url });
                //important, play/push sequence decide the layout z-index
                //to put pusher bottom, we have to wait until pusher loaded
                //and then play other streams
                if (!this.data.pushing) {
                    this.refreshPlayers();
                }
            }, e => {
                Utils.log(`stream subscribed failed ${e.code} ${e.reason}`);
            });
        });

        client.on("stream-removed", uid => {
            Utils.log(`stream ${uid} removed`);
            this.data.playUrls = this.data.playUrls.filter(urlObj => {
                return `${urlObj.uid}` !== `${uid}`;
            });
            //important, play/push sequence decide the layout z-index
            //to put pusher bottom, we have to wait until pusher loaded
            //and then play other streams
            if (!this.data.pushing) {
                this.refreshPlayers();
            }
        });

        client.on("error", err => {
            let errObj = err || {};
            let code = errObj.code || 0;
            let reason = errObj.reason || "";
            Utils.log(`error: ${code}, reason: ${reason}`);
            if (`${code}` === `${901}`) {
                wx.showToast({
                    title: '链接断开',
                    icon: 'none',
                    duration: 2000
                });
                this.reconnectTimer = setTimeout(() => {
                    this.reconnect();
                }, 5000);
            }
        });
    },

    reconnect: function () {
        Utils.log('start reconnect');
        let channel = this.channel;
        let uid = this.uid;
        this.setData({
            playUrls: [],
            pushing: true,
            pushUrl: ""
        }, () => {
            // this is setData callback
            this.initAgoraChannel(uid, channel).then(url => {
                Utils.log(`re-join channel: ${channel}, uid: ${uid}`);
                Utils.log(`re-pushing ${url}`);
                let size = this.layouter.adaptPusherSize(1);
                this.setData({
                    pushUrl: url,
                    pushWidth: size.width,
                    pushHeight: size.height,
                    totalUser: 1
                });
            }).catch(e => {
                wx.showToast({
                    title: `重连失败: ${e.code} ${e.reason}`,
                    icon: 'none',
                    duration: 2000
                });
            });
        });
    }
})