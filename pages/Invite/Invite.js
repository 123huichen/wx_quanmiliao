//获取应用实例
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const socket = require('../../utils/socket.js')

var dow_url = '';
var avatar_url = '';
var QRcode_url = '';
// pages/Invite/Invite.js
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    name: '',
    dow_url:'',
    isShowCav: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取分享二维码
    network.GET(
      {
        params: {
          uid: app.globalData.uid,
          token: app.globalData.token
        },
        success: function (res) {
          dow_url = res.data.data.url;
          if (res.data.code == 0) {
            that.setData({
              avatar: app.globalData.avatar,
              name: app.globalData.nickname,
              //dow_url: res.data.data.url,
              isShowCav: true,
            })
            console.log(app.globalData.avatar);
            QRcode_url = dow_url.replace("http://static.yygo.tv", "https://qiniu.pdvzo.cn");
            console.log(QRcode_url);
            //下载图片
            wx.downloadFile({
              url: QRcode_url,
              success: function (sres) {
                console.log(sres);
                QRcode_url = sres.tempFilePath;
                wx.downloadFile({
                  url: app.globalData.avatar,
                  success: function (sres) {
                    avatar_url = sres.tempFilePath;
                    //绘制画布
                    that.canvas();
                  },
                  fail: function(err) {
                    //绘制画布
                    that.canvas();
                  }
                })
                
              },
              fail: function (err) {
                console.log(err)
                wx.showToast({
                  title: err,
                  icon: `none`,
                  duration: 5000
                });
              }
            })
            
          } else {
            app.httpError(res);
          }

        },
        fail: function (res) {
          app.httpError(res);
        },
        urlname: api.GETINVITECODE
      }
    )
  },

  //返回上一页
  backLastPage: function (){
    wx.navigateBack({
      delta: 1
    })
  },

  canvas: function (object) {
    var that = this;
    let realWidth, realHeight;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#mycanvas').boundingClientRect()
    query.exec(function (res) {
      //res就是 该元素的信息 数组
      realWidth = res[0].width;
      realHeight = res[0].height;
      console.log('realHeight', realWidth);
      console.log('realWidth', realHeight);
      const ctx = wx.createCanvasContext('mycanvas');
      ctx.drawImage("../../image/canven_bg.jpg", 0, 0, realWidth, realHeight);
      ctx.drawImage("../../image/ctx-bg.png", 0, 0, realWidth, realHeight);
      ctx.setFontSize(12);
      ctx.setFillStyle("#F9B846");
      ctx.fillText(app.globalData.nickname, (realWidth * 0.177) + (realWidth * 0.137), (realHeight * 0.070));
      ctx.setFontSize(11);
      ctx.setFillStyle("#F9D18A");
      ctx.fillText("邀请你体验高端社交", (realWidth * 0.177) + (realWidth * 0.137), (realHeight * 0.060) + 20);
      ctx.setFontSize(11);
      ctx.setFillStyle("#F9B846");
      ctx.setTextAlign('center');
      ctx.fillText("长按识别加入", (realWidth * 0.496), (realHeight * 0.623) + (realWidth * 0.395));
      console.log(dow_url);
      //二维码圆形切割-开始
      ctx.save();
      ctx.beginPath();
      ctx.arc((realWidth * 0.316) + (realWidth * 0.363) / 2, (realHeight * 0.613) + (realWidth * 0.363) / 2, (realWidth * 0.363) / 2, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(QRcode_url, (realWidth * 0.316), (realHeight * 0.613), (realWidth * 0.363), (realWidth * 0.363));
      ctx.restore()
      //头像圆形切割-开始
      ctx.save();
      ctx.beginPath();
      ctx.arc((realWidth * 0.177) + (realWidth * 0.117) / 2, (realHeight * 0.040) + (realWidth * 0.117) / 2, (realWidth * 0.117) / 2, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(avatar_url, (realWidth * 0.177), (realHeight * 0.040), (realWidth * 0.117), (realWidth * 0.117));
      ctx.draw();
    })
  },

  //保存到相册
  downloadFile: function(){
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function (data) {
            console.log(data);
          },
          fail: function(ser){
             console.log(ser);
             if (ser.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
               console.log("打开设置窗口");
               wx.openSetting({
                 success(settingdata) {
                   console.log(settingdata)
                   if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                     console.log("获取权限成功，再次点击图片保存到相册")
                   } else {
                     console.log("获取权限失败")
                   }
                 }
               })
             }
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
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
    return {
      title: '一对一视频交友，你喜欢的我们都有',
      path: 'pages/login/login?scene=' + app.globalData.uid,
      imageUrl: 'http://static.yygo.tv/Fakemedia/o_1cd4q9cv74611mqf1n7cs0oecba.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})