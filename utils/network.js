//获取应用实例
const app = getApp();
const api = require('api.js')

var res;
var params = {};
var Path;

var requestHandler = {
    params: {},
    success: function (res) {
        // success
    },
    fail: function () {
        // fail
    },
    urlname: null
}

//地址拼接
function RequestPath(name){
    Path = api.API_URL + name;
}

//GET请求
function GET(requestHandler) {
    var name = requestHandler.urlname
    RequestPath(name);
    request('GET', requestHandler);
}
//POST请求
function POST(requestHandler, name) {
    RequestPath(name);
    request('POST', requestHandler)
}

function request(method, requestHandler) {
    //注意：可以对params加密等处理
    var params = requestHandler.params;
    //添加加载动画
    // wx.showLoading({
    //     title: '加载中',
    //     mask: true
    // })
    wx.request({
        url: Path,
        data: params,
        method: method,
        header: {
          'channel': 'wechat_small'
        },
        success: function (res) {
            //结束加载动画
            // setTimeout(function () {
            //     wx.hideLoading()
            // }, 1000)
            //请求成功处理
            requestHandler.success(res)
        },
        fail: function () {
            //结束加载动画
            // setTimeout(function () {
            //     wx.hideLoading()
            // }, 1000)
            //请求失败处理
            requestHandler.fail()
            //httpError(status)
        },
        complete: function () {
            // complete
        }
    })
}


//底部tab跳转
function tabJump(e){
  console.log(e);
  if (e.currentTarget.id == 'home'){
    wx.redirectTo ({
      url: '../index/index'
    })
  } if (e.currentTarget.id == 'live') {
    wx.navigateTo({
      url: '../matchAnimation/matchAnimation'
    })
  } if (e.currentTarget.id == 'news') {
    wx.redirectTo ({
      url: '../news/news'
    })
  }if (e.currentTarget.id == 'my') {
    wx.redirectTo ({
      url: '../my/my'
    })
  }
}


// function modalPopup(title){
//     wx.showModal({
//         title: title,
//         content: '下载APP',
//         success: function (res) {
//             if (res.confirm) {
//                 console.log('用户点击确定')
//             } else if (res.cancel) {
//                 console.log('用户点击取消')
//             }
//         }
//     })
// }

//未读消息
function unreadMessage(uid,token) {
    GET(
        {
            params: {
                uid: uid,
                token: token,
            },
            success: function (res) {
                if(res.data.code == 0){
                    var data = res.data.data.totalMessageCount;
                    console.log('未读消息' + res)
                    console.log(res)
                    if (data !== '0') {
                        wx.setTabBarBadge({
                            index: 2,
                            text: data
                        })
                    } else {
                        wx.removeTabBarBadge({
                            index: 1,
                        })
                    }
                } else {
                    wx.showToast({
                        title: `获取未读消息失败: ${res.data.code} ${res.data.msg}`,
                        icon: `none`,
                        duration: 5000
                    });
                }
            },
            fail: function (res) {
                //失败弹窗
                network.httpError(res);

            },
            urlname: api.GETLOGSUNREAD
        }
    )
}

//展示数据限制二十条
function limitData(arr){
    if(arr !== '' && arr !==null){
        if (arr.length > 19){
            arr.substr(0,19);
        }
    }
    return arr
}

//loadingTap动画
function loadingTap() {
    this.setData({
        loadingHidden: false
    });
    var that = this;
    setTimeout(function () {
        that.setData({
            loadingHidden: true
        });
        that.update();
    }, 3000);
}

module.exports = {
    GET: GET,
    POST: POST,
    unreadMessage: unreadMessage,
    limitData: limitData,
    tabJump: tabJump
}
